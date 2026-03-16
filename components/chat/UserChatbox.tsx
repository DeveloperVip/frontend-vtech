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
<<<<<<< HEAD
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* Zalo */}
        <a
          href="https://zalo.me/0333444555"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat Zalo"
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform overflow-hidden group"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
            alt="Zalo"
            className="w-8 h-8 group-hover:scale-110 transition-transform"
          />
        </a>

        {/* Messenger */}
        <a
          href="https://m.me/vitechs"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat Facebook"
          className="w-12 h-12 bg-[#0A7CFF] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.477 2 2 6.145 2 11.26c0 2.903 1.488 5.483 3.824 7.152v3.313l3.486-1.921c.854.237 1.758.366 2.69.366 5.523 0 10-4.145 10-9.26S17.523 2 12 2zm1.093 12.396-2.83-3.02-5.594 3.02 6.142-6.52 2.912 3.02 5.513-3.02-6.143 6.52z" />
          </svg>
        </a>

        {/* Live Chat */}
        <button
          onClick={() => setIsOpen(true)}
          title="Hỗ trợ trực tuyến"
          className="w-14 h-14 mt-1 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
        >
          <MessageCircle size={26} className="text-white" />
        </button>
      </div>
=======
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary-700 text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary-800 transition-all hover:scale-110 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </button>
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
    );
  }

  return (
    <div
<<<<<<< HEAD
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}
    >
      <div
        className="text-white px-4 py-3 rounded-t-2xl flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Hỗ Trợ Khách Hàng</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              <p className="text-xs text-white/80">Trực tuyến</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <Minimize2 size={15} />
=======
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
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              socketService.disconnect();
              setIsConnected(false);
            }}
<<<<<<< HEAD
            className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X size={15} />
=======
            className="hover:bg-primary-600 p-1 rounded"
          >
            <X size={16} />
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {!isJoined ? (
<<<<<<< HEAD

=======
            // Join Form
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
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
<<<<<<< HEAD

=======
              {/* Messages */}
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
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
<<<<<<< HEAD
                        className={`max-w-[75%] px-4 py-2 rounded-2xl ${msg.senderType === 'user'
                          ? 'bg-primary-700 text-white'
                          : msg.senderName === 'System'
                            ? 'bg-gray-100 text-gray-600 text-center text-xs'
                            : 'bg-gray-100 text-gray-800'
                          }`}
=======
                        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                          msg.senderType === 'user'
                            ? 'bg-primary-700 text-white'
                            : msg.senderName === 'System'
                            ? 'bg-gray-100 text-gray-600 text-center text-xs'
                            : 'bg-gray-100 text-gray-800'
                        }`}
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
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

<<<<<<< HEAD

              <div className="border-t border-gray-100 p-3 flex gap-2 items-center">
=======
              {/* Input */}
              <div className="border-t p-3 flex gap-2">
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
<<<<<<< HEAD
                  className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
=======
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400"
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
<<<<<<< HEAD
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                >
                  <Send size={16} className="text-white" />
=======
                  className="bg-primary-700 text-white p-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
