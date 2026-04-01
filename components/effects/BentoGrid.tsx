'use client';

import { motion } from 'framer-motion';

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  size?: 'normal' | 'wide' | 'tall';
}

function BentoCard({
  title,
  description,
  icon,
  className = '',
  size = 'normal'
}: BentoCardProps) {
  const sizeClasses = {
    normal: 'col-span-1 row-span-1',
    wide: 'col-span-1 md:col-span-2',
    tall: 'row-span-1 md:row-span-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`
        relative overflow-hidden rounded-3xl bg-surface border border-border p-6 lg:p-8
        hover:shadow-2xl hover:border-accent/30 transition-all duration-300 group
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <div className="text-accent">
            {icon}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
          {title}
        </h3>
        <p className="text-muted text-sm leading-relaxed flex-1">
          {description}
        </p>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function BentoGrid({
  children,
  className = ''
}: BentoGridProps) {
  return (
    <div
      className={`
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[280px]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export { BentoCard };
