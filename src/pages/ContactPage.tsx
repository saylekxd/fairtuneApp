import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { Mail, Phone, MapPin, Send, MessageSquare, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabase';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      value: 'biuro@slowemwtwarz.pl'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Telefon',
      value: '+48 575 97 01 31'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Adress',
      value: 'ul. Wiejska 1C, 44-200 Rybnik'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      // Send the contact form data to Supabase
      const { error: submitError } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          recipient: 'adamrojek@icloud.com'
        });

      if (submitError) throw submitError;

      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
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
            Złapmy się i pogadajmy!
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Będziemy wdzięczni za każdą opinię i pomoc w rozwoju naszego projektu, a w szczególności zapraszamy zainteresowanych artystów do kontaktu.  
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-medium mb-1">{info.title}</h3>
                  <p className="text-zinc-400">{info.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Imię
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Wiadomość
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-32 resize-none"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
              disabled={sending}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {sending ? 'Wysyłanie...' : 'Wyślij wiadomość'}
            </Button>
          </motion.form>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Wiadomość wysłana pomyślnie!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}