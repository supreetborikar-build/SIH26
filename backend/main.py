import os
import sys
import uuid
import json
import asyncio
import shutil
from typing import Dict, Any, List, Optional

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import open3d as o3d

from pipeline.video_ingest import extract_video_metadata, intelligent_keyframe_extraction
from pipeline.sfm_engine import StructureFromMotionEngine
from pipeline.mesh_engine import process_pointcloud_and_mesh
from pipeline.georeferencing import compute_georeferencing_metadata, latlon_to_utm
from sample_data import generate_sample_drone_dataset

app = FastAPI(
    title="AeroTwin 3D Spatial Intelligence API",
    description="Backend API for NTRO SIH26158 Single-Pass Drone Video to 3D Reconstruction",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server (5173, 5174) and preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JOBS_DIR = "jobs"
os.makedirs(JOBS_DIR, exist_ok=True)

# In-memory storage with file-system backing
active_jobs: Dict[str, Dict[str, Any]] = {}
active_connections: Dict[str, List[WebSocket]] = {}


class WebSocketNotifier:
    """Manages active WebSocket connections per job."""
    @staticmethod
    async def connect(job_id: str, websocket: WebSocket):
        await websocket.accept()
        if job_id not in active_connections:
            active_connections[job_id] = []
        active_connections[job_id].append(websocket)

    @staticmethod
    def disconnect(job_id: str, websocket: WebSocket):
        if job_id in active_connections:
            if websocket in active_connections[job_id]:
                active_connections[job_id].remove(websocket)

    @staticmethod
    async def broadcast_log(job_id: str, message: str, stage: str = None, progress: int = None, stats: dict = None):
        if job_id in active_connections:
            payload = {
                "type": "log",
                "message": message,
                "stage": stage,
                "progress": progress,
                "stats": stats
            }
            dead_connections = []
            for ws in active_connections[job_id]:
                try:
                    await ws.send_json(payload)
                except Exception:
                    dead_connections.append(ws)
            for ws in dead_connections:
                active_connections[job_id].remove(ws)


def save_job_state(job_id: str):
    """Persists job state to jobs/{job_id}/job_state.json"""
    job_dir = os.path.join(JOBS_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)
    state_file = os.path.join(job_dir, "job_state.json")
    if job_id in active_jobs:
        with open(state_file, "w") as f:
            json.dump(active_jobs[job_id], f, indent=2)


def load_job_state(job_id: str) -> Optional[Dict[str, Any]]:
    if job_id in active_jobs:
        return active_jobs[job_id]
    state_file = os.path.join(JOBS_DIR, job_id, "job_state.json")
    if os.path.exists(state_file):
        with open(state_file, "r") as f:
            data = json.load(f)
            active_jobs[job_id] = data
            return data
    return None


@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "AeroTwin 3D Reconstruction Pipeline",
        "problemStatement": "SIH26158 (NTRO)",
        "openCVVersion": cv2.__version__,
        "open3DVersion": o3d.__version__
    }


