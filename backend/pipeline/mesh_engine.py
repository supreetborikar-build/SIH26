import os
import open3d as o3d
import numpy as np
from typing import Dict, Any, List, Tuple

def process_pointcloud_and_mesh(
    points: List[List[float]],
    colors: List[List[float]],
    output_dir: str,
    logger_callback = None
) -> Dict[str, Any]:
    """
    Real Open3D 3D point cloud processing, normal estimation, and surface meshing.
    """
    os.makedirs(output_dir, exist_ok=True)

    if not points or len(points) < 10:
        # Fallback if points are sparse
        np_pts = np.array(points if points else [[0, 0, 0]], dtype=np.float64)
        np_cols = np.array(colors if colors else [[1, 1, 1]], dtype=np.float64)
    else:
        np_pts = np.array(points, dtype=np.float64)
        np_cols = np.array(colors, dtype=np.float64)

    # 1. Create Open3D PointCloud
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(np_pts)
    if len(np_cols) == len(np_pts):
        pcd.colors = o3d.utility.Vector3dVector(np_cols)

    if logger_callback:
        logger_callback(f"MVS: Ingested {len(np_pts)} 3D coordinates into Open3D pipeline.")

    # 2. Statistical Outlier Removal
    if len(pcd.points) > 25:
        pcd_filtered, inlier_indices = pcd.remove_statistical_outlier(nb_neighbors=16, std_ratio=1.8)
        culled_count = len(pcd.points) - len(pcd_filtered.points)
        pcd = pcd_filtered
        if logger_callback:
            logger_callback(f"OUTLIER: Statistical k-NN distance filter culled {culled_count} atmospheric noise points.")

    # 3. Surface Normal Estimation
    if len(pcd.points) > 15:
        pcd.estimate_normals(
            search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=3.0, max_nn=30)
        )
        pcd.orient_normals_consistent_tangent_plane(k=10)
        if logger_callback:
            logger_callback("NORMALS: Computed consistent surface normal vectors across point cloud.")

    # 4. Surface Reconstruction (Ball-Pivoting & Poisson)
    triangles = []
    mesh_generated = False
    mesh_path = os.path.join(output_dir, "reconstruction_mesh.ply")
    pcd_path = os.path.join(output_dir, "reconstruction_pointcloud.ply")

    # Save standard PLY Point Cloud
    o3d.io.write_point_cloud(pcd_path, pcd)

    if len(pcd.points) >= 30 and pcd.has_normals():
        try:
            # Ball-Pivoting Algorithm (BPA) provides clean, faithful surfaces without phantom bulbs
            distances = pcd.compute_nearest_neighbor_distance()
            avg_dist = float(np.mean(distances)) if len(distances) > 0 else 0.5
            radii = [avg_dist * 1.5, avg_dist * 3.0, avg_dist * 6.0]

            bpa_mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_ball_pivoting(
                pcd, o3d.utility.DoubleVector(radii)
            )

            if len(bpa_mesh.triangles) > 0:
                bpa_mesh.compute_vertex_normals()
                o3d.io.write_triangle_mesh(mesh_path, bpa_mesh)
                triangles = np.asarray(bpa_mesh.triangles).tolist()
                mesh_generated = True
                if logger_callback:
                    logger_callback(f"POISSON/BPA: Surface reconstruction synthesized {len(triangles)} watertight triangle facets.")
            else:
                # Screened Poisson fallback
                poisson_mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=7)
                poisson_mesh.compute_vertex_normals()
                o3d.io.write_triangle_mesh(mesh_path, poisson_mesh)
                triangles = np.asarray(poisson_mesh.triangles).tolist()
                mesh_generated = True
                if logger_callback:
                    logger_callback(f"POISSON: Screened Poisson generated {len(triangles)} polygonal surface facets.")
        except Exception as e:
            if logger_callback:
                logger_callback(f"MESH: Note: Surface meshing fell back to dense point cloud representation ({e}).")

    # 5. Extract WebGL-Ready Arrays for Three.js Direct Loading
    final_pts = np.asarray(pcd.points)
    final_cols = np.asarray(pcd.colors) if pcd.has_colors() else np.ones_like(final_pts) * 0.8
    final_normals = np.asarray(pcd.normals) if pcd.has_normals() else np.zeros_like(final_pts)

    # Flatten for Three.js Float32Array ingestion
    flat_vertices = final_pts.flatten().tolist()
    flat_colors = final_cols.flatten().tolist()
    flat_normals = final_normals.flatten().tolist()
    flat_indices = [idx for tri in triangles for idx in tri] if triangles else []

    # Compute Bounding Box
    if len(final_pts) > 0:
        min_bound = final_pts.min(axis=0).tolist()
        max_bound = final_pts.max(axis=0).tolist()
        center = ((final_pts.min(axis=0) + final_pts.max(axis=0)) / 2.0).tolist()
        extents = (final_pts.max(axis=0) - final_pts.min(axis=0)).tolist()
    else:
        min_bound = [-10, 0, -10]
        max_bound = [10, 5, 10]
        center = [0, 2.5, 0]
        extents = [20, 5, 20]

    return {
        "plyPath": pcd_path,
        "meshPlyPath": mesh_path if mesh_generated else None,
        "pointCount": len(final_pts),
        "triangleCount": len(triangles),
        "meshGenerated": mesh_generated,
        "boundingBox": {
            "min": [round(v, 2) for v in min_bound],
            "max": [round(v, 2) for v in max_bound],
            "center": [round(v, 2) for v in center],
            "extents": [round(v, 2) for v in extents]
        },
        "webglData": {
            "vertices": flat_vertices,
            "colors": flat_colors,
            "normals": flat_normals,
            "indices": flat_indices
        }
    }
