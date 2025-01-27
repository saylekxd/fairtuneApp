import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface Milestone {
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

export default function RoadmapPage() {
  const milestones: Milestone[] = [
    {
      title: "Uruchomienie platformy",
      description: "Wstępne uruchomienie platformy streamingowej z podstawowymi funkcjami zarządzania muzyką",
      date: "Q1 2024",
      status: "completed"
    },
    {
      title: "Implementacja blockchain i ochrona praw autorskich",
      description: "Wdrożenie mechanizmu rozliczeń tantiem w technologii blockchain oraz rozpoczęcie kampanii dot. ochrony praw autorskich",
      date: "Q2 2024",
      status: "in-progress"
    },
    {
      title: "System rekomendacji playlist",
      description: "Rozszerzenie banku playlist i wprowadzenie inteligentnych rekomendacji, które będą dostosowywać się do specyfiki lokalu",
      date: "Q3 2024",
      status: "upcoming"
    },
    {
      title: "Wdrożenie technologii VoiceAI",
      description: "Innowacja, która pozwoli na generowanie spersonalizowanych komunikatów głosowych w przestrzeniach lokali",
      date: "Q3 2024",
      status: "upcoming"
    },
    {
      title: "Zaawansowana analityka",
      description: "Moduł szczegółowej analityki, który umożliwia właścicielom lokali uzyskiwanie szczegółowych danych o preferencjach klientów i efektywności muzyki w różnych strefach.",
      date: "Q3 2024",
      status: "upcoming"
    },
    {
      title: "Ekspansja produktu",
      description: "Ekspansja produktu w formie pilotazu na rynek Polski i Europy Środkowo-Wschodniej oraz runda pre-seed w celu pozyskania inwestora",
      date: "Q4 2024",
      status: "upcoming"
    },
    {
      title: "Rekomendacje i pilotaż dla OZZ",
      description: "Dla osiągnięcia efektu skali naszego rozwiązania, chcemy zarekomendować gotowe rozwiązanie dla Organizacja zbiorowego zarządzania prawami autorskimi",
      date: "Q4 2024",
      status: "upcoming"
    }
  ];

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-blue-500';
      default:
        return 'text-zinc-500';
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Circle className="w-6 h-6 text-blue-500 fill-blue-500/20" />
          </motion.div>
        );
      default:
        return <Circle className="w-6 h-6 text-zinc-500" />;
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Mapa rozwoju produktu 
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Zobacz co chcemy zrealizować, jeśli uda nam się pozyskać fundusze na rozwój naszych innowacji w obszarze sektorów kreatywnych.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-zinc-800" />

          {/* Milestones */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-8"
              >
                {/* Timeline node */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full">
                  {getStatusIcon(milestone.status)}
                </div>

                {/* Content */}
                <motion.div 
                  className="flex-1 bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{milestone.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      milestone.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                      milestone.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-zinc-500/10 text-zinc-500'
                    }`}>
                      {milestone.date}
                    </span>
                  </div>
                  <p className="text-zinc-400">{milestone.description}</p>
                  
                  {milestone.status === 'in-progress' && (
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "60%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      </div>
                      <span className="text-sm text-blue-500">60%</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Future Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400">
            <span>Więcej ciekawych funkcji wkrótce</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}