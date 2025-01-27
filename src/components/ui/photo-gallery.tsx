import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface Photo {
  url: string;
  title: string;
  description: string;
}

const photos: Photo[] = [
  {
    url: 'https://cdn.midjourney.com/ee98c522-9e0e-4733-b0c6-ead6ae5c16c1/0_3.png',
    title: 'Sprawiedliwe tantiemy',
    description: '80% przychodów trafia do artystów'
  },
  {
    url: 'https://cdn.midjourney.com/0e41dced-3170-4000-9189-fa80f20bc45d/0_0.png',
    title: 'Blockchain',
    description: 'Eliminujemy ukryte koszty i zaginione tantiemy'
  },
  {
    url: 'https://cdn.midjourney.com/86fce6cd-7213-4a84-9f71-c1530a69f2cb/0_3.png',
    title: 'Edukacja',
    description: 'Promujemy świadomość praw autorskich'
  },
  {
    url: 'https://cdn.midjourney.com/ee98c522-9e0e-4733-b0c6-ead6ae5c16c1/0_1.png',
    title: 'Zrównoważony rozwój',
    description: 'Redukcja śladu węglowego dzięki cyfryzacji'
  }
];

export const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-xl"
            onClick={() => setSelectedPhoto(photo)}
          >
            <OptimizedImage
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover"
              width={400}
              height={400}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center p-4"
            >
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">{photo.title}</h3>
                <p className="text-sm text-zinc-300">{photo.description}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <OptimizedImage
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full rounded-xl"
                width={1200}
                height={800}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <h2 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h2>
                <p className="text-zinc-300">{selectedPhoto.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};