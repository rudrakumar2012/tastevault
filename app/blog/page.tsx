'use client';

import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const blogPosts = [
  {
    title: '10 Tips for Perfect Homemade Bread',
    excerpt: 'Learn the secrets to baking bakery-quality bread at home, from yeast activation to proper kneading techniques.',
    date: 'Mar 15, 2025',
    image: '🍞',
  },
  {
    title: 'The Art of Pairing Wine with Food',
    excerpt: 'A beginner\'s guide to understanding wine pairings that will elevate your dining experience.',
    date: 'Mar 10, 2025',
    image: '🍷',
  },
  {
    title: 'Meal Prep Strategies for Busy Weeknights',
    excerpt: 'Save time and reduce stress with our comprehensive meal prep guide for the modern home cook.',
    date: 'Mar 5, 2025',
    image: '⏰',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-xl text-muted max-w-2xl mb-12">
            Cooking tips, recipes, and stories from our community of food lovers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-accent/30 transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-accent/20 to-surface flex items-center justify-center text-6xl">
                  {post.image}
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted mb-2">{post.date}</p>
                  <h3 className="text-xl font-bold text-foreground mb-3 hover:text-accent transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <button className="text-accent font-medium text-sm hover:text-accent-hover transition-colors">
                    Read more →
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
