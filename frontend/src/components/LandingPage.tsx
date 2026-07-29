import { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, Github, ChevronRight, FileText, Search, Bot, Shield, Monitor, Lock, Zap, Upload, MessageSquare, Star, ArrowRight, Check } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const FeatureCard = ({ icon, title, desc, delay = 0 }: { icon: React.ReactNode; title: string; desc: string; delay?: number }) => (
  <div
    className="gradient-border rounded-xl p-4 flex gap-3 items-start hover:bg-white/5 transition-all duration-300 cursor-default group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-white font-semibold text-sm leading-tight">{title}</p>
      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const PricingCard = ({ plan, price, features, highlighted = false }: { plan: string; price: string; features: string[]; highlighted?: boolean }) => (
  <div className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${highlighted ? 'border-purple-500 bg-purple-500/10 glow-purple' : 'border-white/10 bg-white/5'}`}>
    {highlighted && <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">Most Popular</span>}
    <h3 className="text-white text-xl font-bold mt-3">{plan}</h3>
    <div className="flex items-baseline gap-1 mt-2">
      <span className="text-3xl font-black text-white">{price}</span>
      {price !== 'Free' && <span className="text-gray-400 text-sm">/month</span>}
    </div>
    <ul className="mt-4 space-y-2">
      {features.map(f => (
        <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          {f}
        </li>
      ))}
    </ul>
    <button className={`w-full mt-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${highlighted ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
      Get Started
    </button>
  </div>
);

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0d0d1a] text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md border-b' : ''} ${dark && scrolled ? 'bg-[#0d0d1a]/90 border-white/10' : scrolled ? 'bg-white/90 border-gray-200 shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">
              RAG<span className="text-purple-400">Genius</span>
            </span
>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing', 'Docs', 'GitHub'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-sm font-medium transition-colors hover:text-purple-400 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg transition-colors ${dark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onGetStarted}
              className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden" id="features">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 items-start">
            {/* Left features */}
            <div className="flex flex-col gap-4 lg:pt-16">
              <FeatureCard icon={<FileText className="w-5 h-5" />} title="Upload Multiple PDFs" desc="Drag & drop your documents and start chatting" />
              <FeatureCard icon={<Search className="w-5 h-5" />} title="Smart Retrieval" desc="Semantic search with FAISS & Sentence Transformers" delay={100} />
              <FeatureCard icon={<Bot className="w-5 h-5" />} title="AI-Powered Answers" desc="Get accurate, contextual answers with citations" delay={200} />
            </div>

            {/* Center hero */}
            <div className="text-center flex flex-col items-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border ${dark ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>
                <Sparkles className="w-4 h-4" />
                AI-Powered Knowledge Assistant
              </div>

              <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4">
                Chat with your PDFs,<br />
                <span className="gradient-text">Get instant answers.</span>
              </h1>

              <p className={`text-lg max-w-lg leading-relaxed mb-8 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload your documents and ask anything.<br />
                RAGGenius retrieves, understands, and answers using the power of AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onGetStarted}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5"
                >
                  Try RAGGenius Now <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 border hover:-translate-y-0.5 ${dark ? 'bg-white/5 border-white/20 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'}`}
                >
                  View on GitHub <Github className="w-4 h-4" />
                </a>
              </div>

              {/* Stats */}
              <div className={`flex gap-8 mt-12 pt-8 border-t ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                {[['10K+', 'Documents Processed'], ['99.9%', 'Uptime'], ['< 2s', 'Response Time']].map(([stat, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-black text-purple-400">{stat}</div>
                    <div className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right features */}
            <div className="flex flex-col gap-4 lg:pt-16">
              <FeatureCard icon={<Shield className="w-5 h-5" />} title="Source Attribution" desc="Every answer comes with sources and exact pages" />
              <FeatureCard icon={<Monitor className="w-5 h-5" />} title="Modern & Responsive" desc="Beautiful UI with dark/light mode support" delay={100} />
              <FeatureCard icon={<Lock className="w-5 h-5" />} title="Secure & Private" desc="Your documents are safe and never shared" delay={200} />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className={`py-20 px-6 ${dark ? 'bg-[#0f0f1e]' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black">How it <span className="gradient-text">Works</span></h2>
            <p className={`mt-3 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Get answers from your PDFs in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Upload className="w-6 h-6" />, step: '01', title: 'Upload Documents', desc: 'Drag and drop your PDFs or click to upload. Support for multiple files simultaneously.' },
              { icon: <Zap className="w-6 h-6" />, step: '02', title: 'AI Processes & Indexes', desc: 'Our AI chunks, embeds, and indexes your documents using FAISS for lightning-fast retrieval.' },
              { icon: <MessageSquare className="w-6 h-6" />, step: '03', title: 'Ask & Get Answers', desc: 'Chat naturally with your documents. Get cited answers with exact page references.' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className={`relative p-6 rounded-2xl border text-center group hover:-translate-y-1 transition-all duration-300 ${dark ? 'bg-white/5 border-white/10 hover:border-purple-500/40' : 'bg-gray-50 border-gray-200 hover:border-purple-300'}`}>
                <div className="absolute -top-3 left-6 text-xs font-black text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">{step}</div>
                <div className="inline-flex p-3 rounded-xl bg-purple-500/20 text-purple-400 mb-4 group-hover:bg-purple-500/30 transition-colors">
                  {icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black">Simple <span className="gradient-text">Pricing</span></h2>
            <p className={`mt-3 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Start free, scale as you grow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard plan="Starter" price="Free" features={['5 documents', '100 questions/month', 'GPT-3.5', 'Basic support']} />
            <PricingCard plan="Pro" price="$19" features={['Unlimited documents', '1,000 questions/month', 'GPT-4o', 'Priority support', 'Custom collections']} highlighted />
            <PricingCard plan="Enterprise" price="$49" features={['Everything in Pro', 'Unlimited questions', 'Private deployment', 'API access', 'Dedicated support']} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`rounded-3xl p-12 border ${dark ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'}`}>
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-3">Ready to unlock your documents?</h2>
            <p className={`mb-8 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Join thousands of users getting instant answers from their PDFs.</p>
            <button
              onClick={onGetStarted}
              className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
            >
              Get Started Free <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-8 px-6 ${dark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black">RAG<span className="text-purple-400">Genius</span></span>
          </div>
          <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-500'}`}>© 2026 RAGGenius. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'GitHub'].map(item => (
              <a key={item} href="#" className={`text-sm transition-colors hover:text-purple-400 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
