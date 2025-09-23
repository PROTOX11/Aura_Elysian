import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8", showText = true }) => {
  return (
    <motion.div 
      className="flex items-center gap-3"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Flower petals */}
        <g>
          <ellipse cx="50" cy="25" rx="8" ry="12" fill="#F28BB2" transform="rotate(0 50 50)" />
          <ellipse cx="50" cy="25" rx="8" ry="12" fill="#A084DC" transform="rotate(45 50 50)" />
          <ellipse cx="50" cy="25" rx="8" ry="12" fill="#F28BB2" transform="rotate(90 50 50)" />
          <ellipse cx="50" cy="25" rx="8" ry="12" fill="#A084DC" transform="rotate(135 50 50)" />
          <ellipse cx="50" cy="25" rx="8" ry="12" fill="#F28BB2" transform="rotate(180 50 50)" />
          <ellipse cx="50" cy="25" rx="8" ry="12" fill="#A084DC" transform="rotate(225 50 50)" />
          <ellipse cx="50" cy="25" rx="8" ry="12" fill="#F28BB2" transform="rotate(270 50 50)" />
          <ellipse cx="50" cy="25" rx="8" ry="12" fill="#A084DC" transform="rotate(315 50 50)" />
        </g>
        
        {/* Flower center */}
        <circle cx="50" cy="50" r="6" fill="#F4E4BC" />
        
        {/* Candle base */}
        <rect x="45" y="55" width="10" height="25" rx="2" fill="#F5F5F0" stroke="#F4E4BC" strokeWidth="1" />
        
        {/* Candle flame */}
        <ellipse cx="50" cy="52" rx="2" ry="4" fill="#F59E0B" />
        <ellipse cx="50" cy="50" rx="1" ry="2" fill="#FFD700" />
        
        {/* droplets */}
        <circle cx="65" cy="65" r="3" fill="#A084DC" opacity="0.9" />
        <circle cx="35" cy="70" r="2" fill="#F28BB2" opacity="0.9" />
        <circle cx="70" cy="40" r="2.5" fill="#F4E4BC" opacity="0.9" />
      </motion.svg>
      
      {showText && (
        <motion.div 
          className="flex flex-col leading-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.span 
            className="font-serif text-lg font-semibold bg-gradient-to-r from-gold-600 via-purple-700 to-pink-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Aura Elysian
          </motion.span>
          <motion.span 
            className="font-serif text-xs text-gray-800 -mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Luxury Candles
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
};