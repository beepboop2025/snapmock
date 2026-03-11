import MockupEditor from "./components/MockupEditor";
import PricingSection from "./components/PricingSection";
import EmailCapture from "./components/EmailCapture";
import FloatingSupport from "./components/FloatingSupport";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ---- Navbar ---- */}
      <nav className="sticky top-0 z-50 glass border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20 transition-all duration-300 group-hover:shadow-violet-500/30 group-hover:scale-105" />
            <span className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-violet-200">SnapMock</span>
          </a>
          <div className="flex items-center gap-1">
            <a href="#how-it-works" className="text-sm text-white/45 hover:text-white/90 transition-all duration-300 hidden sm:block px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">How it works</a>
            <a href="#features" className="text-sm text-white/45 hover:text-white/90 transition-all duration-300 hidden sm:block px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">Features</a>
            <a href="#pricing" className="text-sm text-white/45 hover:text-white/90 transition-all duration-300 hidden sm:block px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">Pricing</a>
            <a href="#pricing" className="relative ml-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98]">
              Get Pro
            </a>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-fuchsia-500/8 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
        <div className="absolute top-60 left-1/2 w-48 h-48 bg-blue-500/6 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: "12s", animationDelay: "4s" }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="stagger-item inline-block px-4 py-1.5 glass rounded-full mb-8 text-sm font-medium text-violet-300/90 border border-violet-500/20">
            Free &bull; No Sign-up Required
          </div>
          <h1 className="stagger-item text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight" style={{ animationDelay: "100ms" }}>
            <span className="text-white">Beautiful Screenshot</span>
            <br />
            <span className="gradient-text">Mockups in Seconds</span>
          </h1>
          <p className="stagger-item mt-6 text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: "200ms" }}>
            Drop your screenshot, pick a style, and download a stunning mockup. Perfect for social media, presentations, and documentation.
          </p>
          <div className="stagger-item mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: "300ms" }}>
            <a href="#editor" className="group relative px-7 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white font-semibold rounded-xl transition-all duration-300 text-sm hover:shadow-xl hover:shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98]">
              Start Creating &mdash; It&apos;s Free
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            </a>
            <a href="#how-it-works" className="px-7 py-3.5 text-white/50 hover:text-white font-medium text-sm transition-all duration-300 hover:bg-white/[0.04] rounded-xl">
              See how it works &darr;
            </a>
          </div>
        </div>
      </section>

      {/* ---- Editor ---- */}
      <section className="pb-20 sm:pb-28 px-4 sm:px-6" id="editor">
        <div className="max-w-6xl mx-auto">
          <MockupEditor />
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 border-y border-white/[0.04] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">How It Works</h2>
          <p className="text-center text-white/30 mb-14 max-w-lg mx-auto">Three simple steps to stunning mockups.</p>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line between steps (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-gradient-to-r from-violet-500/20 via-fuchsia-500/15 to-blue-500/20" />
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative z-10 w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-5 transition-all duration-500 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-violet-500/10 group-hover:-translate-y-1">
                <span className="text-xl font-bold text-violet-400 transition-colors duration-300 group-hover:text-violet-300">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-violet-200">Upload</h3>
              <p className="text-sm text-white/35 leading-relaxed">
                Drag &amp; drop, click to browse, or paste from clipboard with Ctrl+V. Any image format works.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative z-10 w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-5 transition-all duration-500 group-hover:bg-fuchsia-500/10 group-hover:border-fuchsia-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-fuchsia-500/10 group-hover:-translate-y-1">
                <span className="text-xl font-bold text-fuchsia-400 transition-colors duration-300 group-hover:text-fuchsia-300">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-fuchsia-200">Customize</h3>
              <p className="text-sm text-white/35 leading-relaxed">
                Choose from 12+ gradient backgrounds. Add browser or phone frames. Adjust padding, shadows, and corners.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative z-10 w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-5 transition-all duration-500 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/10 group-hover:-translate-y-1">
                <span className="text-xl font-bold text-blue-400 transition-colors duration-300 group-hover:text-blue-300">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-blue-200">Download</h3>
              <p className="text-sm text-white/35 leading-relaxed">
                Export as a high-resolution PNG. Share on social media, add to presentations, or use in documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Trust / Privacy ---- */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-panel flex items-center gap-3 p-4 rounded-xl group">
              <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-emerald-500/15 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white transition-colors duration-300 group-hover:text-emerald-200">100% Private</p>
                <p className="text-xs text-white/35">Images never leave your browser</p>
              </div>
            </div>
            <div className="glass-panel flex items-center gap-3 p-4 rounded-xl group">
              <div className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-blue-500/15 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/10">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white transition-colors duration-300 group-hover:text-blue-200">No Sign-up</p>
                <p className="text-xs text-white/35">Start creating instantly</p>
              </div>
            </div>
            <div className="glass-panel flex items-center gap-3 p-4 rounded-xl group">
              <div className="w-11 h-11 rounded-full bg-violet-500/10 border border-violet-500/15 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-violet-500/15 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-violet-500/10">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white transition-colors duration-300 group-hover:text-violet-200">Unlimited Exports</p>
                <p className="text-xs text-white/35">Free tier has no limits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 border-y border-white/[0.04] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">Why SnapMock?</h2>
          <p className="text-center text-white/35 mb-14 max-w-lg mx-auto">Everything you need to make your screenshots look professional.</p>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="glass-panel p-7 rounded-2xl group hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/5 gradient-border">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-violet-500/15 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-violet-500/15 group-hover:-translate-y-0.5">
                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-violet-200">Instant Results</h3>
              <p className="text-white/35 text-sm leading-relaxed">No sign-up, no learning curve. Drop an image and get a beautiful mockup in seconds. Paste directly from clipboard.</p>
            </div>
            <div className="glass-panel p-7 rounded-2xl group hover:scale-[1.02] hover:shadow-xl hover:shadow-fuchsia-500/5 gradient-border">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/15 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-fuchsia-500/15 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-fuchsia-500/15 group-hover:-translate-y-0.5">
                <svg className="w-6 h-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-fuchsia-200">12+ Backgrounds</h3>
              <p className="text-white/35 text-sm leading-relaxed">Curated gradient backgrounds that make your screenshots pop. Custom padding, shadows, and rounded corners.</p>
            </div>
            <div className="glass-panel p-7 rounded-2xl group hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/5 gradient-border">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-blue-500/15 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/15 group-hover:-translate-y-0.5">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-blue-200">Device Frames</h3>
              <p className="text-white/35 text-sm leading-relaxed">Add browser windows or phone frames for realistic device mockups. Perfect for app store listings and presentations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Email Capture ---- */}
      <EmailCapture />

      {/* ---- Pricing ---- */}
      <PricingSection />

      {/* ---- FAQ ---- */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 border-t border-white/[0.04] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-14">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: "Is it really free?",
                a: "Yes! The free tier includes unlimited mockups with all backgrounds, frames, and 2x resolution export. The only difference is a small watermark. Pro ($9 one-time) removes the watermark and upgrades to 4x resolution.",
              },
              {
                q: "Are my images stored anywhere?",
                a: "No. Your images never leave your browser. Everything is processed 100% locally on your device. We never upload, store, or access your screenshots.",
              },
              {
                q: "What image formats are supported?",
                a: "PNG, JPG, GIF, WebP, BMP, and more. Any image format your browser can display will work.",
              },
              {
                q: "Can I use the mockups commercially?",
                a: "Absolutely. All mockups you create are yours to use however you want \u2014 social media, marketing, presentations, documentation, client work, or anywhere else.",
              },
              {
                q: "How does the Pro license work?",
                a: "It\u2019s a one-time $9 payment through any of our supported payment methods (UPI, PayPal, and more). After payment, enter any text to activate Pro features in your browser. No subscription, no recurring charges.",
              },
            ].map((faq, i) => (
              <div key={i} className="glass-panel p-6 rounded-xl group hover:scale-[1.01]">
                <h3 className="font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-xs text-violet-400 shrink-0 transition-all duration-300 group-hover:bg-violet-500/15 group-hover:scale-105">{i + 1}</span>
                  {faq.q}
                </h3>
                <p className="text-sm text-white/35 leading-relaxed pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-violet-500/8 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">Ready to Make Beautiful Mockups?</h2>
          <p className="text-white/35 mb-10">Join thousands of creators who use SnapMock to make their content stand out.</p>
          <a href="#editor" className="group relative inline-block px-9 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98]">
            Start Creating &mdash; Free Forever
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
          </a>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="py-10 px-4 sm:px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-sm shadow-violet-500/20 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold text-white/80">SnapMock</span>
          </div>
          <p className="text-sm text-white/20">Built for creators, developers, and marketers.</p>
        </div>
      </footer>

      {/* ---- Floating Buy Me a Coffee ---- */}
      <FloatingSupport />
    </div>
  );
}
