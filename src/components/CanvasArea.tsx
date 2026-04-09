import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer as KonvaLayer, Text, Rect, Image as KonvaImage, Transformer, Group } from 'react-konva';
import useImage from 'use-image';
import { useStore } from '../store/useStore';
import { Layer, TextLayer, ShapeLayer, ImageLayer } from '../types';
import { getLinearGradientCoordinates, getRadialGradientCoordinates } from '../utils/gradient';

const getStrokeProps = (stroke: any, width: number, height: number) => {
  let props: any = {
    strokeWidth: (stroke.position === 'outside' || stroke.position === 'inside') ? stroke.width * 2 : stroke.width,
    lineJoin: stroke.lineJoin,
    lineCap: stroke.lineCap,
    strokeScaleEnabled: false,
  };

  if (stroke.dashType === 'dashed') {
    props.dash = [stroke.dashSize || 10, stroke.dashGap || 10];
  } else if (stroke.dashType === 'dotted') {
    props.dash = [1, stroke.dashGap || 10];
    props.lineCap = 'round';
  }

  if (stroke.fillType === 'solid') {
    props.stroke = stroke.color;
  } else {
    // Gradient stroke workaround: use fill props on a stroke-only component
    const isLinear = stroke.fillType === 'linear-gradient';
    if (isLinear && stroke.gradientAngle !== undefined) {
      const coords = getLinearGradientCoordinates(stroke.gradientAngle, width, height);
      props.fillLinearGradientStartPoint = coords.startPoint;
      props.fillLinearGradientEndPoint = coords.endPoint;
      props.fillLinearGradientColorStops = stroke.gradientColorStops;
      props.fillPriority = 'linear-gradient';
    } else {
      const coords = getRadialGradientCoordinates(width, height);
      props.fillRadialGradientStartPoint = coords.startPoint;
      props.fillRadialGradientEndPoint = coords.endPoint;
      props.fillRadialGradientStartRadius = coords.startRadius;
      props.fillRadialGradientEndRadius = coords.endRadius;
      props.fillRadialGradientColorStops = stroke.gradientColorStops;
      props.fillPriority = 'radial-gradient';
    }
    props.fillEnabled = true;
  }

  return props;
};

const ImageLayerComponent = ({ layer, commonProps }: { layer: ImageLayer, commonProps: any }) => {
  const [image] = useImage(layer.src);
  
  const renderImage = (props: any, key?: string) => (
    <KonvaImage
      key={key}
      image={image}
      width={layer.width}
      height={layer.height}
      {...props}
    />
  );

  const strokes = layer.strokes?.filter(s => s.enabled) || [];

  const renderStroke = (stroke: any, idx: number, isBackground: boolean) => {
    const strokeProps = getStrokeProps(stroke, layer.width, layer.height);
    const isGradient = stroke.fillType !== 'solid';
    
    // For gradient strokes, we use a workaround:
    // We draw the shape with gradient fill and then use the main shape to mask it.
    // Or if it's a solid stroke, we just use the stroke prop.
    
    const finalProps = {
      ...strokeProps,
      fill: isGradient ? undefined : (strokeProps.stroke ? undefined : stroke.color),
      stroke: isGradient ? undefined : strokeProps.stroke,
    };

    if (stroke.position === 'inside') {
      return (
        <Group key={`stroke-${isBackground ? 'bg' : 'fg'}-${idx}`} clipFunc={(ctx: any) => {
          ctx.rect(0, 0, layer.width, layer.height);
        }}>
          {renderImage({ ...finalProps, fillEnabled: isGradient, strokeEnabled: !isGradient }, `stroke-img-${idx}`)}
        </Group>
      );
    }

    return renderImage({ ...finalProps, fillEnabled: isGradient, strokeEnabled: !isGradient }, `stroke-${isBackground ? 'bg' : 'fg'}-${idx}`);
  };

  if (strokes.length === 0) {
    return renderImage(commonProps);
  }

  return (
    <Group {...commonProps}>
      {[...strokes].reverse().map((stroke, idx) => {
         if (stroke.position !== 'outside') return null;
         return renderStroke(stroke, idx, true);
      })}
      
      {renderImage({}, 'main')}

      {strokes.map((stroke, idx) => {
         if (stroke.position === 'outside') return null;
         return renderStroke(stroke, idx, false);
      })}
    </Group>
  );
};

