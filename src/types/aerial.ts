export type ImplementationStatus = 'IMPLEMENTED' | 'ADVANCED' | 'PROPOSED';

export interface TelemetryState {
  timestamp: string;
  latitude: number;
  longitude: number;
  altitudeMsl: number;
  altitudeAgl: number;
  speedMps: number;
  roll: number;
  pitch: number;
  yaw: number;
  satellites: number;
  hdop: number;
  rtkStatus: 'RTK FIXED' | 'RTK FLOAT' | 'DGPS' | 'AUTONOMOUS';
  focalLengthMm: number;
  iso: number;
  shutterSpeed: string;
  batteryPct: number;
  frameIndex: number;
  fps: number;
}

export type ViewerRenderMode = 
  | 'sparse' 
  | 'dense' 
  | 'wireframe' 
  | 'textured' 
  | 'elevation' 
  | 'segmentation';

export interface DatasetItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  coordinates: [number, number];
  altitude: number;
  flightDuration: string;
  framesExtracted: number;
  reconstructedPoints: number;
  meshTriangles: number;
  gsdCmPerPx: number;
  previewUrl: string;
  environmentType: 'Industrial' | 'Infrastructure' | 'Terrain' | 'Urban';
  summary: string;
}

export interface MeasurementPoint3D {
  x: number;
  y: number;
  z: number;
}

export interface MeasurementResult {
  p1: MeasurementPoint3D | null;
  p2: MeasurementPoint3D | null;
  euclideanDistMeters: number;
  horizontalDistMeters: number;
  verticalDeltaMeters: number;
  slopeDegrees: number;
  confidenceScore: number;
}

export interface PipelineStage {
  id: string;
  index: string;
  title: string;
  status: ImplementationStatus;
  category: 'Ingestion' | 'Computer Vision' | 'Reconstruction' | 'Geospatial' | 'AI Intelligence';
  shortDesc: string;
  mathematicalBasis: string;
  input: string;
  output: string;
  metrics: string;
}

export type CursorMode = 'DEFAULT' | 'EXPLORE' | 'VIEW' | 'MEASURE' | 'INSPECT';

export interface CameraPose {
  cameraIndex: number;
  position: [number, number, number];
  rotation: number[][];
  euler: [number, number, number];
}

export interface WebGLModelData {
  vertices: number[];
  colors: number[];
  normals: number[];
  indices: number[];
}

export interface GeoreferencingData {
  crs: string;
  utmZone: string;
  originLat: number;
  originLon: number;
  originEasting: number;
  originNorthing: number;
  meanAltitude: number;
  metricScale: number;
}

export interface RealReconstructionModel {
  jobId: string;
  title: string;
  pointCount: number;
  triangleCount: number;
  meshGenerated: boolean;
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
    center: [number, number, number];
    extents: [number, number, number];
  };
  georeferencing: GeoreferencingData;
  cameraPoses: CameraPose[];
  webglData: WebGLModelData;
  reprojectionError: number;
  inlierRatio: number;
}

export interface ReconstructionJobStats {
  resolution?: string;
  fps?: number;
  durationSec?: number;
  totalFrames?: number;
  analyzedFrames?: number;
  selectedKeyframes?: number;
  rejectedFrames?: number;
  keypointsCount?: number;
  inlierRatio?: number;
  reprojectionResidual?: number;
  pointsCount?: number;
  cameraCount?: number;
  trianglesCount?: number;
  crs?: string;
}

export interface ReconstructionJobStatus {
  jobId: string;
  status: 'UPLOADED' | 'READY' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  stage: string;
  logs: string[];
  stats: ReconstructionJobStats;
  hasModel?: boolean;
}

