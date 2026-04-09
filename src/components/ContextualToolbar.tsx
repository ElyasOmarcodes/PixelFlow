import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Type, Palette, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Strikethrough,
  Edit2, Trash2, MoveUp, MoveDown, CaseUpper, Droplet, PenTool, Copy, Box, Sun, RotateCw,
  Layers, Spline, Waves, Eraser, X, Check, Image as ImageIcon, Crop, SlidersHorizontal
} from 'lucide-react';
import { TextLayer, ImageLayer, ShapeLayer } from '../types';
import ColorPickerSheet from './ColorPickerSheet';
import BottomSheet from './BottomSheet';
import { motion } from 'framer-motion';

import StrokePanel from './StrokePanel';

const TextToolbar = ({ layer }: { layer: TextLayer }) => {
  const { updateLayer, deleteLayer, currentProject, reorderLayers, setEditingTextLayerId, activeTool, setActiveTool } = useStore();
  const [originalLayerState, setOriginalLayerState] = useState<any>(null);
  
  const layerIndex = currentProject?.layers.findIndex(l => l.id === layer.id) ?? -1;
  const totalLayers = currentProject?.layers.length ?? 0;

  const handleOpenTool = (toolId: string) => {
    setOriginalLayerState(JSON.parse(JSON.stringify(layer)));
    setActiveTool(toolId);
  };

  const handleApply = () => {
    setActiveTool(null);
    setOriginalLayerState(null);
  };

  const handleCancel = () => {
    if (originalLayerState) {
      updateLayer(layer.id, originalLayerState);
    }
    setActiveTool(null);
    setOriginalLayerState(null);
  };

  const handleReset = () => {
    if (originalLayerState) {
      updateLayer(layer.id, originalLayerState);
    }
  };

  const handleMoveFront = () => {
    if (layerIndex < totalLayers - 1) {
      reorderLayers(layerIndex, layerIndex + 1);
    }
  };

  const handleMoveBack = () => {
    if (layerIndex > 0) {
      reorderLayers(layerIndex, layerIndex - 1);
    }
  };

  const tools = [
    { id: 'edit', label: 'ایډیټ', icon: Edit2, onClick: () => setEditingTextLayerId(layer.id) },
    { id: 'font', label: 'فونټ', icon: CaseUpper },
    { id: 'size', label: 'سایز', icon: Type },
    { id: 'color', label: 'رنګ', icon: Palette },
    { id: 'style', label: 'سټایل', icon: Bold },
    { id: 'align', label: 'منظمول', icon: AlignCenter },
    { id: 'alpha', label: 'شفافیت', icon: Droplet },
    { id: 'stroke', label: 'سټروک', icon: PenTool },
    { id: 'shadow', label: 'شادو', icon: Copy },
    { id: 'innerShadow', label: 'داخلي شادو', icon: Box },
    { id: 'glow', label: 'ځلا', icon: Sun },
    { id: 'rotate', label: 'روټیټ', icon: RotateCw },
    { id: '3dRotate', label: '3D روټیټ', icon: Box },
    { id: '3dEffect', label: '3D افکټ', icon: Layers },
    { id: 'emboss', label: 'ایمبوس', icon: Layers },
    { id: 'curve', label: 'کږول', icon: Spline },
    { id: 'warp', label: 'وارپ', icon: Waves },
    { id: 'pathEraser', label: 'پات اریسر', icon: Eraser },
    { id: 'front', label: 'مخته', icon: MoveUp, onClick: handleMoveFront },
    { id: 'back', label: 'شاته', icon: MoveDown, onClick: handleMoveBack },
    { id: 'delete', label: 'حذف', icon: Trash2, onClick: () => deleteLayer(layer.id) },
  ];

  const renderSubMenu = () => {
    switch (activeTool) {
      case 'font':
        const fonts = [
          'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 
          'Tahoma', 'Trebuchet MS', 'Impact', 'system-ui', 'cursive', 'sans-serif'
        ];
        return (
          <div className="flex flex-col w-full max-h-64">
            <div className="overflow-y-auto p-2 flex flex-col gap-1">
              {fonts.map(font => (
                <button
                  key={font}
                  onClick={() => updateLayer(layer.id, { fontFamily: font })}
                  className={`p-4 text-right rounded-xl transition-colors flex justify-between items-center ${layer.fontFamily === font ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span style={{ fontFamily: font }} className="text-lg">{font}</span>
                  {layer.fontFamily === font && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        );
      case 'size':
        return (
          <div className="flex items-center gap-4 p-4 w-full">
            <span className="text-sm font-medium w-8 text-center text-gray-800">{layer.fontSize}</span>
            <input 
              type="range" 
              min="8" 
              max="200" 
              value={layer.fontSize}
              onChange={(e) => updateLayer(layer.id, { fontSize: Number(e.target.value) })}
              className="flex-1 accent-blue-600"
            />
          </div>
        );
      case 'color':
        return <ColorPickerSheet layer={layer} onClose={handleApply} />;
      case 'style':
        return (
          <div className="flex items-center justify-around p-2 w-full">
            <button 
              onClick={() => updateLayer(layer.id, { fontStyle: layer.fontStyle === 'bold' ? 'normal' : 'bold' })}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${layer.fontStyle === 'bold' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Bold className="w-5 h-5" />
              <span className="text-[10px]">پنډ (Bold)</span>
            </button>
            <button 
              onClick={() => updateLayer(layer.id, { fontStyle: layer.fontStyle === 'italic' ? 'normal' : 'italic' })}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${layer.fontStyle === 'italic' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Italic className="w-5 h-5" />
              <span className="text-[10px]">کږه (Italic)</span>
            </button>
            <button 
              onClick={() => updateLayer(layer.id, { textDecoration: layer.textDecoration === 'underline' ? 'empty' : 'underline' })}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${layer.textDecoration === 'underline' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Underline className="w-5 h-5" />
              <span className="text-[10px]">لاندې کرښه</span>
            </button>
            <button 
              onClick={() => updateLayer(layer.id, { textDecoration: layer.textDecoration === 'line-through' ? 'empty' : 'line-through' })}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${layer.textDecoration === 'line-through' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Strikethrough className="w-5 h-5" />
              <span className="text-[10px]">منځنۍ کرښه</span>
            </button>
          </div>
        );
      case 'align':
        return (
          <div className="flex items-center justify-around p-2 w-full">
            <button 
              onClick={() => updateLayer(layer.id, { align: 'right' })}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${layer.align === 'right' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <AlignRight className="w-5 h-5" />
              <span className="text-[10px]">ښي</span>
            </button>
            <button 
              onClick={() => updateLayer(layer.id, { align: 'center' })}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${layer.align === 'center' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <AlignCenter className="w-5 h-5" />
              <span className="text-[10px]">منځ</span>
            </button>
            <button 
              onClick={() => updateLayer(layer.id, { align: 'left' })}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${layer.align === 'left' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <AlignLeft className="w-5 h-5" />
              <span className="text-[10px]">چپ</span>
            </button>
          </div>
        );
      case 'alpha':
        return (
          <div className="flex items-center gap-4 p-4 w-full">
            <span className="text-sm font-medium w-12 text-center text-gray-800">{Math.round(layer.opacity * 100)}%</span>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={layer.opacity}
              onChange={(e) => updateLayer(layer.id, { opacity: Number(e.target.value) })}
              className="flex-1 accent-blue-600"
            />
          </div>
        );
      case 'stroke':
        return <StrokePanel layer={layer} onChange={(updates) => updateLayer(layer.id, updates)} />;
      default:
        return (
          <div className="flex items-center justify-between p-4 w-full">
            <span className="text-sm text-gray-500">دا فیچر به ژر اضافه شي</span>
          </div>
        );
    }
  };

  return (
    <>
      {!activeTool && (
        <div className="bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-t-2xl border-t border-gray-200 pointer-events-auto w-full flex flex-col">
          <div className="flex overflow-x-auto hide-scrollbar p-2 gap-1 w-full items-center">
            {tools.map(tool => (
              <motion.button
                whileTap={{ scale: 0.9 }}
                key={tool.id}
                onClick={() => tool.onClick ? tool.onClick() : handleOpenTool(tool.id)}
                className={`flex flex-col items-center justify-center min-w-[72px] h-[72px] p-2 rounded-xl transition-colors shrink-0 ${activeTool === tool.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <tool.icon className="w-6 h-6 mb-1.5" />
                <span className="text-[11px] font-medium whitespace-nowrap">{tool.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
      
      <BottomSheet
        isOpen={activeTool !== null}
        onClose={handleCancel}
        onApply={handleApply}
        onReset={handleReset}
        title={tools.find(t => t.id === activeTool)?.label}
      >
        {renderSubMenu()}
      </BottomSheet>
    </>
  );
};

const ElementToolbar = ({ layer }: { layer: ImageLayer | ShapeLayer }) => {
  const { updateLayer, deleteLayer, currentProject, reorderLayers, activeTool, setActiveTool } = useStore();
  const [originalLayerState, setOriginalLayerState] = useState<any>(null);
  
  const layerIndex = currentProject?.layers.findIndex(l => l.id === layer.id) ?? -1;
  const totalLayers = currentProject?.layers.length ?? 0;

  const handleOpenTool = (toolId: string) => {
    setOriginalLayerState(JSON.parse(JSON.stringify(layer)));
    setActiveTool(toolId);
  };

  const handleApply = () => {
    setActiveTool(null);
    setOriginalLayerState(null);
  };

  const handleCancel = () => {
    if (originalLayerState) {
      updateLayer(layer.id, originalLayerState);
    }
    setActiveTool(null);
    setOriginalLayerState(null);
  };

  const handleReset = () => {
    if (originalLayerState) {
      updateLayer(layer.id, originalLayerState);
    }
  };

  const handleMoveFront = () => {
    if (layerIndex < totalLayers - 1) {
      reorderLayers(layerIndex, layerIndex + 1);
    }
  };

  const handleMoveBack = () => {
    if (layerIndex > 0) {
      reorderLayers(layerIndex, layerIndex - 1);
    }
  };

  const isImage = layer.type === 'image';
  const isShape = layer.type === 'shape';

  const tools = [
    { id: 'replace', label: 'بدلول', icon: ImageIcon },
    { id: 'size', label: 'سایز', icon: Type },
    ...(isShape ? [{ id: 'color', label: 'رنګ', icon: Palette }] : []),
    ...(isImage ? [{ id: 'crop', label: 'کراپ', icon: Crop }] : []),
    { id: 'alpha', label: 'شفافیت', icon: Droplet },
    ...(isImage ? [{ id: 'adjust', label: 'تنظیمات', icon: SlidersHorizontal }] : []),
    { id: 'eraser', label: 'اریسر', icon: Eraser },
    { id: 'stroke', label: 'سټروک', icon: PenTool },
    { id: 'shadow', label: 'شادو', icon: Copy },
    { id: 'innerShadow', label: 'داخلي شادو', icon: Box },
    { id: 'glow', label: 'ځلا', icon: Sun },
    { id: 'rotate', label: 'روټیټ', icon: RotateCw },
    { id: 'warp', label: 'وارپ', icon: Waves },
    { id: '3dRotate', label: '3D روټیټ', icon: Box },
    { id: '3dEffect', label: '3D افکټ', icon: Layers },
    { id: 'emboss', label: 'ایمبوس', icon: Layers },
    { id: 'front', label: 'مخته', icon: MoveUp, onClick: handleMoveFront },
    { id: 'back', label: 'شاته', icon: MoveDown, onClick: handleMoveBack },
    { id: 'delete', label: 'حذف', icon: Trash2, onClick: () => deleteLayer(layer.id) },
  ];

  const renderSubMenu = () => {
    switch (activeTool) {
      case 'size':
        return (
          <div className="flex items-center gap-4 p-4 w-full">
            <span className="text-sm font-medium w-8 text-center text-gray-800">{Math.round(layer.scaleX * 100)}%</span>
            <input 
              type="range" 
              min="0.1" 
              max="5" 
              step="0.1"
              value={layer.scaleX}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateLayer(layer.id, { scaleX: val, scaleY: val });
              }}
              className="flex-1 accent-blue-600"
            />
          </div>
        );
      case 'color':
        if (!isShape) return null;
        return <ColorPickerSheet layer={layer} onClose={handleApply} />;
      case 'alpha':
        return (
          <div className="flex items-center gap-4 p-4 w-full">
            <span className="text-sm font-medium w-12 text-center text-gray-800">{Math.round(layer.opacity * 100)}%</span>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={layer.opacity}
              onChange={(e) => updateLayer(layer.id, { opacity: Number(e.target.value) })}
              className="flex-1 accent-blue-600"
            />
          </div>
        );
      case 'stroke':
        return <StrokePanel layer={layer} onChange={(updates) => updateLayer(layer.id, updates)} />;
      default:
        return (
          <div className="flex items-center justify-between p-4 w-full">
            <span className="text-sm text-gray-500">دا فیچر به ژر اضافه شي</span>
          </div>
        );
    }
  };

  return (
    <>
      {!activeTool && (
        <div className="bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-t-2xl border-t border-gray-200 pointer-events-auto w-full flex flex-col">
          <div className="flex overflow-x-auto hide-scrollbar p-2 gap-1 w-full items-center">
            {tools.map(tool => (
              <motion.button
                whileTap={{ scale: 0.9 }}
                key={tool.id}
                onClick={() => tool.onClick ? tool.onClick() : handleOpenTool(tool.id)}
                className={`flex flex-col items-center justify-center min-w-[72px] h-[72px] p-2 rounded-xl transition-colors shrink-0 ${activeTool === tool.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <tool.icon className="w-6 h-6 mb-1.5" />
                <span className="text-[11px] font-medium whitespace-nowrap">{tool.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
      
      <BottomSheet
        isOpen={activeTool !== null}
        onClose={handleCancel}
        onApply={handleApply}
        onReset={handleReset}
        title={tools.find(t => t.id === activeTool)?.label}
      >
        {renderSubMenu()}
      </BottomSheet>
    </>
  );
};

export default function ContextualToolbar() {
  const { currentProject, selectedLayerId, updateLayer } = useStore();

  if (!currentProject || !selectedLayerId) return null;

  const layer = currentProject.layers.find(l => l.id === selectedLayerId);
  if (!layer) return null;

  if (layer.type === 'text') {
    return <TextToolbar layer={layer as TextLayer} />;
  }

  if (layer.type === 'image' || layer.type === 'shape') {
    return <ElementToolbar layer={layer as ImageLayer | ShapeLayer} />;
  }

  return null;
}
