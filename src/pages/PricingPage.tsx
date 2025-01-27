import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const plans = [
    {
      name: "Podstawowa",
      price: "0 PLN",
      description: "Idealny dla małych lokali",
      features: [
        "Do 3 lokalizacji",
        "Podstawowe zarządzanie playlistami",
        "Planowanie muzyki 24/7",
        "Wsparcie zespołu"
      ],
      popular: false
    },
    {
      name: "Rozbudowana",
      price: "0 PLN",
      description: "Idealny dla rozwijających się firm",
      features: [
        "Do 10 lokalizacji",
        "Zaawansowane zarządzanie playlistami",
        "Filtrowanie treści",
        "Priorytetowe wsparcie",
        "Komunikaty głosowe VoiceAI"
      ],
      popular: false
    },
    {
      name: "Zaawansowana",
      price: "Indywidualny",
      description: "Dla dużych organizacji",
      features: [
    
        "Nieograniczona liczba lokalizacji",
        "Dostęp do API",
        "Niestandardowe integracje",
        "Dedykowane wsparcie",
        "Zaawansowana analityka"
      ],
      popular: false
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500 text-white text-center py-2 rounded-md mb-8 max-w-md mx-auto"
        >
          <p className="text-sm md:text-base">
            W fazie pilotażu projektu wszystkie usługi są bezpłatne
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Proste, transparentne rozliczanie
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Wybierz najlepszy plan dla swojego lokalu i wspieraj artystów w ich karierze
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`relative bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Najbardziej popularny
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-2">{plan.price}</div>
                <p className="text-zinc-400 text-sm">{plan.description}</p>
              </div>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-8 bg-blue-500 hover:bg-blue-600"
                size="lg"
              >
                Zacznij teraz
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}