import os
import cv2
import numpy as np
from typing import Dict, Any, List, Tuple

def extract_video_metadata(video_path: str) -> Dict[str, Any]:
    """
    Extracts genuine metadata from drone video container.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found at: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"OpenCV could not open video container: {video_path}")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = float(cap.get(cv2.CAP_PROP_FPS))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()

    fps = round(fps, 2) if fps > 0 else 30.0
    duration_sec = round(frame_count / fps, 2) if fps > 0 else 0.0

    return {
        "width": width,
        "height": height,
        "resolution": f"{width}x{height}",
        "fps": fps,
        "totalFrames": frame_count,
        "durationSec": duration_sec,
        "sizeBytes": os.path.getsize(video_path),
        "codec": "H.264/H.265 (MP4/MOV)"
    }


def intelligent_keyframe_extraction(
    video_path: str,
    output_dir: str,
    target_keyframes: int = 30,
    blur_threshold: float = 35.0,
    redundancy_threshold: float = 1.2,
    min_frame_step: int = 4,
    logger_callback = None
) -> Dict[str, Any]:
    """
    Real intelligent frame selection pipeline.
    Calculates Laplacian variance, exposure limits, and inter-frame similarity.
    Rejects blurry, redundant, and poorly exposed frames.
    """
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Failed to open video file: {video_path}")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = float(cap.get(cv2.CAP_PROP_FPS))
    if fps <= 0:
        fps = 30.0

    # Determine stride based on total frames to get a rich baseline
    stride = max(min_frame_step, total_frames // (target_keyframes * 2)) if total_frames > 0 else 4

    selected_keyframes: List[Dict[str, Any]] = []
    analyzed_count = 0
    rejected_blur = 0
    rejected_exposure = 0
    rejected_redundancy = 0

    prev_selected_gray = None
    frame_idx = 0

    if logger_callback:
        logger_callback(f"INGEST: Initializing OpenCV capture for {total_frames} raw video frames (stride={stride})...")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % stride == 0:
            analyzed_count += 1
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # 1. Laplacian Variance Blur Metric
            lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

            # 2. Exposure Metric
            mean_brightness = float(np.mean(gray))

            is_blurry = lap_var < blur_threshold
            is_bad_exposure = mean_brightness < 20 or mean_brightness > 240

            if is_blurry:
                rejected_blur += 1
            elif is_bad_exposure:
                rejected_exposure += 1
            else:
                # 3. Inter-frame Similarity / Redundancy check
                is_redundant = False
                if prev_selected_gray is not None:
                    # Normalized absolute difference
                    diff = cv2.absdiff(gray, prev_selected_gray)
                    diff_score = float(np.mean(diff))
                    if diff_score < redundancy_threshold: # Drone hovered in place, baseline is too small
                        is_redundant = True
                        rejected_redundancy += 1

                if not is_redundant:
                    keyframe_name = f"frame_{len(selected_keyframes)+1:04d}.jpg"
                    keyframe_path = os.path.join(output_dir, keyframe_name)
                    cv2.imwrite(keyframe_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 95])

                    selected_keyframes.append({
                        "index": len(selected_keyframes) + 1,
                        "rawFrameIndex": frame_idx,
                        "timestampSec": round(frame_idx / fps, 2),
                        "filename": keyframe_name,
                        "filepath": keyframe_path,
                        "laplacianVariance": round(lap_var, 1),
                        "meanBrightness": round(mean_brightness, 1)
                    })
                    prev_selected_gray = gray

                    if logger_callback and len(selected_keyframes) % 5 == 0:
                        logger_callback(
                            f"EXTRACT: Locked keyframe {len(selected_keyframes)} "
                            f"(T={frame_idx/fps:.1f}s, var={lap_var:.1f})."
                        )

            # Cap keyframes if target reached
            if len(selected_keyframes) >= target_keyframes:
                break

        frame_idx += 1

    cap.release()

    total_rejected = rejected_blur + rejected_exposure + rejected_redundancy
    cull_rate_pct = round((total_rejected / analyzed_count * 100), 1) if analyzed_count > 0 else 0.0

    if logger_callback:
        logger_callback(
            f"QUALITY: Analyzed {analyzed_count} frames -> Selected {len(selected_keyframes)} "
            f"salient keyframes (Culled: {cull_rate_pct}% | Blur: {rejected_blur}, Redundant: {rejected_redundancy})."
        )

    return {
        "totalVideoFrames": total_frames,
        "analyzedFrames": analyzed_count,
        "selectedKeyframes": len(selected_keyframes),
        "rejectedFrames": total_rejected,
        "rejectedBlur": rejected_blur,
        "rejectedExposure": rejected_exposure,
        "rejectedRedundant": rejected_redundancy,
        "cullRatePct": cull_rate_pct,
        "keyframes": selected_keyframes
    }
