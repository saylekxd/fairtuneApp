import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Sparkles, Music, Users, Clock, Globe, Shield } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Music className="w-6 h-6" />,
      title: "Inteligentne zarządzanie muzyką",
      description: "Inteligentne tworzenie i zarządzanie playlistami dla każdego rozmiaru lokalu"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Wsparcie dla wielu lokalizacji",
      description: "Zarządzaj muzyką w wielu lokalizacjach z jednego panelu"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Zaplanuj playlisty",
      description: "Ustaw automatyczne harmonogramy playlist na różne czasy i dni"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Dostęp globalny",
      description: "Uzyskaj dostęp do swojej biblioteki muzycznej z dowolnego miejsca na świecie"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Filtrowanie treści",
      description: "Automatyczne filtrowanie treści dla przyjaznych rodzinie środowisk"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Rekomendacje oparte na AI",
      description: "Otrzymuj inteligentne rekomendacje playlist na podstawie typu lokalu"
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Potężne funkcje dla nowoczesnych lokali
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Wszystko, czego potrzebujesz, aby stworzyć idealną atmosferę dla swojego biznesu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-zinc-800/70 transition-colors border border-white/5"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
            Rozpocznij teraz
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}