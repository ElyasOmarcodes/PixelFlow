import React, { useState } from 'react';
import { Type, Image as ImageIcon, LayoutTemplate, Sticker, Square, ArrowUpRight, PenTool } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

type Tab = 'text' | 'elements' | 'canvas';

export default function BottomMenu() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const { addLayer, selectLayer, activeTool } = useStore();

  const handleAddText = () => {
    addLayer({
      type: 'text',
      name: 'نوی متن',
      text: 'دلته ولیکئ',
      x: 100,
      y: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
      blendMode: 'normal',
      fontSize: 48,
      fontFamily: 'Arial',
      fill: '#000000',
      align: 'center',
      fontStyle: 'normal',
      textDecoration: 'empty',
    } as any);
    setActiveTab(null);
  };

  const handleAddShape = () => {
    addLayer({
      type: 'shape',
      name: 'نوی شیپ',
      shapeType: 'rect',
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
      blendMode: 'normal',
      fill: '#3b82f6',
    } as any);
    setActiveTab(null);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (activeTool) return null;

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        addLayer({
          type: 'image',
          name: 'نوی تصویر',
          src,
          x: 50,
          y: 50,
          width: img.width > 800 ? 800 : img.width,
          height: img.width > 800 ? (img.height * 800) / img.width : img.height,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          visible: true,
          locked: false,
          blendMode: 'normal',
        } as any);
        setActiveTab(null);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: 'text', label: 'متن', icon: Type, onClick: handleAddText },
    { id: 'elements', label: 'توکي', icon: ImageIcon, onClick: () => setActiveTab(activeTab === 'elements' ? null : 'elements') },
    { id: 'canvas', label: 'کانواس', icon: LayoutTemplate, onClick: () => setActiveTab(activeTab === 'canvas' ? null : 'canvas') },
  ];

  const elementOptions = [
    { id: 'image', label: 'انځور', icon: ImageIcon, onClick: () => fileInputRef.current?.click() },
    { id: 'sticker', label: 'سټیکر', icon: Sticker, onClick: () => {} },
    { id: 'shape', label: 'شیپ', icon: Square, onClick: handleAddShape },
    { id: 'arrow', label: 'غشی', icon: ArrowUpRight, onClick: () => {} },
    { id: 'path', label: 'پټ/رسم', icon: PenTool, onClick: () => {} },
  ];

  return (
    <div className="bg-white border-t border-gray-200 z-30 relative">
      {/* Sub-menus based on active tab */}
      {activeTab === 'elements' && (
        <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-100 p-2 flex gap-2 overflow-x-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] hide-scrollbar">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleAddImage} 
            className="hidden" 
          />
          {elementOptions.map((item) => (
            <motion.button 
              whileTap={{ scale: 0.9 }}
              key={item.id} 
              onClick={item.onClick}
              className="flex flex-col items-center justify-center min-w-[72px] h-[72px] p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
            >
              <item.icon className="w-6 h-6 mb-1.5 text-gray-700" />
              <span className="text-[11px] font-medium text-gray-700 whitespace-nowrap">{item.label}</span>
            </motion.button>
          ))}
        </div>
      )}
      
      {activeTab === 'canvas' && (
        <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-100 p-2 flex gap-4 overflow-x-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] hide-scrollbar">
          {['رنګ', 'شفاف', 'سایز', 'ګالري', 'کمره', 'ایفکټونه'].map((item) => (
            <motion.button whileTap={{ scale: 0.95 }} key={item} className="whitespace-nowrap px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
              {item}
            </motion.button>
          ))}
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              whileTap={{ scale: 0.9 }}
              key={tab.id}
              onClick={tab.onClick}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-blue-600 bg-blue-50/50 border-t-2 border-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-t-2 border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
