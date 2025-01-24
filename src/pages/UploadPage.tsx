import React from 'react';
import { Navigate } from 'react-router-dom';
import { AdminTrackUploader } from '../components/playlist/AdminTrackUploader';
import { useAdminStatus } from '../hooks/useAdminStatus';
import { Shield } from 'lucide-react';

export default function UploadPage() {
  const { isAdmin, loading } = useAdminStatus();

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Upload Track</h2>
          <p className="text-sm text-zinc-400">Add new tracks to the library</p>
        </div>
      </div>
      <AdminTrackUploader />
    </div>
  );
}