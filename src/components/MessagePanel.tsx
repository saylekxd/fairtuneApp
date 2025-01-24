import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store/useStore';

export const MessagePanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const { messages, addMessage } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      addMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 mb-2 rounded-lg ${
              msg.played ? 'bg-zinc-800' : 'bg-blue-500/10'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <span className="text-xs text-zinc-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 border-t border-zinc-800 pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-zinc-800 border-none rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};