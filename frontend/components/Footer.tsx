import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 space-y-2">
        <p className="font-medium text-slate-600">
          CardioAI — Research &amp; Educational Clinical Decision Support Platform
        </p>
        <p>
          Not a diagnostic device or replacement for professional clinical judgment.
        </p>
        <p className="text-slate-400">© 2025 CardioAI Initiative. Built with open scientific frameworks.</p>
      </div>
    </footer>
  );
}
