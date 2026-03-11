"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { useLicense } from "../hooks/useLicense";
import { CONFIG } from "../config";
import PaymentModal from "./PaymentModal";

export default function PricingSection() {
  const { isPro, activate } = useLicense();
  const [licenseKey, setLicenseKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [keyError, setKeyError] = useState("");

  const handleCheckout = () => {
    track("checkout_click");
    setShowPaymentModal(true);
  };

  const handleActivate = () => {
    setKeyError("");
    if (activate(licenseKey)) {
      track("license_activated");
      setLicenseKey("");
      setShowKeyInput(false);
    } else {
      setKeyError("Invalid license key. Please check and try again.");
    }
  };

  if (isPro) {
    return (
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="shimmer inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full text-white font-semibold text-lg shadow-lg shadow-violet-500/20">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Pro Activated
          </div>
          <p className="mt-4 text-white/40">
            You have full access to all Pro features including watermark-free exports and 4x resolution.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">Simple Pricing</h2>
          <p className="text-center text-white/35 mb-14">Use SnapMock free forever, or upgrade for premium features.</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="glass-panel p-8 rounded-2xl group hover:scale-[1.01]">
              <h3 className="text-lg font-semibold text-white">Free</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-white/30">forever</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-white/50">
                <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">&#10003;</span> Unlimited mockups</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">&#10003;</span> All backgrounds &amp; frames</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">&#10003;</span> 2x resolution export</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">&#10003;</span> Clipboard paste support</li>
                <li className="flex items-center gap-2 text-white/25"><span className="font-bold">&times;</span> Includes small watermark</li>
              </ul>
              <a href="#editor" className="btn-press mt-6 block w-full text-center py-3 border border-white/10 text-white/60 font-semibold rounded-xl hover:bg-white/[0.05] hover:border-white/15 hover:text-white/80 transition-all duration-300">
                Start Creating
              </a>
            </div>

            {/* Pro */}
            <div className="relative p-8 rounded-2xl text-white overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-xl shadow-violet-500/15 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/25 hover:scale-[1.02] group noise-overlay">
              <div className="shimmer absolute top-4 right-4 bg-white/20 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">POPULAR</div>
              <h3 className="text-lg font-semibold relative z-[2]">Pro</h3>
              <div className="mt-4 flex items-baseline gap-1 relative z-[2]">
                <span className="text-4xl font-bold">{CONFIG.PRO_PRICE}</span>
                <span className="text-white/50">{CONFIG.PRO_PRICE_LABEL}</span>
              </div>
              {CONFIG.PRO_PRICE_INR && (
                <p className="text-white/40 text-sm mt-1 relative z-[2]">~&#8377;{CONFIG.PRO_PRICE_INR} INR</p>
              )}
              <ul className="mt-6 space-y-3 text-sm text-white/80 relative z-[2]">
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> Everything in Free</li>
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> No watermark</li>
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> 4x resolution export</li>
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> Custom color backgrounds</li>
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> Priority support</li>
              </ul>
              <button
                onClick={handleCheckout}
                className="btn-press relative z-[2] mt-6 w-full bg-white text-violet-700 font-semibold py-3 rounded-xl hover:bg-white/90 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-white/20"
              >
                Get Pro Access
              </button>
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="relative z-[2] mt-2 w-full text-center text-white/50 text-xs hover:text-white/80 transition-colors duration-300 cursor-pointer"
              >
                Already have a license key?
              </button>
            </div>
          </div>

          {/* License Key Activation */}
          {showKeyInput && (
            <div className="max-w-md mx-auto mt-8 p-6 glass-panel rounded-2xl expand-in">
              <h3 className="text-sm font-semibold text-white mb-3">Activate License Key</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => { setLicenseKey(e.target.value); setKeyError(""); }}
                  placeholder="Enter your license key..."
                  className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all duration-300"
                  onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                />
                <button
                  onClick={handleActivate}
                  className="btn-press px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20"
                >
                  Activate
                </button>
              </div>
              {keyError && <p className="text-red-400 text-xs mt-2 fade-slide-in">{keyError}</p>}
            </div>
          )}
        </div>
      </section>

      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} mode="pro" />
    </>
  );
}
