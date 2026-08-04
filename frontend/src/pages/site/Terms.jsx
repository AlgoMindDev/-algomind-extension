import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail, ShieldAlert, CheckCircle2, Cpu, Scale, AlertOctagon, Clock, Bookmark } from 'lucide-react';
import SiteLayout from '../../components/site/SiteLayout.jsx';

const tocSections = [
  { id: 'about', title: '1. About AlgoMind' },
  { id: 'eligibility', title: '2. Eligibility' },
  { id: 'responsibilities', title: '3. User Responsibilities' },
  { id: 'prohibited', title: '4. Prohibited Activities' },
  { id: 'ip', title: '5. Intellectual Property' },
  { id: 'ai-features', title: '6. AI Features' },
  { id: 'availability', title: '7. Service Availability' },
  { id: 'liability', title: '8. Limitation of Liability' },
  { id: 'termination', title: '9. Account Termination' },
  { id: 'changes', title: '10. Changes to Terms' },
  { id: 'contact', title: '11. Contact Us' },
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (const section of tocSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-14"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20 shadow-xs mb-1">
            <FileText size={28} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            Terms and conditions governing your use of the AlgoMind web application, Chrome Extension, and AI review services.
          </p>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-[#a78bfa]">
            <Clock size={14} />
            <span>Last Updated: July 28, 2026</span>
          </div>
        </motion.div>

        {/* Content Layout with Sticky Desktop TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Desktop Sticky Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-3 p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0d101f]/80 backdrop-blur-xl shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-[#a78bfa] pb-2.5 border-b border-slate-100 dark:border-white/10">
                <Bookmark size={14} />
                <span>On This Page</span>
              </div>
              <nav className="space-y-1">
                {tocSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-all cursor-pointer truncate font-medium ${
                      activeSection === section.id
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-white font-bold border-l-2 border-indigo-600 dark:border-[#a78bfa]'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Document Card */}
          <div className="lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c0f1d]/90 backdrop-blur-xl shadow-sm text-slate-700 dark:text-slate-300 space-y-10 text-sm leading-relaxed"
            >
              <p>
                Welcome to AlgoMind! By accessing or using the AlgoMind web dashboard or Chrome Extension, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
              </p>

              {/* Section 1 */}
              <section id="about" className="space-y-3 pt-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 1. About AlgoMind
                </h2>
                <p>
                  AlgoMind is an AI-powered SaaS product featuring active recall algorithms, spaced repetition scheduling, memory analytics, and Chrome Extension automation built to assist software engineers in mastering Data Structures and Algorithms for coding interviews.
                </p>
              </section>

              {/* Section 2 */}
              <section id="eligibility" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  2. Eligibility
                </h2>
                <p>
                  You must be at least 13 years of age (or the minimum legal age in your jurisdiction) to create an account. By registering, you warrant that all information provided is accurate and truthful.
                </p>
              </section>

              {/* Section 3 */}
              <section id="responsibilities" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  3. User Responsibilities
                </h2>
                <p>As a registered user of AlgoMind, you agree to:</p>
                <ul className="list-disc pl-5 space-y-1.5 opacity-90 font-medium">
                  <li>Maintain the confidentiality of your account credentials.</li>
                  <li>Be fully responsible for all activity conducted under your account.</li>
                  <li>Use the services strictly for lawful educational and personal skill development purposes.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="prohibited" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert size={20} className="text-rose-500" /> 4. Prohibited Activities
                </h2>
                <p>Users are strictly prohibited from:</p>
                <ul className="list-disc pl-5 space-y-1.5 opacity-90 font-medium">
                  <li>Reverse engineering, decompiling, or attempting to extract source code from the AlgoMind extension or backend APIs.</li>
                  <li>Attempting to bypass platform rate limits or security authentication layers.</li>
                  <li>Automating unauthorized mass scraping of other users' recall analytics.</li>
                  <li>Using AlgoMind to distribute malicious scripts or harmful payloads.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="ip" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  5. Intellectual Property
                </h2>
                <p>
                  All AlgoMind branding, algorithms, interface mockups, graphics, and codebase rights remain the exclusive property of AlgoMind Inc. Your code submissions and personal notes remain your personal property.
                </p>
              </section>

              {/* Section 6 */}
              <section id="ai-features" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 6. AI Features & Output
                </h2>
                <p>
                  AlgoMind utilizes AI models to provide hints, complexity analysis, and memory recommendations. While we strive for high accuracy, AI feedback is provided "as is" as an educational supplement and should not replace critical problem-solving logic.
                </p>
              </section>

              {/* Section 7 */}
              <section id="availability" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  7. Service Availability & Maintenance
                </h2>
                <p>
                  We aim for 99.9% uptime. However, service availability may be temporarily affected by scheduled maintenance, infrastructure updates, or third-party platform API changes (e.g. LeetCode layout updates).
                </p>
              </section>

              {/* Section 8 */}
              <section id="liability" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 8. Limitation of Liability
                </h2>
                <p>
                  To the maximum extent permitted by applicable law, AlgoMind Inc. shall not be liable for indirect, incidental, or consequential damages resulting from lost data, service interruptions, or interview outcomes.
                </p>
              </section>

              {/* Section 9 */}
              <section id="termination" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertOctagon size={20} className="text-amber-500" /> 9. Account Termination
                </h2>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these Terms. Users may voluntarily delete their account at any time via the <a href="/data-deletion" className="text-indigo-600 dark:text-[#a78bfa] font-bold underline">Data Deletion Page</a>.
                </p>
              </section>

              {/* Section 10 */}
              <section id="changes" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  10. Changes to Terms
                </h2>
                <p>
                  We may revise these Terms from time to time. Continued use of AlgoMind after published revisions constitutes acceptance of the updated Terms.
                </p>
              </section>

              {/* Section 11 */}
              <section id="contact" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 11. Contact Us
                </h2>
                <p>For questions or legal inquiries regarding these Terms, please contact:</p>
                <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 inline-flex items-center gap-3">
                  <Mail size={20} className="text-indigo-600 dark:text-[#a78bfa]" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Legal Contact</p>
                    <a href="mailto:algomind.help@gmail.com" className="text-sm font-bold text-indigo-600 dark:text-[#a78bfa] hover:underline">
                      algomind.help@gmail.com
                    </a>
                  </div>
                </div>
              </section>
            </motion.div>
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}
