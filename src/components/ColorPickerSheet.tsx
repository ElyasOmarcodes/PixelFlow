import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Plus, Check } from 'lucide-react';
import { Layer, TextLayer } from '../types';
import SolidColorDialog from './SolidColorDialog';
import GradientCreatorDialog from './GradientCreatorDialog';
import { motion } from 'framer-motion';

interface ColorPickerSheetProps {
  layer?: Layer;
  onClose: () => void;
  color?: string;
  gradient?: any;
  onChange?: (val: any) => void;
}

export default function ColorPickerSheet({ layer, onClose, color, gradient, onChange }: ColorPickerSheetProps) {
  const { updateLayer, colorHistory, gradientHistory } = useStore();
  const [mode, setMode] = useState<'solid' | 'gradient'>('solid');
  const [showSolidPicker, setShowSolidPicker] = useState(false);
  const [showGradientPicker, setShowGradientPicker] = useState(false);

  const [selection, setSelection] = useState<{ start: number, end: number } | null>(null);

  const isText = layer?.type === 'text';
  const textLayer = layer as TextLayer;

  const currentFill = layer && 'fill' in layer ? (layer as any).fill : color;
  const currentFillPriority = layer ? layer.fillPriority : (gradient ? (gradient.type === 'linear' ? 'linear-gradient' : 'radial-gradient') : 'color');
  const currentGradientAngle = layer ? layer.gradientAngle : gradient?.angle;
  const currentLinearStops = layer ? layer.fillLinearGradientColorStops : gradient?.colorStops;
  const currentRadialStops = layer ? layer.fillRadialGradientColorStops : gradient?.colorStops;

  const handleSolidColorSelect = (selectedColor: string) => {
    if (onChange) {
      onChange(selectedColor);
      return;
    }
    
    if (!layer) return;

    if (isText && selection && selection.start !== selection.end) {
      // Partial text selection
      const text = textLayer.text;
      const start = Math.min(selection.start, selection.end);
      const end = Math.max(selection.start, selection.end);
      
      const before = text.substring(0, start);
      const selected = text.substring(start, end);
      const after = text.substring(end);
      
      const newSegments = [];
      if (before) newSegments.push({ text: before, fill: textLayer.fill });
      newSegments.push({ text: selected, fill: selectedColor });
      if (after) newSegments.push({ text: after, fill: textLayer.fill });
      
      updateLayer(layer.id, { segments: newSegments, fillPriority: 'color' });
    } else {
      updateLayer(layer.id, { fill: selectedColor, fillPriority: 'color', segments: undefined });
    }
  };

  const handleGradientSelect = (selectedGradient: any) => {
    if (onChange) {
      onChange({
        type: selectedGradient.type,
        angle: selectedGradient.gradientAngle,
        colorStops: selectedGradient.colorStops
      });
      return;
    }

    if (!layer) return;

    updateLayer(layer.id, {
      fillPriority: selectedGradient.type === 'linear' ? 'linear-gradient' : 'radial-gradient',
      gradientAngle: selectedGradient.gradientAngle,
      fillLinearGradientColorStops: selectedGradient.colorStops,
      fillRadialGradientColorStops: selectedGradient.colorStops,
      segments: undefined,
    });
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Toggle */}
      <div className="flex items-center justify-center p-3 border-b border-gray-100">
        <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-100 w-full max-w-xs">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('solid')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'solid' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            رنګ
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('gradient')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'gradient' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            ګراډینټ
          </motion.button>
        </div>
      </div>

      {/* History Bar */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => mode === 'solid' ? setShowSolidPicker(true) : setShowGradientPicker(true)}
            className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0 hover:border-blue-600 hover:text-blue-600 text-gray-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          
          {mode === 'solid' && colorHistory.map((c, idx) => (
            <motion.button
              whileTap={{ scale: 0.9 }}
              key={idx}
              onClick={() => handleSolidColorSelect(c)}
              className="w-10 h-10 rounded-full shrink-0 border border-gray-200 shadow-sm relative"
              style={{ backgroundColor: c }}
            >
              {currentFill === c && currentFillPriority !== 'linear-gradient' && currentFillPriority !== 'radial-gradient' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.button>
          ))}

          {mode === 'gradient' && gradientHistory.map((grad, idx) => {
            const isLinear = grad.type === 'linear';
            const stops = grad.colorStops;
            let bg = '';
            if (stops && stops.length >= 2) {
              const stopsStr = [];
              for (let i = 0; i < stops.length; i += 2) {
                stopsStr.push(`${stops[i+1]} ${stops[i] * 100}%`);
              }
              const angle = grad.gradientAngle ?? 90;
              bg = isLinear 
                ? `linear-gradient(${angle}deg, ${stopsStr.join(', ')})` 
                : `radial-gradient(circle, ${stopsStr.join(', ')})`;
            }
            
            const isActive = currentFillPriority === (isLinear ? 'linear-gradient' : 'radial-gradient') && 
                             JSON.stringify(currentLinearStops || currentRadialStops) === JSON.stringify(stops) &&
                             (isLinear ? currentGradientAngle === grad.gradientAngle : true);
                             
            return (
              <motion.button
                whileTap={{ scale: 0.9 }}
                key={idx}
                onClick={() => handleGradientSelect(grad)}
                className="w-10 h-10 rounded-full shrink-0 border border-gray-200 shadow-sm relative"
                style={{ background: bg || '#f3f4f6' }}
              >
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Partial Selection Box (UI Only) */}
      {isText && (
        <div className="p-3 bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">د متن انتخاب (بشپړ متن)</div>
          <input
            type="text"
            value={textLayer.text}
            readOnly
            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm text-gray-800 outline-none focus:border-blue-500 selection:bg-blue-200"
            onSelect={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.selectionStart !== null && target.selectionEnd !== null) {
                setSelection({ start: target.selectionStart, end: target.selectionEnd });
              }
            }}
          />
        </div>
      )}

      {showSolidPicker && (
        <SolidColorDialog
          initialColor={currentFillPriority !== 'linear-gradient' && currentFillPriority !== 'radial-gradient' ? currentFill : '#000000'}
          onClose={() => setShowSolidPicker(false)}
          onSelect={(selectedColor) => {
            handleSolidColorSelect(selectedColor);
            setShowSolidPicker(false);
          }}
        />
      )}

      {showGradientPicker && (
        <GradientCreatorDialog
          initialGradient={
            currentFillPriority === 'linear-gradient' || currentFillPriority === 'radial-gradient'
              ? {
                  type: currentFillPriority === 'linear-gradient' ? 'linear' : 'radial',
                  gradientAngle: currentGradientAngle,
                  colorStops: currentLinearStops || currentRadialStops,
                }
              : undefined
          }
          onClose={() => setShowGradientPicker(false)}
          onSelect={(grad) => {
            handleGradientSelect(grad);
            setShowGradientPicker(false);
          }}
        />
      )}
    </div>
  );
}
