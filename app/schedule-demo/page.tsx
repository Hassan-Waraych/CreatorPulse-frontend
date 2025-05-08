"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ScheduleDemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState<'creator' | 'brand'>('brand');

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-black/20 rounded-2xl p-10 border border-white/10 shadow-xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
        {!submitted && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-white text-center">Schedule a Demo</h1>
            <div className="flex flex-col items-center mb-8">
              <span className="text-white/80 mb-2 font-medium">I'm a...</span>
              <div className="inline-flex bg-black/30 rounded-full p-1 border border-white/10">
                <button
                  type="button"
                  className={`px-6 py-2 rounded-full font-semibold transition-colors text-lg ${role === 'brand' ? 'bg-[#ff4d8d] text-white shadow-[0_0_10px_rgba(255,77,141,0.4)]' : 'text-white/70 hover:text-white'}`}
                  onClick={() => setRole('brand')}
                >
                  Brand
                </button>
                <button
                  type="button"
                  className={`px-6 py-2 rounded-full font-semibold transition-colors text-lg ${role === 'creator' ? 'bg-[#ff4d8d] text-white shadow-[0_0_10px_rgba(255,77,141,0.4)]' : 'text-white/70 hover:text-white'}`}
                  onClick={() => setRole('creator')}
                >
                  Creator
                </button>
              </div>
            </div>
          </>
        )}
        {submitted ? (
          <div className="text-center text-white/80">
            <p className="mb-4 text-xl">Thank you for your interest!</p>
            <p>We'll be in touch soon.</p>
            <p className="mt-2 text-[#ff4d8d] font-medium">We will get back to you within 24 hours!</p>
            <p className="mt-4 text-white/70">You selected: <span className="font-bold text-[#ff4d8d]">{role === 'brand' ? 'Brand' : 'Creator'}</span></p>
          </div>
        ) : (
          role === 'creator' ? (
            <form
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <label className="block text-white/70 mb-2" htmlFor="creator">Creator Name</label>
                <input
                  id="creator"
                  name="creator"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2" htmlFor="portfolio">Portfolio <span className="text-white/40">(optional)</span></label>
                <input
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2" htmlFor="email">Contact Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#ff4d8d] hover:bg-[#ff1a6c] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4d8d] focus:ring-offset-2 focus:ring-offset-black shadow-[0_0_20px_rgba(255,77,141,0.7)]"
              >
                Submit
              </button>
            </form>
          ) : (
            <form
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <label className="block text-white/70 mb-2" htmlFor="brand">Brand Name</label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2" htmlFor="website">Brand Website <span className="text-white/40">(optional)</span></label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://yourbrand.com"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2" htmlFor="email">Contact Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#ff4d8d] hover:bg-[#ff1a6c] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4d8d] focus:ring-offset-2 focus:ring-offset-black shadow-[0_0_20px_rgba(255,77,141,0.7)]"
              >
                Submit
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
} 