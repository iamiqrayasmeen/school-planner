import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';

interface InspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InspirationModal: React.FC<InspirationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCF] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E6D8] mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌸</span>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#3E2723]">
                Design Inspiration: Aesthetic Study Journal
              </h3>
              <p className="text-xs text-[#7D6B62]">
                Crafted directly from your uploaded discbound notebook photo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#FAF4ED] hover:bg-[#F0E5D8] text-[#4E342E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Photo */}
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border-2 border-[#E8DCCF] shadow-sm bg-[#FAF4ED]">
              <img
                src="/assets/aistudio/OIP__1__f5dee2ea.webp"
                alt="Aesthetic Student Study Journal Inspiration Photo"
                className="w-full h-auto object-cover max-h-[380px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[11px] text-[#8D6E63] text-center italic font-handwriting text-base">
              Original reference study planner spread with disc rings & floral washi tapes
            </p>
          </div>

          {/* Design Elements Transferred to Code */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#4E342E] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D87093]" />
              <span>How the design was brought to life:</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-[#5C4537]">
              <li className="flex items-start gap-2 bg-[#FAF6EE] p-2.5 rounded-xl border border-[#F0E5D8]">
                <Check className="w-4 h-4 text-[#5B7B6D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723]">Hexagonal Date Stickers:</strong>
                  <p className="text-[11px] text-[#7D6B62] mt-0.5">
                    Just like the Sunday, Monday, and Tuesday hexagons in your photo, used across daily headers, countdowns, and quick dates.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-[#FAF6EE] p-2.5 rounded-xl border border-[#F0E5D8]">
                <Check className="w-4 h-4 text-[#5B7B6D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723]">Washi Tape & Banner Badges:</strong>
                  <p className="text-[11px] text-[#7D6B62] mt-0.5">
                    Floral print washi strips, &ldquo;Get it done&rdquo; stamps, and peach/sage ribbon flags.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-[#FAF6EE] p-2.5 rounded-xl border border-[#F0E5D8]">
                <Check className="w-4 h-4 text-[#5B7B6D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723]">Paper Textures (Lined & Grid):</strong>
                  <p className="text-[11px] text-[#7D6B62] mt-0.5">
                    Authentic lined paper ruling and faint dot/graph grids for notes and task sheets.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-[#FAF6EE] p-2.5 rounded-xl border border-[#F0E5D8]">
                <Check className="w-4 h-4 text-[#5B7B6D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723]">Floral Mason Jar & Sleep Mask:</strong>
                  <p className="text-[11px] text-[#7D6B62] mt-0.5">
                    Illustrated mason jar with bouquet and &ldquo;I&apos;m already tired tomorrow&rdquo; sleep mask sticker from the top-left card.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-[#FAF6EE] p-2.5 rounded-xl border border-[#F0E5D8]">
                <Check className="w-4 h-4 text-[#5B7B6D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723]">Pastel Color Harmony:</strong>
                  <p className="text-[11px] text-[#7D6B62] mt-0.5">
                    Soft blush pink, cream ivory, sage green, and light chocolate ink typography.
                  </p>
                </div>
              </li>
            </ul>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-[#F4ACB7] hover:bg-[#EB97A4] text-[#4A1D28] text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95"
            >
              Continue to Study Planner 🌸
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
