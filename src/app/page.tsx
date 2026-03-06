import MockupEditor from "./components/MockupEditor";
import PricingSection from "./components/PricingSection";
import EmailCapture from "./components/EmailCapture";
import FloatingSupport from "./components/FloatingSupport";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <span className="text-xl font-bold text-gray-900">SnapMock</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">How it works</a>
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Pricing</a>
            <a href="#pricing" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Get Pro</a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-16 sm:pt-20 pb-10 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-violet-50 text-violet-700 text-sm font-medium rounded-full mb-6">
            Free &bull; No Sign-up Required
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Beautiful Screenshot
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">Mockups in Seconds</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Drop your screenshot, pick a style, and download a stunning mockup. Perfect for social media, presentations, and documentation.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#editor" className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors text-sm">
              Start Creating &mdash; It&apos;s Free
            </a>
            <a href="#how-it-works" className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
              See how it works &darr;
            </a>
          </div>
        </div>
      </section>

      {/* ─── Editor ─── */}
      <section className="pb-16 sm:pb-20 px-4 sm:px-6" id="editor">
        <div className="max-w-6xl mx-auto">
          <MockupEditor />
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-violet-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Drag &amp; drop, click to browse, or paste from clipboard with Ctrl+V. Any image format works.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-fuchsia-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Choose from 12+ gradient backgrounds. Add browser or phone frames. Adjust padding, shadows, and corners.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Export as a high-resolution PNG. Share on social media, add to presentations, or use in documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust / Privacy ─── */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">100% Private</p>
                <p className="text-xs text-gray-500">Images never leave your browser</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">No Sign-up</p>
                <p className="text-xs text-gray-500">Start creating instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Unlimited Exports</p>
                <p className="text-xs text-gray-500">Free tier has no limits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why SnapMock?</h2>
          <p className="text-center text-gray-500 mb-12 max-w-lg mx-auto">Everything you need to make your screenshots look professional.</p>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-500 text-sm leading-relaxed">No sign-up, no learning curve. Drop an image and get a beautiful mockup in seconds. Paste directly from clipboard.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">12+ Backgrounds</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Curated gradient backgrounds that make your screenshots pop. Custom padding, shadows, and rounded corners.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Device Frames</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Add browser windows or phone frames for realistic device mockups. Perfect for app store listings and presentations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Email Capture ─── */}
      <EmailCapture />

      {/* ─── Pricing ─── */}
      <PricingSection />

      {/* ─── FAQ ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
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
                a: "It\u2019s a one-time $9 payment via Buy Me a Coffee. You get a license key that activates Pro features in your browser. No subscription, no recurring charges. One key works on all your devices.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make Beautiful Mockups?</h2>
          <p className="text-gray-500 mb-8">Join thousands of creators who use SnapMock to make their content stand out.</p>
          <a href="#editor" className="inline-block px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors">
            Start Creating &mdash; Free Forever
          </a>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-10 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <span className="font-semibold text-gray-900">SnapMock</span>
          </div>
          <p className="text-sm text-gray-400">Built for creators, developers, and marketers.</p>
        </div>
      </footer>

      {/* ─── Floating Buy Me a Coffee ─── */}
      <FloatingSupport />
    </div>
  );
}
