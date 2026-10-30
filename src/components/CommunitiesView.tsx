import React, { useState, useMemo } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Send, 
  Check, 
  Plus, 
  Sparkles,
  MapPin,
  Search,
  PlusCircle,
  Tag,
  Globe,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Community, CommunityInterestCategory, User } from '../types';
import { CreateCommunityModal, COMMUNITY_INTEREST_OPTIONS } from './CreateCommunityModal';

interface CommunitiesViewProps {
  communities: Community[];
  currentUser: User;
  onToggleJoin: (communityId: string) => void;
  onAddPost: (communityId: string, content: string) => void;
  onCreateCommunity?: (newCommunity: Community) => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  communities,
  currentUser,
  onToggleJoin,
  onAddPost,
  onCreateCommunity
}) => {
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(communities[0]?.id || '');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [newPostText, setNewPostText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Active selected community object
  const selectedCommunity = communities.find(c => c.id === selectedCommunityId) || communities[0];

  // Filtered communities based on category and search query
  const filteredCommunities = useMemo(() => {
    return communities.filter(comm => {
      const matchCat = selectedCategoryFilter === 'all' || comm.interestCategory === selectedCategoryFilter;
      const q = searchFilter.toLowerCase().trim();
      const matchSearch = !q || 
        comm.name.toLowerCase().includes(q) ||
        comm.tagline.toLowerCase().includes(q) ||
        comm.description.toLowerCase().includes(q) ||
        comm.region.toLowerCase().includes(q) ||
        (comm.tags && comm.tags.some(t => t.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });
  }, [communities, selectedCategoryFilter, searchFilter]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !selectedCommunity) return;
    onAddPost(selectedCommunity.id, newPostText.trim());
    setNewPostText('');
  };

  const handleCreatedCommunity = (newCommunity: Community) => {
    if (onCreateCommunity) {
      onCreateCommunity(newCommunity);
    }
    setSelectedCommunityId(newCommunity.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4E27] to-[#FF7849] text-white flex items-center justify-center shadow-md shadow-[#FF4E27]/25">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
                Cercles & Communautés Culinaires
              </h1>
              <p className="text-xs text-slate-500">
                Rejoignez ou créez des groupes thématiques selon vos centres d'intérêts (Street food, tradition, vegan, grillades...)
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Create Community */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-black shadow-lg shadow-[#FF4E27]/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer une communauté</span>
          </button>
        </div>
      </div>

      {/* Interest Categories Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4E27]" />
            <span>Filtrer par centre d'intérêt</span>
          </span>

          {/* Quick search input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Rechercher par mot-clé, tag..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:outline-none bg-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Tous les centres d'intérêt ({communities.length})
          </button>

          {COMMUNITY_INTEREST_OPTIONS.map((cat) => {
            const count = communities.filter(c => c.interestCategory === cat.id).length;
            const isSelected = selectedCategoryFilter === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[#FF4E27] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Community selector grid + Active Circle Discussions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Community Circles List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Cercles disponibles ({filteredCommunities.length})
            </span>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs font-bold text-[#FF4E27] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau cercle</span>
            </button>
          </div>

          {filteredCommunities.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">
                Aucune communauté ne correspond à ce filtre
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setSearchFilter('');
                }}
                className="text-xs text-[#FF4E27] font-bold hover:underline"
              >
                Réinitialiser les filtres
              </button>
              <div className="pt-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
                >
                  Créer cette communauté maintenant
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCommunities.map((comm) => {
                const isSelected = selectedCommunity?.id === comm.id;

                return (
                  <div
                    key={comm.id}
                    onClick={() => setSelectedCommunityId(comm.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-[#FF4E27] shadow-md ring-1 ring-[#FF4E27]'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-[#0F3E2E] uppercase tracking-wider">
                            {comm.region}
                          </span>
                          {comm.interestLabel && (
                            <span className="px-1.5 py-0.2 rounded bg-orange-50 text-[#FF4E27] text-[9px] font-bold">
                              {comm.interestLabel}
                            </span>
                          )}
                          {comm.creatorName && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 text-[9px] font-bold">
                              Créé par {comm.creatorName.split(' ')[0]}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                          {comm.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleJoin(comm.id);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors ${
                          comm.isJoined
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-[#FF4E27] text-white hover:bg-[#E03814]'
                        }`}
                      >
                        {comm.isJoined ? 'Membre ✓' : 'Rejoindre'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 font-normal leading-relaxed">
                      {comm.tagline}
                    </p>

                    {/* Tags preview */}
                    {comm.tags && comm.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-2">
                        {comm.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>{comm.membersCount.toLocaleString()} passionnés</span>
                      <span>{comm.posts.length} discussions</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Discussion Feed of the selected community */}
        {selectedCommunity && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Community Banner */}
            <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-sm">
              <img
                src={selectedCommunity.coverImage}
                alt={selectedCommunity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 p-6 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
                    Cercle Actif · {selectedCommunity.region}
                  </span>
                  {selectedCommunity.interestLabel && (
                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white">
                      {selectedCommunity.interestLabel}
                    </span>
                  )}
                  {selectedCommunity.privacy && (
                    <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-slate-300">
                      {selectedCommunity.privacy === 'public' ? 'Public' : 'Privé'}
                    </span>
                  )}
                </div>
                
                <h2 className="font-serif font-black text-xl sm:text-3xl leading-tight">
                  {selectedCommunity.name}
                </h2>
                
                <p className="text-xs text-slate-200 line-clamp-2 mt-1 leading-relaxed max-w-xl">
                  {selectedCommunity.description}
                </p>

                <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/20 text-xs text-white/80">
                  <span>{selectedCommunity.membersCount.toLocaleString()} membres</span>
                  <span>·</span>
                  <span>{selectedCommunity.posts.length} contributions</span>
                  {selectedCommunity.creatorName && (
                    <>
                      <span>·</span>
                      <span className="text-amber-300">Fondé par {selectedCommunity.creatorName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* New Discussion Input */}
            <form onSubmit={handleCreatePost} className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                />
                <span className="text-xs font-bold text-slate-900">
                  Partagez une astuce ou posez une question dans "{selectedCommunity.name}" :
                </span>
              </div>

              <textarea
                rows={2}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Ex : Quelle marinade ou quelle épice utilisez-vous pour donner ce goût fumé si caractéristique ?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newPostText.trim()}
                  className="px-4 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publier dans le cercle</span>
                </button>
              </div>
            </form>

            {/* Posts List */}
            <div className="space-y-4">
              {selectedCommunity.posts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-100"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {post.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {post.authorCountry} · {post.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {post.content}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <button className="flex items-center gap-1 hover:text-[#FF4E27] transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{post.likes} mentions utiles</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.repliesCount} réponses</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Community Creation Modal */}
      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        onCreateCommunity={handleCreatedCommunity}
      />

    </div>
  );
};
