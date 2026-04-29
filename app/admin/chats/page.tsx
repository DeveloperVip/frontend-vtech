'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  Users,
  Search,
  History,
  Trash2,
  AlertCircle,
  Search as SearchIcon,
  Clock,
  X,
  ArrowLeft,
} from 'lucide-react';
import socketService from '@/services/socketService';
import { adminGet } from '@/services/adminService';
import toast from 'react-hot-toast';

interface Message {
  id?: number;
  senderType: 'user' | 'admin';
  senderName: string;
  message: string;
  createdAt?: string;
}

interface Room {
  id: number;
  userId: string;
  userName: string;
  userEmail?: string;
  userType?: 'guest' | 'member';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  status: 'waiting' | 'active' | 'closed';
  lastMessageAt?: string;
  admin?: { id: number; name: string };
}

export default function AdminChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'guest' | 'member'>('all');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [isSearchingMessages, setIsSearchingMessages] = useState(false);
  const [showRoomListMobile, setShowRoomListMobile] = useState(true);

  const [adminInfo] = useState({
    id: 1,
    name: 'Admin Support',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketService.connect();

    socketService.emit('admin:join', {
      adminId: adminInfo.id,
      adminName: adminInfo.name,
    });

    socketService.on('admin:rooms-list', () => {
      loadRooms();
    });

    socketService.on('admin:new-user-waiting', () => {
      loadRooms();
    });

    socketService.on('message:received', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketService.on('admin:new-message', () => {
      loadRooms();
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    loadRooms();
  }, [searchTerm, typeFilter]);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id, messageSearchTerm);
    }
  }, [messageSearchTerm, selectedRoom?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowRoomListMobile(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadRooms = async () => {
    try {
      const params = new URLSearchParams();
      params.append('status', 'waiting');
      params.append('status', 'active');
      if (searchTerm) params.append('q', searchTerm);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const res = await adminGet(`/chat/rooms?${params.toString()}`);
      setRooms(res.data || []);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const loadMessages = async (roomId: number, keyword?: string) => {
    try {
      setIsSearchingMessages(!!keyword);
      const url = `/chat/rooms/${roomId}/messages${keyword ? `?q=${keyword}` : ''}`;
      const res = await adminGet(url);
      setMessages(res.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handlePickRoom = async (room: Room) => {
    setSelectedRoom(room);
    setMessageSearchTerm('');

    socketService.emit('admin:pick-room', {
      roomId: room.id,
      adminId: adminInfo.id,
      adminName: adminInfo.name,
    });

    loadMessages(room.id);

    socketService.emit('message:mark-read', {
      roomId: room.id,
      userType: 'admin',
    });

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowRoomListMobile(false);
    }
  };

  const handleUpdatePriority = async (roomId: number, priority: 'low' | 'normal' | 'high' | 'urgent') => {
    try {
      const { adminPatch } = await import('@/services/adminService');
      await adminPatch(`/chat/rooms/${roomId}/meta`, { priority });

      setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, priority } : r)));
      if (selectedRoom?.id === roomId) {
        setSelectedRoom((prev) => (prev ? { ...prev, priority } : null));
      }
      toast.success('Đã cập nhật mức ưu tiên');
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedRoom) return;

    socketService.emit('message:send', {
      roomId: selectedRoom.id,
      message: inputMessage.trim(),
      senderType: 'admin',
      senderId: String(adminInfo.id),
      senderName: adminInfo.name,
    });

    setInputMessage('');
    if (isSearchingMessages) {
      setMessageSearchTerm('');
    }
  };

  const handleCloseRoom = () => {
    if (!selectedRoom) return;

    socketService.emit('admin:close-room', {
      roomId: selectedRoom.id,
    });

    setSelectedRoom(null);
    setMessages([]);
    loadRooms();
    setShowRoomListMobile(true);
    toast.success('Đã đóng cuộc hội thoại');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      waiting: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-600',
    };
    return styles[status as keyof typeof styles] || styles.closed;
  };

  const getPriorityInfo = (priority: string = 'normal') => {
    const map = {
      low: { label: 'Chưa gấp', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
      normal: { label: 'Bình thường', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-400' },
      high: { label: 'Ưu tiên', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-400' },
      urgent: { label: 'GẤP', color: 'bg-red-50 text-red-600 font-bold animate-pulse', dot: 'bg-red-500' },
    };
    return map[priority as keyof typeof map] || map.normal;
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col gap-3 lg:flex-row lg:gap-4">
      <div
        className={`${selectedRoom && !showRoomListMobile ? 'hidden' : 'flex'} w-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:flex lg:w-80`}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-primary-700" />
            <h2 className="text-sm font-bold tracking-tight text-gray-900">Hỗ trợ khách hàng</h2>
          </div>
          <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-700">
            {rooms.length} Hội thoại
          </span>
        </div>

        <div className="mb-4 shrink-0 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="admin-chat-search-room"
              type="text"
              placeholder="Tìm tên, email..."
              className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex rounded-lg border border-gray-100 bg-gray-50 p-1">
            {(['all', 'guest', 'member'] as const).map((f) => (
              <button
                id={`admin-chat-filter-${f}`}
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`flex-1 rounded-md py-1.5 text-[10px] font-bold transition-all ${typeFilter === f ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {f === 'all' ? 'Tất cả' : f === 'guest' ? 'Khách' : 'Thành viên'}
              </button>
            ))}
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-12 text-center text-sm text-gray-400">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-gray-200 bg-gray-50">
              <MessageCircle size={32} className="opacity-20" />
            </div>
            <p className="font-medium">Không tìm thấy hội thoại</p>
            <p className="mt-1 text-[11px]">Vui lòng thử điều chỉnh bộ lọc</p>
          </div>
        ) : (
          <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
            {rooms
              .sort((a, b) => {
                const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
                return (priorityOrder[a.priority || 'normal'] || 2) - (priorityOrder[b.priority || 'normal'] || 2);
              })
              .map((room) => {
                const pInfo = getPriorityInfo(room.priority);
                const isActive = selectedRoom?.id === room.id;

                return (
                  <button
                    id={`admin-chat-room-${room.id}`}
                    key={room.id}
                    onClick={() => handlePickRoom(room)}
                    className={`group relative w-full rounded-xl border p-3.5 text-left transition-all active:scale-[0.98] ${isActive
                        ? 'bg-primary-50 ring-1 ring-primary-600 border-primary-600 shadow-md'
                        : 'border-gray-50 bg-white hover:border-primary-100 hover:bg-gray-50/50'
                      }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <p className={`max-w-[140px] truncate text-sm font-bold ${isActive ? 'text-primary-900' : 'text-gray-900'}`}>
                            {room.userName}
                          </p>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tighter ${room.userType === 'member' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                            {room.userType === 'member' ? 'ME' : 'GS'}
                          </span>
                        </div>
                        <p className="max-w-[160px] truncate text-[10px] italic text-gray-400">#{room.userId.substring(0, 8)}</p>
                      </div>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${getStatusBadge(room.status)}`}
                      >
                        {room.status === 'waiting' ? 'Chờ' : 'Hỗ trợ'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 group-hover:border-primary-100">
                      <div className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${pInfo.color}`}>
                        <span className={`h-1 w-1 rounded-full ${pInfo.dot}`} />
                        {pInfo.label}
                      </div>
                      {room.lastMessageAt && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock size={10} />
                          {new Date(room.lastMessageAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      <div
        className={`${!selectedRoom && showRoomListMobile ? 'hidden lg:flex' : 'flex'} min-h-[360px] flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm`}
      >
        {!selectedRoom ? (
          <div className="flex flex-1 items-center justify-center bg-gray-50/30 text-gray-400">
            <div className="animate-pulse text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-50 bg-white shadow-sm">
                <MessageCircle size={48} className="text-primary-100" />
              </div>
              <h3 className="mb-2 text-xl font-extrabold tracking-tight text-gray-900">Hệ thống Support VITECHS</h3>
              <p className="max-w-[280px] text-sm">Chọn một cuộc trò chuyện từ danh sách để bắt đầu hỗ trợ khách hàng</p>
            </div>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10 border-b bg-white px-3 py-3 sm:px-4 lg:px-6">
              <div className="mb-3 flex items-center justify-between gap-2 lg:hidden">
                <button
                  id="admin-chat-back-rooms"
                  onClick={() => setShowRoomListMobile(true)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700"
                >
                  <ArrowLeft size={14} /> Hội thoại
                </button>
                <button
                  id="admin-chat-close-mobile"
                  onClick={handleCloseRoom}
                  className="rounded-lg bg-red-50 p-2 text-red-600"
                  title="Kết thúc tư vấn"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-base font-black text-white shadow-lg ${selectedRoom.userType === 'member' ? 'from-indigo-500 to-primary-700' : 'from-gray-400 to-gray-600'
                      }`}
                  >
                    {selectedRoom.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-black tracking-tight text-gray-900 sm:text-lg">{selectedRoom.userName}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${selectedRoom.userType === 'member'
                            ? 'border border-indigo-100 bg-indigo-50 text-indigo-600'
                            : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {selectedRoom.userType === 'member' ? 'Thành viên' : 'Khách'}
                      </span>
                    </div>
                    <p className="truncate text-xs font-medium text-primary-600">
                      {selectedRoom.userEmail || `Mã định danh: ${selectedRoom.userId}`}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                      <History size={11} />
                      {selectedRoom.lastMessageAt ? new Date(selectedRoom.lastMessageAt).toLocaleTimeString('vi-VN') : 'Mới'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 focus-within:border-primary-200 focus-within:bg-white transition-all">
                    <SearchIcon size={14} className="mr-2 text-gray-400" />
                    <input
                      id="admin-chat-search-message"
                      type="text"
                      placeholder="Tìm tin nhắn..."
                      className="w-28 bg-transparent text-xs outline-none focus:w-44 transition-all"
                      value={messageSearchTerm}
                      onChange={(e) => setMessageSearchTerm(e.target.value)}
                    />
                    {messageSearchTerm && (
                      <button onClick={() => setMessageSearchTerm('')} className="rounded-full p-1 hover:bg-gray-200">
                        <X size={10} className="text-gray-500" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center rounded-xl border border-gray-100 bg-gray-50 p-1">
                    {(['low', 'normal', 'high', 'urgent'] as const).map((p) => {
                      const info = getPriorityInfo(p);
                      const isActive = (selectedRoom.priority || 'normal') === p;
                      return (
                        <button
                          id={`admin-chat-priority-${p}`}
                          key={p}
                          onClick={() => handleUpdatePriority(selectedRoom.id, p)}
                          className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-tight transition-all ${isActive ? `${info.color} ring-1 ring-white shadow` : 'text-gray-400 hover:bg-white hover:text-gray-600'
                            }`}
                        >
                          {info.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    id="admin-chat-close-desktop"
                    onClick={handleCloseRoom}
                    className="hidden rounded-xl bg-red-50 p-2.5 text-red-600 transition-all hover:bg-red-600 hover:text-white lg:block"
                    title="Kết thúc tư vấn"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="custom-scrollbar relative flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-3 sm:p-4 lg:p-6">
              {isSearchingMessages && (
                <div className="sticky top-0 z-20 mb-3 flex justify-center">
                  <div className="flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-primary-600 shadow-sm backdrop-blur">
                    <SearchIcon size={12} />
                    Đang tìm: "{messageSearchTerm}" ({messages.length})
                  </div>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="mt-16 text-center text-sm text-gray-400">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/50 grayscale">
                    <AlertCircle size={30} />
                  </div>
                  <p className="font-medium">
                    {isSearchingMessages ? 'Không tìm thấy tin nhắn trùng khớp' : 'Chưa có dữ liệu hội thoại'}
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isSystem = msg.senderName === 'System';
                  if (isSystem) {
                    return (
                      <div key={idx} className="my-3 flex justify-center animate-in fade-in zoom-in-95">
                        <span className="rounded-full bg-gray-200/50 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 backdrop-blur-sm">
                          {msg.message}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className={`group flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[88%] flex-col sm:max-w-[78%] lg:max-w-[70%] ${msg.senderType === 'admin' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`relative whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.senderType === 'admin'
                              ? 'rounded-tr-none bg-primary-600 text-white'
                              : 'rounded-tl-none border border-gray-100 bg-white text-gray-800 ring-1 ring-gray-50'
                            }`}
                        >
                          {msg.message}
                          {isSearchingMessages && (
                            <div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-primary-400" />
                          )}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 px-2">
                          {msg.senderType === 'admin' && (
                            <span className="text-[9px] font-black uppercase text-primary-400">Đã gửi</span>
                          )}
                          {msg.createdAt && (
                            <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                              {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-100 bg-white p-3 sm:p-4">
              <div className="group flex items-end gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-2.5 transition-all focus-within:border-primary-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-50">
                <textarea
                  id="admin-chat-input"
                  placeholder={isSearchingMessages ? 'Hãy thoát tìm kiếm để tiếp tục trả lời...' : 'Nhập nội dung tư vấn và nhấn Enter...'}
                  rows={1}
                  disabled={isSearchingMessages}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[42px] max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none"
                />
                <button
                  id="admin-chat-send"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isSearchingMessages}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-200 transition-all active:scale-90 disabled:cursor-not-allowed disabled:opacity-20"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between px-1">
                <p className="text-[10px] font-bold uppercase text-gray-400">Nhấn Shift + Enter để xuống dòng</p>
                {isSearchingMessages && (
                  <button
                    id="admin-chat-exit-search"
                    onClick={() => setMessageSearchTerm('')}
                    className="text-[10px] font-black uppercase text-primary-600 hover:underline"
                  >
                    Thoát tìm kiếm
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
