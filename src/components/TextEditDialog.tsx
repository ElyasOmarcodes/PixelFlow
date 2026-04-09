import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Type, Trash2 } from 'lucide-react';
import { TextLayer } from '../types';
import { motion } from 'framer-motion';

export default function TextEditDialog() {
  const { editingTextLayerId, setEditingTextLayerId, currentProject, updateLayer } = useStore();
  const [text, setText] = useState('');
  const [isUppercase, setIsUppercase] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const layer = currentProject?.layers.find(l => l.id === editingTextLayerId) as TextLayer | undefined;

  useEffect(() => {
    if (layer) {
      setText(layer.text);
      setIsUppercase(layer.text === layer.text.toUpperCase() && layer.text !== layer.text.toLowerCase());
    }
  }, [layer]);

  useEffect(() => {
    if (editingTextLayerId && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }
  }, [editingTextLayerId]);

  if (!editingTextLayerId || !layer) return null;

  const handleToggleCase = () => {
    const newIsUpper = !isUppercase;
    setIsUppercase(newIsUpper);
    setText(newIsUpper ? text.toUpperCase() : text.toLowerCase());
  };

  const handleClear = () => {
    setText('');
    textareaRef.current?.focus();
  };

  const handleCancel = () => {
    setEditingTextLayerId(null);
  };

  const handleSave = () => {
    updateLayer(layer.id, { text, segments: undefined });
    setEditingTextLayerId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleCase} 
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="غټ/کوچني توري"
            >
              <Type className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleClear} 
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="متن پاک کړئ"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="flex items-center gap-2">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel} 
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              بندول
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleSave} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              سمه ده
            </motion.button>
          </div>
        </div>
        
        {/* Text Input Area */}
        <div className="p-4 bg-white">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-48 resize-none outline-none text-lg p-2 bg-transparent text-gray-800 placeholder-gray-400"
            placeholder="متن ولیکئ..."
            dir="auto"
          />
        </div>
      </div>
    </div>
  );
}
