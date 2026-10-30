import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Sparkles, 
  Flame, 
  CheckCircle, 
  Scan, 
  RefreshCw,
  Utensils,
  Image as ImageIcon
} from 'lucide-react';
import { Recipe } from '../types';

interface FoodCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipeId: string) => void;
}

interface ScanPreset {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  calories: string;
  spices: string[];
  imageUrl: string;
  matchedRecipeId: string;
}

const SCAN_PRESETS: ScanPreset[] = [
  {
    id: 'thieb',
    name: 'Ceebu Jën / Thiéboudienne',
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    calories: '~620 kcal / portion',
    spices: ['Guedj', 'Yet', 'Rof persillé', 'Concentré de tomate'],
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80',
    matchedRecipeId: 'rec-thieb'
  },
  {
    id: 'griot',
    name: 'Griot de Porc & Pikliz',
    country: 'Haïti',
    countryFlag: '🇭🇹',
    calories: '~580 kcal / portion',
    spices: ['Orange amère', 'Épis créole', 'Piment bouc', 'Thym pays'],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    matchedRecipeId: 'rec-griot'
  },
  {
    id: 'jerk',
    name: 'Jerk Chicken Caribéen',
    country: 'Jamaïque',
    countryFlag: '🇯🇲',
    calories: '~540 kcal / portion',
    spices: ['Scotch bonnet', 'Piment de la Jamaïque', 'Thym sauvage'],
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80',
    matchedRecipeId: 'rec-jerk'
  },
  {
    id: 'bokit',
    name: 'Bokit Guadeloupéen',
    country: 'Guadeloupe',
    countryFlag: '🇬🇵',
    calories: '~650 kcal / pièce',
    spices: ['Sauce chien', 'Poulet boucané', 'Piment végétarien'],
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    matchedRecipeId: 'rec-bokit'
  }
];

export const FoodCameraModal: React.FC<FoodCameraModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipe,
}) => {
  if (!isOpen) return null;

  const [activePreset, setActivePreset] = useState<ScanPreset>(SCAN_PRESETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(true);

  const handleScan = (preset: ScanPreset) => {
    setActivePreset(preset);
    setIsScanning(true);
    setHasScanned(false);

    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#1A1615] text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FF4E27] text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">
                Caméra Culinaire & Scanner d'Assiette
              </h2>
              <p className="text-xs text-white/60">
                Identifiez instantanément un plat afro-caribéen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Preview */}
        <div className="p-6 space-y-4">
          <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-white/20 bg-black flex items-center justify-center">
            
            {/* Background image preview */}
            <img
              src={activePreset.imageUrl}
              alt="Scan preview"
              className="absolute inset-0 w-full h-full object-cover opacity-85"
            />

            {/* Viewfinder Overlay Frame */}
            <div className="absolute inset-8 border border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between items-start">
                <span className="w-4 h-4 border-t-2 border-l-2 border-[#FF4E27]" />
                <span className="w-4 h-4 border-t-2 border-r-2 border-[#FF4E27]" />
              </div>

              {/* Scanning beam animation */}
              {isScanning && (
                <div className="w-full h-0.5 bg-[#FF4E27] shadow-[0_0_15px_#FF4E27] animate-pulse" />
              )}

              <div className="flex justify-between items-end">
                <span className="w-4 h-4 border-b-2 border-l-2 border-[#FF4E27]" />
                <span className="w-4 h-4 border-b-2 border-r-2 border-[#FF4E27]" />
              </div>
            </div>

            {/* Scan in progress badge */}
            {isScanning && (
              <div className="absolute px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-2 border border-white/20">
                <RefreshCw className="w-4 h-4 animate-spin text-[#FF4E27]" />
                <span>Analyse des épices et textures en cours...</span>
              </div>
            )}
          </div>

          {/* Quick preset selector to simulate taking photos */}
          <div>
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-2">
              Tester la reconnaissance sur une assiette type :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SCAN_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleScan(p)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    activePreset.id === p.id
                      ? 'border-[#FF4E27] bg-[#FF4E27]/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs block">{p.countryFlag} {p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Recognition Output Box */}
          {hasScanned && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Plat identifié avec certitude (98%)
                  </span>
                </div>
                <span className="text-xs text-amber-400 font-mono">
                  {activePreset.calories}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {activePreset.countryFlag} {activePreset.name} ({activePreset.country})
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activePreset.spices.map((spice, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-white/80">
                      {spice}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onClose();
                    onSelectRecipe(activePreset.matchedRecipeId);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Ouvrir la recette complète</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
