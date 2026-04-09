import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw, X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BottomSheet({ isOpen, onClose, onApply, onReset, children, title }: BottomSheetProps) {
  // Prevent click outside to close by not adding a backdrop click handler
  // Prevent swipe to close by not adding drag handlers

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[80vh]"
          >
            {title && (
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                <h3 className="font-medium text-gray-800">{title}</h3>
              </div>
            )}
            
            <div className="flex flex-1 overflow-hidden">
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
              
              {/* Right Vertical Buttons */}
              <div className="w-16 border-l border-gray-100 bg-gray-50 flex flex-col p-2 gap-2 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onApply}
                  className="flex flex-col items-center justify-center p-2 rounded-xl text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Check className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-medium">تایید</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onReset}
                  className="flex flex-col items-center justify-center p-2 rounded-xl text-orange-500 hover:bg-orange-100 transition-colors"
                >
                  <RotateCcw className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-medium">بېرته</span>
                </motion.button>
                <div className="flex-1" />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex flex-col items-center justify-center p-2 rounded-xl text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-medium">بندول</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