const TextLayerComponent = ({ layer, commonProps, onDblClick, onDblTap }: { layer: TextLayer, commonProps: any, onDblClick: () => void, onDblTap: () => void }) => {
  const textRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (textRef.current) {
      setSize({
        width: textRef.current.width(),
        height: textRef.current.height()
      });
    }
  }, [layer.text, layer.fontSize, layer.fontFamily, layer.fontStyle]);

  let gradientProps = {};
  if (layer.fillPriority === 'linear-gradient' && layer.gradientAngle !== undefined) {
    const coords = getLinearGradientCoordinates(layer.gradientAngle, size.width, size.height);
    gradientProps = {
      fillLinearGradientStartPoint: coords.startPoint,
      fillLinearGradientEndPoint: coords.endPoint,
      fillLinearGradientColorStops: layer.fillLinearGradientColorStops,
    };
  } else if (layer.fillPriority === 'radial-gradient') {
    const coords = getRadialGradientCoordinates(size.width, size.height);
    gradientProps = {
      fillRadialGradientStartPoint: coords.startPoint,
      fillRadialGradientEndPoint: coords.endPoint,
      fillRadialGradientStartRadius: coords.startRadius,
      fillRadialGradientEndRadius: coords.endRadius,
      fillRadialGradientColorStops: layer.fillRadialGradientColorStops,
    };
  }

  if (layer.segments && layer.segments.length > 0) {
    // Render segments side-by-side
    // We need to measure text width to position them
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const renderSegments = (props: any, key?: string) => {
      let currentX = 0;
      return (
        <Group key={key} {...props}>
          {layer.segments!.map((seg, idx) => {
            if (ctx) {
              ctx.font = `${layer.fontStyle} ${layer.fontSize}px ${layer.fontFamily}`;
            }
            const segWidth = ctx ? ctx.measureText(seg.text).width : 0;
            const node = (
              <Text
                key={idx}
                x={currentX}
                y={0}
                text={seg.text}
                fontSize={layer.fontSize}
                fontFamily={layer.fontFamily}
                fill={props.fillEnabled === false ? undefined : seg.fill}
                align={layer.align}
                fontStyle={layer.fontStyle}
                textDecoration={layer.textDecoration}
                stroke={props.stroke}
                strokeWidth={props.strokeWidth}
                lineJoin={props.lineJoin}
                lineCap={props.lineCap}
                dash={props.dash}
                strokeLinearGradientStartPoint={props.strokeLinearGradientStartPoint}
                strokeLinearGradientEndPoint={props.strokeLinearGradientEndPoint}
                strokeLinearGradientColorStops={props.strokeLinearGradientColorStops}
                strokeRadialGradientStartPoint={props.strokeRadialGradientStartPoint}
                strokeRadialGradientEndPoint={props.strokeRadialGradientEndPoint}
                strokeRadialGradientStartRadius={props.strokeRadialGradientStartRadius}
                strokeRadialGradientEndRadius={props.strokeRadialGradientEndRadius}
                strokeRadialGradientColorStops={props.strokeRadialGradientColorStops}
              />
            );
            currentX += segWidth;
            return node;
          })}
        </Group>
      );
    };

    const strokes = layer.strokes?.filter(s => s.enabled) || [];

    const renderStrokeSegments = (stroke: any, idx: number, isBackground: boolean) => {
      const strokeProps = getStrokeProps(stroke, size.width, size.height);
      const finalProps = {
        ...strokeProps,
        fillEnabled: false,
        strokeEnabled: true,
      };

      if (stroke.position === 'inside') {
        return (
          <Group key={`stroke-${isBackground ? 'bg' : 'fg'}-${idx}`} clipFunc={(ctx: any) => {
            ctx.rect(0, 0, size.width, size.height);
          }}>
            {renderSegments(finalProps)}
          </Group>
        );
      }
      return renderSegments(finalProps, `stroke-${isBackground ? 'bg' : 'fg'}-${idx}`);
    };

    if (strokes.length === 0) {
      return (
        <Group ref={textRef} {...commonProps} onDblClick={onDblClick} onDblTap={onDblTap}>
          {renderSegments({})}
        </Group>
      );
    }

    return (
      <Group ref={textRef} {...commonProps} onDblClick={onDblClick} onDblTap={onDblTap}>
        {[...strokes].reverse().map((stroke, idx) => {
           if (stroke.position !== 'outside') return null;
           return renderStrokeSegments(stroke, idx, true);
        })}
        
        {renderSegments({}, 'main')}

        {strokes.map((stroke, idx) => {
           if (stroke.position === 'outside') return null;
           return renderStrokeSegments(stroke, idx, false);
        })}
      </Group>
    );
  }

  const renderText = (props: any, key?: string) => (
    <Text
      key={key}
      text={layer.text}
      fontSize={layer.fontSize}
      fontFamily={layer.fontFamily}
      align={layer.align}
      fontStyle={layer.fontStyle}
      textDecoration={layer.textDecoration}
      strokeScaleEnabled={false}
      {...props}
    />
  );

  const strokes = layer.strokes?.filter(s => s.enabled) || [];

  const renderStrokeText = (stroke: any, idx: number, isBackground: boolean) => {
    const strokeProps = getStrokeProps(stroke, size.width, size.height);
    const finalProps = {
      ...strokeProps,
      fillEnabled: false,
      strokeEnabled: true,
    };

    if (stroke.position === 'inside') {
      return (
        <Group key={`stroke-${isBackground ? 'bg' : 'fg'}-${idx}`} clipFunc={(ctx: any) => {
          ctx.rect(0, 0, size.width, size.height);
        }}>
          {renderText(finalProps)}
        </Group>
      );
    }
    return renderText(finalProps, `stroke-${isBackground ? 'bg' : 'fg'}-${idx}`);
  };

  if (strokes.length === 0) {
    return renderText({
      ref: textRef,
      ...commonProps,
      ...gradientProps,
      fill: layer.fillPriority === 'color' || !layer.fillPriority ? layer.fill : undefined,
      onDblClick,
      onDblTap
    });
  }

  return (
    <Group ref={textRef} {...commonProps} onDblClick={onDblClick} onDblTap={onDblTap}>
      {[...strokes].reverse().map((stroke, idx) => {
         if (stroke.position !== 'outside') return null;
         return renderStrokeText(stroke, idx, true);
      })}
      
      {renderText({
        ...gradientProps,
        fill: layer.fillPriority === 'color' || !layer.fillPriority ? layer.fill : undefined
      }, 'main')}

      {strokes.map((stroke, idx) => {
         if (stroke.position === 'outside') return null;
         return renderStrokeText(stroke, idx, false);
      })}
    </Group>
  );
};

