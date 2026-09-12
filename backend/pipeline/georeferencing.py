import math
from typing import Tuple, Dict, Any, List

def latlon_to_utm(lat: float, lon: float) -> Tuple[float, float, int, str]:
    """
    Converts Latitude and Longitude (WGS84) to Universal Transverse Mercator (UTM).
    Returns (Easting, Northing, ZoneNumber, Hemisphere).
    Uses standard Karney / USGS geodetic formulations.
    """
    # WGS84 ellipsoid constants
    a = 6378137.0         # Semi-major axis (meters)
    f = 1 / 298.257223563 # Flattening
    b = a * (1 - f)       # Semi-minor axis
    e2 = (a**2 - b**2) / (a**2) # First eccentricity squared
    e_prime2 = (a**2 - b**2) / (b**2) # Second eccentricity squared

    # UTM Zone calculation
    zone_number = int((lon + 180) / 6) + 1
    lon_origin = (zone_number - 1) * 6 - 180 + 3
    hemisphere = 'N' if lat >= 0 else 'S'

    lat_rad = math.radians(lat)
    lon_rad = math.radians(lon)
    lon_origin_rad = math.radians(lon_origin)

    k0 = 0.9996 # Central scale factor for UTM

    N = a / math.sqrt(1 - e2 * math.sin(lat_rad)**2)
    T = math.tan(lat_rad)**2
    C = e_prime2 * math.cos(lat_rad)**2
    A = math.cos(lat_rad) * (lon_rad - lon_origin_rad)

    # Meridian distance M
    M = a * (
        (1 - e2 / 4 - 3 * e2**2 / 64 - 5 * e2**3 / 256) * lat_rad
        - (3 * e2 / 8 + 3 * e2**2 / 32 + 45 * e2**3 / 1024) * math.sin(2 * lat_rad)
        + (15 * e2**2 / 256 + 45 * e2**3 / 1024) * math.sin(4 * lat_rad)
        - (35 * e2**3 / 3072) * math.sin(6 * lat_rad)
    )

    # Easting
    easting = k0 * N * (
        A + (1 - T + C) * A**3 / 6
        + (5 - 18 * T + T**2 + 72 * C - 58 * e_prime2) * A**5 / 120
    ) + 500000.0 # 500,000 m False Easting

    # Northing
    northing = k0 * (
        M + N * math.tan(lat_rad) * (
            A**2 / 2 + (5 - T + 9 * C + 4 * C**2) * A**4 / 24
            + (61 - 58 * T + T**2 + 600 * C - 330 * e_prime2) * A**6 / 720
        )
    )
    if lat < 0:
        northing += 10000000.0 # 10,000,000 m False Northing for Southern Hemisphere

    return easting, northing, zone_number, hemisphere


def compute_georeferencing_metadata(
    gps_entries: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Computes Coordinate Reference System (CRS), geographic bounding box,
    local origin, and metric scale from ingested GPS telemetry.
    """
    if not gps_entries:
        # Default fallback context for NTRO / Pune test sector
        default_lat, default_lon = 18.5204, 73.8567 # Pune, India
        easting, northing, zone, hemi = latlon_to_utm(default_lat, default_lon)
        return {
            "crs": f"WGS 84 / UTM Zone {zone}{hemi}",
            "utmZone": f"{zone}{hemi}",
            "isEstimated": True,
            "originLat": default_lat,
            "originLon": default_lon,
            "originEasting": round(easting, 2),
            "originNorthing": round(northing, 2),
            "meanAltitude": 120.0,
            "metricScale": 1.0,
            "sampleCount": 0
        }

    lats = [float(e.get("lat", 0.0)) for e in gps_entries if "lat" in e]
    lons = [float(e.get("lon", 0.0)) for e in gps_entries if "lon" in e]
    alts = [float(e.get("alt", 100.0)) for e in gps_entries if "alt" in e]

    mean_lat = sum(lats) / len(lats) if lats else 18.5204
    mean_lon = sum(lons) / len(lons) if lons else 73.8567
    mean_alt = sum(alts) / len(alts) if alts else 120.0

    origin_easting, origin_northing, zone, hemi = latlon_to_utm(mean_lat, mean_lon)

    return {
        "crs": f"WGS 84 / UTM Zone {zone}{hemi}",
        "utmZone": f"{zone}{hemi}",
        "isEstimated": False,
        "originLat": round(mean_lat, 6),
        "originLon": round(mean_lon, 6),
        "originEasting": round(origin_easting, 2),
        "originNorthing": round(origin_northing, 2),
        "meanAltitude": round(mean_alt, 2),
        "metricScale": 1.0, # Metric UTM scale is preserved (meters)
        "sampleCount": len(gps_entries)
    }
