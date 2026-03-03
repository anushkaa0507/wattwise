"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div
        className="
        relative
        w-full
        max-w-[1100px]
        max-h-[95vh]
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-2xl
        flex
        flex-col
        lg:flex-row
        border-8
        border-white
      "
      >
        {/* IMAGE SECTION */}
        <div
          className="
          w-full
          lg:w-1/2
          h-[220px]
          sm:h-[260px]
          lg:h-auto
          relative
          flex
          rounded-t-3xl
          lg:rounded-none
        "
        >
          <img
            src="/Background.png"
            alt="Auth background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* FORM SECTION */}
        <div
          className="
          w-full
          lg:w-1/2
          flex
          flex-col
          p-6
          sm:p-10
          lg:p-12
          overflow-y-auto
          bg-white
        "
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-black"
          >
            ✕
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-4xl text-sky-400">
              wb_sunny
            </span>
            <h1 className="text-2xl font-bold">WattWise</h1>
          </div>

          {/* Tabs */}
          <div className="flex w-fit mb-8 bg-emerald-100 rounded-full p-1">
            <button
              onClick={() => setTab("signin")}
              className={`px-6 py-2 text-sm font-bold rounded-full transition-all ${
                tab === "signin"
                  ? "bg-white shadow text-black"
                  : "text-slate-500"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => setTab("signup")}
              className={`px-6 py-2 text-sm font-bold rounded-full transition-all ${
                tab === "signup"
                  ? "bg-white shadow text-black"
                  : "text-slate-500"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Clerk Forms */}
          <div className="flex-1">
            {tab === "signin" ? (
              <SignIn
                appearance={{
                  elements: {
                    card: "shadow-none p-0",
                  },
                }}
              />
            ) : (
              <SignUp
                appearance={{
                  elements: {
                    card: "shadow-none p-0",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}