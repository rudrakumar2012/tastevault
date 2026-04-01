'use client';

import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
            Privacy Policy
          </h1>

          <div className="prose prose-invert max-w-none text-muted space-y-6">
            <p className="text-lg leading-relaxed">
              Last updated: April 2026
            </p>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
              <p>
                TasteVault collects information you provide directly to us, including your name, email address, and saved recipes. When you use Google OAuth, we receive your basic profile information from Google.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services. This includes storing your saved recipes and personal notes, and authenticating your access to your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Data Storage</h2>
              <p>
                Your data is stored securely in a PostgreSQL database hosted on Neon. We implement appropriate security measures to protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Sharing Your Information</h2>
              <p>
                We do not share your personal information with third parties except as necessary to provide our services (e.g., database hosting) or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal data. You can do this through your account settings or by contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Cookies</h2>
              <p>
                We use essential cookies for authentication and session management. No tracking or advertising cookies are used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Contact</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@tastevault.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