const ShapeLayerComponent = ({ layer, commonProps }: { layer: ShapeLayer, commonProps: any }) => {
  let gradientProps = {};
  if (layer.fillPriority === 'linear-gradient' && layer.gradientAngle !== undefined) {
    const coords = getLinearGradientCoordinates(layer.gradientAngle, layer.width, layer.height);
    gradientProps = {
      fillLinearGradientStartPoint: coords.startPoint,
      fillLinearGradientEndPoint: coords.endPoint,
      fillLinearGradientColorStops: layer.fillLinearGradientColorStops,
    };
  } else if (layer.fillPriority === 'radial-gradient') {
    const coords = getRadialGradientCoordinates(layer.width, layer.height);
    gradientProps = {
      fillRadialGradientStartPoint: coords.startPoint,
      fillRadialGradientEndPoint: coords.endPoint,
      fillRadialGradientStartRadius: coords.startRadius,
      fillRadialGradientEndRadius: coords.endRadius,
      fillRadialGradientColorStops: layer.fillRadialGradientColorStops,
    };
  }

  const renderShape = (props: any, key?: string) => {
    if (layer.shapeType === 'rect') {
      return (
        <Rect
          key={key}
          width={layer.width}
          height={layer.height}
          strokeScaleEnabled={false}
          {...props}
        />
      );
    }
    return null;
  };

  const strokes = layer.strokes?.filter(s => s.enabled) || [];

  const renderStrokeShape = (stroke: any, idx: number, isBackground: boolean) => {
    const strokeProps = getStrokeProps(stroke, layer.width, layer.height);
    const finalProps = {
      ...strokeProps,
      fillEnabled: false,
      strokeEnabled: true,
    };

    if (stroke.position === 'inside') {
      return (
        <Group key={`stroke-${isBackground ? 'bg' : 'fg'}-${idx}`} clipFunc={(ctx: any) => {
          ctx.rect(0, 0, layer.width, layer.height);
        }}>
          {renderShape(finalProps)}
        </Group>
      );
    }
    return renderShape(finalProps, `stroke-${isBackground ? 'bg' : 'fg'}-${idx}`);
  };

  if (strokes.length === 0) {
    return renderShape({
      ...commonProps,
      ...gradientProps,
      fill: layer.fillPriority === 'color' || !layer.fillPriority ? layer.fill : undefined
    });
  }

  return (
    <Group {...commonProps}>
      {[...strokes].reverse().map((stroke, idx) => {
         if (stroke.position !== 'outside') return null;
         return renderStrokeShape(stroke, idx, true);
      })}
      
      {renderShape({
        ...gradientProps,
        fill: layer.fillPriority === 'color' || !layer.fillPriority ? layer.fill : undefined
      }, 'main')}

      {strokes.map((stroke, idx) => {
         if (stroke.position === 'outside') return null;
         return renderStrokeShape(stroke, idx, false);
      })}
    </Group>
  );
};

