// app/page.js
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// Spiritual quotes array for rotation
const spiritualQuotes = [
  {
    text: "The earth is the Lord's, and everything in it—the world, and all who live in it.",
    source: "Psalm 24:1",
    theme: "gratitude"
  },
  {
    text: "Your home is your larger body. It grows in the sun and sleeps in the stillness of the night.",
    source: "Kahlil Gibran",
    theme: "peace"
  },
  {
    text: "A house is made of walls and beams; a home is built with love and dreams.",
    source: "Unknown",
    theme: "love"
  },
  {
    text: "Where we love is home—home that our feet may leave, but not our hearts.",
    source: "Oliver Wendell Holmes Sr.",
    theme: "heart"
  },
  {
    text: "Blessed are those who have found their place of peace, for they shall never be homeless.",
    source: "Ancient Wisdom",
    theme: "peace"
  },
  {
    text: "Every good and perfect gift is from above, coming down from the Father of lights.",
    source: "James 1:17",
    theme: "gratitude"
  },
  {
    text: "The ache for home lives in all of us, the safe place where we can go as we are.",
    source: "Maya Angelou",
    theme: "safety"
  },
  {
    text: "Unless the Lord builds the house, the builders labor in vain.",
    source: "Psalm 127:1",
    theme: "faith"
  },
  {
    text: "A home is not a place—it's a feeling of belonging and peace.",
    source: "Unknown",
    theme: "peace"
  },
  {
    text: "May the roof above us never fall in, and may we friends beneath it never fall out.",
    source: "Irish Blessing",
    theme: "blessing"
  }
];

// Animated floating particles - simplified
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

// Spiritual Quote Carousel - simplified
const SpiritualQuote = ({ quote, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center px-4">
        <p className="text-3xl md:text-4xl lg:text-5xl font-light text-white/90 leading-relaxed mb-6">
          "{quote.text}"
        </p>
        <p className="text-lg text-white/60 font-medium italic">
          — {quote.source}
        </p>
      </div>
    </div>
  );
};

// Simplified meditation bell
const MeditationBell = () => {
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed bottom-8 right-8 transition-opacity duration-500 z-50 ${isRinging ? 'opacity-100' : 'opacity-30'}`}>
      <div className="w-12 h-12 bg-amber-100/20 backdrop-blur-sm rounded-full flex items-center justify-center">
        <span className="text-2xl">🔔</span>
      </div>
    </div>
  );
};

export default function Home() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % spiritualQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Gradient orbs - reduced intensity */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>

      <FloatingParticles />
      <MeditationBell />

      {/* ONLY ONE HEADER - the imported component */}
      <Header />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-4 py-12 mt-16">
        {/* Quote carousel - positioned higher */}
        <div className="relative w-full h-[300px] mb-8">
          {spiritualQuotes.map((quote, index) => (
            <SpiritualQuote 
              key={index}
              quote={quote}
              isActive={index === currentQuoteIndex}
            />
          ))}
        </div>

        {/* Welcome message */}
        <div className="relative text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
              Radiant Roof Realty
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Where every property finds its purpose and every investment serves a higher calling.
          </p>
        </div>

        {/* Simple CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Enter Dashboard
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            Create Account
          </Link>
        </div>

        {/* Simple spiritual touch */}
        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm">
            ॐ शांति ॐ
          </p>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        div[style*="animation: float"] {
          animation: float infinite;
        }
      `}</style>
    </div>
  );
}