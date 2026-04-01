'use client';

import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
            Terms of Service
          </h1>

          <div className="prose prose-invert max-w-none text-muted space-y-6">
            <p className="text-lg leading-relaxed">
              Last updated: April 2026
            </p>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using TasteVault, you accept and agree to be bound by the terms and conditions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Description of Service</h2>
              <p>
                TasteVault provides a recipe discovery and personal vault service that allows users to save, organize, and annotate recipes from external sources.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information when creating an account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Acceptable Use</h2>
              <p>
                You agree to use TasteVault only for lawful purposes. You are responsible for all content you submit to the service. Do not upload or share content that is illegal, harmful, or violates others' rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Intellectual Property</h2>
              <p>
                The TasteVault application, its design, and original content are owned by TasteVault. Recipe content is sourced from Themealdb and other external providers, with appropriate attribution.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Termination</h2>
              <p>
                We may terminate or suspend your access to the service at our sole discretion, without prior notice, for conduct that we believe violates this agreement or is harmful to other users or the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Disclaimer</h2>
              <p>
                The service is provided "as is" without warranties of any kind. We do not guarantee the accuracy or reliability of recipe content from external sources.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">9. Contact</h2>
              <p>
                Questions about these Terms of Service should be sent to legal@tastevault.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
