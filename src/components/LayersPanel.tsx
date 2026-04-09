import React from 'react';
import { useStore } from '../store/useStore';
import { Eye, EyeOff, Lock, Unlock, GripVertical, Trash2 } from 'lucide-react';
import { Reorder, motion } from 'motion/react';

export default function LayersPanel() {
  const currentProject = useStore((state) => state.currentProject);
  const selectedLayerId = useStore((state) => state.selectedLayerId);
  const selectLayer = useStore((state) => state.selectLayer);
  const updateLayer = useStore((state) => state.updateLayer);
  const deleteLayer = useStore((state) => state.deleteLayer);
  const reorderLayers = useStore((state) => state.reorderLayers);
  
  const layers = currentProject?.layers || [];

  if (!currentProject) return null;

  // Reorder layers (Zustand state update)
  const handleReorder = (newOrder: any[]) => {
    // We need to map the new order back to indices and call reorderLayers
    // For simplicity with framer-motion Reorder, we can just update the whole layers array
    // Let's add a setLayers action or just use updateProject
    useStore.getState().updateProject({ layers: newOrder });
  };

  // Reverse layers for display (top layer first)
  const displayLayers = [...layers].reverse();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">لیئرونه</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <Reorder.Group axis="y" values={displayLayers} onReorder={(newOrder) => handleReorder([...newOrder].reverse())} className="space-y-1">
          {displayLayers.map((layer) => (
            <Reorder.Item
              key={layer.id}
              value={layer}
              className={`flex items-center gap-2 p-2 rounded-lg border ${
                selectedLayerId === layer.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
              onClick={() => selectLayer(layer.id)}
            >
              <div className="cursor-grab active:cursor-grabbing text-gray-400">
                <GripVertical className="w-4 h-4" />
              </div>
              
              <div className="flex-1 truncate text-sm font-medium text-gray-700">
                {layer.name}
              </div>

              <div className="flex items-center gap-1">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200"
                >
                  {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200"
                >
                  {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                  className="p-1.5 text-red-400 hover:text-red-600 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        
        {layers.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            هیڅ لیئر نشته
          </div>
        )}
      </div>
    </div>
  );
}
