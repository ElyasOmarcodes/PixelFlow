import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Layer } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  projects: Project[];
  currentProject: Project | null;
  selectedLayerId: string | null;
  editingTextLayerId: string | null;
  zoom: number;
  showGrid: boolean;
  showLayersPanel: boolean;
  activeTool: string | null;
  
  colorHistory: string[];
  gradientHistory: any[];
  
  // Actions
  createProject: (project: Omit<Project, 'id' | 'layers' | 'updatedAt'>) => void;
  openProject: (id: string) => void;
  closeProject: () => void;
  deleteProject: (id: string) => void;
  updateProject: (updates: Partial<Project>) => void;
  
  addLayer: (layer: Omit<Layer, 'id'>) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  deleteLayer: (id: string) => void;
  selectLayer: (id: string | null) => void;
  setEditingTextLayerId: (id: string | null) => void;
  reorderLayers: (startIndex: number, endIndex: number) => void;
  
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleLayersPanel: () => void;
  setActiveTool: (tool: string | null) => void;
  
  addColorToHistory: (color: string) => void;
  addGradientToHistory: (gradient: any) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      selectedLayerId: null,
      editingTextLayerId: null,
      zoom: 100,
      showGrid: false,
      showLayersPanel: false,
      activeTool: null,
      colorHistory: ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      gradientHistory: [],

      createProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: uuidv4(),
          layers: [],
          updatedAt: Date.now(),
        };
        set((state) => ({
          projects: [newProject, ...state.projects],
          currentProject: newProject,
          selectedLayerId: null,
          zoom: 100,
        }));
      },

      openProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (project) {
          set({ currentProject: project, selectedLayerId: null, zoom: 100 });
        }
      },

      closeProject: () => {
        set({ currentProject: null, selectedLayerId: null });
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },

      updateProject: (updates) => {
        set((state) => {
          if (!state.currentProject) return state;
          const updatedProject = { ...state.currentProject, ...updates, updatedAt: Date.now() };
          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
          };
        });
      },

      addLayer: (layerData) => {
        set((state) => {
          if (!state.currentProject) return state;
          const newLayer = { ...layerData, id: uuidv4() } as Layer;
          const updatedProject = {
            ...state.currentProject,
            layers: [...state.currentProject.layers, newLayer],
            updatedAt: Date.now(),
          };
          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
            selectedLayerId: newLayer.id,
          };
        });
      },

      updateLayer: (id, updates) => {
        set((state) => {
          if (!state.currentProject) return {};
          const updatedLayers = state.currentProject.layers.map((layer) =>
            layer.id === id ? ({ ...layer, ...updates } as Layer) : layer
          );
          const updatedProject = {
            ...state.currentProject,
            layers: updatedLayers,
            updatedAt: Date.now(),
          };
          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
          };
        });
      },

      deleteLayer: (id) => {
        set((state) => {
          if (!state.currentProject) return state;
          const updatedLayers = state.currentProject.layers.filter((layer) => layer.id !== id);
          const updatedProject = {
            ...state.currentProject,
            layers: updatedLayers,
            updatedAt: Date.now(),
          };
          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
            selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
          };
        });
      },

      selectLayer: (id) => set({ selectedLayerId: id, activeTool: null }),
      setEditingTextLayerId: (id) => set({ editingTextLayerId: id }),

      reorderLayers: (startIndex, endIndex) => {
        set((state) => {
          if (!state.currentProject) return state;
          const result = Array.from(state.currentProject.layers);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          
          const updatedProject = {
            ...state.currentProject,
            layers: result,
            updatedAt: Date.now(),
          };
          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
          };
        });
      },

      setZoom: (zoom) => set({ zoom }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleLayersPanel: () => set((state) => ({ showLayersPanel: !state.showLayersPanel })),
      setActiveTool: (tool) => set({ activeTool: tool }),
      
      addColorToHistory: (color) => set((state) => {
        const newHistory = [color, ...state.colorHistory.filter(c => c !== color)].slice(0, 30);
        return { colorHistory: newHistory };
      }),
      
      addGradientToHistory: (gradient) => set((state) => {
        // Simple deduplication based on JSON stringification
        const gradStr = JSON.stringify(gradient);
        const newHistory = [gradient, ...state.gradientHistory.filter(g => JSON.stringify(g) !== gradStr)].slice(0, 30);
        return { gradientHistory: newHistory };
      }),
    }),
    {
      name: 'pashto-editor-storage',
    }
  )
);
