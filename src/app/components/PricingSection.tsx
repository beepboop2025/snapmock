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
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full text-white font-semibold text-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Pro Activated
          </div>
          <p className="mt-4 text-gray-500">
            You have full access to all Pro features including watermark-free exports and 4x resolution.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-center text-gray-500 mb-12">Use SnapMock free forever, or upgrade for premium features.</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-400">forever</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> Unlimited mockups</li>
                <li className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> All backgrounds &amp; frames</li>
                <li className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> 2x resolution export</li>
                <li className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> Clipboard paste support</li>
                <li className="flex items-center gap-2 text-gray-400"><span className="font-bold">&times;</span> Includes small watermark</li>
              </ul>
              <a href="#editor" className="mt-6 block w-full text-center py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Start Creating
              </a>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-500 p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">POPULAR</div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{CONFIG.PRO_PRICE}</span>
                <span className="text-white/60">{CONFIG.PRO_PRICE_LABEL}</span>
              </div>
              {CONFIG.PRO_PRICE_INR && (
                <p className="text-white/50 text-sm mt-1">~₹{CONFIG.PRO_PRICE_INR} INR</p>
              )}
              <ul className="mt-6 space-y-3 text-sm text-white/90">
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> Everything in Free</li>
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> No watermark</li>
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> 4x resolution export</li>
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> Custom color backgrounds</li>
                <li className="flex items-center gap-2"><span className="font-bold">&#10003;</span> Priority support</li>
              </ul>
              <button onClick={handleCheckout} className="mt-6 w-full bg-white text-violet-700 font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors cursor-pointer">
                Get Pro Access
              </button>
              <button onClick={() => setShowKeyInput(!showKeyInput)} className="mt-2 w-full text-center text-white/70 text-xs hover:text-white transition-colors cursor-pointer">
                Already have a license key?
              </button>
            </div>
          </div>

          {/* License Key Activation */}
          {showKeyInput && (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Activate License Key</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => { setLicenseKey(e.target.value); setKeyError(""); }}
                  placeholder="Enter your license key..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                />
                <button onClick={handleActivate} className="px-5 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
                  Activate
                </button>
              </div>
              {keyError && <p className="text-red-500 text-xs mt-2">{keyError}</p>}
            </div>
          )}
        </div>
      </section>

      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} mode="pro" />
    </>
  );
}
