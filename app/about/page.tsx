'use client';

import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
            About TasteVault
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-muted leading-relaxed mb-6">
              TasteVault is your personal culinary companion—a modern recipe discovery and organization platform built for home cooks who love to explore new flavors.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Our Mission</h2>
            <p className="text-muted leading-relaxed mb-6">
              We believe cooking at home should be joyful, inspiring, and organized. TasteVault helps you discover thousands of recipes from around the world, save your favorites, and add personal notes to make each recipe truly yours.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">What We Offer</h2>
            <ul className="space-y-3 text-muted mb-6">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>Intuitive recipe discovery with smart search</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>Personal recipe vault with customizable notes</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>Dual authentication: email/password or Google OAuth</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>Beautiful, responsive interface with smooth animations</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Built With Love</h2>
            <p className="text-muted leading-relaxed mb-6">
              TasteVault is built with modern technologies including Next.js 16, React 19, Drizzle ORM, and PostgreSQL. We're committed to providing a premium experience that feels effortless and delightful.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
