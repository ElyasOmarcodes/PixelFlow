import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Layer, StrokeConfig } from '../types';
import { motion } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ColorPickerSheet from './ColorPickerSheet';

interface StrokePanelProps {
  layer: Layer;
  onChange: (updates: Partial<Layer>) => void;
}

export default function StrokePanel({ layer, onChange }: StrokePanelProps) {
  const strokes = layer.strokes || [];
  const [expandedStrokeId, setExpandedStrokeId] = useState<string | null>(strokes[0]?.id || null);

  const handleAddStroke = () => {
    const newStroke: StrokeConfig = {
      id: uuidv4(),
      enabled: true,
      width: 4,
      fillType: 'solid',
      color: '#000000',
      position: 'outside',
      dashType: 'solid',
      dashSize: 10,
      dashGap: 10,
      lineJoin: 'round',
      lineCap: 'round',
    };
    const newStrokes = [...strokes, newStroke];
    onChange({ strokes: newStrokes });
    setExpandedStrokeId(newStroke.id);
  };

  const handleUpdateStroke = (id: string, updates: Partial<StrokeConfig>) => {
    const newStrokes = strokes.map(s => s.id === id ? { ...s, ...updates } : s);
    onChange({ strokes: newStrokes });
  };

  const handleRemoveStroke = (id: string) => {
    const newStrokes = strokes.filter(s => s.id !== id);
    onChange({ strokes: newStrokes });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
        <h3 className="font-medium text-gray-800 text-sm">سټروک (Stroke)</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddStroke}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"
        >
          <Plus className="w-4 h-4" />
          <span>نوی سټروک</span>
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {strokes.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            هیڅ سټروک شتون نلري. د نوي سټروک اضافه کولو لپاره پورته تڼۍ کیکاږئ.
          </div>
        ) : (
          strokes.map((stroke, index) => (
            <StrokeItem
              key={stroke.id}
              stroke={stroke}
              index={index}
              isExpanded={expandedStrokeId === stroke.id}
              onToggle={() => setExpandedStrokeId(expandedStrokeId === stroke.id ? null : stroke.id)}
              onUpdate={(updates) => handleUpdateStroke(stroke.id, updates)}
              onRemove={() => handleRemoveStroke(stroke.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function StrokeItem({ stroke, index, isExpanded, onToggle, onUpdate, onRemove }: any) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full border border-gray-200 shadow-inner"
            style={{ background: stroke.fillType === 'solid' ? stroke.color : 'linear-gradient(to right, #ff0000, #0000ff)' }}
          />
          <span className="font-medium text-sm text-gray-700">سټروک {index + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-100 space-y-5 bg-gray-50/50">
          {/* Width */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-gray-600">ضخامت</label>
              <input 
                type="number" 
                value={stroke.width}
                onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-md text-center focus:outline-none focus:border-blue-500"
                min="0"
                max="100"
              />
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={stroke.width}
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">رنګ</label>
            <button
              onClick={() => setShowColorPicker(true)}
              className="w-full h-10 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <div 
                className="w-6 h-6 rounded-full border border-gray-200 shadow-inner"
                style={{ background: stroke.fillType === 'solid' ? stroke.color : 'linear-gradient(to right, #ff0000, #0000ff)' }}
              />
              <span className="text-xs font-medium text-gray-600">رنګ بدل کړئ</span>
            </button>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">موقعیت</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['outside', 'center', 'inside'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => onUpdate({ position: pos })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${stroke.position === pos ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {pos === 'outside' ? 'دباندې' : pos === 'inside' ? 'دننه' : 'منځ'}
                </button>
              ))}
            </div>
          </div>

          {/* Dash Type */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">سټایل</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['solid', 'dashed', 'dotted'].map((type) => (
                <button
                  key={type}
                  onClick={() => onUpdate({ dashType: type })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${stroke.dashType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {type === 'solid' ? 'مستقیم' : type === 'dashed' ? 'پرې شوی' : 'نقطه دار'}
                </button>
              ))}
            </div>
          </div>

          {/* Dash Size & Gap (if dashed or dotted) */}
          {(stroke.dashType === 'dashed' || stroke.dashType === 'dotted') && (
            <div className="space-y-3 pt-2 border-t border-gray-200">
              {stroke.dashType === 'dashed' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-gray-600">د ټوټې اوږدوالی</label>
                    <span className="text-xs text-gray-500">{stroke.dashSize || 10}</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" 
                    value={stroke.dashSize || 10}
                    onChange={(e) => onUpdate({ dashSize: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-gray-600">فاصله</label>
                  <span className="text-xs text-gray-500">{stroke.dashGap || 10}</span>
                </div>
                <input 
                  type="range" min="1" max="50" 
                  value={stroke.dashGap || 10}
                  onChange={(e) => onUpdate({ dashGap: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          )}

          {/* Joins & Caps */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">کونجونه</label>
              <select 
                value={stroke.lineJoin}
                onChange={(e) => onUpdate({ lineJoin: e.target.value })}
                className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="miter">تېز</option>
                <option value="round">ګردی</option>
                <option value="bevel">پرې شوی</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">پای</label>
              <select 
                value={stroke.lineCap}
                onChange={(e) => onUpdate({ lineCap: e.target.value })}
                className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="butt">هوار</option>
                <option value="round">ګردی</option>
                <option value="square">مربع</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Sheet */}
      {showColorPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20" onClick={() => setShowColorPicker(false)}>
          <div className="w-full bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800">د سټروک رنګ</h3>
              <button onClick={() => setShowColorPicker(false)} className="p-2 bg-gray-100 rounded-full text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ColorPickerSheet
              onClose={() => setShowColorPicker(false)}
              color={stroke.fillType === 'solid' ? stroke.color : '#000000'}
              gradient={stroke.fillType !== 'solid' ? {
                type: stroke.fillType,
                colorStops: stroke.gradientColorStops,
                angle: stroke.gradientAngle
              } : undefined}
              onChange={(val) => {
                if (typeof val === 'string') {
                  onUpdate({ fillType: 'solid', color: val });
                } else {
                  onUpdate({
                    fillType: val.type,
                    gradientColorStops: val.colorStops,
                    gradientAngle: val.angle
                  });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
