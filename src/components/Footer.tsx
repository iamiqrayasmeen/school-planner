import React from 'react';
import { NavTabId, NAV_ITEMS } from './Navigation';
import { Heart, Sparkles } from 'lucide-react';
import { FloralSprigCorner } from './FloralDecorations';

interface FooterProps {
  onNavigate: (tab: NavTabId) => void;
  onOpenInspiration: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenInspiration }) => {
  return (
    <footer className="mt-16 bg-[#FFFDF9] border-t border-[#E8DCCF] pt-12 pb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 pointer-events-none opacity-60">
        <FloralSprigCorner flipped className="-mr-4 -mt-2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#F0E6D8]">
          {/* Col 1: Brand & Quote (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌸</span>
              <h2 className="font-serif font-bold text-xl text-[#3E2723]">
                My Study Planner
              </h2>
            </div>
            <p className="font-handwriting text-lg text-[#D87093] font-bold">
              Plan Your Study, Achieve Your Dreams
            </p>
            <p className="text-xs text-[#7D6B62] leading-relaxed max-w-sm">
              An aesthetic floral digital journal designed to nurture your daily focus, simplify revision schedules, and celebrate every academic milestone.
            </p>

            <button
              type="button"
              onClick={onOpenInspiration}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C3A4D] hover:underline pt-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D87093]" />
              <span>View Original Journal Design Inspiration Photo</span>
            </button>
          </div>

          {/* Col 2: Quick Links (4 cols) */}
          <div className="md:col-span-4">
            <h3 className="font-serif font-bold text-sm text-[#3E2723] uppercase tracking-wider mb-3">
              Planner Sections
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left text-[#6D5A50] hover:text-[#3E2723] transition-colors py-0.5 truncate"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Journal Note (3 cols) */}
          <div className="md:col-span-3 bg-[#FAF4ED] p-4 rounded-2xl border border-[#E8DACB] text-xs">
            <h4 className="font-serif font-bold text-[#4E342E] mb-1 flex items-center gap-1">
              <span>📖</span>
              <span>100% Local & Private</span>
            </h4>
            <p className="text-[#7D6B62] leading-relaxed">
              Your subjects, timetable, notes, tasks, and exam dates are automatically saved in your browser&apos;s LocalStorage. No registration or server required.
            </p>
          </div>
        </div>

        {/* Bottom copyright and motto */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8D6E63] gap-3">
          <p>© {new Date().getFullYear()} My Study Planner 🌸. All rights reserved.</p>
          <p className="flex items-center gap-1 font-handwriting text-base text-[#D87093]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-[#D87093] text-[#D87093]" />
            <span>for dedicated students everywhere</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
