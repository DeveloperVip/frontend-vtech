'use client';
import { motion } from 'framer-motion';
import BannerEffects from '../../ultilites/BannerEffects';
import OrbBackground from '../../ultilites/OrbBackground';
import ThreadsBackground from '../../ultilites/ThreadsBackground';
import RippleGridBackground from '../../ultilites/RippleGridBackground';
import Hyperspeed from '@/ultilites/Hyperspeed';

interface AnimatedHeaderProps {
  title: string;
  subtitle: string;
  background?: 'default' | 'orb' | 'threads' | 'ripple-grid' | 'hyperspeed';
  intensity?: 'soft' | 'medium' | 'bold';
}

export default function AnimatedHeader({ title, subtitle, background = 'default', intensity = 'medium' }: AnimatedHeaderProps) {
  return (
    <div
      className="relative overflow-hidden text-white pt-20 pb-16"
      style={{ background: 'linear-gradient(90deg,rgba(215, 247, 250, 1) 0%, rgba(69, 133, 230, 1) 0%, rgba(188, 160, 250, 1) 100%, rgba(124, 166, 230, 1) 82%)' }}
    >
      {background === 'orb' && <OrbBackground intensity={intensity} />}
      {background === 'threads' && <ThreadsBackground intensity={intensity} />}
      {background === 'ripple-grid' && <RippleGridBackground intensity={intensity} />}
      {background === 'hyperspeed' && <Hyperspeed color='white' />}
      {background === 'default' && <BannerEffects variant="light" intensity={intensity} />}

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[1440px] mx-auto px-2 md:px-4 relative z-10 text-white text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
        <p className="text-blue-100 text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      </motion.div>
    </div>
  );
}
