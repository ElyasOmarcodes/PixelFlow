export type LayerType = 'text' | 'image' | 'shape' | 'group';

export interface StrokeConfig {
  id: string;
  enabled: boolean;
  width: number;
  
  // Color
  fillType: 'solid' | 'linear-gradient' | 'radial-gradient';
  color: string;
  gradientColorStops?: (number | string)[];
  gradientAngle?: number;
  
  // Position
  position: 'center' | 'inside' | 'outside';
  
  // Style
  dashType: 'solid' | 'dashed' | 'dotted';
  dashSize?: number;
  dashGap?: number;
  
  // Joins & Caps
  lineJoin: 'miter' | 'round' | 'bevel';
  lineCap: 'butt' | 'round' | 'square';
}

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  blendMode: string;
  fillPriority?: 'color' | 'linear-gradient' | 'radial-gradient';
  fillLinearGradientStartPoint?: { x: number, y: number };
  fillLinearGradientEndPoint?: { x: number, y: number };
  fillLinearGradientColorStops?: (number | string)[];
  fillRadialGradientStartPoint?: { x: number, y: number };
  fillRadialGradientEndPoint?: { x: number, y: number };
  fillRadialGradientStartRadius?: number;
  fillRadialGradientEndRadius?: number;
  fillRadialGradientColorStops?: (number | string)[];
  gradientAngle?: number;
  strokes?: StrokeConfig[];
}

export interface TextSegment {
  text: string;
  fill: string;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: 'left' | 'center' | 'right';
  fontStyle: string; // normal, bold, italic
  textDecoration: string; // empty, underline, line-through
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  stroke?: string;
  strokeWidth?: number;
  segments?: TextSegment[];
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  width: number;
  height: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: 'rect' | 'circle' | 'star' | 'polygon';
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export type Layer = TextLayer | ImageLayer | ShapeLayer;

export interface Project {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: 'px' | 'inch';
  backgroundColor: string;
  isTransparent: boolean;
  layers: Layer[];
  thumbnail?: string;
  updatedAt: number;
}
