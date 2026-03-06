"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONFIG } from "../config";
import PaymentModal from "./PaymentModal";

export default function FloatingSupport() {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check if ANY payment method is configured
  const hasPayment = !!(CONFIG.UPI_ID || CONFIG.PAYPAL_USERNAME || CONFIG.BMAC_USERNAME || CONFIG.CRYPTO_ADDRESS);

  if (!hasPayment) return null;

  return (
    <>
      <button
        onClick={() => { setShowModal(true); track("support_floating_click"); }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#FFDD00] hover:bg-[#FFD000] text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        style={{
          padding: isHovered ? "12px 20px" : "12px 16px",
        }}
        aria-label="Support the creator"
      >
        <span className="text-xl" role="img" aria-hidden="true">
          ☕
        </span>
        <span
          className="text-sm font-semibold overflow-hidden whitespace-nowrap transition-all duration-300"
          style={{
            maxWidth: isHovered ? "200px" : "0",
            opacity: isHovered ? 1 : 0,
          }}
        >
          Support this tool
        </span>
      </button>

      <PaymentModal isOpen={showModal} onClose={() => setShowModal(false)} mode="tip" />
    </>
  );
}
