"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { useLicense } from "../hooks/useLicense";
import { CONFIG } from "../config";

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
  const [copied, setCopied] = useState(false);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0);

  if (!isOpen) return null;

  // Determine which payment methods are available
  const hasCrypto = (CONFIG.CRYPTO_WALLETS && CONFIG.CRYPTO_WALLETS.length > 0) || !!CONFIG.CRYPTO_ADDRESS;
  const cryptoLabel = CONFIG.CRYPTO_WALLETS?.length > 1
    ? `Crypto (${CONFIG.CRYPTO_WALLETS.length} networks)`
    : CONFIG.CRYPTO_WALLETS?.length === 1
      ? `Crypto (${CONFIG.CRYPTO_WALLETS[0].network})`
      : CONFIG.CRYPTO_NETWORK ? `Crypto (${CONFIG.CRYPTO_NETWORK})` : "Crypto";

  const methods: { id: PaymentMethod; name: string; icon: string; available: boolean }[] = [
    { id: "upi", name: "UPI (GPay / PhonePe)", icon: "💳", available: !!CONFIG.UPI_ID },
    { id: "paypal", name: "PayPal", icon: "🅿️", available: !!CONFIG.PAYPAL_USERNAME },
    { id: "bmac", name: "Buy Me a Coffee", icon: "☕", available: !!CONFIG.BMAC_USERNAME },
    { id: "crypto", name: cryptoLabel, icon: "🪙", available: hasCrypto },
  ];

  const availableMethods = methods.filter((m) => m.available);
  const hasAnyMethod = availableMethods.length > 0;

  const amount = mode === "pro" ? CONFIG.PRO_PRICE : "any amount";
  const amountINR = mode === "pro" && CONFIG.PRO_PRICE_INR ? `₹${CONFIG.PRO_PRICE_INR}` : null;

  const upiDeepLink = CONFIG.UPI_ID
    ? `upi://pay?pa=${encodeURIComponent(CONFIG.UPI_ID)}&pn=${encodeURIComponent(CONFIG.UPI_NAME || CONFIG.PRODUCT_NAME)}${mode === "pro" ? `&am=${CONFIG.PRO_PRICE_INR || "749"}&cu=INR` : "&cu=INR"}&tn=${encodeURIComponent(mode === "pro" ? "SnapMock Pro License" : "Support SnapMock")}`
    : "";

  const upiQrUrl = upiDeepLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}`
    : "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={upiQrUrl} alt="UPI QR Code" className="mx-auto rounded-lg" width={200} height={200} />
              <p className="text-xs text-gray-400 mt-2">Scan with any UPI app</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-600 flex-1 font-mono truncate">{CONFIG.UPI_ID}</span>
              <button onClick={() => handleCopy(CONFIG.UPI_ID)} className="text-xs font-semibold text-violet-600 hover:text-violet-800 shrink-0">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <a
              href={upiDeepLink}
              className="block w-full text-center py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
              onClick={() => track("upi_deeplink_click")}
            >
              Pay {amountINR || amount} via UPI App
            </a>
          </div>
        );

      case "paypal":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Click below to open PayPal and send {amount}</p>
            <a
              href={`https://paypal.me/${CONFIG.PAYPAL_USERNAME}${mode === "pro" ? "/9" : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-[#0070BA] hover:bg-[#005C9A] text-white font-semibold rounded-xl transition-colors"
              onClick={() => track("paypal_click")}
            >
              Pay with PayPal
            </a>
          </div>
        );

      case "bmac":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Support via Buy Me a Coffee</p>
            <a
              href={`https://buymeacoffee.com/${CONFIG.BMAC_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-[#FFDD00] hover:bg-[#FFD000] text-gray-900 font-semibold rounded-xl transition-colors"
              onClick={() => track("bmac_click")}
            >
              ☕ Buy Me a Coffee
            </a>
          </div>
        );

      case "crypto": {
        const wallets = CONFIG.CRYPTO_WALLETS?.length
          ? CONFIG.CRYPTO_WALLETS
          : CONFIG.CRYPTO_ADDRESS
            ? [{ network: CONFIG.CRYPTO_NETWORK || "Crypto", address: CONFIG.CRYPTO_ADDRESS, icon: "🪙" }]
            : [];
        const activeWallet = wallets[selectedWalletIndex] || wallets[0];
        if (!activeWallet) return null;

        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Send {amount} to the address below
            </p>
            {/* Network selector — only show when multiple wallets */}
            {wallets.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {wallets.map((w, i) => (
                  <button
                    key={w.network}
                    onClick={() => { setSelectedWalletIndex(i); setCopied(false); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      i === selectedWalletIndex
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-200 hover:border-gray-400 text-gray-600"
                    }`}
                  >
                    {w.icon} {w.network}
                  </button>
                ))}
              </div>
            )}
            {/* Selected network label */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                {activeWallet.icon} {activeWallet.network}
              </span>
            </div>
            {/* Address */}
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs font-mono text-gray-600 break-all text-center">{activeWallet.address}</p>
            </div>
            <button
              onClick={() => { handleCopy(activeWallet.address); track("crypto_copy", { network: activeWallet.network }); }}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors"
            >
              {copied ? "✓ Address Copied!" : "Copy Wallet Address"}
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {step === "activate"
              ? "Activate Pro"
              : mode === "pro"
                ? `Get Pro — ${amount}`
                : "Support SnapMock"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {step === "activate" ? (
            /* License activation step */
            <div className="space-y-4">
              <div className="bg-green-50 text-green-800 rounded-xl p-4 text-center">
                <p className="font-semibold">Thank you for your payment!</p>
                <p className="text-sm mt-1">Enter any text (8+ characters) to activate Pro.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => { setLicenseKey(e.target.value); setKeyError(""); }}
                  placeholder="Enter your name, email, or transaction ID..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                />
                <button onClick={handleActivate} className="px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                  Activate
                </button>
              </div>
              {keyError && <p className="text-red-500 text-xs">{keyError}</p>}
            </div>
          ) : !hasAnyMethod ? (
            /* No payment methods configured */
            <div className="text-center py-6">
              <p className="text-gray-500">Payment methods are being set up.</p>
              <p className="text-sm text-gray-400 mt-2">Check back soon!</p>
            </div>
          ) : selectedMethod ? (
            /* Show selected method details */
            <div className="space-y-4">
              <button onClick={() => setSelectedMethod(null)} className="text-sm text-violet-600 hover:text-violet-800 font-medium flex items-center gap-1">
                ← All payment methods
              </button>
              {renderMethodDetails()}
              {mode === "pro" && (
                <button
                  onClick={handlePaid}
                  className="w-full py-2.5 border border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-400 text-sm font-medium rounded-xl transition-colors mt-2"
                >
                  I&apos;ve completed the payment →
                </button>
              )}
            </div>
          ) : (
            /* Payment method selection */
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">Choose your preferred payment method:</p>
              {availableMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => { setSelectedMethod(method.id); track("payment_method_selected", { method: method.id }); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all text-left group"
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium text-gray-700 group-hover:text-violet-700">{method.name}</span>
                  <span className="ml-auto text-gray-300 group-hover:text-violet-400">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
