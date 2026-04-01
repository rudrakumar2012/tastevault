'use client';

import { motion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  once?: boolean;
}

export default function TextReveal({
  text,
  className = '',
  once = true
}: TextRevealProps) {
  const words = text.split(' ');

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      className={className}
    >
      <motion.span className="inline-block overflow-hidden">
        <motion.span
          variants={{
            hidden: { y: '100%', opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              },
            },
          }}
          className="inline-block"
        >
          {text}
        </motion.span>
      </motion.span>
    </motion.div>
  );
}

export function StaggeredText({
  text,
  className = '',
  once = true,
  delay = 0.02,
}: TextRevealProps & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      className={className}
    >
      <div className="flex flex-wrap">
        {text.split(' ').map((word, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { y: '100%', opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  delay: index * delay,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              },
            }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
