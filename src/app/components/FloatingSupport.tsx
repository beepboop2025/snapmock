"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONFIG } from "../config";
import PaymentModal from "./PaymentModal";

export default function FloatingSupport() {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check if ANY payment method is configured
  const hasPayment = !!(CONFIG.UPI_ID || CONFIG.PAYPAL_USERNAME || CONFIG.BMAC_USERNAME || CONFIG.CRYPTO_ADDRESS || (CONFIG.CRYPTO_WALLETS && CONFIG.CRYPTO_WALLETS.length > 0));

  if (!hasPayment) return null;

  return (
    <>
      <button
        onClick={() => { setShowModal(true); track("support_floating_click"); }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#FFDD00] hover:bg-[#FFD000] text-gray-900 font-semibold rounded-full shadow-lg shadow-[#FFDD00]/20 hover:shadow-xl hover:shadow-[#FFDD00]/30 cursor-pointer float-spring pulse-ring relative"
        style={{
          padding: isHovered ? "12px 22px" : "12px 16px",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        aria-label="Support the creator"
      >
        <span
          className="text-xl"
          role="img"
          aria-hidden="true"
          style={{
            display: "inline-block",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: isHovered ? "rotate(-12deg) scale(1.15)" : "rotate(0) scale(1)",
          }}
        >
          ☕
        </span>
        <span
          className="text-sm font-semibold overflow-hidden whitespace-nowrap"
          style={{
            maxWidth: isHovered ? "200px" : "0",
            opacity: isHovered ? 1 : 0,
            transition: isHovered
              ? "max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease 0.05s"
              : "opacity 0.15s ease, max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          Support this tool
        </span>
      </button>

      <PaymentModal isOpen={showModal} onClose={() => setShowModal(false)} mode="tip" />
    </>
  );
}
