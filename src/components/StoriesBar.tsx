import React from 'react';
import { Plus, Sparkles, Flame, CheckCircle2, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  onOpenStory: (storyId: string) => void;
  onOpenCreateStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onOpenStory,
  onOpenCreateStory,
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  // Check if current user has an active story
  const currentUserStory = stories.find(s => s.userId === currentUser.id);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-white rounded-3xl p-4 border border-slate-200/80 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF4E27] animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <span>Stories & Coulisses des Chefs</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">· En direct des cuisines</span>
        </div>

        <button
          onClick={onOpenCreateStory}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4E27] hover:text-[#E03814] transition-colors py-1 px-2.5 rounded-lg hover:bg-orange-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Diffuser une Story</span>
        </button>
      </div>

      {/* Navigation arrows for desktop */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 mt-1 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all hidden sm:flex"
          aria-label="Défiler à gauche"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 mt-1 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all hidden sm:flex"
          aria-label="Défiler à droite"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Horizontal Stories Tray */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth px-1"
      >
        {/* Slot 1: Current User (Diffuser / Voir sa Story) */}
        <div className="flex flex-col items-center shrink-0 w-20 group text-center cursor-pointer">
          <div 
            onClick={() => {
              if (currentUserStory) {
                onOpenStory(currentUserStory.id);
              } else {
                onOpenCreateStory();
              }
            }}
            className="relative"
          >
            <div className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-300 group-hover:scale-105 ${
              currentUserStory
                ? 'bg-gradient-to-tr from-[#FF4E27] via-[#EC4899] to-[#F59E0B]'
                : 'bg-slate-200 group-hover:bg-slate-300'
            }`}>
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Plus badge or Play badge */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCreateStory();
              }}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#FF4E27] text-white flex items-center justify-center border-2 border-white shadow-sm hover:scale-110 transition-transform"
              title="Diffuser une story"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-800 mt-1.5 truncate max-w-[76px]">
            {currentUserStory ? 'Votre story' : 'Diffuser'}
          </span>
          <span className="text-[10px] text-slate-600 font-medium">
            {currentUserStory ? `${currentUserStory.slides.length} slide(s)` : 'En direct'}
          </span>
        </div>

        {/* Stories from other chefs & users */}
        {stories
          .filter(s => s.userId !== currentUser.id)
          .map((story) => {
            const hasUnread = !story.isViewed;
            return (
              <div
                key={story.id}
                onClick={() => onOpenStory(story.id)}
                className="flex flex-col items-center shrink-0 w-20 group text-center cursor-pointer"
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-300 group-hover:scale-105 ${
                    hasUnread
                      ? 'bg-gradient-to-tr from-[#FF4E27] via-[#F59E0B] to-[#10B981] animate-pulse-ring'
                      : 'bg-slate-200'
                  }`}>
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      <img
                        src={story.userAvatar}
                        alt={story.userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Flag or verified badge */}
                  <div className="absolute -bottom-1 -right-0.5 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs text-[10px]">
                    {story.userCountryFlag || '👨‍🍳'}
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-slate-800 mt-1.5 truncate max-w-[76px] group-hover:text-[#FF4E27] transition-colors">
                  {story.userName.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  {story.createdAt}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
