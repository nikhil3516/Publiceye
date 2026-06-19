import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Zap, Eye, Shield, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    title: "Your City,\nYour Responsibility",
    description: "Join thousands of citizens making a difference in their communities every single day.",
    icon: Eye,
    color: "from-sky-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800",
    feature: "Active Monitoring"
  },
  {
    title: "Reporting Made\nEffortless",
    description: "Snap a photo, tag the location, and report issues in seconds. We handle the rest.",
    icon: Zap,
    color: "from-teal-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    feature: "Smart Geolocation"
  },
  {
    title: "Track Success &\nEarn Rewards",
    description: "Monitor progress in real-time, earn badges for your contributions, and level up.",
    icon: Shield,
    color: "from-indigo-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1553481199-65653c7d6daa?auto=format&fit=crop&q=80&w=800",
    feature: "Gamified Civic Action"
  }
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      navigate('/portal');
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 flex flex-col"
        >
          {/* Top Visual Section */}
          <div className={`relative h-[42vh] md:h-[48vh] bg-gradient-to-br ${slide.color} overflow-hidden rounded-b-[4rem] shadow-2xl`}>
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
            <motion.img 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              src={slide.image} 
              alt="Slide Visual" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-12 left-0 right-0 flex justify-center">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-[2rem] border border-white/30 shadow-xl">
                <slide.icon className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
              {SLIDES.map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 px-8 py-12 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 block text-slate-400`}>
                {slide.feature}
              </span>
              <h1 className="text-4xl font-black text-slate-900 mb-6 leading-[1.1] whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-sm mb-12 font-medium">
                {slide.description}
              </p>
            </motion.div>

            {/* Actions */}
            <div className="mt-auto w-full max-w-sm flex flex-col gap-4">
              <Button 
                onClick={nextSlide}
                className={`w-full h-16 rounded-[1.5rem] text-lg font-bold shadow-2xl transition-all hover:scale-[1.02] active:scale-95 bg-slate-900 text-white`}
              >
                {currentSlide === SLIDES.length - 1 ? 'Start Your Journey' : 'Continue'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {currentSlide < SLIDES.length - 1 && (
                <button 
                  onClick={() => navigate('/portal')}
                  className="py-2 text-slate-400 font-bold text-sm uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Skip
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
