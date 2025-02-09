import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AnimatedHeading = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full flex items-center justify-center gap-3 py-6 mt-[-16px]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-purple-500/30 to-blue-500/30 blur-xl" />
      <div className="relative bg-black/50 px-8 py-4 rounded-2xl backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
            BI Agent
          </h1>
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedHeading;