'use client';

import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
            Help Center
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-muted leading-relaxed mb-8">
              Find answers to common questions about using TasteVault.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">How do I save a recipe?</h2>
                <p className="text-muted leading-relaxed">
                  Look for the heart icon on recipe cards or the "Save to Vault" button on recipe detail pages. Click it to add the recipe to your personal kitchen. You'll have the option to add personal notes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Can I edit my notes later?</h2>
                <p className="text-muted leading-relaxed">
                  Yes! On your My Kitchen page, each saved recipe has a note editor. Simply edit the note and it will automatically save when you click away.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">How do I sign up?</h2>
                <p className="text-muted leading-relaxed">
                  Click the "Sign in" button in the top right, then select "Create Account" to sign up with email and password. You can also use Google OAuth for one-click sign-in.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Is my data private?</h2>
                <p className="text-muted leading-relaxed">
                  Yes. Your saved recipes and notes are stored securely in your personal account and are only accessible by you. We never share your data with third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Can I delete my account?</h2>
                <p className="text-muted leading-relaxed">
                  Yes. If you'd like to delete your account and all associated data, please contact us at support@tastevault.com.
                </p>
              </section>
            </div>

            <div className="mt-12 p-6 bg-surface border border-border rounded-2xl">
              <h3 className="text-xl font-bold text-foreground mb-3">Still need help?</h3>
              <p className="text-muted mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold rounded-full hover:bg-accent-hover transition-all duration-200"
              >
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
