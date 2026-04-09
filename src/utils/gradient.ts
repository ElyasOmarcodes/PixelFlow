export function getLinearGradientCoordinates(cssAngle: number, width: number, height: number) {
  // Convert CSS angle to radians.
  // CSS: 0deg = to top, 90deg = to right, 180deg = to bottom, 270deg = to left.
  // Math: 0 = right, PI/2 = down, PI = left, -PI/2 = up.
  const mathAngle = cssAngle - 90;
  const rad = (mathAngle * Math.PI) / 180;

  const cx = width / 2;
  const cy = height / 2;

  // The length of the gradient line that covers the bounding box
  const length = Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad));

  const startX = cx - (Math.cos(rad) * length) / 2;
  const startY = cy - (Math.sin(rad) * length) / 2;
  const endX = cx + (Math.cos(rad) * length) / 2;
  const endY = cy + (Math.sin(rad) * length) / 2;

  return {
    startPoint: { x: startX, y: startY },
    endPoint: { x: endX, y: endY }
  };
}

export function getRadialGradientCoordinates(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.max(width, height) / 2;

  return {
    startPoint: { x: cx, y: cy },
    endPoint: { x: cx, y: cy },
    startRadius: 0,
    endRadius: radius
  };
}
