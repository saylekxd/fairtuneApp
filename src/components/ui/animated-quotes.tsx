import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Star } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
  role: string;
  rating: number;
}

const quotes: Quote[] = [
  {
    text: "FAIRTUNE has completely transformed how we manage music across our restaurant chain. The scheduling feature is a game-changer!",
    author: "Sarah Johnson",
    role: "Restaurant Chain Owner",
    rating: 5
  },
  {
    text: "The platform's ease of use and powerful features have made managing our venue's music effortless.",
    author: "Michael Chen",
    role: "Venue Manager",
    rating: 5
  },
  {
    text: "Best investment we've made for our retail stores. The ambiance is perfect every time.",
    author: "Emma Davis",
    role: "Retail Director",
    rating: 5
  }
];

export const AnimatedQuotes = () => {
  const quotesRef = useRef<HTMLDivElement>(null);
  const quoteEls = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!quotesRef.current) return;

    const ctx = gsap.context(() => {
      // Initial setup - hide all quotes except the first one
      gsap.set(quoteEls.current.slice(1), { opacity: 0, y: 20 });

      // Create the animation timeline
      const tl = gsap.timeline({ repeat: -1 });

      quoteEls.current.forEach((quote, index) => {
        const nextIndex = (index + 1) % quoteEls.current.length;

        tl.to(quote, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        })
        .to({}, { duration: 4 }) // Pause to read the quote
        .to(quote, {
          opacity: 0,
          y: -20,
          duration: 1,
          ease: "power2.in"
        }, "+=0.5")
        .to(quoteEls.current[nextIndex], {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        }, "-=0.5");
      });
    }, quotesRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-20 px-4" ref={quotesRef}>
      <div className="relative h-[200px]">
        {quotes.map((quote, index) => (
          <div
            key={index}
            ref={el => quoteEls.current[index] = el}
            className="absolute inset-0 flex flex-col items-center text-center"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(quote.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className="text-xl md:text-2xl font-medium mb-6 text-zinc-100">
              "{quote.text}"
            </p>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{quote.author}</span>
              <span className="text-sm text-zinc-400">{quote.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};