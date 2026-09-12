import os
import cv2
import numpy as np
import json
import csv

def generate_sample_drone_dataset(output_dir: str = "sample") -> str:
    """
    Synthesizes a reproducible, high-contrast aerial drone surveillance flight video
    and synchronized GPS track with genuine visual geometric features (buildings, roads, towers)
    for guaranteed 100% reproducible end-to-end evaluation.
    """
    os.makedirs(output_dir, exist_ok=True)
    video_path = os.path.join(output_dir, "drone_video.mp4")
    gps_path = os.path.join(output_dir, "gps.csv")
    meta_path = os.path.join(output_dir, "metadata.json")

    # Only generate if it doesn't already exist
    if os.path.exists(video_path) and os.path.getsize(video_path) > 10000:
        return video_path

    # Video parameters
    width, height = 1280, 720
    fps = 30
    duration_sec = 4
    total_frames = fps * duration_sec

    # Codec
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))

    # GPS entries
    base_lat = 18.5204
    base_lon = 73.8567
    base_alt = 120.0
    gps_rows = [["timestamp_sec", "lat", "lon", "alt_msl", "speed_mps", "heading_deg"]]

    # 3D World coordinates for synthetic industrial scene
    # Generate camera orbit flight path
    for i in range(total_frames):
        t = i / total_frames
        # Aerial flight path: straight corridor forward with slight right curve
        cam_x = (t - 0.5) * 40.0
        cam_y = 25.0 + np.sin(t * np.pi) * 3.0
        cam_z = 35.0 - t * 30.0

        # Render aerial drone perspective frame
        img = np.zeros((height, width, 3), dtype=np.uint8)
        # Deep asphalt / terrain ground color
        img[:] = (35, 45, 55)

        # Ground grid lines (creating scale-invariant features)
        for gx in range(-80, 80, 8):
            # Project ground point
            px = int(width / 2 + (gx - cam_x) * 18.0 / (cam_y * 0.1 + 1.0))
            if 0 <= px < width:
                cv2.line(img, (px, 0), (px, height), (50, 60, 75), 1)

        for gz in range(-40, 80, 8):
            py = int(height / 2 + (gz - cam_z) * 14.0 / (cam_y * 0.1 + 1.0))
            if 0 <= py < height:
                cv2.line(img, (0, py), (width, py), (50, 60, 75), 1)

        # Industrial Facility Structures (Rectangles, Silos, Crosses with high SIFT saliency)
        structures = [
            {"x": -10, "z": 5, "w": 14, "h": 10, "color": (140, 160, 180), "label": "BLDG_A"},
            {"x": 12, "z": -5, "w": 18, "h": 12, "color": (160, 180, 200), "label": "WAREHOUSE"},
            {"x": 0, "z": -12, "w": 8, "h": 8, "color": (120, 140, 160), "label": "CONTROL"},
            {"x": -18, "z": -8, "w": 6, "h": 6, "color": (200, 210, 220), "label": "SILO_1"},
            {"x": -18, "z": 0, "w": 6, "h": 6, "color": (200, 210, 220), "label": "SILO_2"}
        ]

        for s in structures:
            sx = int(width / 2 + (s["x"] - cam_x) * 22.0)
            sy = int(height / 2 + (s["z"] - cam_z) * 16.0)
            sw = int(s["w"] * 20.0 / (cam_y * 0.08 + 1.0))
            sh = int(s["h"] * 16.0 / (cam_y * 0.08 + 1.0))

            if -sw < sx < width + sw and -sh < sy < height + sh:
                # Building footprint
                cv2.rectangle(img, (sx - sw // 2, sy - sh // 2), (sx + sw // 2, sy + sh // 2), s["color"], -1)
                cv2.rectangle(img, (sx - sw // 2, sy - sh // 2), (sx + sw // 2, sy + sh // 2), (240, 240, 240), 2)

                # High-contrast internal textures for SIFT feature extraction
                for sub in range(4):
                    sub_x = sx - sw // 2 + (sub + 1) * (sw // 5)
                    cv2.circle(img, (sub_x, sy), 3, (255, 255, 255), -1)
                    cv2.circle(img, (sub_x, sy), 5, (20, 20, 20), 1)

        # Telemetry HUD Stamp on video frame
        cv2.putText(
            img,
            f"REC 4K [RAW] // TIME: {i/fps:.2f}S // ALT: {cam_y:.1f}M",
            (30, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (220, 220, 220),
            1,
            cv2.LINE_AA
        )

        out.write(img)

        # Synchronized GPS
        cur_lat = base_lat + (t * 0.0008)
        cur_lon = base_lon + (t * 0.0006)
        cur_alt = base_alt + np.sin(t * np.pi) * 3.0
        gps_rows.append([f"{i/fps:.2f}", f"{cur_lat:.6f}", f"{cur_lon:.6f}", f"{cur_alt:.2f}", "8.5", "42.0"])

    out.release()

    # Save GPS CSV
    with open(gps_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(gps_rows)

    # Save Metadata JSON
    metadata = {
        "mission": "NTRO SIH26158 Automated Flight Baseline",
        "sensor": "CMOS 1-inch 20MP (Simulated 4K/60)",
        "focalLengthMm": 24.0,
        "shutterSpeed": "1/1000s",
        "iso": 100,
        "crs": "WGS 84 / UTM Zone 43N",
        "gsdCmPerPx": 1.85,
        "durationSec": duration_sec,
        "fps": fps,
        "totalFrames": total_frames
    }
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    return video_path

if __name__ == "__main__":
    generate_sample_drone_dataset()
