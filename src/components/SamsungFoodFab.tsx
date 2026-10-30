import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Link2, 
  Camera, 
  Utensils,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface SamsungFoodFabProps {
  onCreateRecipe: () => void;
  onImportUrl: () => void;
  /** Omitted when the AI photo-scan module is switched off by an administrator. */
  onScanPhoto?: () => void;
  onOpenCreateStory?: () => void;
}

export const SamsungFoodFab: React.FC<SamsungFoodFabProps> = ({
  onCreateRecipe,
  onImportUrl,
  onScanPhoto,
  onOpenCreateStory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const actionButtons = [
    ...(onOpenCreateStory ? [{
      id: 'story',
      label: 'Diffuser une Story',
      sublabel: 'Vidéo éphémère ou photo en direct',
      icon: Sparkles,
      color: 'from-purple-600 to-[#FF4E27]',
      badgeColor: 'hover:border-purple-500/40 group-hover:text-purple-600',
      accentBg: 'bg-purple-50 text-purple-700',
      onClick: () => {
        setIsOpen(false);
        onOpenCreateStory();
      },
    }] : []),
    {
      id: 'import',
      label: 'Importer depuis un lien',
      sublabel: 'Instagram, TikTok, YouTube, Blog...',
      icon: Link2,
      color: 'from-[#0F3E2E] to-[#15523E]',
      badgeColor: 'hover:border-[#15523E]/40 group-hover:text-[#15523E]',
      accentBg: 'bg-emerald-50 text-[#0F3E2E]',
      onClick: () => {
        setIsOpen(false);
        onImportUrl();
      },
    },
    {
      id: 'camera',
      label: 'Prendre une photo',
      sublabel: 'Scanner votre plat ou ingrédients',
      icon: Camera,
      color: 'from-[#FF7849] to-[#F59E0B]',
      badgeColor: 'hover:border-[#FF7849]/40 group-hover:text-[#FF7849]',
      accentBg: 'bg-orange-50 text-[#FF7849]',
      onClick: () => {
        setIsOpen(false);
        onScanPhoto?.();
      },
    },
    {
      id: 'create',
      label: 'Créer une recette',
      sublabel: 'Formulaire complet pas-à-pas',
      icon: Utensils,
      color: 'from-[#FF4E27] to-[#FF7849]',
      badgeColor: 'hover:border-[#FF4E27]/40 group-hover:text-[#FF4E27]',
      accentBg: 'bg-gradient-to-tr from-[#FF4E27] to-[#FF7849] text-white',
      onClick: () => {
        setIsOpen(false);
        onCreateRecipe();
      },
    },
  ];

  return (
    <div className="fixed bottom-20 sm:bottom-22 md:bottom-22 right-4 sm:right-6 z-50 flex flex-col items-end select-none">
      {/* Backdrop overlay when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40"
          />
        )}
      </AnimatePresence>

      {/* Floating Options Menu - Staggered expansion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="flex flex-col items-end gap-3.5 mb-4 z-50 pointer-events-auto"
            initial="closed"
            animate="open"
            exit="closed"
          >
            {actionButtons.filter(item => item.id !== 'camera' || onScanPhoto).map((item, index) => {
              const Icon = item.icon;
              // Stagger delay based on distance to the FAB (create comes out first, then camera, then import)
              // index 2 is 'create' (bottom-most, closest to FAB), index 0 is 'import' (top)
              const reversedIndex = actionButtons.length - 1 - index;
              const delay = reversedIndex * 0.05 + 0.02;

              return (
                <motion.button
                  key={item.id}
                  onClick={item.onClick}
                  initial={{ 
                    opacity: 0, 
                    y: 28 + (actionButtons.length - index) * 8, 
                    scale: 0.5,
                    filter: 'blur(4px)'
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: {
                      type: 'spring',
                      stiffness: 420,
                      damping: 24,
                      delay,
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 16, 
                    scale: 0.6,
                    filter: 'blur(3px)',
                    transition: {
                      duration: 0.16,
                      ease: 'easeInOut',
                      delay: index * 0.03, // exit quickly in reverse
                    }
                  }}
                  whileHover={{ scale: 1.03, x: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-3.5 group focus:outline-none cursor-pointer"
                >
                  {/* Label tooltip card */}
                  <motion.div 
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0, 
                      transition: { delay: delay + 0.04, duration: 0.2 } 
                    }}
                    className={`bg-white/95 backdrop-blur-md text-left px-3.5 py-2 rounded-xl shadow-xl border border-[#E8DFD1] transition-all group-hover:shadow-2xl group-hover:border-[#D9532F]/40 flex flex-col`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1A1615] group-hover:text-[#D9532F] transition-colors">
                        {item.label}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-[#8C7D70] group-hover:text-[#D9532F] transition-colors" />
                    </div>
                    <span className="text-[10px] text-[#7A6E63] font-medium leading-tight">
                      {item.sublabel}
                    </span>
                  </motion.div>

                  {/* Icon Circle button */}
                  <div 
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg border border-white/60 transition-all ${item.accentBg} group-hover:shadow-xl group-hover:ring-4 group-hover:ring-white/40`}
                  >
                    <Icon className="w-5.5 h-5.5 stroke-[2.2]" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button (Samsung Food inspired with smooth rotation animation) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={isOpen ? "Fermer le menu d'actions" : "Créer ou importer une recette"}
        className="relative z-50 flex items-center justify-center w-15 h-15 rounded-2xl shadow-xl cursor-pointer focus:outline-none overflow-hidden"
        animate={{
          rotate: isOpen ? 135 : 0,
          scale: isOpen ? 1 : 1,
        }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.92 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 22,
          mass: 0.8,
        }}
      >
        {/* Dynamic Background: Smoothly changes from warm Afro-Caribbean gradient to dark graphite when expanded */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#FF4E27] via-[#FF7849] to-[#F59E0B]"
          animate={{
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.25 }}
        />
        <motion.div
          className="absolute inset-0 bg-slate-900 border border-white/20"
          animate={{
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
        />

        {/* Ambient Ring / Glow Effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-2xl ring-2 ring-[#FF4E27]/50 animate-pulse pointer-events-none" />
        )}

        {/* Center Icon: Smooth rotation of Plus into Cross */}
        <motion.div
          className="relative z-10 text-white flex items-center justify-center"
          animate={{
            rotate: isOpen ? 0 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 22,
          }}
        >
          <Plus className="w-7 h-7 stroke-[2.75]" />
        </motion.div>

        {/* Ping badge when closed indicating freshness / smart actions */}
        <AnimatePresence>
          {!isOpen && (
            <motion.span 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-2 right-2 flex h-2.5 w-2.5"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-xs"></span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
