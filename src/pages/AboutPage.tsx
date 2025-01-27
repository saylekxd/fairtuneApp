import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Music2, Users2, Globe2, Award, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { PhotoGallery } from '../components/ui/photo-gallery';

export default function AboutPage() {
  const stats = [
    { label: 'Budowa MVP', value: 'Etap' },
    { label: 'Wsparcie artystów', value: 'Wizja' },
    { label: 'Blockchain i VoiceAI', value: 'Technologia' },
    { label: 'Rynki CEE', value: 'Zasięg' }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Twórcy w centrum uwagi',
      description: 'Wspieramy niszowych artystów, zapewniając im przejrzystość rozliczeń oraz wynagrodzenie na poziomie 80% z przychodów platformy.'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Rewolucja w branży muzycznej',
      description: 'Łączymy blockchain i AI, aby stworzyć nowoczesny ekosystem muzyczny, który eliminuje problem "zagubionych tantiem" i wspiera rozwój kultury.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Technologie przyszłości',
      description: 'Integrujemy zaawansowane algorytmy AI i systemy inteligentnych kontraktów, aby uprościć zarządzanie muzyką i dostarczać spersonalizowane doświadczenia użytkownikom.'
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            O FAIRTUNE
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          
            Fairtune to innowacyjna platforma B2B, która ma wykorzystywać blockchain i AI, aby zapewnić transparentną dystrybucję muzyki, wspierając niszowych artystów i upraszczając zarządzanie muzyką dla firm.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Nasze wartości i misja</h2>
          <PhotoGallery />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-zinc-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}