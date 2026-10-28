import React from 'react';

export interface VoraeclatLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
}

export const VoraeclatLogo: React.FC<VoraeclatLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  variant = 'auto',
  showTagline = true,
}) => {
  // Sizing map for the top "Voraeclat" mark (mascot + crowned V + wordmark)
  const markHeightMap = {
    xs: 'h-6 sm:h-7',
    sm: 'h-7 sm:h-8.5',
    md: 'h-9 min-[380px]:h-10 sm:h-11 md:h-12',
    lg: 'h-12 sm:h-14 lg:h-16',
    xl: 'h-15 sm:h-18 lg:h-22',
  };

  // High-legibility sizing map for the tagline text
  const taglineTextMap = {
    xs: 'text-[7.5px] sm:text-[8px] tracking-[0.14em]',
    sm: 'text-[8.5px] min-[380px]:text-[9px] sm:text-[10px] tracking-[0.15em]',
    md: 'text-[9.5px] min-[380px]:text-[10.5px] sm:text-[11.5px] md:text-[12px] tracking-[0.16em]',
    lg: 'text-[11.5px] sm:text-[13px] tracking-[0.18em]',
    xl: 'text-[13px] sm:text-[15.5px] tracking-[0.2em]',
  };

  const isDark = variant === 'dark';

  const markFilter = isDark
    ? 'drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)] filter brightness-105'
    : 'filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]';

  return (
    <div className={`inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
      {/* Top Main Mark: Prince Mascot + "Voraeclat" Wordmark */}
      <img
        src="/voraeclat-mark.png"
        alt="Voraeclat"
        className={`${markHeightMap[size]} w-auto object-contain select-none transition-transform duration-200 hover:scale-[1.01] ${markFilter}`}
        loading="eager"
      />

      {/* Prominent Tagline: "— Little Things, Big Dreams —" with 3D metallic gold rules and gold-beveled teal letters */}
      {showTagline && (
        <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mt-0.5 select-none">
          {/* Left 3D Metallic Gold Bar */}
          <span
            className={`h-[1.5px] sm:h-[2px] flex-1 min-w-[12px] max-w-[28px] sm:max-w-[40px] rounded-full ${
              isDark
                ? 'bg-gradient-to-r from-transparent via-amber-300 to-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                : 'bg-gradient-to-r from-transparent via-amber-400 to-amber-600 shadow-[0_1px_1px_rgba(217,119,6,0.35)]'
            }`}
          />

          {/* Tagline Text with exact gold outline bevel and deep teal fill */}
          <span
            className={`${taglineTextMap[size]} font-extrabold whitespace-nowrap select-none transition-colors duration-200 leading-tight`}
            style={{
              fontFamily: '"Plus Jakarta Sans", "Fredoka", -apple-system, sans-serif',
              color: isDark ? '#FFFBEB' : '#0B3A3E',
              textShadow: isDark
                ? '0 0 1px #F59E0B, 0 1px 3px rgba(0,0,0,0.9), -0.5px -0.5px 0 #D97706, 0.5px 0.5px 0 #D97706'
                : '-0.75px -0.75px 0 #DEC082, 0.75px -0.75px 0 #DEC082, -0.75px 0.75px 0 #DEC082, 0.75px 0.75px 0 #DEC082, 0 1px 1.5px rgba(217,119,6,0.35)',
            }}
          >
            Little Things, Big Dreams
          </span>

          {/* Right 3D Metallic Gold Bar */}
          <span
            className={`h-[1.5px] sm:h-[2px] flex-1 min-w-[12px] max-w-[28px] sm:max-w-[40px] rounded-full ${
              isDark
                ? 'bg-gradient-to-l from-transparent via-amber-300 to-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                : 'bg-gradient-to-l from-transparent via-amber-400 to-amber-600 shadow-[0_1px_1px_rgba(217,119,6,0.35)]'
            }`}
          />
        </div>
      )}

      {showSubtitle && (
        <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[10px] font-semibold text-slate-500 tracking-wider uppercase ml-0.5 sm:ml-1 mt-0.5 whitespace-nowrap">
          Asia&apos;s Baby &amp; Kids Superstore
        </span>
      )}
    </div>
  );
};

// Backwards compatibility export
export const PuppyShameLogo = VoraeclatLogo;
export default VoraeclatLogo;
