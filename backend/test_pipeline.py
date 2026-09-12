import os
import shutil
import json
from pipeline.video_ingest import extract_video_metadata, intelligent_keyframe_extraction
from pipeline.sfm_engine import StructureFromMotionEngine
from pipeline.mesh_engine import process_pointcloud_and_mesh
from pipeline.georeferencing import compute_georeferencing_metadata

def run_test():
    print("=== STARTING END-TO-END SIH26158 PIPELINE TEST ===")

    video_path = os.path.join("sample", "drone_video.mp4")
    test_output_dir = os.path.join("jobs", "test_job_001")
    if os.path.exists(test_output_dir):
        shutil.rmtree(test_output_dir)
    os.makedirs(test_output_dir, exist_ok=True)

    # 1. Video Ingestion & Metadata
    print("\n--- PHASE 1: VIDEO METADATA EXTRACTION ---")
    meta = extract_video_metadata(video_path)
    print(f"Resolution: {meta['resolution']}, FPS: {meta['fps']}, Total Frames: {meta['totalFrames']}, Duration: {meta['durationSec']}s")
    assert meta["width"] == 1280
    assert meta["height"] == 720

    # 2. Intelligent Frame Extraction
    print("\n--- PHASE 2: INTELLIGENT KEYFRAME EXTRACTION ---")
    keyframes_dir = os.path.join(test_output_dir, "keyframes")
    extract_res = intelligent_keyframe_extraction(
        video_path=video_path,
        output_dir=keyframes_dir,
        target_keyframes=15,
        blur_threshold=10.0,
        logger_callback=print
    )
    print(f"Analyzed: {extract_res['analyzedFrames']}, Selected Keyframes: {extract_res['selectedKeyframes']}, Culled: {extract_res['rejectedFrames']}")
    assert extract_res["selectedKeyframes"] >= 2

    # 3. SfM Core (SIFT + Matching + Triangulation)
    print("\n--- PHASE 3: STRUCTURE FROM MOTION ---")
    keyframe_paths = [kf["filepath"] for kf in extract_res["keyframes"]]
    sfm = StructureFromMotionEngine()
    sfm_res = sfm.run_reconstruction(keyframe_paths, logger_callback=print)

    print(f"Cameras Solved: {sfm_res['cameraCount']}, 3D Tie Points: {sfm_res['pointCount']}, Inlier Ratio: {sfm_res['meanInlierRatio']}%")
    assert sfm_res["cameraCount"] >= 2
    assert sfm_res["pointCount"] > 0

    # 4. Open3D Point Cloud & Meshing
    print("\n--- PHASE 4: OPEN3D POINT CLOUD & MESH GENERATION ---")
    mesh_res = process_pointcloud_and_mesh(
        points=sfm_res["sparsePoints"],
        colors=sfm_res["sparseColors"],
        output_dir=test_output_dir,
        logger_callback=print
    )
    print(f"Final Points: {mesh_res['pointCount']}, Bounding Box Extents: {mesh_res['boundingBox']['extents']}")
    assert os.path.exists(mesh_res["plyPath"])

    # 5. Georeferencing
    print("\n--- PHASE 5: GEOREFERENCING ---")
    geo = compute_georeferencing_metadata([{"lat": 18.5204, "lon": 73.8567, "alt": 120.0}])
    print(f"CRS: {geo['crs']}, UTM Easting: {geo['originEasting']}m, Northing: {geo['originNorthing']}m")
    assert "UTM" in geo["crs"]

    print("\n=== SUCCESS: END-TO-END PIPELINE VERIFIED CLEANLY ===")

if __name__ == "__main__":
    run_test()