export default function CanvasArea() {
  const currentProject = useStore((state) => state.currentProject);
  const selectedLayerId = useStore((state) => state.selectedLayerId);
  const selectLayer = useStore((state) => state.selectLayer);
  const updateLayer = useStore((state) => state.updateLayer);
  const zoom = useStore((state) => state.zoom);
  const setEditingTextLayerId = useStore((state) => state.setEditingTextLayerId);
  
  const layers = currentProject?.layers || [];

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    if (selectedLayerId && trRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#${selectedLayerId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedLayerId, layers]);

  if (!currentProject) return null;

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.id === 'bg-rect';
    if (clickedOnEmpty) {
      selectLayer(null);
    }
  };

  // Calculate scale to fit canvas in view
  const scale = Math.min(
    (stageSize.width * 0.9) / currentProject.width,
    (stageSize.height * 0.9) / currentProject.height
  ) * (zoom / 100);

  const stageX = (stageSize.width - currentProject.width * scale) / 2;
  const stageY = (stageSize.height - currentProject.height * scale) / 2;

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden flex items-center justify-center">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <KonvaLayer x={stageX} y={stageY} scaleX={scale} scaleY={scale}>
          {/* Background */}
          <Rect
            id="bg-rect"
            x={0}
            y={0}
            width={currentProject.width}
            height={currentProject.height}
            fill={currentProject.isTransparent ? 'transparent' : currentProject.backgroundColor}
            shadowColor="rgba(0,0,0,0.1)"
            shadowBlur={10}
            shadowOffsetX={0}
            shadowOffsetY={5}
          />

          {/* Layers */}
          {layers.map((layer) => {
            if (!layer.visible) return null;

            const commonProps = {
              id: layer.id,
              x: layer.x,
              y: layer.y,
              rotation: layer.rotation,
              scaleX: layer.scaleX,
              scaleY: layer.scaleY,
              opacity: layer.opacity,
              draggable: !layer.locked,
              onClick: () => selectLayer(layer.id),
              onTap: () => selectLayer(layer.id),
              onDragEnd: (e: any) => {
                updateLayer(layer.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                });
              },
              onTransformEnd: (e: any) => {
                const node = e.target;
                updateLayer(layer.id, {
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                  scaleX: node.scaleX(),
                  scaleY: node.scaleY(),
                });
              },
            };

            if (layer.type === 'text') {
              return (
                <TextLayerComponent
                  key={layer.id}
                  layer={layer as TextLayer}
                  commonProps={commonProps}
                  onDblClick={() => setEditingTextLayerId(layer.id)}
                  onDblTap={() => setEditingTextLayerId(layer.id)}
                />
              );
            }

            if (layer.type === 'shape') {
              return (
                <ShapeLayerComponent
                  key={layer.id}
                  layer={layer as ShapeLayer}
                  commonProps={commonProps}
                />
              );
            }

            if (layer.type === 'image') {
              return <ImageLayerComponent key={layer.id} layer={layer as ImageLayer} commonProps={commonProps} />;
            }

            return null;
          })}

          {/* Transformer for selected layer */}
          {selectedLayerId && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </KonvaLayer>
      </Stage>
    </div>
  );
}
