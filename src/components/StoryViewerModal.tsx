import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Send, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  MapPin, 
  Utensils, 
  CheckCircle2, 
  Share2,
  Sparkles,
  Award
} from 'lucide-react';
import { Story, StorySlide, User } from '../types';

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  initialStoryId: string | null;
  currentUser: User;
  onSelectRecipe: (recipeId: string) => void;
  onSendStoryReply: (story: Story, slide: StorySlide, message: string) => void;
  onSendStoryReaction: (story: Story, slide: StorySlide, emoji: string) => void;
  onMarkStoryViewed: (storyId: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  stories,
  initialStoryId,
  currentUser,
  onSelectRecipe,
  onSendStoryReply,
  onSendStoryReaction,
  onMarkStoryViewed,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likedSlides, setLikedSlides] = useState<Record<string, boolean>>({});
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});

  // Slide timer progress
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<any>(null);

  // Initialize story based on initialStoryId
  useEffect(() => {
    if (isOpen && initialStoryId) {
      const idx = stories.findIndex(s => s.id === initialStoryId);
      if (idx !== -1) {
        setCurrentStoryIndex(idx);
        setCurrentSlideIndex(0);
        setProgress(0);
      }
    }
  }, [isOpen, initialStoryId, stories]);

  const currentStory = stories[currentStoryIndex];
  const currentSlide = currentStory?.slides?.[currentSlideIndex];

  // Mark current story as viewed
  useEffect(() => {
    if (isOpen && currentStory) {
      onMarkStoryViewed(currentStory.id);
    }
  }, [isOpen, currentStoryIndex, currentStory, onMarkStoryViewed]);

  // Progress Bar timer
  useEffect(() => {
    if (!isOpen || !currentSlide || isPaused) return;

    const duration = (currentSlide.durationSeconds || 5) * 1000;
    const stepTime = 50; // update every 50ms
    const stepIncrement = (stepTime / duration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, stepTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, currentSlideIndex, currentStoryIndex, isPaused, currentSlide]);

  // Key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex, currentStoryIndex]);

  if (!isOpen || !currentStory || !currentSlide) return null;

  const handleNext = () => {
    setProgress(0);
    if (currentSlideIndex < currentStory.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    } else if (currentStoryIndex > 0) {
      const prevStory = stories[currentStoryIndex - 1];
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentSlideIndex(prevStory.slides.length - 1);
    }
  };

  const triggerReaction = (emoji: string) => {
    onSendStoryReaction(currentStory, currentSlide, emoji);
    const id = Date.now() + Math.random();
    const left = 30 + Math.random() * 40;
    setFloatingEmojis(prev => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => item.id !== id));
    }, 1800);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendStoryReply(currentStory, currentSlide, replyText.trim());
    triggerReaction('💬');
    setReplyText('');
  };

  const toggleLikeSlide = () => {
    const isLiked = !likedSlides[currentSlide.id];
    setLikedSlides(prev => ({ ...prev, [currentSlide.id]: isLiked }));
    if (isLiked) {
      triggerReaction('❤️');
    }
  };

  const handleVotePoll = (optionIndex: number) => {
    if (pollVotes[currentSlide.id] !== undefined) return;
    setPollVotes(prev => ({ ...prev, [currentSlide.id]: optionIndex }));
    triggerReaction('🗳️');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      
      {/* Background close click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Top Right Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all backdrop-blur-md"
        aria-label="Fermer la story"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Desktop Navigation Arrows */}
      {currentStoryIndex > 0 || currentSlideIndex > 0 ? (
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md hidden md:flex items-center justify-center transition-all hover:scale-110"
          aria-label="Slide précédente"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      ) : null}

      <button
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md hidden md:flex items-center justify-center transition-all hover:scale-110"
        aria-label="Slide suivante"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Mobile Device Frame Container (Instagram / TikTok Story format) */}
      <div 
        className="relative z-30 w-full max-w-md h-full sm:h-[88vh] sm:max-h-[820px] sm:rounded-3xl overflow-hidden bg-slate-950 flex flex-col shadow-2xl border border-white/10"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        
        {/* Story Media Background */}
        <div className="absolute inset-0">
          <img
            src={currentSlide.mediaUrl}
            alt={currentSlide.caption || currentStory.userName}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient vignette for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/90 pointer-events-none" />
        </div>

        {/* Click Zones (Left for Prev, Right for Next) */}
        <div className="absolute inset-0 z-10 flex">
          <div 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
            className="w-1/3 h-full cursor-pointer"
            title="Précédent"
          />
          <div 
            onClick={(e) => { e.stopPropagation(); handleNext(); }} 
            className="w-2/3 h-full cursor-pointer"
            title="Suivant"
          />
        </div>

        {/* Top Header & Segmented Progress Bars */}
        <div className="relative z-20 p-4 space-y-3 shrink-0">
          {/* Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {currentStory.slides.map((slide, idx) => {
              let fillPercent = 0;
              if (idx < currentSlideIndex) fillPercent = 100;
              else if (idx === currentSlideIndex) fillPercent = progress;

              return (
                <div 
                  key={slide.id}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div 
                    className="h-full bg-white transition-all ease-linear"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Author Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.userName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF4E27]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wide">
                    {currentStory.userName}
                  </span>
                  {currentStory.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4E27] fill-white" />
                  )}
                  <span className="text-[10px] text-white/70">
                    {currentStory.createdAt}
                  </span>
                </div>
                {currentSlide.location && (
                  <div className="flex items-center gap-1 text-[10px] text-white/85">
                    <MapPin className="w-3 h-3 text-[#FF4E27]" />
                    <span>{currentSlide.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls: Pause/Play & Mute */}
            <div className="flex items-center gap-1 text-white">
              <button
                onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isPaused ? "Reprendre" : "Pause"}
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isMuted ? "Activer son" : "Couper son"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Center Interactive Content / Stickers */}
        <div className="relative z-20 flex-1 flex flex-col justify-end p-5 pb-6 space-y-4 pointer-events-auto">
          
          {/* Interactive Poll Sticker */}
          {currentSlide.sticker?.type === 'poll' && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl p-4 shadow-xl border border-white/40 space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">📊</span>
                <span className="text-xs font-bold text-slate-900 leading-snug">
                  {currentSlide.sticker.question}
                </span>
              </div>

              <div className="space-y-2">
                {currentSlide.sticker.options?.map((option, idx) => {
                  const hasVoted = pollVotes[currentSlide.id] !== undefined;
                  const isUserVote = pollVotes[currentSlide.id] === idx;
                  
                  // compute total votes
                  const totalVotes = currentSlide.sticker?.options?.reduce((acc, opt) => acc + opt.votes, 0) || 1;
                  const voteShare = Math.round((option.votes / totalVotes) * 100);

                  return (
                    <button
                      key={idx}
                      disabled={hasVoted}
                      onClick={() => handleVotePoll(idx)}
                      className={`relative w-full text-left p-2.5 rounded-xl border font-medium text-xs transition-all overflow-hidden ${
                        isUserVote 
                          ? 'border-[#FF4E27] bg-orange-50/90 text-[#FF4E27] font-bold' 
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800'
                      }`}
                    >
                      {/* Animated Progress percentage fill if voted */}
                      {hasVoted && (
                        <div 
                          className="absolute inset-y-0 left-0 bg-[#FF4E27]/15 transition-all duration-500 rounded-lg"
                          style={{ width: `${voteShare}%` }}
                        />
                      )}
                      <div className="relative z-10 flex items-center justify-between">
                        <span>{option.label}</span>
                        {hasVoted && (
                          <span className="text-xs font-bold font-mono">
                            {voteShare}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Chef Tip Sticker */}
          {currentSlide.sticker?.type === 'tip' && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-gradient-to-r from-[#0F3E2E]/95 to-[#15523E]/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-xl border border-white/20 space-y-1.5"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F59E0B]">
                <Sparkles className="w-4 h-4" />
                <span>{currentSlide.sticker.tipTitle || 'Astuce de Chef'}</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                {currentSlide.sticker.tipContent}
              </p>
            </div>
          )}

          {/* Linked Recipe Card Attachment */}
          {currentSlide.tagRecipeId && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(true);
                onSelectRecipe(currentSlide.tagRecipeId!);
              }}
              className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-white/40 shadow-xl flex items-center gap-3 cursor-pointer group hover:scale-[1.02] transition-transform"
            >
              {currentSlide.tagRecipeImage && (
                <img
                  src={currentSlide.tagRecipeImage}
                  alt={currentSlide.tagRecipeTitle || 'Recette'}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4E27] block">
                  Recette associée
                </span>
                <span className="text-xs font-bold text-slate-900 truncate block group-hover:text-[#FF4E27] transition-colors">
                  {currentSlide.tagRecipeTitle}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#FF4E27] text-white text-[11px] font-bold shrink-0 shadow-xs">
                Voir
              </span>
            </div>
          )}

          {/* Slide Caption Text */}
          {currentSlide.caption && (
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 text-white text-xs leading-relaxed font-medium border border-white/10">
              {currentSlide.caption}
            </div>
          )}

        </div>

        {/* Floating Emojis Burst */}
        {floatingEmojis.map(item => (
          <div
            key={item.id}
            className="absolute bottom-20 z-40 text-3xl pointer-events-none animate-in slide-in-from-bottom-6 fade-out duration-1000"
            style={{ left: `${item.left}%` }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Bottom Interaction Bar (Reply + Reactions + Like) */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="relative z-30 p-4 pt-2 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2.5 shrink-0"
        >
          {/* Quick Reaction Emoji Pills */}
          <div className="flex items-center justify-between px-1">
            {['🔥', '❤️', '🤤', '🌶️', '👏', '👑'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => triggerReaction(emoji)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-lg flex items-center justify-center transition-transform hover:scale-125"
                title={`Réagir avec ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Form & Like Button */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              placeholder={`Répondre à ${currentStory.userName.split(' ')[0]}...`}
              className="flex-1 bg-white/20 text-white placeholder-white/60 text-xs px-3.5 py-2.5 rounded-xl border border-white/20 focus:border-white focus:outline-none backdrop-blur-md"
            />

            {replyText.trim() ? (
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#FF4E27] text-white hover:bg-[#E03814] transition-colors"
                title="Envoyer"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleLikeSlide}
                className={`p-2.5 rounded-xl transition-all ${
                  likedSlides[currentSlide.id]
                    ? 'bg-[#FF4E27] text-white scale-110'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title="Aimer la story"
              >
                <Heart className={`w-4 h-4 ${likedSlides[currentSlide.id] ? 'fill-white' : ''}`} />
              </button>
            )}
          </form>
        </div>

      </div>

    </div>
  );
};
