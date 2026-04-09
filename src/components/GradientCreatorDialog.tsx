import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Minus, ChevronLeft, ChevronRight, PaintBucket, MoveRight, MoveDown, MoveUpRight, MoveDownRight, CircleDot, Circle } from 'lucide-react';
import SolidColorDialog from './SolidColorDialog';
import { motion } from 'framer-motion';

interface GradientCreatorDialogProps {
  initialGradient?: any;
  onClose: () => void;
  onSelect: (gradient: any) => void;
}

interface ColorStop {
  id: string;
  position: number; // 0 to 1
  color: string;
}

export default function GradientCreatorDialog({ initialGradient, onClose, onSelect }: GradientCreatorDialogProps) {
  const { addGradientToHistory } = useStore();
  const [type, setType] = useState<'linear' | 'radial'>(initialGradient?.type || 'linear');
  const [angle, setAngle] = useState(initialGradient?.gradientAngle || 90); // For linear
  
  const initialStops = initialGradient?.colorStops ? 
    initialGradient.colorStops.reduce((acc: any[], curr: any, i: number, arr: any[]) => {
      if (i % 2 === 0) {
        acc.push({ id: Date.now().toString() + i, position: curr, color: arr[i+1] });
      }
      return acc;
    }, []) : [
    { id: '1', position: 0, color: '#ff0000' },
    { id: '2', position: 1, color: '#0000ff' },
  ];

  const [stops, setStops] = useState<ColorStop[]>(initialStops);
  const [selectedStopId, setSelectedStopId] = useState<string>(initialStops[0].id);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const handleAddStop = () => {
    const newStop: ColorStop = {
      id: Date.now().toString(),
      position: 0.5,
      color: '#ffffff'
    };
    setStops([...stops, newStop].sort((a, b) => a.position - b.position));
    setSelectedStopId(newStop.id);
  };

  const handleRemoveStop = () => {
    if (stops.length <= 2) return;
    const newStops = stops.filter(s => s.id !== selectedStopId);
    setStops(newStops);
    setSelectedStopId(newStops[0].id);
  };

  const handleMoveStop = (delta: number) => {
    setStops(stops.map(s => {
      if (s.id === selectedStopId) {
        return { ...s, position: Math.max(0, Math.min(1, s.position + delta)) };
      }
      return s;
    }).sort((a, b) => a.position - b.position));
  };

  const handleSliderClick = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = Math.max(0, Math.min(1, x / rect.width));
    
    // Check if clicked near an existing stop
    const closeStop = stops.find(s => Math.abs(s.position - position) < 0.05);
    if (closeStop) {
      setSelectedStopId(closeStop.id);
    } else {
      // Add new stop
      const newStop: ColorStop = {
        id: Date.now().toString(),
        position,
        color: '#ffffff' // Could interpolate color here
      };
      setStops([...stops, newStop].sort((a, b) => a.position - b.position));
      setSelectedStopId(newStop.id);
    }
  };

  const handleSave = () => {
    // Convert to Konva format
    const colorStops: (number | string)[] = [];
    stops.forEach(s => {
      colorStops.push(s.position, s.color);
    });

    let gradientConfig: any = {
      type,
      colorStops,
      gradientAngle: type === 'linear' ? angle : undefined,
    };

    if (type === 'linear') {
      // We will calculate actual points in CanvasArea based on node size
      gradientConfig.startPoint = { x: 0, y: 0 };
      gradientConfig.endPoint = { x: 100, y: 100 };
    } else {
      gradientConfig.startPoint = { x: 50, y: 50 };
      gradientConfig.endPoint = { x: 50, y: 50 };
      gradientConfig.startRadius = 0;
      gradientConfig.endRadius = 50;
    }

    addGradientToHistory(gradientConfig);
    onSelect(gradientConfig);
  };

  const getPreviewBackground = () => {
    const stopsStr = stops.map(s => `${s.color} ${s.position * 100}%`).join(', ');
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    } else {
      return `radial-gradient(circle, ${stopsStr})`;
    }
  };

  const selectedStop = stops.find(s => s.id === selectedStopId);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="font-medium text-gray-800">ګراډینټ جوړ کړئ</h3>
        </div>
        
        <div className="p-4 flex flex-col gap-4">
          {/* Presets */}
          <div className="flex justify-between bg-gray-50 p-2 rounded-xl border border-gray-200">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setType('linear'); setAngle(90); }} className={`p-2 rounded-lg ${type === 'linear' && angle === 90 ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}><MoveRight className="w-5 h-5" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setType('linear'); setAngle(180); }} className={`p-2 rounded-lg ${type === 'linear' && angle === 180 ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}><MoveDown className="w-5 h-5" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setType('linear'); setAngle(45); }} className={`p-2 rounded-lg ${type === 'linear' && angle === 45 ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}><MoveDownRight className="w-5 h-5" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setType('linear'); setAngle(135); }} className={`p-2 rounded-lg ${type === 'linear' && angle === 135 ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}><MoveUpRight className="w-5 h-5" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setType('radial')} className={`p-2 rounded-lg ${type === 'radial' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}><CircleDot className="w-5 h-5" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setType('radial')} className={`p-2 rounded-lg ${type === 'radial' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}><Circle className="w-5 h-5" /></motion.button>
          </div>

          {/* Live Preview */}
          <div 
            className="w-full h-32 rounded-xl shadow-inner border border-gray-200"
            style={{ background: getPreviewBackground() }}
          />

          {/* Slider */}
          <div className="relative h-12 mt-4">
            <div 
              ref={sliderRef}
              className="absolute top-4 left-4 right-4 h-4 rounded-full shadow-inner cursor-pointer border border-gray-300"
              style={{ background: getPreviewBackground() }}
              onClick={handleSliderClick}
            />
            {stops.map(stop => (
              <div
                key={stop.id}
                className={`absolute top-2 w-8 h-8 -ml-4 rounded-full border-2 shadow-md cursor-pointer flex items-center justify-center ${selectedStopId === stop.id ? 'border-blue-600 scale-110 z-10' : 'border-white z-0'}`}
                style={{ 
                  left: `calc(1rem + ${stop.position * 100}% - ${stop.position * 2}rem)`, 
                  backgroundColor: stop.color 
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedStopId(stop.id); }}
              >
                {selectedStopId === stop.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl mt-2 border border-gray-200">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleAddStop} className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><Plus className="w-5 h-5" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleRemoveStop} disabled={stops.length <= 2} className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-50"><Minus className="w-5 h-5" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleMoveStop(-0.05)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><ChevronLeft className="w-5 h-5" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleMoveStop(0.05)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><ChevronRight className="w-5 h-5" /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowColorPicker(true)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><PaintBucket className="w-5 h-5" /></motion.button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            لغو
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            تایید
          </motion.button>
        </div>
      </div>

      {showColorPicker && selectedStop && (
        <SolidColorDialog
          initialColor={selectedStop.color}
          onClose={() => setShowColorPicker(false)}
          onSelect={(color) => {
            setStops(stops.map(s => s.id === selectedStopId ? { ...s, color } : s));
            setShowColorPicker(false);
          }}
        />
      )}
    </div>
  );
}
