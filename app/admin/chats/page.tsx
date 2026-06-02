'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  Paperclip,
  FileText,
  Loader2,
  Filter,
  ChevronDown,
  Check,
  Settings,
} from 'lucide-react';
import socketService from '@/services/socketService';
import { adminGet } from '@/services/adminService';
import toast from 'react-hot-toast';
import { formatFileSize, parseChatMessage, uploadChatAttachment, type ChatAttachment } from '@/lib/chatMessage';

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
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'active' | 'closed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'guest' | 'member'>('all');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [isSearchingMessages, setIsSearchingMessages] = useState(false);
  const [showRoomListMobile, setShowRoomListMobile] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const chatSettingsRef = useRef<HTMLDivElement>(null);

  const [adminInfo] = useState({
    id: 1,
    name: 'Admin Support',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, [searchTerm, typeFilter, statusFilter]);

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
      if (statusFilter === 'all') {
        params.append('status', 'waiting');
        params.append('status', 'active');
      } else {
        params.append('status', statusFilter);
      }
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
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File tối đa 10MB');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.kind === 'file' && item.type.startsWith('image/'));
    const pastedFile = imageItem?.getAsFile();

    if (!pastedFile) return;

    e.preventDefault();

    if (pastedFile.size > 10 * 1024 * 1024) {
      toast.error('Ảnh tối đa 10MB');
      return;
    }

    const ext = pastedFile.type.split('/')[1] || 'png';
    const file = new File([pastedFile], `anh-dan-tu-clipboard-${Date.now()}.${ext}`, {
      type: pastedFile.type || 'image/png',
    });

    setSelectedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Đã dán ảnh vào tin nhắn');
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !selectedFile) || !selectedRoom || uploadingAttachment || isSearchingMessages) return;

    try {
      let attachment: ChatAttachment | undefined;

      if (selectedFile) {
        setUploadingAttachment(true);
        attachment = await uploadChatAttachment(selectedFile);
      }

      socketService.emit('message:send', {
        roomId: selectedRoom.id,
        message: inputMessage.trim(),
        attachment,
        senderType: 'admin',
        senderId: String(adminInfo.id),
        senderName: adminInfo.name,
      });

      setInputMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể gửi file');
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleCloseRoom = () => {
    if (!selectedRoom) return;

    socketService.emit('admin:close-room', {
      roomId: selectedRoom.id,
    });

    setSelectedRoom(null);
    setMessages([]);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const renderAttachment = (attachment: ChatAttachment, isOwnMessage: boolean) => {
    if (attachment.kind === 'image') {
      return (
        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="mt-2 block overflow-hidden rounded-xl">
          <img src={attachment.url} alt={attachment.name} className="max-h-64 w-full object-cover" />
        </a>
      );
    }

    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 flex items-center gap-2 rounded-xl border p-2 transition ${isOwnMessage
          ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
          : 'border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
      >
        <FileText size={18} className="shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-bold">{attachment.name}</span>
          <span className={`text-[10px] ${isOwnMessage ? 'text-white/70' : 'text-gray-400'}`}>{formatFileSize(attachment.size)}</span>
        </span>
      </a>
    );
  };

  return (
    <div className="flex h-[calc(100vh-5.5rem)] min-h-[560px] min-w-0 flex-col gap-3 overflow-hidden bg-[#f7f8fb] font-[var(--font-geist-sans)] md:h-[calc(100vh-3rem)] lg:flex-row">
      <div
        className={`${selectedRoom && !showRoomListMobile ? 'hidden' : 'flex'} h-full min-h-0 w-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.07)] lg:flex lg:w-[360px] lg:shrink-0`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:-translate-x-0.5 hover:text-stone-900"
              aria-label="Quay lại dashboard"
              title="Quay lại dashboard"
            >
              <ArrowLeft size={17} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Chat hỗ trợ</p>
              <h2 className="text-sm font-semibold tracking-tight text-slate-950">Hội thoại</h2>
            </div>
          </div>
          <span className="rounded-full bg-stone-900 px-3 py-1 text-[10px] font-semibold text-white shadow-sm shadow-stone-200">
            {rooms.length} Hội thoại
          </span>
        </div>

        <div className="shrink-0 space-y-3 border-b border-slate-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-chat-search-room"
                type="text"
                placeholder="Tìm tên, email..."
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative" ref={statusDropdownRef}>
              <button
                id="admin-chat-status-filter-btn"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-xs font-bold transition-all ${
                  statusFilter !== 'all'
                    ? 'border-primary-200 bg-primary-50 text-primary-700'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white'
                }`}
              >
                <Filter size={14} />
                <span className="hidden sm:inline">
                  {statusFilter === 'all' ? 'Trạng thái' : statusFilter === 'waiting' ? 'Chờ' : statusFilter === 'active' ? 'Hỗ trợ' : 'Đã đóng'}
                </span>
                <ChevronDown size={14} className={`transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showStatusDropdown && (
                <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
                  {[
                    { value: 'all', label: 'Tất cả trạng thái', color: 'text-slate-600' },
                    { value: 'waiting', label: 'Đang chờ', color: 'text-yellow-600', dot: 'bg-yellow-400' },
                    { value: 'active', label: 'Đang hỗ trợ', color: 'text-green-600', dot: 'bg-green-400' },
                    { value: 'closed', label: 'Đã đóng', color: 'text-gray-500', dot: 'bg-gray-400' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      id={`admin-chat-status-${opt.value}`}
                      onClick={() => {
                        setStatusFilter(opt.value as typeof statusFilter);
                        setShowStatusDropdown(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-all hover:bg-slate-50 ${
                        statusFilter === opt.value ? 'bg-primary-50/50' : ''
                      }`}
                    >
                      {opt.dot && <span className={`h-2 w-2 rounded-full ${opt.dot}`} />}
                      {!opt.dot && <span className="h-2 w-2" />}
                      <span className={`flex-1 ${opt.color}`}>{opt.label}</span>
                      {statusFilter === opt.value && <Check size={14} className="text-primary-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex rounded-2xl border border-slate-100 bg-slate-50 p-1">
            {(['all', 'guest', 'member'] as const).map((f) => (
              <button
                id={`admin-chat-filter-${f}`}
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`flex-1 rounded-xl py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all ${typeFilter === f ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {f === 'all' ? 'Tất cả' : f === 'guest' ? 'Khách' : 'Thành viên'}
              </button>
            ))}
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 py-12 text-center text-sm text-slate-400">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
              <MessageCircle size={32} className="opacity-20" />
            </div>
            <p className="font-bold text-slate-600">Không tìm thấy hội thoại</p>
            <p className="mt-1 text-[11px]">Vui lòng thử điều chỉnh bộ lọc</p>
          </div>
        ) : (
          <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fb] px-3 py-4">
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
                    className={`group relative w-full overflow-hidden rounded-2xl border px-3.5 py-3 text-left transition-all active:scale-[0.985] ${isActive
                        ? 'border-slate-300 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.10)] ring-1 ring-slate-200'
                        : 'border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={`max-w-[210px] truncate text-sm font-semibold tracking-tight ${isActive ? 'text-stone-950' : 'text-slate-900'}`}>
                          {room.userName}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">
                            {room.userType === 'member' ? 'Thành viên' : 'Khách'}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">Mã #{room.userId.substring(0, 8)}</span>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] ${getStatusBadge(room.status)}`}
                      >
                        {room.status === 'waiting' ? 'Đang chờ' : room.status === 'active' ? 'Đang hỗ trợ' : 'Đã đóng'}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 group-hover:border-stone-200">
                      <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] ${pInfo.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${pInfo.dot}`} />
                        {pInfo.label}
                      </div>
                      {room.lastMessageAt && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
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
        className={`${!selectedRoom && showRoomListMobile ? 'hidden lg:flex' : 'flex'} h-full min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.07)]`}
      >
        {!selectedRoom ? (
          <div className="flex min-h-0 flex-1 items-center justify-center bg-[#f7f8fb] px-6 text-slate-400">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] border border-stone-200 bg-white shadow-[0_18px_44px_rgba(68,64,60,0.10)]">
                <MessageCircle size={48} className="text-stone-300" />
              </div>
              <h3 className="mb-2 text-xl font-semibold tracking-tight text-slate-950">Chọn hội thoại để bắt đầu</h3>
              <p className="mx-auto max-w-[320px] text-xs font-medium leading-5 text-slate-500">
                Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu hỗ trợ khách hàng.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative z-30 shrink-0 overflow-visible border-b border-slate-200 bg-white px-3 py-3 sm:px-4 lg:px-5">
              <div className="mb-3 flex items-center justify-between gap-2 lg:hidden">
                <button
                  id="admin-chat-back-rooms"
                  onClick={() => setShowRoomListMobile(true)}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 shadow-sm"
                >
                  <ArrowLeft size={14} /> Hội thoại
                </button>
                <button
                  id="admin-chat-close-mobile"
                  onClick={handleCloseRoom}
                  className="rounded-2xl border border-red-100 bg-white p-2.5 text-red-500 shadow-sm"
                  title="Kết thúc tư vấn"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 flex items-center gap-3">
                  <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-base font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.14)] ${selectedRoom.userType === 'member' ? 'from-indigo-500 to-primary-700' : 'from-slate-500 to-slate-700'
                      }`}
                  >
                    {selectedRoom.userName.charAt(0).toUpperCase()}
                    <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">{selectedRoom.userName}</h3>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${selectedRoom.userType === 'member'
                          ? 'border-indigo-100 bg-indigo-50 text-indigo-600'
                          : 'border-slate-200 bg-white text-slate-600'
                          }`}
                      >
                        {selectedRoom.userType === 'member' ? 'Thành viên' : 'Khách'}
                      </span>
                    </div>
                    <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-500">
                      <span className="truncate text-primary-700">{selectedRoom.userEmail || `Mã định danh: ${selectedRoom.userId}`}</span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <History size={12} />
                        {selectedRoom.lastMessageAt ? new Date(selectedRoom.lastMessageAt).toLocaleTimeString('vi-VN') : 'Mới'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end" ref={chatSettingsRef}>
                  <div className="relative">
                    <button
                      type="button"
                      id="admin-chat-settings-btn"
                      onClick={() => setShowChatSettings((prev) => !prev)}
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 ${showChatSettings ? 'border-primary-200 bg-primary-50 text-primary-700 ring-4 ring-primary-100' : 'border-slate-200/80 bg-white'}`}
                      title="Thiết lập hội thoại"
                      aria-label="Thiết lập hội thoại"
                      aria-expanded={showChatSettings}
                    >
                      <Settings size={18} />
                    </button>

                    {showChatSettings && (
                      <div className="absolute right-0 top-full z-50 mt-3 w-[320px] overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                        <div className="border-b border-slate-100 px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Thiết lập</p>
                          <p className="mt-1 text-sm font-bold text-slate-900">Tìm kiếm và mức ưu tiên</p>
                        </div>

                        <div className="space-y-4 p-4">
                          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition-all focus-within:border-primary-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-100">
                            <SearchIcon size={15} className="mr-2 text-primary-500" />
                            <input
                              id="admin-chat-search-message"
                              type="text"
                              placeholder="Tìm trong hội thoại..."
                              className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                              value={messageSearchTerm}
                              onChange={(e) => setMessageSearchTerm(e.target.value)}
                            />
                            {messageSearchTerm && (
                              <button onClick={() => setMessageSearchTerm('')} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                                <X size={12} />
                              </button>
                            )}
                          </div>

                          <div>
                            <p className="mb-2 text-[11px] font-semibold text-slate-500">Mức ưu tiên</p>
                            <div className="grid grid-cols-2 gap-2">
                              {(['low', 'normal', 'high', 'urgent'] as const).map((p) => {
                                const info = getPriorityInfo(p);
                                const isActive = (selectedRoom.priority || 'normal') === p;
                                return (
                                  <button
                                    id={`admin-chat-priority-${p}`}
                                    key={p}
                                    onClick={() => {
                                      handleUpdatePriority(selectedRoom.id, p);
                                      setShowChatSettings(false);
                                    }}
                                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-[11px] font-semibold transition-all ${isActive ? `${info.color} border-transparent shadow-sm` : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800'}`}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className={`h-2 w-2 rounded-full ${info.dot}`} />
                                      {info.label}
                                    </span>
                                    {isActive && <Check size={13} />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            id="admin-chat-close-desktop"
                            onClick={() => {
                              setShowChatSettings(false);
                              handleCloseRoom();
                            }}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 text-sm font-bold text-red-600 transition-all hover:border-red-200 hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                            Kết thúc tư vấn
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="custom-scrollbar relative min-h-0 flex-1 space-y-5 overflow-y-auto bg-[#f7f8fb] p-4 sm:p-5 lg:p-6">
              {isSearchingMessages && (
                <div className="sticky top-0 z-20 mb-3 flex justify-center">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-semibold text-slate-600 shadow-sm">
                    <SearchIcon size={12} />
                    Đang tìm: "{messageSearchTerm}" ({messages.length})
                  </div>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="mt-16 text-center text-sm text-slate-400">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/70 shadow-sm grayscale">
                    <AlertCircle size={30} />
                  </div>
                  <p className="font-bold">
                    {isSearchingMessages ? 'Không tìm thấy tin nhắn trùng khớp' : 'Chưa có dữ liệu hội thoại'}
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isSystem = msg.senderName === 'System';
                  const parsedMessage = parseChatMessage(msg.message);
                  if (isSystem) {
                    return (
                      <div key={idx} className="my-3 flex justify-center animate-in fade-in zoom-in-95">
                        <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500 shadow-sm backdrop-blur-sm">
                          {parsedMessage.text}
                        </span>
                      </div>
                    );
                  }

                  const isOwnMessage = msg.senderType === 'admin';

                  return (
                    <div key={idx} className={`group flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[94%] flex-col sm:max-w-[80%] lg:max-w-[68%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                        <div className={`mb-1 flex items-center gap-2 px-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold shadow-sm ${isOwnMessage ? 'bg-primary-600 text-white' : 'bg-white text-slate-600'}`}>
                            {isOwnMessage ? 'AD' : msg.senderName.charAt(0).toUpperCase()}
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            {isOwnMessage ? 'Admin hỗ trợ' : msg.senderName}
                          </span>
                        </div>
                        <div
                          className={`relative rounded-[26px] px-5 py-3.5 text-[15px] leading-7 shadow-sm ring-1 ring-inset ${isOwnMessage
                              ? 'rounded-tr-md bg-gradient-to-br from-primary-600 via-blue-700 to-blue-800 text-white shadow-[0_16px_38px_rgba(37,99,235,0.30)] ring-white/15'
                              : 'rounded-tl-md bg-white/96 text-slate-900 shadow-[0_16px_38px_rgba(15,23,42,0.09)] ring-slate-200/80'
                            }`}
                        >
                          {parsedMessage.text && <p className="whitespace-pre-wrap font-semibold tracking-[-0.01em]">{parsedMessage.text}</p>}
                          {parsedMessage.attachment && renderAttachment(parsedMessage.attachment, isOwnMessage)}
                          {isSearchingMessages && (
                            <div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-primary-400" />
                          )}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 px-2">
                          {msg.senderType === 'admin' && (
                            <span className="text-[9px] font-semibold uppercase text-slate-500">Đã gửi</span>
                          )}
                          {msg.createdAt && (
                            <p className="text-[9px] font-semibold uppercase tracking-tight text-slate-500">
                              {new Date(msg.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} · {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
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

            <div className="shrink-0 border-t border-slate-200/80 bg-white/95 p-3 shadow-[0_-20px_55px_rgba(15,23,42,0.08)] backdrop-blur sm:p-4">
              {selectedFile && (
                <div className="mb-2 flex items-center gap-2 rounded-2xl border border-primary-100 bg-primary-50/60 px-3 py-2 text-xs text-slate-600">
                  <FileText size={15} className="shrink-0 text-primary-600" />
                  <span className="min-w-0 flex-1 truncate font-semibold">{selectedFile.name}</span>
                  <span className="text-slate-400">{formatFileSize(selectedFile.size)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="rounded-full p-1 hover:bg-primary-100"
                    aria-label="Bỏ file đã chọn"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
              <div className="group flex items-end gap-3 rounded-[24px] border border-stone-200/90 bg-white p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_14px_38px_rgba(15,23,42,0.08)] transition-all focus-within:border-primary-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-50">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedRoom || isSearchingMessages || uploadingAttachment}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-30"
                  title="Đính kèm ảnh hoặc file"
                >
                  <Paperclip size={18} />
                </button>
                <textarea
                  id="admin-chat-input"
                  placeholder={isSearchingMessages ? 'Hãy thoát tìm kiếm để tiếp tục trả lời...' : 'Nhập nội dung tư vấn và nhấn Enter...'}
                  rows={1}
                  disabled={isSearchingMessages || uploadingAttachment}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onPaste={handlePaste}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[42px] max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-[15px] font-medium leading-6 text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  id="admin-chat-send"
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && !selectedFile) || isSearchingMessages || uploadingAttachment}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-blue-700 text-white shadow-lg shadow-primary-200 transition-all hover:-translate-y-0.5 active:scale-90 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-20"
                >
                  {uploadingAttachment ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="ml-0.5" />}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between px-1">
                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400">Shift + Enter xuống dòng · Ctrl + V để dán ảnh</p>
                {isSearchingMessages && (
                  <button
                    id="admin-chat-exit-search"
                    onClick={() => setMessageSearchTerm('')}
                    className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600 hover:underline"
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
