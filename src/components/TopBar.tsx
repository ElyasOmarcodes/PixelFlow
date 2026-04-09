import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Home, Save, Quote, ZoomIn, 
  Trash2, Undo2, Redo2, Grid, Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar() {
  const { 
    closeProject, 
    selectedLayerId, 
    deleteLayer, 
    toggleGrid, 
    showGrid,
    toggleLayersPanel,
    showLayersPanel
  } = useStore();

  return (
    <header className="bg-blue-600 text-white z-30 shadow-md">
      {/* Line 1 */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-blue-500/30">
        <div className="flex items-center gap-1">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={closeProject}
            className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
            title="کور پاڼه"
          >
            <Home className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
            title="خوندي کول"
          >
            <Save className="w-5 h-5" />
          </motion.button>
        </div>
        <div className="flex items-center gap-1">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
            title="متنونه"
          >
            <Quote className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
            title="زوم"
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Line 2 */}
      <div className="flex items-center justify-between px-2 py-1.5 bg-blue-700/50">
        <div className="flex items-center gap-1">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => selectedLayerId && deleteLayer(selectedLayerId)}
            disabled={!selectedLayerId}
            className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-30"
            title="حذف کول"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
          <div className="w-px h-4 bg-blue-400/50 mx-1" />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
            title="شاته تګ"
          >
            <Undo2 className="w-4 h-4" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
            title="مخکې تګ"
          >
            <Redo2 className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="flex items-center gap-1">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleGrid}
            className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
            title="جال"
          >
            <Grid className="w-4 h-4" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleLayersPanel}
            className={`p-2 rounded-lg transition-colors ${showLayersPanel ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
            title="لیئرونه"
          >
            <Layers className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