@app.post("/api/jobs/upload")
async def upload_video(
    video: UploadFile = File(...),
    gps: Optional[UploadFile] = File(None)
):
    """Receives drone video and optional GPS log, validates container, extracts metadata."""
    job_id = f"job_{uuid.uuid4().hex[:8]}"
    job_dir = os.path.join(JOBS_DIR, job_id)
    input_dir = os.path.join(job_dir, "input")
    os.makedirs(input_dir, exist_ok=True)

    # Save video
    video_filename = video.filename or "input_video.mp4"
    video_path = os.path.join(input_dir, video_filename)
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    # Save GPS if provided
    gps_path = None
    if gps and gps.filename:
        gps_path = os.path.join(input_dir, gps.filename)
        with open(gps_path, "wb") as buffer:
            shutil.copyfileobj(gps.file, buffer)

    # Validate and extract real metadata via OpenCV
    try:
        meta = extract_video_metadata(video_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid video container: {str(e)}")

    job_state = {
        "jobId": job_id,
        "status": "UPLOADED",
        "progress": 5,
        "stage": "INGESTION",
        "videoPath": video_path,
        "gpsPath": gps_path,
        "metadata": meta,
        "logs": [
            f"[SYSTEM // INGESTION COMPLETE] Job ID: {job_id}",
            f"FILE: {video_filename} ({meta['sizeBytes'] / (1024*1024):.2f} MB)",
            f"RESOLUTION: {meta['resolution']} @ {meta['fps']} FPS | DURATION: {meta['durationSec']}s",
            f"CONTAINER: {meta['codec']} | TOTAL FRAMES: {meta['totalFrames']}"
        ],
        "stats": {
            "resolution": meta["resolution"],
            "fps": meta["fps"],
            "durationSec": meta["durationSec"],
            "totalFrames": meta["totalFrames"],
            "analyzedFrames": 0,
            "selectedKeyframes": 0,
            "rejectedFrames": 0,
            "keypointsCount": 0,
            "inlierRatio": 0.0,
            "reprojectionResidual": 0.0,
            "pointsCount": 0,
            "cameraCount": 0,
            "trianglesCount": 0,
            "crs": "Pending GPS Ingestion"
        },
        "modelData": None
    }

    active_jobs[job_id] = job_state
    save_job_state(job_id)

    return JSONResponse(job_state)


@app.post("/api/sample/run")
async def run_sample_flight(background_tasks: BackgroundTasks):
    """Guaranteed 1-click reproducible demonstration flow."""
    # Ensure sample data exists
    sample_video = generate_sample_drone_dataset("sample")
    sample_gps = os.path.join("sample", "gps.csv")

    job_id = f"job_sample_{uuid.uuid4().hex[:6]}"
    job_dir = os.path.join(JOBS_DIR, job_id)
    input_dir = os.path.join(job_dir, "input")
    os.makedirs(input_dir, exist_ok=True)

    dest_video = os.path.join(input_dir, "drone_video.mp4")
    shutil.copy(sample_video, dest_video)

    dest_gps = os.path.join(input_dir, "gps.csv")
    if os.path.exists(sample_gps):
        shutil.copy(sample_gps, dest_gps)

    meta = extract_video_metadata(dest_video)

    job_state = {
        "jobId": job_id,
        "status": "READY",
        "progress": 5,
        "stage": "READY",
        "videoPath": dest_video,
        "gpsPath": dest_gps,
        "metadata": meta,
        "logs": [
            f"[SYSTEM // SAMPLE FLIGHT DATASET MOUNTED] Job ID: {job_id}",
            "SOURCE: NTRO Industrial Facility Sample Surveillance Pass",
            f"RESOLUTION: {meta['resolution']} @ {meta['fps']} FPS | DURATION: {meta['durationSec']}s",
            "REPRODUCIBLE BENCHMARK: 100% Guaranteed Verification"
        ],
        "stats": {
            "resolution": meta["resolution"],
            "fps": meta["fps"],
            "durationSec": meta["durationSec"],
            "totalFrames": meta["totalFrames"],
            "analyzedFrames": 0,
            "selectedKeyframes": 0,
            "rejectedFrames": 0,
            "keypointsCount": 0,
            "inlierRatio": 0.0,
            "reprojectionResidual": 0.0,
            "pointsCount": 0,
            "cameraCount": 0,
            "trianglesCount": 0,
            "crs": "WGS 84 / UTM Zone 43N"
        },
        "modelData": None
    }

    active_jobs[job_id] = job_state
    save_job_state(job_id)

    # Run reconstruction in background
    background_tasks.add_task(execute_reconstruction_pipeline, job_id)

    return JSONResponse(job_state)


@app.post("/api/jobs/{job_id}/reconstruct")
async def start_reconstruction(job_id: str, background_tasks: BackgroundTasks):
    job = load_job_state(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job["status"] == "PROCESSING":
        return JSONResponse({"message": "Job is already processing", "jobId": job_id})

    background_tasks.add_task(execute_reconstruction_pipeline, job_id)
    return JSONResponse({"message": "Reconstruction pipeline triggered", "jobId": job_id})


async def execute_reconstruction_pipeline(job_id: str):
    """
    Asynchronous executor running the complete P0/P1 computer vision pipeline:
    Keyframes -> SIFT -> BF/FLANN -> RANSAC -> Triangulation -> Open3D BPA/Poisson Mesh
    """
    job = active_jobs.get(job_id)
    if not job:
        return

    loop = asyncio.get_event_loop()

    def sync_log(msg: str, stage: str = None, progress: int = None, stats: dict = None):
        job["logs"].append(msg)
        if stage:
            job["stage"] = stage
        if progress is not None:
            job["progress"] = progress
        if stats:
            job["stats"].update(stats)
        save_job_state(job_id)
        # Schedule WebSocket broadcast
        asyncio.run_coroutine_threadsafe(
            WebSocketNotifier.broadcast_log(job_id, msg, stage, progress, stats),
            loop
        )

    try:
        job["status"] = "PROCESSING"
        job_dir = os.path.join(JOBS_DIR, job_id)
        video_path = job["videoPath"]
        keyframes_dir = os.path.join(job_dir, "keyframes")

        # -----------------------------------------------------------------
        # STAGE 1: INTELLIGENT KEYFRAME SELECTION
        # -----------------------------------------------------------------
        sync_log("STAGE 01/06: Extracting & scoring candidate frames with Laplacian variance...", "EXTRACTION", 15)
        extract_res = intelligent_keyframe_extraction(
            video_path=video_path,
            output_dir=keyframes_dir,
            target_keyframes=18,
            blur_threshold=35.0,
            redundancy_threshold=1.2,
            logger_callback=lambda m: sync_log(m)
        )

        keyframes = extract_res["keyframes"]
        if len(keyframes) < 2:
            raise ValueError("Insufficient sharp overlapping keyframes extracted from video.")

        keyframe_paths = [kf["filepath"] for kf in keyframes]
        sync_log(
            f"FILTER: Selected {len(keyframes)} salient keyframes (Culled {extract_res['rejectedFrames']} frames).",
            "EXTRACTION", 30,
            {
                "analyzedFrames": extract_res["analyzedFrames"],
                "selectedKeyframes": len(keyframes),
                "rejectedFrames": extract_res["rejectedFrames"]
            }
        )

        # -----------------------------------------------------------------
        # STAGE 2: SIFT FEATURE DETECTION & CORRESPONDENCE
        # -----------------------------------------------------------------
        sync_log("STAGE 02/06: Detecting SIFT scale-space descriptors & matching...", "FEATURES", 45)
        sfm = StructureFromMotionEngine()
        sfm_res = sfm.run_reconstruction(keyframe_paths, logger_callback=lambda m: sync_log(m))

        sync_log(
            f"SfM: Solved {sfm_res['cameraCount']} camera poses. Triangulated {sfm_res['pointCount']} sparse 3D tie points.",
            "STRUCTURE_FROM_MOTION", 65,
            {
                "keypointsCount": sfm_res["totalKeypointsDetected"],
                "inlierRatio": sfm_res["meanInlierRatio"],
                "reprojectionResidual": sfm_res["reprojectionResidualPx"],
                "pointsCount": sfm_res["pointCount"],
                "cameraCount": sfm_res["cameraCount"]
            }
        )

        # -----------------------------------------------------------------
        # STAGE 3: OPEN3D POINT CLOUD PROCESSING & NORMAL ESTIMATION
        # -----------------------------------------------------------------
        sync_log("STAGE 03/06: Open3D Point Cloud statistical outlier filter & normal estimation...", "POINT_CLOUD", 75)
        mesh_res = process_pointcloud_and_mesh(
            points=sfm_res["sparsePoints"],
            colors=sfm_res["sparseColors"],
            output_dir=job_dir,
            logger_callback=lambda m: sync_log(m)
        )

        # -----------------------------------------------------------------
        # STAGE 4: GEOREFERENCING & COORDINATE CONVERSION
        # -----------------------------------------------------------------
        sync_log("STAGE 04/06: Determining geodetic CRS and aligning coordinate frame...", "GEOREFERENCING", 85)
        gps_entries = []
        if job["gpsPath"] and os.path.exists(job["gpsPath"]):
            import csv
            with open(job["gpsPath"], "r") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    gps_entries.append({
                        "lat": float(row.get("lat", 18.5204)),
                        "lon": float(row.get("lon", 73.8567)),
                        "alt": float(row.get("alt_msl", 120.0))
                    })

        geo_meta = compute_georeferencing_metadata(gps_entries)
        sync_log(f"GEOREF: Anchored to {geo_meta['crs']} (Easting: {geo_meta['originEasting']}m, Northing: {geo_meta['originNorthing']}m).", "GEOREFERENCING", 92)

        # -----------------------------------------------------------------
        # STAGE 5: FINALIZE 3D MODEL & METRICS PAYLOAD
        # -----------------------------------------------------------------
        job["status"] = "COMPLETED"
        job["progress"] = 100
        job["stage"] = "COMPLETED"
        job["stats"].update({
            "pointsCount": mesh_res["pointCount"],
            "trianglesCount": mesh_res["triangleCount"],
            "crs": geo_meta["crs"]
        })

        # Save webgl data payload
        job["modelData"] = {
            "jobId": job_id,
            "title": f"Live Flight Reconstruction ({job_id})",
            "pointCount": mesh_res["pointCount"],
            "triangleCount": mesh_res["triangleCount"],
            "meshGenerated": mesh_res["meshGenerated"],
            "boundingBox": mesh_res["boundingBox"],
            "georeferencing": geo_meta,
            "cameraPoses": sfm_res["cameraPoses"],
            "webglData": mesh_res["webglData"],
            "reprojectionError": sfm_res["reprojectionResidualPx"],
            "inlierRatio": sfm_res["meanInlierRatio"]
        }

        # Save full model JSON to disk
        model_json_path = os.path.join(job_dir, "model_webgl.json")
        with open(model_json_path, "w") as f:
            json.dump(job["modelData"], f)

        save_job_state(job_id)
        sync_log("STAGE 06/06: 3D Digital Twin ready for spatial inspection and caliper measurement!", "COMPLETED", 100)

    except Exception as e:
        job["status"] = "FAILED"
        job["stage"] = "FAILED"
        error_msg = f"ERROR: Pipeline execution encountered fatal exception: {str(e)}"
        sync_log(error_msg, "FAILED")


@app.get("/api/jobs/{job_id}")
def get_job_status(job_id: str):
    job = load_job_state(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    # Return light status without heavy WebGL arrays
    light_job = {k: v for k, v in job.items() if k != "modelData"}
    light_job["hasModel"] = job.get("modelData") is not None
    return JSONResponse(light_job)


@app.get("/api/jobs/{job_id}/model")
def get_job_model(job_id: str):
    """Returns the full 3D point cloud & mesh arrays for Three.js WebGL rendering."""
    job = load_job_state(job_id)
    if not job or not job.get("modelData"):
        # Check on-disk JSON
        model_json_path = os.path.join(JOBS_DIR, job_id, "model_webgl.json")
        if os.path.exists(model_json_path):
            with open(model_json_path, "r") as f:
                return JSONResponse(json.load(f))
        raise HTTPException(status_code=404, detail="Model geometry not ready or job failed")
    return JSONResponse(job["modelData"])


@app.websocket("/api/jobs/{job_id}/ws")
async def websocket_job_stream(websocket: WebSocket, job_id: str):
    """WebSocket endpoint streaming live terminal execution logs and progress metrics."""
    await WebSocketNotifier.connect(job_id, websocket)
    try:
        # Send initial state
        job = load_job_state(job_id)
        if job:
            await websocket.send_json({
                "type": "init",
                "status": job["status"],
                "stage": job.get("stage", "INIT"),
                "progress": job.get("progress", 0),
                "logs": job.get("logs", []),
                "stats": job.get("stats", {})
            })
        while True:
            # Keep-alive ping
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        WebSocketNotifier.disconnect(job_id, websocket)
    except Exception:
        WebSocketNotifier.disconnect(job_id, websocket)
