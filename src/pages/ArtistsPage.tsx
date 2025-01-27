import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  image_url: string | null;
  track_count: number;
}

const ArtistCard = ({ artist }: { artist: Artist }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/artists/${artist.id}`)}
      className="group cursor-pointer bg-zinc-900/50 rounded-xl overflow-hidden hover:bg-zinc-900 transition-colors"
    >
      <div className="aspect-square relative">
        {artist.image_url ? (
          <img
            src={artist.image_url}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <Music className="w-12 h-12 text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{artist.name}</h3>
        <p className="text-sm text-zinc-400">{artist.track_count} utworów</p>
      </div>
    </div>
  );
};

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const { data: artistsData, error } = await supabase
          .from('artists')
          .select('*, tracks:tracks(count)')
          .ilike('name', `%${searchQuery}%`)
          .order('name');

        if (error) throw error;

        if (artistsData) {
          setArtists(artistsData.map(artist => ({
            ...artist,
            track_count: artist.tracks[0].count
          })));
        }
      } catch (error) {
        console.error('Błąd podczas ładowania artystów:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, [searchQuery]);

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Artyści</h2>
            <p className="text-zinc-400">Przeglądaj wszystkich artystów w swojej bibliotece</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj artystów..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <LoadingSkeleton type="genre" count={10} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}