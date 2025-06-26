'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60')"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t('hero.welcome')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              {t('hero.brandName')}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t('hero.subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl transition-all duration-300 transform hover:shadow-orange-500/25"
              >
                <span className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <span>{t('hero.browseMenu')}</span>
                  <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Simplified Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-32 right-16 w-12 h-12 bg-red-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-20 w-8 h-8 bg-yellow-400/20 rounded-full blur-lg" />
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero; 