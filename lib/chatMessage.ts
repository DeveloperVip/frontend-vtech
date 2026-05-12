export type ChatAttachment = {
  url: string;
  name: string;
  mimeType: string;
  size: number;
  kind: 'image' | 'file';
};

export type ParsedChatMessage = {
  text: string;
  attachment?: ChatAttachment;
};

type StoredChatMessage = {
  type?: string;
  text?: string;
  attachment?: ChatAttachment;
};

export const parseChatMessage = (message: string): ParsedChatMessage => {
  try {
    const parsed = JSON.parse(message) as StoredChatMessage;

    if (parsed?.type === 'chat-message' && parsed.attachment?.url) {
      return {
        text: parsed.text || '',
        attachment: parsed.attachment,
      };
    }
  } catch {
    // Plain text messages from the existing chat history are still valid.
  }

  return { text: message };
};

export const formatFileSize = (bytes: number) => {
  if (!bytes) return '';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const uploadChatAttachment = async (file: File): Promise<ChatAttachment> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/upload/chat`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Upload file thất bại');
  }

  return {
    url: data.url,
    name: data.originalName || data.filename || file.name,
    mimeType: data.mimeType || file.type,
    size: data.size || file.size,
    kind: data.kind || (file.type.startsWith('image/') ? 'image' : 'file'),
  };
};
