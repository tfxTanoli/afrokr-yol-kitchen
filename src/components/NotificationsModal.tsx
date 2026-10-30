import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Heart, 
  MessageSquare, 
  GraduationCap, 
  CheckCheck, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  DollarSign,
  Flame,
  Camera
} from 'lucide-react';
import { InAppNotification, NotificationType } from '../types';
import { CulinaryBadgeChip } from './CulinaryBadgeChip';
import { getAuthorCulinaryBadge } from '../utils/badgeSystem';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: InAppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNavigateToTarget: (notif: InAppNotification) => void;
  onSimulateNotification: (type: NotificationType) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNavigateToTarget,
  onSimulateNotification,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'like' | 'comment' | 'enrollment' | 'story'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'like') return n.type === 'like';
    if (filter === 'comment') return n.type === 'comment';
    if (filter === 'enrollment') return n.type === 'enrollment';
    if (filter === 'story') return n.type === 'story_reaction' || n.type === 'story_reply';
    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 fill-[#FF4E27] text-[#FF4E27]" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-[#FF4E27]" />;
      case 'enrollment':
        return <GraduationCap className="w-4 h-4 text-[#0F3E2E]" />;
      case 'story_reaction':
        return <Flame className="w-4 h-4 text-[#FF4E27] fill-[#FF4E27]" />;
      case 'story_reply':
        return <Camera className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeStyle = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return 'bg-orange-50 text-[#FF4E27] border-orange-200';
      case 'comment':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'enrollment':
        return 'bg-emerald-50 text-[#0F3E2E] border-emerald-200';
      case 'story_reaction':
        return 'bg-rose-50 text-[#FF4E27] border-rose-200';
      case 'story_reply':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[85vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-orange-100 text-[#FF4E27]">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF4E27] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-lg text-slate-900">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF4E27]">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Interactions sur vos recettes, masterclasses et stories en direct
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onMarkAllAsRead}
                title="Tout marquer comme lu"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tout marquer lu</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Simulator Banner */}
        <div className="px-6 py-2.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulateur d'événements live :</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onSimulateNotification('like')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#FF4E27] text-[11px] font-semibold text-slate-700 hover:text-[#FF4E27] transition-all flex items-center gap-1 shadow-2xs"
            >
              <Heart className="w-3 h-3 fill-[#FF4E27] text-[#FF4E27]" />
              <span>+1 Like</span>
            </button>
            <button
              onClick={() => onSimulateNotification('story_reaction')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#FF4E27] text-[11px] font-semibold text-slate-700 hover:text-[#FF4E27] transition-all flex items-center gap-1 shadow-2xs"
            >
              <Flame className="w-3 h-3 text-[#FF4E27] fill-[#FF4E27]" />
              <span>+1 Réaction Story</span>
            </button>
            <button
              onClick={() => onSimulateNotification('comment')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#FF4E27] text-[11px] font-semibold text-slate-700 hover:text-[#FF4E27] transition-all flex items-center gap-1 shadow-2xs"
            >
              <MessageSquare className="w-3 h-3 text-amber-600" />
              <span>+1 Commentaire</span>
            </button>
            <button
              onClick={() => onSimulateNotification('enrollment')}
              className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 hover:border-emerald-500 text-[11px] font-semibold text-[#0F3E2E] hover:bg-emerald-50 transition-all flex items-center gap-1 shadow-2xs"
            >
              <GraduationCap className="w-3 h-3 text-[#0F3E2E]" />
              <span>+1 Élève</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2 bg-white border-b border-slate-100 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'unread', label: `Non lues (${unreadCount})` },
            { id: 'story', label: '⚡ Stories' },
            { id: 'like', label: '❤️ Likes' },
            { id: 'comment', label: '💬 Commentaires' },
            { id: 'enrollment', label: '🎓 Inscriptions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="ml-auto text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3 h-3" />
              <span>Vider</span>
            </button>
          )}
        </div>

        {/* Notification List Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-black text-base text-slate-900">
                Aucune notification pour le moment
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Utilisez les boutons du simulateur ci-dessus pour tester l'arrivée d'une réaction story, d'un like ou d'un commentaire !
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  onNavigateToTarget(notif);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-start gap-3.5 ${
                  notif.isRead
                    ? 'bg-white border-slate-200 hover:bg-slate-50'
                    : 'bg-orange-50/40 border-orange-200 shadow-2xs ring-1 ring-[#FF4E27]/20'
                }`}
              >
                {/* Actor Avatar with Type Badge overlay */}
                <div className="relative shrink-0">
                  <img
                    src={notif.actorAvatar}
                    alt={notif.actorName}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border shadow-2xs ${getBadgeStyle(notif.type)}`}>
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">
                        {notif.actorName || 'Afrodelicious'}
                      </span>
                      <CulinaryBadgeChip badge={getAuthorCulinaryBadge(notif.actorName || 'Afrodelicious', notif.actorHandle)} size="xs" />
                      {notif.actorHandle && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {notif.actorHandle}
                        </span>
                      )}
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#FF4E27] inline-block shrink-0" />
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {notif.createdAt}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  {/* Revenue badge if enrollment */}
                  {notif.type === 'enrollment' && notif.amountEarned && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-[#0F3E2E] text-[11px] font-bold border border-emerald-200">
                      <DollarSign className="w-3 h-3 text-emerald-600" />
                      <span>+{notif.amountEarned.toFixed(2)} € crédités sur votre compte Chef</span>
                    </div>
                  )}

                  {/* Target item teaser */}
                  {notif.targetTitle && (
                    <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 group-hover:border-[#FF4E27]/40 transition-colors">
                      {notif.targetImage && (
                        <img
                          src={notif.targetImage}
                          alt={notif.targetTitle}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <span className="text-[11px] font-semibold text-slate-800 truncate flex-1">
                        {notif.targetTitle}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF4E27] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>{notifications.length} notification{notifications.length > 1 ? 's' : ''} au total</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-[#FF4E27] text-white text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
