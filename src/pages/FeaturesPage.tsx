import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Sparkles, Music, Users, Clock, Globe, Shield } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Music className="w-6 h-6" />,
      title: "Smart Music Management",
      description: "Intelligent playlist creation and management for any venue size"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Location Support",
      description: "Manage music across multiple locations from a single dashboard"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Scheduled Playlists",
      description: "Set up automated playlist schedules for different times and days"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Access your music library from anywhere in the world"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Content Filtering",
      description: "Automatic content filtering for family-friendly environments"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Recommendations",
      description: "Get smart playlist recommendations based on your venue type"
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Powerful Features for Modern Venues
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Everything you need to create the perfect atmosphere for your business
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
            Get Started Now
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}