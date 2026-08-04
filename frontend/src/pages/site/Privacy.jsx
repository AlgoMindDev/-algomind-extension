import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, Cpu, UserCheck, Mail, Clock, Bookmark } from 'lucide-react';
import SiteLayout from '../../components/site/SiteLayout.jsx';

const tocSections = [
  { id: 'collection', title: '1. Information We Collect' },
  { id: 'usage', title: '2. How We Use Your Data' },
  { id: 'ai-processing', title: '3. AI Processing' },
  { id: 'extension', title: '4. Chrome Extension Permissions' },
  { id: 'sharing', title: '5. Data Sharing' },
  { id: 'security', title: '6. Data Security' },
  { id: 'rights', title: '7. User Rights' },
  { id: 'children', title: '8. Children\'s Privacy' },
  { id: 'updates', title: '9. Policy Updates' },
  { id: 'contact', title: '10. Contact Us' },
];

export default function Privacy() {
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
            <ShieldCheck size={28} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            How AlgoMind collects, processes, and protects your personal learning data and extension permissions.
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
              {/* Commitment Banner */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-slate-800 dark:text-indigo-200 flex items-start gap-3">
                <Lock size={20} className="text-indigo-600 dark:text-[#a78bfa] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-[#a78bfa]">Privacy First Commitment</p>
                  <p className="text-xs mt-1 leading-relaxed font-medium opacity-90">
                    AlgoMind prioritizes your privacy. We process learning signals to generate personalized spaced-repetition schedules. We do not sell your personal data or code submissions to third-party advertisers.
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <section id="collection" className="space-y-3 pt-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 1. Information We Collect
                </h2>
                <p>
                  When you register and use the AlgoMind web application or Chrome Extension, we collect the following categories of information:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 opacity-90 font-medium">
                  <li><strong>Account Information:</strong> Full name, email address, password hash, and profile preferences.</li>
                  <li><strong>DSA Session Signals:</strong> Solved problem titles, difficulty levels, completion time, confidence ratings, and topic tags from supported coding platforms (LeetCode, HackerRank, Codeforces).</li>
                  <li><strong>Technical Telemetry:</strong> Browser type, operating system version, device resolution, and extension version logs to maintain stability.</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section id="usage" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 2. How We Use Your Data
                </h2>
                <p>We use the collected information strictly for product enhancement and active recall features:</p>
                <ul className="list-disc pl-5 space-y-1.5 opacity-90 font-medium">
                  <li>To compute your personalized spaced-repetition memory curve and optimal review schedule.</li>
                  <li>To provide AI-assisted insights into problem solving velocity and topic weaknesses.</li>
                  <li>To synchronize problem recall status across the Chrome Extension and Dashboard.</li>
                  <li>To send critical account alerts and service security updates.</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="ai-processing" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 3. AI Processing
                </h2>
                <p>
                  AlgoMind incorporates AI memory models to analyze problem recall history. Submissions sent for AI analysis are processed securely using encrypted API channels. Your code submissions are evaluated exclusively to generate targeted hints, time complexity analysis, and recall recommendations.
                </p>
              </section>

              {/* Section 4 */}
              <section id="extension" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 4. Chrome Extension Permissions
                </h2>
                <p>The AlgoMind Chrome Extension requests minimal scope permissions required for operation:</p>
                <ul className="list-disc pl-5 space-y-1.5 opacity-90 font-medium">
                  <li><strong>Host Permissions (e.g. leetcode.com):</strong> Used solely to detect when a problem is accepted and record completion duration.</li>
                  <li><strong>Storage API:</strong> Used to persist local offline session queues and authentication tokens securely.</li>
                  <li><strong>ActiveTab:</strong> Used to render the AlgoMind overlay widget on active problem pages upon user interaction.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="sharing" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  5. Data Sharing & Third Parties
                </h2>
                <p>
                  We do not sell, rent, or trade your personal data. Data is shared only with trusted cloud infrastructure providers (e.g., database hosts and authentication service providers) operating under strict data protection agreements.
                </p>
              </section>

              {/* Section 6 */}
              <section id="security" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  6. Data Security
                </h2>
                <p>
                  All data in transit is encrypted using Industry-standard TLS/SSL encryption protocols. Passwords are cryptographically salted and hashed. We implement routine security scans and permission auditing to safeguard your data.
                </p>
              </section>

              {/* Section 7 */}
              <section id="rights" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 7. User Rights
                </h2>
                <p>Depending on your jurisdiction, you possess the right to:</p>
                <ul className="list-disc pl-5 space-y-1.5 opacity-90 font-medium">
                  <li>Access a copy of your stored learning records.</li>
                  <li>Request correction of inaccurate account information.</li>
                  <li>Request permanent deletion of your account and learning data (visit our <a href="/data-deletion" className="text-indigo-600 dark:text-[#a78bfa] font-bold underline">Data Deletion Page</a>).</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="children" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  8. Children's Privacy
                </h2>
                <p>
                  AlgoMind is intended for students and software engineering professionals. We do not knowingly collect personal information from children under 13 years of age.
                </p>
              </section>

              {/* Section 9 */}
              <section id="updates" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  9. Updates to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy periodically to reflect product changes or legal requirements. Updated versions will feature an updated "Last Updated" date at the top of this page.
                </p>
              </section>

              {/* Section 10 */}
              <section id="contact" className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> 10. Contact Us
                </h2>
                <p>If you have any questions or concerns regarding this Privacy Policy, please reach out to our privacy team:</p>
                <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 inline-flex items-center gap-3">
                  <Mail size={20} className="text-indigo-600 dark:text-[#a78bfa]" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Official Privacy Email</p>
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
