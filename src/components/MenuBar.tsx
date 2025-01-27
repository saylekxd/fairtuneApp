import React, { useState, useEffect } from 'react';
import { Upload, X, Image, Music, Loader2, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

export const MenuBar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    description: '',
    releaseDate: '',
    bpm: '',
    key: '',
    tags: '',
    copyright: '',
    isPublic: true,
  });
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
    } catch (err) {
      console.error('Błąd podczas sprawdzania statusu administratora:', err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your existing functions (handleSubmit, handleAudioChange, etc.)
  // ... keep them exactly as they are ...

  if (loading) {
    return (
      <div className="h-16 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center">
          <div className="flex items-center gap-4">
            <Music className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold">Menadżer Muzyki</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-16 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Music className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold">Menadżer Muzyki</h1>
          </div>
          {isAdmin ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              Prześlij utwór
            </button>
          ) : (
            <div className="flex items-center gap-2 text-zinc-400">
              <ShieldAlert className="w-5 h-5" />
              <span>Wymagany dostęp administratora</span>
            </div>
          )}
        </div>
      </div>

      {/* Rest of your modal code */}
      {/* ... keep it exactly as it is ... */}
    </>
  );
};