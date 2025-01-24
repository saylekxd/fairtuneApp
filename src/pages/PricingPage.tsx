import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "$29",
      description: "Perfect for small venues",
      features: [
        "Up to 3 locations",
        "Basic playlist management",
        "24/7 music scheduling",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$79",
      description: "Ideal for growing businesses",
      features: [
        "Up to 10 locations",
        "Advanced playlist management",
        "Content filtering",
        "Priority support",
        "Custom announcements"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited locations",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Advanced analytics"
      ],
      popular: false
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Choose the perfect plan for your business
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
                  Most Popular
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
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}