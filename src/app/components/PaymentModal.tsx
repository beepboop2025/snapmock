"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import { useLicense } from "../hooks/useLicense";
import { CONFIG } from "../config";
import {
  buildMethods,
  buildUpiDeepLink,
  buildUpiQrUrl,
  buildPaypalUrl,
  buildBmacUrl,
  resolveWallets,
} from "../lib/payment";

type PaymentMethod = "upi" | "paypal" | "bmac" | "crypto";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "pro" | "tip"; // "pro" = buying Pro license, "tip" = general support
}

export default function PaymentModal({ isOpen, onClose, mode }: PaymentModalProps) {
  const { activate } = useLicense();
  const [step, setStep] = useState<"pay" | "activate">("pay");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [licenseKey, setLicenseKey] = useState("");
  const [keyError, setKeyError] = useState("");
  const [copied, setCopied] = useState("");
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0);

  // Reset all internal state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("pay");
      setSelectedMethod(null);
      setLicenseKey("");
      setKeyError("");
      setCopied("");
      setSelectedWalletIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine which payment methods are available (pure logic in lib/payment)
  const methods = buildMethods(CONFIG);

  const availableMethods = methods.filter((m) => m.available);
  const hasAnyMethod = availableMethods.length > 0;

  const amount = mode === "pro" ? CONFIG.PRO_PRICE : "any amount";
  const amountINR = mode === "pro" && CONFIG.PRO_PRICE_INR ? `\u20B9${CONFIG.PRO_PRICE_INR}` : null;

  const upiDeepLink = buildUpiDeepLink(CONFIG, mode);

  const upiQrUrl = buildUpiQrUrl(upiDeepLink);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleActivate = () => {
    setKeyError("");
    if (activate(licenseKey)) {
      track("license_activated", { method: selectedMethod || "direct" });
      onClose();
      setStep("pay");
      setLicenseKey("");
      setSelectedMethod(null);
    } else {
      setKeyError("Enter at least 8 characters to activate.");
    }
  };

  const handlePaid = () => {
    track("payment_completed", { method: selectedMethod, mode });
    if (mode === "pro") {
      setStep("activate");
    } else {
      onClose();
      setStep("pay");
      setSelectedMethod(null);
    }
  };

  const renderMethodDetails = () => {
    switch (selectedMethod) {
      case "upi":
        return (
          <div className="space-y-4 fade-slide-in">
            <div className="bg-white/[0.03] rounded-xl p-4 text-center border border-white/[0.06]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={upiQrUrl} alt="UPI QR Code" className="mx-auto rounded-lg" width={200} height={200} />
              <p className="text-xs text-white/30 mt-2">Scan with any UPI app</p>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3">
              <span className="text-sm text-white/50 flex-1 font-mono truncate">{CONFIG.UPI_ID}</span>
              <button
                onClick={() => handleCopy(CONFIG.UPI_ID)}
                className={`text-xs font-semibold shrink-0 transition-all duration-300 px-2.5 py-1 rounded-md ${
                  copied === CONFIG.UPI_ID
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                }`}
              >
                {copied === CONFIG.UPI_ID ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 check-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Copied!
                  </span>
                ) : "Copy"}
              </button>
            </div>
            <a
              href={upiDeepLink}
              className="block w-full text-center py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 hover:scale-[1.01] active:scale-[0.99]"
              onClick={() => track("upi_deeplink_click")}
            >
              Pay {amountINR || amount} via UPI App
            </a>
          </div>
        );

      case "paypal":
        return (
          <div className="space-y-4 fade-slide-in">
            <p className="text-sm text-white/40 text-center">Click below to open PayPal and send {amount}</p>
            <a
              href={buildPaypalUrl(CONFIG.PAYPAL_USERNAME, mode)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-[#0070BA] hover:bg-[#005C9A] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#0070BA]/20 hover:scale-[1.01] active:scale-[0.99]"
              onClick={() => track("paypal_click")}
            >
              Pay with PayPal
            </a>
          </div>
        );

      case "bmac":
        return (
          <div className="space-y-4 fade-slide-in">
            <p className="text-sm text-white/40 text-center">Support via Buy Me a Coffee</p>
            <a
              href={buildBmacUrl(CONFIG.BMAC_USERNAME)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-[#FFDD00] hover:bg-[#FFD000] text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFDD00]/20 hover:scale-[1.01] active:scale-[0.99]"
              onClick={() => track("bmac_click")}
            >
              Buy Me a Coffee
            </a>
          </div>
        );

      case "crypto": {
        const wallets = resolveWallets(CONFIG);
        const activeWallet = wallets[selectedWalletIndex] || wallets[0];
        if (!activeWallet) return null;

        return (
          <div className="space-y-4 fade-slide-in">
            <p className="text-sm text-white/40 text-center">
              Send {amount} to the address below
            </p>
            {/* Network selector -- only show when multiple wallets */}
            {wallets.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {wallets.map((w, i) => (
                  <button
                    key={w.network}
                    onClick={() => { setSelectedWalletIndex(i); setCopied(""); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${
                      i === selectedWalletIndex
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                        : "border border-white/8 hover:border-white/15 text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
                    }`}
                  >
                    {w.icon} {w.network}
                  </button>
                ))}
              </div>
            )}
            {/* Selected network label */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-white/[0.05] border border-white/[0.06] rounded-full text-xs font-semibold text-white/60">
                {activeWallet.icon} {activeWallet.network}
              </span>
            </div>
            {/* Address */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3">
              <p className="text-xs font-mono text-white/50 break-all text-center">{activeWallet.address}</p>
            </div>
            <button
              onClick={() => { handleCopy(activeWallet.address); track("crypto_copy", { network: activeWallet.network }); }}
              className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
                copied === activeWallet.address
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
              }`}
            >
              {copied === activeWallet.address ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 check-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Address Copied!
                </span>
              ) : "Copy Wallet Address"}
            </button>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg modal-backdrop-in" />

      {/* Modal */}
      <div
        className="relative glass-strong rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md max-h-[90vh] overflow-y-auto modal-slide-up noise-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-lg font-bold text-white">
            {step === "activate"
              ? "Activate Pro"
              : mode === "pro"
                ? `Get Pro \u2014 ${amount}`
                : "Support SnapMock"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-300 hover:rotate-90"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {step === "activate" ? (
            /* License activation step */
            <div className="space-y-4 fade-slide-in">
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-emerald-500/15 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 check-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold">Thank you for your payment!</p>
                <p className="text-sm mt-1 text-emerald-400/60">Enter any text (8+ characters) to activate Pro.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => { setLicenseKey(e.target.value); setKeyError(""); }}
                  placeholder="Enter your name, email, or transaction ID..."
                  className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all duration-300"
                  onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                />
                <button
                  onClick={handleActivate}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20"
                >
                  Activate
                </button>
              </div>
              {keyError && <p className="text-red-400 text-xs fade-slide-in">{keyError}</p>}
            </div>
          ) : !hasAnyMethod ? (
            /* No payment methods configured */
            <div className="text-center py-6 fade-slide-in">
              <p className="text-white/50">Payment methods are being set up.</p>
              <p className="text-sm text-white/25 mt-2">Check back soon!</p>
            </div>
          ) : selectedMethod ? (
            /* Show selected method details */
            <div className="space-y-4">
              <button
                onClick={() => setSelectedMethod(null)}
                className="text-sm text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors duration-300 hover:bg-violet-500/5 px-2 py-1 rounded-md -ml-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                All payment methods
              </button>
              {renderMethodDetails()}
              {mode === "pro" && (
                <button
                  onClick={handlePaid}
                  className="w-full py-2.5 border border-white/8 text-white/40 hover:text-white/70 hover:border-white/15 hover:bg-white/[0.03] text-sm font-medium rounded-xl transition-all duration-300 mt-2"
                >
                  I&apos;ve completed the payment &rarr;
                </button>
              )}
            </div>
          ) : (
            /* Payment method selection */
            <div className="space-y-3 fade-slide-in">
              <p className="text-sm text-white/35 mb-4">Choose your preferred payment method:</p>
              {availableMethods.map((method, idx) => (
                <button
                  key={method.id}
                  onClick={() => { setSelectedMethod(method.id); track("payment_method_selected", { method: method.id }); }}
                  className="stagger-item w-full flex items-center gap-3 px-4 py-3.5 border border-white/[0.06] rounded-xl hover:border-violet-500/25 hover:bg-violet-500/[0.06] transition-all duration-300 text-left group hover:scale-[1.015] active:scale-[0.99] hover:shadow-lg hover:shadow-violet-500/5"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{method.icon}</span>
                  <span className="font-medium text-white/60 group-hover:text-violet-300 transition-colors duration-300">{method.name}</span>
                  <span className="ml-auto text-white/15 group-hover:text-violet-400 transition-all duration-300 group-hover:translate-x-1">&rarr;</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
