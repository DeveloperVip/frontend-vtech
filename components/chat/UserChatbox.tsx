'use client';

// import { useState, useEffect, useRef } from 'react';
// import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
// import socketService from '@/services/socketService';

// interface Message {
//   id?: number;
//   senderType: 'user' | 'admin';
//   senderName: string;
//   message: string;
//   createdAt?: string;
// }

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, User as UserIcon, LogIn, History, ShieldAlert, Phone, Paperclip, FileText, Eye, EyeOff } from 'lucide-react';
import socketService from '@/services/socketService';
import { useUserAuthStore } from '@/hooks/useUserAuthStore';
import toast from 'react-hot-toast';
import { formatFileSize, parseChatMessage, uploadChatAttachment, type ChatAttachment } from '@/lib/chatMessage';

interface Message {
  id?: number;
  senderType: 'user' | 'admin';
  senderName: string;
  message: string;
  createdAt?: string;
}

type ChatStage = 'CHOICE' | 'GUEST_FORM' | 'LOGIN_FORM' | 'CHAT';

export default function UserChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [stage, setStage] = useState<ChatStage>('CHOICE');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, token, isAuthenticated, setUser, setToken } = useUserAuthStore();

  useEffect(() => {
    // Tự động nhận diện nếu đã đăng nhập thành viên
    if (isAuthenticated && user) {
      setUserName(user.name);
      setStage('CHAT');
    } else {
      // Nếu là khách đã nhập tên trước đó trong session
      const savedGuestName = sessionStorage.getItem('chat_guest_name');
      if (savedGuestName) {
        setUserName(savedGuestName);
        setStage('CHAT');
      }
    }

    // Listen for external open requests
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-customer-chat', handleOpenChat);
    return () => window.removeEventListener('open-customer-chat', handleOpenChat);
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isOpen && !isConnected) {
      socketService.connect();
      setIsConnected(true);

      // Listen for events
      socketService.on('connect', () => {
        if (isAuthenticated || sessionStorage.getItem('chat_guest_id')) {
          handleJoin();
        }
      });

      socketService.on('room:joined', (data: { roomId: number; messages: Message[] }) => {
        setRoomId(data.roomId);
        setMessages(data.messages);
        setIsJoined(true);
        setStage('CHAT');
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
  }, [messages, stage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        toast.success('Đăng nhập thành công');
        handleJoin();
      } else {
        toast.error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      toast.error('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (typeOverride?: 'guest' | 'member') => {
    if (typeof window === 'undefined') return;

    const guestId = sessionStorage.getItem('chat_guest_id') || `guest_${Math.random().toString(36).substr(2, 9)}`;
    const userRole = (typeOverride === 'member' || isAuthenticated) ? 'member' : 'guest';

    let userId = '';
    let name = userName;

    if (userRole === 'member' && user) {
      userId = user.id.toString();
      name = user.name;
    } else {
      if (!name.trim() && stage !== 'CHAT') return;
      userId = guestId;
      sessionStorage.setItem('chat_guest_id', guestId);
      sessionStorage.setItem('chat_guest_name', name);
    }

    socketService.emit('user:join', {
      userId,
      userName: name,
      userType: userRole,
      userEmail: userRole === 'member' ? user?.email : userEmail
    });
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
    if ((!inputMessage.trim() && !selectedFile) || !roomId || uploadingAttachment) return;

    const userId = isAuthenticated
      ? user?.id.toString()
      : sessionStorage.getItem('chat_guest_id');

    try {
      let attachment: ChatAttachment | undefined;

      if (selectedFile) {
        setUploadingAttachment(true);
        attachment = await uploadChatAttachment(selectedFile);
      }

      socketService.emit('message:send', {
        roomId,
        message: inputMessage.trim(),
        attachment,
        senderType: 'user',
        senderId: userId || 'unknown',
        senderName: userName || user?.name || 'Khách',
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isJoined) {
        handleSendMessage();
      }
    }
  };

  const renderAttachment = (attachment: ChatAttachment, isOwnMessage: boolean) => {
    if (attachment.kind === 'image') {
      return (
        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="mt-2 block overflow-hidden rounded-xl">
          <img src={attachment.url} alt={attachment.name} className="max-h-48 w-full object-cover" />
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

  if (!isOpen) {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
          {/* Zalo */}
          <a
            href="https://zalo.me/02466828899"
            target="_blank"
            rel="noopener noreferrer"
            title="Chat Zalo"
            className="chat-wiggle chat-wiggle-zalo w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform overflow-hidden group"
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
            className="chat-wiggle chat-wiggle-messenger w-12 h-12 bg-[#0A7CFF] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.477 2 2 6.145 2 11.26c0 2.903 1.488 5.483 3.824 7.152v3.313l3.486-1.921c.854.237 1.758.366 2.69.366 5.523 0 10-4.145 10-9.26S17.523 2 12 2zm1.093 12.396-2.83-3.02-5.594 3.02 6.142-6.52 2.912 3.02 5.513-3.02-6.143 6.52z" />
            </svg>
          </a>

          {/* Phone */}
          <a
            href="tel:02466828899"
            title="Gọi điện"
            className="chat-wiggle chat-wiggle-phone w-12 h-12 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Phone size={23} className="text-white" />
          </a>

          {/* Live Chat */}
          <button
            onClick={() => setIsOpen(true)}
            title="Hỗ trợ trực tuyến"
            className="chat-wiggle chat-wiggle-live w-14 h-14 mt-1 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
          >
            <MessageCircle size={26} className="text-white" />
          </button>
        </div>

        <style jsx>{`
          .chat-wiggle {
            animation: chatWiggle 2.8s ease-in-out infinite;
            transform-origin: center;
          }

          .chat-wiggle-zalo {
            animation-delay: 0s;
          }

          .chat-wiggle-messenger {
            animation-delay: 0.25s;
          }

          .chat-wiggle-phone {
            animation-delay: 0.5s;
          }

          .chat-wiggle-live {
            animation-delay: 0.75s;
          }

          @keyframes chatWiggle {
            0%, 82%, 100% {
              transform: rotate(0deg);
            }
            85% {
              transform: rotate(-8deg);
            }
            88% {
              transform: rotate(8deg);
            }
            91% {
              transform: rotate(-6deg);
            }
            94% {
              transform: rotate(6deg);
            }
            97% {
              transform: rotate(-2deg);
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all overflow-hidden ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}
    >
      <div
        className="text-white px-4 py-3 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">VITECHS Support</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              <p className="text-xs text-white/80">Sẵn sàng hỗ trợ</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <Minimize2 size={15} />
          </button>
          <button onClick={() => { setIsOpen(false); socketService.disconnect(); setIsConnected(false); }} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-[calc(600px-64px)] overflow-hidden">
          {stage === 'CHOICE' && (
            <div className="p-8 flex flex-col justify-center h-full gap-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Chào mừng bạn!</h3>
                <p className="text-sm text-gray-500 mt-1">Chọn phương thức để bắt đầu hỗ trợ</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setStage('GUEST_FORM')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50/30 transition-all group active:scale-[0.98]"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 border border-transparent group-hover:border-primary-200">
                    <UserIcon size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Khách vãng lai</p>
                    <p className="text-xs text-gray-400">Không lưu lịch sử chat</p>
                  </div>
                </button>

                <button
                  onClick={() => setStage('LOGIN_FORM')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50/30 transition-all group active:scale-[0.98]"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 border border-transparent group-hover:border-primary-200">
                    <LogIn size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Thành viên</p>
                    <p className="text-xs text-gray-400">Lưu lịch sử & Hỗ trợ ưu tiên</p>
                  </div>
                </button>
              </div>

              <p className="text-[11px] text-center text-gray-400 mt-4 leading-relaxed">
                Bằng cách tiếp tục, bạn đồng ý với <span className="underline">Chính sách bảo mật</span> và <span className="underline">Điều khoản sử dụng</span> của chúng tôi.
              </p>
            </div>
          )}

          {stage === 'GUEST_FORM' && (
            <div className="p-6 flex flex-col h-full">
              <button onClick={() => setStage('CHOICE')} className="text-sm text-primary-600 font-bold mb-6 flex items-center gap-1 hover:underline">
                Quay lại
              </button>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6 animate-in slide-in-from-top-2">
                <ShieldAlert className="text-amber-500 shrink-0" size={18} />
                <p className="text-[13px] text-amber-800 leading-tight">
                  <strong className="block mb-0.5">Lưu ý quan trọng:</strong>
                  Lịch sử chat sẽ <strong>không được lưu lại</strong> sau khi bạn rời khỏi trang web. Đăng nhập thành viên để lưu trữ vĩnh viễn.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Tên của bạn *</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ví dụ: Anh Tuấn"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Email (Không bắt buộc)</label>
                  <input
                    type="email"
                    className="input-field w-full"
                    placeholder="email@example.com"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => handleJoin('guest')}
                  disabled={!userName.trim()}
                  className="btn-primary w-full bg-primary-600 hover:bg-primary-700 py-3 shadow-lg shadow-primary-100 disabled:opacity-50"
                >
                  Bắt đầu nhắn tin
                </button>
              </div>
            </div>
          )}

          {stage === 'LOGIN_FORM' && (
            <div className="p-6 flex flex-col h-full">
              <button onClick={() => setStage('CHOICE')} className="text-sm text-primary-600 font-bold mb-6 flex items-center gap-1 hover:underline">
                Quay lại
              </button>

              <h3 className="text-xl font-bold text-gray-900 mb-6">Đăng nhập thành viên</h3>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Tên đăng nhập / Email</label>
                  <input
                    type="text"
                    required
                    className="input-field w-full"
                    placeholder="Nhập email hoặc username"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Mật khẩu</label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      className="input-field w-full pr-11"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition hover:text-primary-600"
                      aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showLoginPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full bg-gray-900 hover:bg-black py-3 shadow-lg disabled:opacity-50 flex justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Tiếp tục cuộc trò chuyện'}
                </button>
              </form>
              <div className="mt-8 text-center bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-2">Chưa có tài khoản?</p>
                <a href="/register" className="text-sm font-bold text-primary-600 hover:underline">Đăng ký thành viên mới</a>
              </div>
            </div>
          )}

          {stage === 'CHAT' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-10">
                    <p className="text-2xl mb-2">✨</p>
                    <p>Hệ thống đã sẵn sàng hỗ trợ bạn</p>
                    <p className="mt-1 text-xs px-10">Gửi lời chào để bắt đầu kết nối với tư vấn viên</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const parsedMessage = parseChatMessage(msg.message);
                    const isOwnMessage = msg.senderType === 'user';

                    return (
                      <div key={idx} className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isOwnMessage
                            ? 'bg-primary-600 text-white rounded-tr-none'
                            : msg.senderName === 'System'
                              ? 'bg-gray-200 text-gray-600 text-center text-xs mx-auto shadow-none rounded-md italic py-1'
                              : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                          }`}
                        >
                          {msg.senderType === 'admin' && msg.senderName !== 'System' && (
                            <p className="text-[11px] font-extrabold mb-1 text-blue-600 flex items-center gap-1 tracking-tight">
                              <span className="w-1 h-1 bg-blue-600 rounded-full inline-block" />
                              {msg.senderName}
                            </p>
                          )}
                          {parsedMessage.text && <p className="whitespace-pre-wrap leading-relaxed">{parsedMessage.text}</p>}
                          {parsedMessage.attachment && renderAttachment(parsedMessage.attachment, isOwnMessage)}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-100 p-4 bg-white">
                {selectedFile && (
                  <div className="mb-2 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    <FileText size={15} className="shrink-0 text-primary-600" />
                    <span className="min-w-0 flex-1 truncate font-semibold">{selectedFile.name}</span>
                    <span className="text-gray-400">{formatFileSize(selectedFile.size)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="rounded-full p-1 hover:bg-gray-200"
                      aria-label="Bỏ file đã chọn"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}
                <div className="flex gap-2 items-end">
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
                    disabled={!isJoined || uploadingAttachment}
                    className="w-11 h-11 rounded-full border border-gray-100 bg-gray-50 text-gray-500 flex items-center justify-center shrink-0 hover:bg-gray-100 disabled:opacity-30"
                    title="Đính kèm ảnh hoặc file"
                  >
                    <Paperclip size={18} />
                  </button>
                  <textarea
                    placeholder="Viết tin nhắn..."
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onPaste={handlePaste}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border-gray-100 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 placeholder-gray-400 resize-none max-h-32"
                    style={{ minHeight: '44px' }}
                  />
                <button
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && !selectedFile) || !isJoined || uploadingAttachment}
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 disabled:opacity-30 disabled:grayscale hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-100"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                >
                    {uploadingAttachment ? <Loader2 className="animate-spin text-white" size={18} /> : <Send size={18} className="text-white ml-0.5" />}
                </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-loader-2 ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
