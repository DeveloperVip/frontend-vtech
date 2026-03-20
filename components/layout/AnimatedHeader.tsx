'use client';
import { motion } from 'framer-motion';

interface AnimatedHeaderProps {
  title: string;
  subtitle: string;
}

export default function AnimatedHeader({ title, subtitle }: AnimatedHeaderProps) {
  return (
    <div 
      className="text-white pt-20 pb-16"
      style={{ background: 'linear-gradient(90deg,rgba(215, 247, 250, 1) 0%, rgba(69, 133, 230, 1) 0%, rgba(188, 160, 250, 1) 100%, rgba(124, 166, 230, 1) 82%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
        <p className="text-blue-100 text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      </motion.div>
    </div>
  );
}
