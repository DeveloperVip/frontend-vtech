'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users, Search, Filter, History, Trash2, CheckCircle2, AlertCircle, Search as SearchIcon, Clock, X } from 'lucide-react';
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
  
  const [adminInfo] = useState({
    id: 1,
    name: 'Admin Support',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect socket
    socketService.connect();

    // Join as admin
    socketService.emit('admin:join', {
      adminId: adminInfo.id,
      adminName: adminInfo.name,
    });

    // Listen for events
    socketService.on('admin:rooms-list', (data: Room[]) => {
      // Refresh rooms based on current filters 
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

  // Update rooms list when filters change
  useEffect(() => {
    loadRooms();
  }, [searchTerm, typeFilter]);

  // Update messages when keyword search changes
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id, messageSearchTerm);
    }
  }, [messageSearchTerm, selectedRoom?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRooms = async () => {
    try {
      const params = new URLSearchParams();
      params.append('status', 'waiting');
      params.append('status', 'active');
      if (searchTerm) params.append('q', searchTerm);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      
      const res = await adminGet(`/chat/rooms?${params.toString()}`);
      setRooms(res.data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const loadMessages = async (roomId: number, keyword?: string) => {
    try {
      setIsSearchingMessages(!!keyword);
      const url = `/chat/rooms/${roomId}/messages${keyword ? `?q=${keyword}` : ''}`;
      const res = await adminGet(url);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handlePickRoom = async (room: Room) => {
    setSelectedRoom(room);
    setMessageSearchTerm(''); // Reset message search

    // Emit pick room
    socketService.emit('admin:pick-room', {
      roomId: room.id,
      adminId: adminInfo.id,
      adminName: adminInfo.name,
    });

    // Initial load
    loadMessages(room.id);

    // Mark as read
    socketService.emit('message:mark-read', {
      roomId: room.id,
      userType: 'admin',
    });
  };

  const handleUpdatePriority = async (roomId: number, priority: string) => {
    try {
      const { adminPatch } = await import('@/services/adminService');
      // @ts-ignore
      await adminPatch(`/chat/rooms/${roomId}/meta`, { priority });
      
      // Update local state
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, priority: priority as any } : r));
      if (selectedRoom?.id === roomId) {
        setSelectedRoom(prev => prev ? { ...prev, priority: priority as any } : null);
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
        setMessageSearchTerm(''); // Nếu đang search mà gửi thì clear search để hiện hết
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
    <div className="flex h-[calc(100vh-120px)] gap-4 animate-in fade-in duration-500">
      {/* Rooms List */}
      <div className="w-80 bg-white rounded-2xl border border-gray-200 p-4 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-primary-700" />
            <h2 className="font-bold text-gray-900 tracking-tight text-sm">Hỗ trợ khách hàng</h2>
          </div>
          <span className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-bold">
            {rooms.length} Hội thoại
          </span>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3 mb-6 shrink-0">
          <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
                type="text" 
                placeholder="Tìm tên, email..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-gray-100 border rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex p-1 bg-gray-50 rounded-lg border border-gray-100">
            {(['all', 'guest', 'member'] as const).map(f => (
                <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                        typeFilter === f 
                        ? 'bg-white text-primary-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {f === 'all' ? 'Tất cả' : f === 'guest' ? 'Khách' : 'Thành viên'}
                </button>
            ))}
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-16 flex-1">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
               <MessageCircle size={32} className="opacity-20" />
            </div>
            <p className="font-medium">Không tìm thấy hội thoại</p>
            <p className="text-[11px] mt-1">Vui lòng thử điều chỉnh bộ lọc</p>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {rooms.sort((a,b) => {
               const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
               return (priorityOrder[a.priority||'normal'] || 2) - (priorityOrder[b.priority||'normal'] || 2);
            }).map((room) => {
              const pInfo = getPriorityInfo(room.priority);
              const isActive = selectedRoom?.id === room.id;
              
              return (
                <button
                  key={room.id}
                  onClick={() => handlePickRoom(room)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all relative group active:scale-[0.98] ${
                    isActive
                      ? 'border-primary-600 bg-primary-50 shadow-md ring-1 ring-primary-600'
                      : 'border-gray-50 hover:border-primary-100 bg-white hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold text-sm truncate max-w-[120px] ${isActive ? 'text-primary-900' : 'text-gray-900'}`}>
                            {room.userName}
                        </p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter ${
                          room.userType === 'member' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {room.userType === 'member' ? 'ME' : 'GS'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate max-w-[140px] italic">#{room.userId.substring(0,8)}</p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${getStatusBadge(room.status)}`}>
                      {room.status === 'waiting' ? 'Chờ' : 'Hỗ trợ'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 group-hover:border-primary-100">
                    <div className={`text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1.5 font-bold uppercase ${pInfo.color}`}>
                      <span className={`w-1 h-1 rounded-full ${pInfo.dot}`} />
                      {pInfo.label}
                    </div>
                    {room.lastMessageAt && (
                      <div className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(room.lastMessageAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col shadow-sm overflow-hidden">
        {!selectedRoom ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50/30">
            <div className="text-center animate-pulse">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-50">
                <MessageCircle size={48} className="text-primary-100" />
              </div>
              <h3 className="text-gray-900 font-extrabold text-xl tracking-tight mb-2">Hệ thống Support VITECHS</h3>
              <p className="text-sm max-w-[280px]">Chọn một cuộc trò chuyện từ danh sách để bắt đầu quy trình hỗ trợ khách hàng</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b px-8 py-5 flex items-center justify-between bg-white backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transform rotate-3 transition-transform hover:rotate-0 ${
                   selectedRoom.userType === 'member' ? 'bg-gradient-to-br from-indigo-500 to-primary-700' : 'bg-gradient-to-br from-gray-400 to-gray-600'
                }`}>
                  {selectedRoom.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-lg text-gray-900 tracking-tight">{selectedRoom.userName}</h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest ${
                      selectedRoom.userType === 'member' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedRoom.userType === 'member' ? 'Thành viên' : 'Khách vãng lai'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-0.5">
                    <p className="text-xs text-primary-600 font-medium">{selectedRoom.userEmail || `Mã định danh: ${selectedRoom.userId}`}</p>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <History size={12} />
                        Lần cuối: {selectedRoom.lastMessageAt ? new Date(selectedRoom.lastMessageAt).toLocaleTimeString('vi-VN') : 'Mới'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Search Messages */}
                <div className="relative group">
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-primary-200 transition-all">
                        <SearchIcon size={14} className="text-gray-400 mr-2" />
                        <input 
                            type="text" 
                            placeholder="Tìm tin nhắn..."
                            className="bg-transparent border-none outline-none text-xs w-28 focus:w-48 transition-all"
                            value={messageSearchTerm}
                            onChange={e => setMessageSearchTerm(e.target.value)}
                        />
                        {messageSearchTerm && (
                            <button onClick={() => setMessageSearchTerm('')} className="p-1 hover:bg-gray-200 rounded-full">
                                <X size={10} className="text-gray-500" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="h-8 w-px bg-gray-100 mx-1" />

                {/* Priority Selector */}
                <div className="flex items-center bg-gray-50/80 p-1.5 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 px-3 uppercase tracking-tighter">Độ ưu tiên:</span>
                  {(['low', 'normal', 'high', 'urgent'] as const).map((p) => {
                    const info = getPriorityInfo(p);
                    const isActive = (selectedRoom.priority || 'normal') === p;
                    return (
                      <button
                        key={p}
                        onClick={() => handleUpdatePriority(selectedRoom.id, p)}
                        className={`text-[10px] px-3.5 py-2 rounded-lg transition-all font-black uppercase tracking-tight ${
                          isActive 
                           ? `${info.color} shadow-lg ring-1 ring-white scale-105` 
                           : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                        }`}
                      >
                        {info.label.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>

                <div className="h-8 w-px bg-gray-100 mx-1" />
                
                <button
                  onClick={handleCloseRoom}
                  className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                  title="Kết thúc tư vấn"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar relative">
              {isSearchingMessages && (
                  <div className="sticky top-0 z-20 flex justify-center mb-4">
                      <div className="bg-white/80 backdrop-blur shadow-sm border border-primary-100 px-4 py-1.5 rounded-full text-xs font-bold text-primary-600 flex items-center gap-2">
                          <SearchIcon size={12} />
                          Đang tìm kiếm: "{messageSearchTerm}" ({messages.length} kết quả)
                      </div>
                  </div>
              )}

              {messages.length === 0 ? (
                <div className="text-center text-gray-400 text-sm mt-20">
                  <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale">
                     <AlertCircle size={32} />
                  </div>
                  <p className="font-medium">{isSearchingMessages ? 'Không tìm thấy tin nhắn trùng khớp' : 'Chưa có dữ liệu hội thoại'}</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                   const isSystem = msg.senderName === 'System';
                   if (isSystem) {
                       return (
                           <div key={idx} className="flex justify-center my-4 animate-in fade-in zoom-in-95">
                               <span className="bg-gray-200/50 text-gray-500 text-[10px] px-4 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                                   {msg.message}
                               </span>
                           </div>
                       )
                   }

                   return (
                    <div
                      key={idx}
                      className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className={`flex flex-col ${msg.senderType === 'admin' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        <div
                          className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed relative whitespace-pre-wrap ${
                            msg.senderType === 'admin'
                              ? 'bg-primary-600 text-white rounded-tr-none'
                              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none ring-1 ring-gray-50'
                          }`}
                        >
                          {msg.message}
                          {/* Indicator for keyword match */}
                          {isSearchingMessages && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-400 rounded-full animate-ping" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 px-2">
                             {msg.senderType === 'admin' && (
                                 <span className="text-[9px] text-primary-400 font-black uppercase">Đã gửi</span>
                             )}
                             {msg.createdAt && (
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                    {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                             )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex gap-4 items-end bg-gray-50 p-3 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-50 transition-all border border-gray-100 focus-within:border-primary-200 group">
                <textarea
                  placeholder={isSearchingMessages ? "Hãy thoát tìm kiếm để tiếp tục trả lời..." : "Nhập nội dung tư vấn và nhấn Enter..."}
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
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm focus:outline-none resize-none max-h-32 min-h-[44px]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isSearchingMessages}
                  className="bg-primary-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-primary-200 transition-all active:scale-90 transform group-focus-within:rotate-3"
                >
                  <Send size={20} className="ml-1" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-3 px-2">
                  <div className="flex items-center gap-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Nhấn Shift + Enter để xuống dòng</p>
                  </div>
                  {isSearchingMessages && (
                      <button 
                        onClick={() => setMessageSearchTerm('')}
                        className="text-[10px] text-primary-600 font-black uppercase hover:underline"
                      >
                         Thoát chế độ tìm kiếm
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
