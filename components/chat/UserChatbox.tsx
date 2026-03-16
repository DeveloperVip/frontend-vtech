'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import socketService from '@/services/socketService';

interface Message {
  id?: number;
  senderType: 'user' | 'admin';
  senderName: string;
  message: string;
  createdAt?: string;
}

export default function UserChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved user info
    const savedName = localStorage.getItem('chat_user_name');
    const savedEmail = localStorage.getItem('chat_user_email');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (isOpen && !isConnected) {
      socketService.connect();
      setIsConnected(true);

      // Listen for events
      socketService.on('connect', () => {
        console.log('Connected to chat server');
      });

      socketService.on('room:joined', (data: { roomId: number; messages: Message[] }) => {
        setRoomId(data.roomId);
        setMessages(data.messages);
        setIsJoined(true);
      });

      socketService.on('message:received', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      socketService.on('admin:joined', (data: { adminName: string; message: string }) => {
        setMessages((prev) => [
          ...prev,
          {
            senderType: 'admin',
            senderName: 'System',
            message: data.message,
          },
        ]);
      });

      socketService.on('room:closed', (data: { message: string }) => {
        setMessages((prev) => [
          ...prev,
          {
            senderType: 'admin',
            senderName: 'System',
            message: data.message,
          },
        ]);
      });
    }

    return () => {
      if (isConnected) {
        socketService.removeAllListeners();
      }
    };
  }, [isOpen, isConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (!userName.trim()) return;

    const userId = userEmail || `guest_${Date.now()}`;
    localStorage.setItem('chat_user_name', userName);
    if (userEmail) localStorage.setItem('chat_user_email', userEmail);

    socketService.emit('user:join', {
      userId,
      userName,
      userEmail,
    });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !roomId) return;

    const userId = userEmail || `guest_${Date.now()}`;

    socketService.emit('message:send', {
      roomId,
      message: inputMessage.trim(),
      senderType: 'user',
      senderId: userId,
      senderName: userName,
    });

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isJoined) {
        handleSendMessage();
      } else {
        handleJoin();
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary-700 text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary-800 transition-all hover:scale-110 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="bg-primary-700 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <div>
            <p className="font-semibold text-sm">Hỗ trợ trực tuyến</p>
            <p className="text-xs text-primary-100">
              {isJoined ? 'Đang kết nối...' : 'Bắt đầu trò chuyện'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-primary-600 p-1 rounded"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              socketService.disconnect();
              setIsConnected(false);
            }}
            className="hover:bg-primary-600 p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {!isJoined ? (
            // Join Form
            <div className="p-6 flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                Vui lòng nhập thông tin để bắt đầu trò chuyện với chúng tôi
              </p>
              <input
                type="text"
                placeholder="Tên của bạn *"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email (không bắt buộc)"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field"
              />
              <button
                onClick={handleJoin}
                disabled={!userName.trim()}
                className="btn-primary bg-primary-700 hover:bg-primary-800"
              >
                Bắt đầu chat
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[480px]">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-10">
                    <p>👋 Xin chào!</p>
                    <p className="mt-2">Hãy gửi tin nhắn để bắt đầu</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                          msg.senderType === 'user'
                            ? 'bg-primary-700 text-white'
                            : msg.senderName === 'System'
                            ? 'bg-gray-100 text-gray-600 text-center text-xs'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.senderType === 'admin' && msg.senderName !== 'System' && (
                          <p className="text-xs font-semibold mb-1 text-primary-700">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-primary-700 text-white p-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
