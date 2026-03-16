'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users, Clock } from 'lucide-react';
import socketService from '@/services/socketService';
import { adminGet } from '@/services/adminService';

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
  status: 'waiting' | 'active' | 'closed';
  lastMessageAt?: string;
  admin?: { id: number; name: string };
}

export default function AdminChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
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
      setRooms(data);
    });

    socketService.on('admin:new-user-waiting', (data: any) => {
      // Reload rooms
      loadRooms();
    });

    socketService.on('message:received', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketService.on('admin:new-message', () => {
      loadRooms();
    });

    // Load initial rooms
    loadRooms();

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRooms = async () => {
    try {
      const res = await adminGet('/chat/rooms?status=waiting&status=active');
      setRooms(res.data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const handlePickRoom = async (room: Room) => {
    setSelectedRoom(room);

    // Emit pick room
    socketService.emit('admin:pick-room', {
      roomId: room.id,
      adminId: adminInfo.id,
      adminName: adminInfo.name,
    });

    // Load messages
    try {
      const res = await adminGet(`/chat/rooms/${room.id}/messages`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }

    // Mark as read
    socketService.emit('message:mark-read', {
      roomId: room.id,
      userType: 'admin',
    });
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
  };

  const handleCloseRoom = () => {
    if (!selectedRoom) return;

    socketService.emit('admin:close-room', {
      roomId: selectedRoom.id,
    });

    setSelectedRoom(null);
    setMessages([]);
    loadRooms();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      waiting: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-600',
    };
    return styles[status as keyof typeof styles] || styles.closed;
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Rooms List */}
      <div className="w-80 bg-white rounded-2xl border border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-primary-700" />
          <h2 className="font-semibold text-gray-900">Danh sách chat ({rooms.length})</h2>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-10">
            <MessageCircle size={40} className="mx-auto mb-2 opacity-50" />
            <p>Chưa có tin nhắn nào</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handlePickRoom(room)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedRoom?.id === room.id
                    ? 'border-primary-700 bg-primary-50'
                    : 'border-gray-100 hover:border-primary-200'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-semibold text-sm text-gray-900">{room.userName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(room.status)}`}>
                    {room.status}
                  </span>
                </div>
                {room.userEmail && (
                  <p className="text-xs text-gray-500 mb-1">{room.userEmail}</p>
                )}
                {room.lastMessageAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={10} />
                    {new Date(room.lastMessageAt).toLocaleString('vi-VN')}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col">
        {!selectedRoom ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageCircle size={60} className="mx-auto mb-3 opacity-30" />
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedRoom.userName}</h3>
                <p className="text-xs text-gray-500">{selectedRoom.userEmail || selectedRoom.userId}</p>
              </div>
              <button
                onClick={handleCloseRoom}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Đóng chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 text-sm mt-10">
                  <p>Chưa có tin nhắn nào</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                        msg.senderType === 'admin'
                          ? 'bg-primary-700 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      {msg.createdAt && (
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString('vi-VN')}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 flex gap-3">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-primary-700 text-white px-6 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
                Gửi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
