import React, { useState } from 'react';
import Sketch from '@uiw/react-color-sketch';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface SolidColorDialogProps {
  initialColor: string;
  onClose: () => void;
  onSelect: (color: string) => void;
}

export default function SolidColorDialog({ initialColor, onClose, onSelect }: SolidColorDialogProps) {
  const [color, setColor] = useState(initialColor || '#000000');
  const { addColorToHistory } = useStore();

  const handleSave = () => {
    addColorToHistory(color);
    onSelect(color);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-sm w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="font-medium text-gray-800">رنګ وټاکئ</h3>
        </div>
        
        <div className="p-2 flex justify-center bg-white w-full">
          <Sketch
            color={color}
            onChange={(c) => setColor(c.hexa)}
            disableAlpha={false}
            style={{ width: '100%', background: 'transparent', boxShadow: 'none' }}
          />
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
    </div>
  );
}
