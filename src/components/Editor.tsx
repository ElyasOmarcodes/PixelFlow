import React from 'react';
import { useStore } from '../store/useStore';
import TopBar from './TopBar';
import BottomMenu from './BottomMenu';
import CanvasArea from './CanvasArea';
import LayersPanel from './LayersPanel';
import ContextualToolbar from './ContextualToolbar';
import TextEditDialog from './TextEditDialog';

export default function Editor() {
  const { currentProject, showLayersPanel, selectedLayerId } = useStore();

  if (!currentProject) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col overflow-hidden" dir="rtl">
      <TopBar />
      
      <div className="flex-1 relative flex overflow-hidden">
        {/* Main Canvas Area */}
        <main className="flex-1 relative bg-gray-200/50">
          <CanvasArea />
        </main>

        {/* Layers Panel (Slide over or side panel) */}
        {showLayersPanel && (
          <aside className="w-72 bg-white border-r border-gray-200 shadow-xl z-20 flex flex-col">
            <LayersPanel />
          </aside>
        )}
      </div>

      {/* Contextual Toolbar - Appears above bottom menu when a layer is selected */}
      {selectedLayerId && (
        <div className="absolute bottom-[64px] left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-2xl mx-auto">
            <ContextualToolbar />
          </div>
        </div>
      )}

      <BottomMenu />
      <TextEditDialog />
    </div>
  );
}
