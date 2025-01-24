import React, { useState, useEffect, useRef } from 'react';
import { Send, Play, Pause, Trash2, Volume2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { synthesizeSpeech } from '../services/elevenlabs';

const VOICES = [
  { id: 'Julia', name: 'Julia (Polski - Kobiecy)' },
  { id: 'Antoni', name: 'Antoni (Polski - Męski)' },
  { id: 'Zofia', name: 'Zofia (Polski - Kobiecy)' },
  { id: 'Marek', name: 'Marek (Polski - Męski)' },
  { id: 'Kasia', name: 'Kasia (Polski - Kobiecy)' }
];

const MAX_CHARS = 1000;

export const VoiceMessagePanel = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { messages, addVoiceMessage, deleteMessage, audioElement, setVolume } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousVolumeRef = useRef<number>(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || converting) return;

    setConverting(true);
    setError(null);

    try {
      const audioBuffer = await synthesizeSpeech(text, selectedVoice.id);
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      addVoiceMessage({
        text,
        audioUrl,
        voiceId: selectedVoice.id,
        timestamp: Date.now()
      });

      setText('');
    } catch (err) {
      console.error('Speech synthesis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert text to speech. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const handleVoiceMessagePlay = () => {
    if (audioElement) {
      previousVolumeRef.current = audioElement.volume;
      setVolume(0.2);
    }
  };

  const handleVoiceMessageEnd = () => {
    if (audioElement) {
      setVolume(previousVolumeRef.current);
    }
  };

  const charsRemaining = MAX_CHARS - text.length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-zinc-900/50 rounded-lg p-4 space-y-2 touch-manipulation"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm flex-1">{message.text}</p>
              <button
                onClick={() => deleteMessage(message.id)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Delete message"
              >
                <Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-500" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <audio
                src={message.audioUrl}
                controls
                className="flex-1 h-[44px]"
                onPlay={handleVoiceMessagePlay}
                onEnded={handleVoiceMessageEnd}
                onPause={handleVoiceMessageEnd}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
              <span className="text-zinc-400">
                {VOICES.find(v => v.id === message.voiceId)?.name || 'Unknown voice'}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <select
            value={selectedVoice.id}
            onChange={(e) => {
              const voice = VOICES.find(v => v.id === e.target.value);
              if (voice) setSelectedVoice(voice);
            }}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-[44px]"
          >
            {VOICES.map(voice => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Type your message..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 pr-20 min-h-[100px] focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="absolute bottom-2 right-2 text-xs text-zinc-500">
            {charsRemaining} characters remaining
          </div>
        </div>

        <button
          type="submit"
          disabled={converting || !text.trim()}
          className="w-full bg-blue-500 text-white rounded-lg py-3 px-4 font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
        >
          {converting ? 'Converting...' : 'Convert to Speech'}
        </button>
      </form>
    </div>
  );
};