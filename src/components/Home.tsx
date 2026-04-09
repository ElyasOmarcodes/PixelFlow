import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Search, Settings, Image as ImageIcon, MoreVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const { projects, createProject, openProject, deleteProject } = useStore();
  const [search, setSearch] = useState('');
  const [showNewDialog, setShowNewDialog] = useState(false);
  
  // New Project State
  const [name, setName] = useState('نوی پروجکټ');
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [unit, setUnit] = useState<'px' | 'inch'>('px');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isTransparent, setIsTransparent] = useState(false);

  const filteredProjects = projects.filter(p => p.name.includes(search));

  const handleCreate = () => {
    createProject({
      name,
      width,
      height,
      unit,
      backgroundColor: bgColor,
      isTransparent,
    });
    setShowNewDialog(false);
  };

  const templates = [
    { name: 'یوټیوب تمبنیل', w: 1280, h: 720 },
    { name: 'فیسبوک پوسټ', w: 1080, h: 1080 },
    { name: 'انسټاګرام سټوري', w: 1080, h: 1920 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600">پښتو ایډیټور</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-8">
        {/* Search & New Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="پروجکټونه ولټوئ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowNewDialog(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>نوی پروجکټ</span>
          </button>
        </div>

        {/* Templates */}
        <section>
          <h2 className="text-lg font-semibold mb-4">تیار سایزونه</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {templates.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  setName(t.name);
                  setWidth(t.w);
                  setHeight(t.h);
                  setShowNewDialog(true);
                }}
                className="snap-start shrink-0 bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 w-32 h-32 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-center">{t.name}</span>
                <span className="text-xs text-gray-500">{t.w}x{t.h}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Projects List */}
        <section>
          <h2 className="text-lg font-semibold mb-4">ستاسو پروجکټونه</h2>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">هیڅ پروجکټ ونه موندل شو.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group relative">
                  <div 
                    className="aspect-square bg-gray-100 cursor-pointer relative"
                    onClick={() => openProject(project.id)}
                  >
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{project.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{new Date(project.updatedAt).toLocaleDateString('ps-AF')}</p>
                  </div>
                  <button 
                    onClick={() => deleteProject(project.id)}
                    className="absolute top-2 left-2 p-1.5 bg-white/80 backdrop-blur rounded-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* New Project Dialog */}
      <AnimatePresence>
        {showNewDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowNewDialog(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
              dir="rtl"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">نوی پروجکټ</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">د پروژې نوم</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">پلنوالی</label>
                    <input 
                      type="number" 
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">اوږدوالی</label>
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">واحد</label>
                    <select 
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as 'px' | 'inch')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="px">Pixel</option>
                      <option value="inch">Inch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">پس منظر</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      disabled={isTransparent}
                      className="w-10 h-10 rounded cursor-pointer disabled:opacity-50"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isTransparent}
                        onChange={(e) => setIsTransparent(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">شفاف (Transparent)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  لغوه کول
                </button>
                <button 
                  onClick={handleCreate}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                >
                  جوړول
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
