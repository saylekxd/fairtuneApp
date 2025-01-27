import React, { Suspense } from 'react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { GenrePlaylists } from '../components/playlist/GenrePlaylists';

export default function PlaylistsPage() {
  return (
    <Suspense fallback={
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Playlisty gatunkowe</h2>
        <LoadingSkeleton type="genre" count={8} />
      </div>
    }>
      <GenrePlaylists />
    </Suspense>
  );
}