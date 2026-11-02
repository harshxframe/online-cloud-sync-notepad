"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";
import { loginWithEmail, registerWithEmail, isFirebaseConfigured } from "../lib/firebase";

export default function AuthModal({ isOpen, onClose, onAuthSuccess, settings }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isDark = settings?.theme === "dark";
  const isConfigured = isFirebaseConfigured();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isConfigured) {
      setError("Firebase keys are not added to .env.local yet. Please configure .env.local to enable cloud login.");
      return;
    }

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      let user;
      if (isSignUp) {
        user = await registerWithEmail(email, password, displayName);
      } else {
        user = await loginWithEmail(email, password);
      }
      setLoading(false);
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setLoading(false);
      console.error(err);
      let msg = err.message || "Authentication failed.";
      if (
        msg.includes("auth/user-not-found") ||
        msg.includes("auth/wrong-password") ||
        msg.includes("auth/invalid-credential")
      ) {
        msg = "Invalid email or password.";
      } else if (msg.includes("auth/email-already-in-use")) {
        msg = "This email is already registered. Please log in instead.";
      } else if (msg.includes("auth/invalid-email")) {
        msg = "Please enter a valid email address.";
      }
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div
        className={`rounded-lg shadow-2xl border w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
          isDark
            ? "bg-[#252526] border-[#454545] text-[#cccccc]"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-3.5 flex items-center justify-between border-b ${
            isDark ? "bg-[#1e1e1e] border-[#333333]" : "bg-[#f5f5f5] border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm">
              {isSignUp ? "Create Notepad Account" : "Sign In to Notepad"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`rounded p-1 transition-colors ${
              isDark ? "text-gray-400 hover:text-white hover:bg-[#333333]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-xs rounded p-2.5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-medium mb-1 opacity-80">
                Your Name (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Harsh"
                  className={`w-full text-xs pl-9 pr-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none border ${
                    isDark
                      ? "bg-[#1e1e1e] border-[#3e3e42] text-white focus:border-blue-400"
                      : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1 opacity-80">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full text-xs pl-9 pr-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none border ${
                  isDark
                    ? "bg-[#1e1e1e] border-[#3e3e42] text-white focus:border-blue-400"
                    : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 opacity-80">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full text-xs pl-9 pr-3 py-2 rounded focus:ring-1 focus:ring-blue-500 outline-none border ${
                  isDark
                    ? "bg-[#1e1e1e] border-[#3e3e42] text-white focus:border-blue-400"
                    : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
                }`}
              />
            </div>
          </div>

          <div
            className={`text-[11px] p-2.5 rounded border ${
              isDark
                ? "bg-blue-950/30 border-blue-900/50 text-blue-300"
                : "bg-blue-50 border-blue-100 text-gray-600"
            }`}
          >
            💡 Logging in automatically backs up and syncs your tabs and notes to Firebase Cloud Firestore.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#007acc] hover:bg-[#0062a3] text-white py-2 rounded text-xs font-medium transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <div
            className={`text-center pt-2 border-t text-xs ${
              isDark ? "border-[#333333] text-gray-400" : "border-gray-100 text-gray-600"
            }`}
          >
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                  }}
                  className="text-blue-400 hover:underline font-medium"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                  }}
                  className="text-blue-400 hover:underline font-medium"
                >
                  Create one
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
