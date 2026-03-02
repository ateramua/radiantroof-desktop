// app/page.js
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Todos from "@/components/Todos";

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

// Animated floating particles
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm animate-float"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.1))`,
          }}
        />
      ))}
    </div>
  );
};

// Spiritual Quote Carousel
const SpiritualQuote = ({ quote, index, isActive }) => {
  const themeColors = {
    gratitude: "from-amber-400 to-orange-500",
    peace: "from-blue-400 to-cyan-500",
    love: "from-rose-400 to-pink-500",
    heart: "from-red-400 to-rose-500",
    safety: "from-emerald-400 to-teal-500",
    faith: "from-purple-400 to-indigo-500",
    blessing: "from-yellow-400 to-amber-500"
  };

  const color = themeColors[quote.theme] || "from-blue-400 to-purple-500";

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center px-4">
        {/* Decorative elements */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-300/20 to-amber-300/20 rounded-full blur-3xl"></div>
          </div>
          <span className="relative text-6xl text-yellow-500/50">"</span>
        </div>

        {/* Quote text with gradient */}
        <p className={`text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-r ${color} bg-clip-text text-transparent leading-relaxed mb-6 animate-fadeIn`}>
          {quote.text}
        </p>

        {/* Source with decorative line */}
        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-400"></div>
          <p className="text-lg text-gray-500 font-medium italic">
            — {quote.source}
          </p>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-400"></div>
        </div>

        {/* Floating spiritual symbols */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-6 text-3xl text-white/30">
          <span className="animate-bounce delay-100">🕊️</span>
          <span className="animate-bounce delay-200">✨</span>
          <span className="animate-bounce delay-300">☯️</span>
          <span className="animate-bounce delay-400">🕉️</span>
          <span className="animate-bounce delay-500">🔯</span>
        </div>
      </div>
    </div>
  );
};

// Animated lotus background
const LotusBackground = () => (
  <div className="absolute inset-0 overflow-hidden opacity-10">
    <svg className="absolute top-10 left-10 w-64 h-64 text-yellow-500 animate-float" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10 Q60 30 50 50 Q40 30 50 10 M30 30 Q45 40 40 60 Q25 50 30 30 M70 30 Q55 40 60 60 Q75 50 70 30 M20 50 Q40 55 35 75 Q15 70 20 50 M80 50 Q60 55 65 75 Q85 70 80 50" />
    </svg>
    <svg className="absolute bottom-10 right-10 w-48 h-48 text-purple-500 animate-float delay-2000" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10 Q60 30 50 50 Q40 30 50 10 M30 30 Q45 40 40 60 Q25 50 30 30 M70 30 Q55 40 60 60 Q75 50 70 30" />
    </svg>
  </div>
);

// Meditation timer component (just for aesthetics)
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
    <div className={`fixed top-24 right-8 transition-opacity duration-500 ${isRinging ? 'opacity-100' : 'opacity-30'}`}>
      <div className="relative">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl">🔔</span>
        </div>
        {isRinging && (
          <>
            <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping"></div>
            <div className="absolute -top-10 -right-10 text-amber-600 animate-bounce">🕉️</div>
          </>
        )}
      </div>
    </div>
  );
};

// Spiritual blessing cards
const BlessingCard = ({ title, blessing, icon }) => (
  <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative">
      <div className="text-4xl mb-4 transform group-hover:rotate-12 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm italic">{blessing}</p>
    </div>
  </div>
);

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
      {/* Animated background layers - fixed SVG */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

      <FloatingParticles />
      <LotusBackground />
      <MeditationBell />
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-4 py-12">
        {/* Spiritual quote carousel */}
        <div className="relative w-full h-[400px] md:h-[500px] mb-12">
          {spiritualQuotes.map((quote, index) => (
            <SpiritualQuote
              key={index}
              quote={quote}
              index={index}
              isActive={index === currentQuoteIndex}
            />
          ))}
        </div>

        {/* Welcome message with spiritual essence */}
        <div className="relative text-center mb-12 animate-fadeInUp">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
              Radiant Roof Realty
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Where earthly dwellings meet divine purpose. Every property tells a story,
            every home holds a prayer, and every investment serves a higher calling.
          </p>
        </div>

        {/* Blessings grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <BlessingCard
            title="Sacred Spaces"
            blessing="May your investments create sanctuaries of peace and prosperity for generations to come."
            icon="🕊️"
          />
          <BlessingCard
            title="Divine Abundance"
            blessing="As you sow in faith, may you reap in abundance. Your work is blessed."
            icon="✨"
          />
          <BlessingCard
            title="Eternal Foundation"
            blessing="Build not just houses, but legacies that stand the test of time."
            icon="🏛️"
          />
        </div>

        {/* CTA buttons with spiritual touch */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
          <Link
            href="/login"
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>Enter with Peace</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">🕯️</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            href="/register"
            className="group px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <span>Begin Your Journey</span>
            <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">☸️</span>
          </Link>
        </div>

        {/* Spiritual chant / mantra */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm font-mono animate-pulse">
            ॐ शांति ॐ • Om Shanti Om • བཀྲ་ཤིས་བདེ་ལེགས།
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-white/30 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
          <div>
            <h1>My Todos</h1>
            <Todos />
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(20px, -20px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
        
        .duration-2000 {
          transition-duration: 2000ms;
        }
      `}</style>
    </div>
  );
}