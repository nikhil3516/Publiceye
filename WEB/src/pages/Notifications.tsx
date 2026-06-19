import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Check, Clock, AlertCircle, Users, ChevronRight, Trash2, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1, type: 'status',
    title: 'Complaint Status Updated',
    message: 'Your complaint #PE-892341 has been assigned to Sanitary Inspector Rajesh Kumar.',
    time: '2 hours ago', unread: true, icon: Clock, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    link: '/home/complaints/PE-892341',
  },
  {
    id: 2, type: 'success',
    title: '🎉 Issue Resolved!',
    message: 'Great news! The streetlight issue in Ward 4 (#PE-765219) has been resolved. Please verify.',
    time: 'Yesterday', unread: true, icon: Check, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    link: '/home/complaints/PE-765219',
  },
  {
    id: 3, type: 'escalation',
    title: '🚨 Complaint Escalated',
    message: 'Complaint #PE-543876 (Giant Pothole — Ward 3) has been auto-escalated to Deputy Commissioner due to SLA breach.',
    time: '1 day ago', unread: true, icon: AlertCircle, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    link: '/home/complaints/PE-543876',
  },
  {
    id: 4, type: 'points',
    title: '⚡ XP Points Earned',
    message: 'You earned +10 XP for submitting a high severity complaint. Keep up the great civic work!',
    time: '2 days ago', unread: false, icon: Bell, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    link: '/home/rewards',
  },
  {
    id: 5, type: 'community',
    title: '🌳 Community Event',
    message: 'Join the tree plantation drive this Sunday at 8 AM in Central Park, Ward 5. Over 200 citizens participating!',
    time: '3 days ago', unread: false, icon: Users, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    link: '/home',
  },
];

export function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const dismiss = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification dismissed');
  };

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 pb-28 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Inbox
            {unreadCount > 0 && (
              <span className="ml-3 text-sm bg-teal-600 text-white px-2.5 py-1 rounded-full font-black">{unreadCount}</span>
            )}
          </h2>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Updates from your city</p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={markAllRead}
            className="text-teal-600 dark:text-teal-400 font-black text-xs hover:bg-teal-50 dark:hover:bg-teal-900/20 px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        )}
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-28">
            <div className="w-24 h-24 bg-white dark:bg-slate-800 shadow-2xl rounded-[2.5rem] flex items-center justify-center mb-6 relative">
              <Bell className="w-10 h-10 text-slate-200 dark:text-slate-600" />
              <div className="absolute top-0 right-0 w-4 h-4 bg-teal-500 rounded-full border-4 border-white dark:border-slate-900" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">All caught up!</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs">No notifications at the moment.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => { markRead(notif.id); navigate(notif.link); }}
              className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer flex gap-4 group hover:shadow-xl hover:-translate-y-0.5 ${
                notif.unread
                  ? 'bg-white dark:bg-slate-800 border-teal-100 dark:border-teal-900/50 shadow-md shadow-teal-100/20 dark:shadow-none'
                  : 'bg-white dark:bg-slate-800 border-transparent shadow-sm opacity-80 hover:opacity-100'
              }`}
            >
              {/* Icon */}
              <div className={`w-13 h-13 min-w-[52px] min-h-[52px] w-[52px] h-[52px] rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${notif.color}`}>
                <notif.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h4 className={`text-base font-black tracking-tight leading-tight ${notif.unread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {notif.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{notif.time}</span>
                    {notif.unread && <div className="w-2.5 h-2.5 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.6)] animate-pulse" />}
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{notif.message}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={e => dismiss(notif.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 text-slate-300 hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
