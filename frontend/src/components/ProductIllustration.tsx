import React from 'react';

interface ProductIllustrationProps {
  type: string;
  className?: string;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({ type, className = 'w-full h-full' }) => {
  switch (type) {
    case 'baby-romper-mint':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#E6F7F2" rx="16" />
          {/* Hanger / Stand */}
          <path d="M100 28 C96 24 96 18 100 15 C104 12 108 17 104 22 C102 24 100 28 100 32" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M60 48 L100 32 L140 48" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          {/* Romper Body */}
          <path
            d="M72 50 L50 68 C47 70 47 75 51 77 L62 82 L65 145 C65 152 72 155 80 152 L95 146 L100 156 L105 146 L120 152 C128 155 135 152 135 145 L138 82 L149 77 C153 75 153 70 150 68 L128 50 C120 54 112 56 100 56 C88 56 80 54 72 50 Z"
            fill="#34D399"
            fillOpacity="0.85"
            stroke="#059669"
            strokeWidth="2"
          />
          {/* Neckline */}
          <path d="M80 54 C88 64 112 64 120 54" stroke="#059669" strokeWidth="2" fill="#E6F7F2" />
          {/* Puppy print badge on chest */}
          <circle cx="100" cy="88" r="14" fill="#FFFFFF" />
          <path d="M96 86 C94 84 93 88 95 90 C97 92 103 92 105 90 C107 88 106 84 104 86 Z" fill="#F97316" />
          <circle cx="95" cy="84" r="2" fill="#1E293B" />
          <circle cx="105" cy="84" r="2" fill="#1E293B" />
          {/* Snaps buttons at bottom */}
          <circle cx="85" cy="148" r="2" fill="#FFFFFF" />
          <circle cx="100" cy="151" r="2" fill="#FFFFFF" />
          <circle cx="115" cy="148" r="2" fill="#FFFFFF" />
          {/* Organic Leaf Tag */}
          <rect x="135" y="105" width="22" height="14" rx="3" fill="#10B981" />
          <text x="138" y="115" fontSize="8" fill="#FFFFFF" fontWeight="bold">BIO</text>
        </svg>
      );

    case 'baby-dress-floral':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#FFF1F2" rx="16" />
          {/* Hanger */}
          <path d="M100 28 C96 24 96 18 100 15 C104 12 108 17 104 22 C102 24 100 28 100 32" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M65 46 L100 34 L135 46" stroke="#FDA4AF" strokeWidth="3" strokeLinecap="round" />
          {/* Bodice */}
          <path d="M78 48 L66 60 C63 63 65 68 70 68 L76 66 L78 95 L122 95 L124 66 L130 68 C135 68 137 63 134 60 L122 48 C115 52 107 53 100 53 C93 53 85 52 78 48 Z" fill="#FB7185" />
          {/* Flared Party Skirt */}
          <path d="M78 95 C60 120 45 160 52 165 C58 170 142 170 148 165 C155 160 140 120 122 95 Z" fill="#F43F5E" fillOpacity="0.9" />
          {/* Floral Petals Details */}
          <circle cx="80" cy="130" r="5" fill="#FFE4E6" />
          <circle cx="100" cy="140" r="6" fill="#FDE047" />
          <circle cx="120" cy="126" r="5" fill="#FFE4E6" />
          <circle cx="100" cy="112" r="4" fill="#FBCFE8" />
          <circle cx="70" cy="150" r="4" fill="#FBCFE8" />
          <circle cx="130" cy="148" r="5" fill="#FDE047" />
          {/* Ribbon Bow at waist */}
          <ellipse cx="100" cy="95" rx="5" ry="4" fill="#FFE4E6" />
          <path d="M96 95 L88 90 L90 98 Z" fill="#FFE4E6" />
          <path d="M104 95 L112 90 L110 98 Z" fill="#FFE4E6" />
        </svg>
      );

    case 'boy-dungaree-set':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#F0F9FF" rx="16" />
          {/* Inner Striped Tee */}
          <path d="M60 58 L140 58 L146 95 L132 98 L130 75 L70 75 L68 98 L54 95 Z" fill="#FEF08A" />
          <line x1="60" y1="65" x2="140" y2="65" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="62" y1="72" x2="138" y2="72" stroke="#F59E0B" strokeWidth="2.5" />
          {/* Denim Dungaree Straps */}
          <rect x="76" y="52" width="10" height="45" rx="2" fill="#0284C7" />
          <rect x="114" y="52" width="10" height="45" rx="2" fill="#0284C7" />
          {/* Metallic Buckles */}
          <circle cx="81" cy="90" r="3.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
          <circle cx="119" cy="90" r="3.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
          {/* Denim Bib & Pants */}
          <path d="M72 88 L128 88 L132 125 L134 165 L110 165 L102 128 L98 128 L90 165 L66 165 L68 125 Z" fill="#0369A1" />
          {/* Center Pocket with puppy stitching */}
          <rect x="88" y="96" width="24" height="20" rx="3" fill="#0284C7" stroke="#38BDF8" strokeDasharray="2 2" strokeWidth="1.5" />
          {/* Pocket Bear/Puppy Ear */}
          <circle cx="95" cy="94" r="3" fill="#F59E0B" />
          <circle cx="105" cy="94" r="3" fill="#F59E0B" />
        </svg>
      );

    case 'baby-diapers-pack':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#ECFDF5" rx="16" />
          {/* Diaper bag package */}
          <rect x="45" y="45" width="110" height="115" rx="12" fill="#10B981" />
          <path d="M45 45 C75 35 125 35 155 45 L155 70 L45 70 Z" fill="#34D399" />
          {/* Handle */}
          <path d="M80 40 C80 28 120 28 120 40" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
          {/* Package details */}
          <rect x="58" y="75" width="84" height="65" rx="8" fill="#FFFFFF" />
          {/* Diaper visual inside badge */}
          <path d="M75 92 C75 88 125 88 125 92 L120 115 C115 125 85 125 80 115 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <text x="100" y="105" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0284C7">12H</text>
          <text x="100" y="132" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#059669">TAPE 64 PCS</text>
          {/* Feather icon */}
          <circle cx="135" cy="62" r="10" fill="#FEF08A" />
          <text x="135" y="65" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#B45309">SOFT</text>
        </svg>
      );

    case 'feeding-bottle-glass':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#FEF3C7" rx="16" />
          {/* Silicone Nipple */}
          <path d="M94 28 C94 20 106 20 106 28 L108 42 L92 42 Z" fill="#FEF9C3" stroke="#FBBF24" strokeWidth="1.5" />
          {/* Screw Ring */}
          <rect x="80" y="42" width="40" height="14" rx="4" fill="#F59E0B" />
          {/* Ergonomic Glass Body */}
          <path d="M82 56 C76 80 74 120 74 150 C74 165 84 172 100 172 C116 172 126 165 126 150 C126 120 124 80 118 56 Z" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
          {/* Milk Level */}
          <path d="M75 95 C85 92 115 92 125 95 L125 150 C125 163 115 170 100 170 C85 170 75 163 75 150 Z" fill="#FEF9C3" fillOpacity="0.8" />
          {/* Volume Measurement Lines */}
          <line x1="82" y1="110" x2="94" y2="110" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="82" y1="125" x2="98" y2="125" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="82" y1="140" x2="94" y2="140" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="106" y="128" fontSize="8" fill="#64748B" fontWeight="bold">240 ml</text>
          {/* Anti-Colic Indicator badge */}
          <circle cx="145" cy="55" r="14" fill="#10B981" />
          <text x="145" y="58" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#FFFFFF">ANTI</text>
        </svg>
      );

    case 'baby-crib-wooden':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#FDF4FF" rx="16" />
          {/* Crib Headboard and Legs */}
          <rect x="35" y="60" width="8" height="115" rx="3" fill="#D97706" />
          <rect x="157" y="60" width="8" height="115" rx="3" fill="#D97706" />
          {/* Top & Bottom rails */}
          <rect x="35" y="75" width="130" height="8" rx="2" fill="#B45309" />
          <rect x="35" y="145" width="130" height="8" rx="2" fill="#B45309" />
          {/* Wooden Slats */}
          {[52, 66, 80, 94, 108, 122, 136, 148].map((x) => (
            <rect key={x} x={x} y="83" width="4" height="62" rx="1" fill="#F59E0B" />
          ))}
          {/* Cozy Mattress */}
          <rect x="42" y="130" width="116" height="18" rx="4" fill="#EDE9FE" />
          {/* Small cloud pillow */}
          <ellipse cx="65" cy="125" rx="12" ry="7" fill="#FFFFFF" />
          {/* Hanging mobile */}
          <path d="M100 35 L100 65" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="92" cy="68" r="4" fill="#F43F5E" />
          <circle cx="108" cy="68" r="4" fill="#38BDF8" />
        </svg>
      );

    case 'baby-stroller-pram':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#F0FDFA" rx="16" />
          {/* Canopy hood */}
          <path d="M60 90 C60 55 110 50 135 75 L95 95 Z" fill="#0D9488" />
          <path d="M135 75 C145 85 145 100 135 110 L95 95 Z" fill="#14B8A6" />
          {/* Seat bassinet */}
          <path d="M65 92 L140 102 C145 108 140 125 125 128 L75 125 C65 125 60 110 65 92 Z" fill="#0F766E" />
          {/* Handlebar & Chassis */}
          <path d="M40 50 L75 110 L125 155" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <path d="M75 110 L50 155" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          {/* Soft padded handle */}
          <path d="M36 46 L46 54" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
          {/* Wheels */}
          <circle cx="50" cy="160" r="14" fill="#1E293B" />
          <circle cx="50" cy="160" r="6" fill="#E2E8F0" />
          <circle cx="130" cy="160" r="14" fill="#1E293B" />
          <circle cx="130" cy="160" r="6" fill="#E2E8F0" />
          {/* Basket */}
          <rect x="70" y="132" width="45" height="15" rx="3" fill="#64748B" fillOpacity="0.4" />
        </svg>
      );

    case 'baby-lotion-wash':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#FFFBEB" rx="16" />
          {/* Pump Dispenser */}
          <path d="M100 32 L100 48" stroke="#0284C7" strokeWidth="5" />
          <path d="M85 30 L115 30 C120 30 120 35 115 35 L85 35" fill="#0284C7" />
          <path d="M115 35 L125 40" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          {/* Pump collar */}
          <rect x="88" y="48" width="24" height="10" rx="2" fill="#38BDF8" />
          {/* Bottle body */}
          <path d="M86 58 C72 70 70 95 70 145 C70 162 82 170 100 170 C118 170 130 162 130 145 C130 95 128 70 114 58 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          {/* Label */}
          <rect x="78" y="85" width="44" height="60" rx="6" fill="#E0F2FE" />
          <circle cx="100" cy="105" r="10" fill="#FEF08A" />
          {/* Daisy Petal flower in label */}
          <circle cx="100" cy="105" r="4" fill="#F59E0B" />
          <text x="100" y="128" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#0369A1">CALENDULA</text>
          <text x="100" y="138" textAnchor="middle" fontSize="6" fill="#64748B">TEAR FREE</text>
        </svg>
      );

    case 'wooden-activity-toy':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#FEF2F2" rx="16" />
          {/* Wooden Cube Frame */}
          <polygon points="100,50 155,75 155,140 100,165 45,140 45,75" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
          <polygon points="100,50 155,75 100,105 45,75" fill="#FCD34D" />
          <polygon points="100,105 155,75 155,140 100,165" fill="#D97706" />
          <polygon points="45,75 100,105 100,165 45,140" fill="#F59E0B" />
          {/* Wire Bead Maze on Top */}
          <path d="M65 65 C65 25 110 20 110 50 C110 25 140 30 135 68" stroke="#EF4444" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M80 60 C80 30 130 35 120 70" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Beads */}
          <circle cx="85" cy="30" r="5" fill="#10B981" />
          <circle cx="105" cy="42" r="5" fill="#F59E0B" />
          <circle cx="125" cy="32" r="5" fill="#EC4899" />
          {/* Shape cutouts on left face */}
          <circle cx="72" cy="118" r="7" fill="#1E293B" />
          <polygon points="72,135 65,147 79,147" fill="#1E293B" />
        </svg>
      );

    case 'baby-booties-shoes':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#F3E8FF" rx="16" />
          {/* Bootie 1 */}
          <path d="M45 130 C45 105 60 90 85 90 C95 90 105 98 108 110 L125 112 C135 115 138 128 135 138 C130 148 115 150 95 150 C65 150 45 145 45 130 Z" fill="#A855F7" />
          <path d="M45 138 C60 148 110 152 135 140 L135 146 C110 156 60 154 45 144 Z" fill="#FFFFFF" />
          {/* Cute puppy face on shoe tip */}
          <circle cx="118" cy="122" r="2" fill="#1E293B" />
          <circle cx="128" cy="124" r="2" fill="#1E293B" />
          <ellipse cx="123" cy="128" rx="2" ry="1.5" fill="#F43F5E" />
          {/* Elastic Ankle Cuff */}
          <rect x="65" y="80" width="35" height="15" rx="3" fill="#D8B4FE" />
          {/* Shoe laces / ribbon */}
          <path d="M82 92 C75 96 70 94 72 100" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M82 92 C90 96 95 94 92 100" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'maternity-nursing-top':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#EFF6FF" rx="16" />
          {/* Hanger */}
          <path d="M100 25 C96 22 96 16 100 14 C104 12 108 16 104 20 C102 22 100 25 100 29" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M60 42 L100 29 L140 42" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
          {/* Maternity Wrap Tunic */}
          <path d="M72 44 L45 70 C42 73 45 78 50 78 L60 74 L62 165 C62 170 138 170 138 165 L140 74 L150 78 C155 78 158 73 155 70 L128 44 C120 48 110 50 100 50 C90 50 80 48 72 44 Z" fill="#3B82F6" />
          {/* Empire waist sash wrap */}
          <path d="M62 90 C80 100 120 100 138 90" stroke="#1D4ED8" strokeWidth="4" />
          <path d="M72 44 L100 95 L128 44" stroke="#60A5FA" strokeWidth="2.5" />
          <text x="100" y="130" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#DBEAFE">EASY FEEDING</text>
        </svg>
      );

    case 'festive-kurta-set':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#FEFCE8" rx="16" />
          {/* Gold Nehru Jacket & Kurta */}
          <path d="M70 45 L50 65 L60 70 L65 155 L135 155 L140 70 L150 65 L130 45 Z" fill="#CA8A04" />
          <path d="M78 48 L70 150 L100 150 L100 48 Z" fill="#EAB308" />
          <path d="M122 48 L130 150 L100 150 L100 48 Z" fill="#EAB308" />
          {/* Mandarin Collar */}
          <rect x="85" y="42" width="30" height="12" rx="3" fill="#A16207" />
          {/* Golden Brocade Buttons */}
          <circle cx="100" cy="65" r="3" fill="#FEF08A" stroke="#854D0E" strokeWidth="1" />
          <circle cx="100" cy="80" r="3" fill="#FEF08A" stroke="#854D0E" strokeWidth="1" />
          <circle cx="100" cy="95" r="3" fill="#FEF08A" stroke="#854D0E" strokeWidth="1" />
          <circle cx="100" cy="110" r="3" fill="#FEF08A" stroke="#854D0E" strokeWidth="1" />
          {/* Silk Churidar Pants */}
          <path d="M75 155 L125 155 L120 185 L108 185 L100 162 L92 185 L80 185 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Festive Badge */}
          <rect x="135" y="25" width="45" height="18" rx="4" fill="#DC2626" />
          <text x="157" y="37" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFFFFF">DIWALI</text>
        </svg>
      );

    case 'festive-lehenga-choli':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#FFF1F2" rx="16" />
          {/* Choli Blouse */}
          <path d="M72 45 L55 60 L62 65 L70 85 L130 85 L138 65 L145 60 L128 45 Z" fill="#BE123C" />
          <path d="M88 45 C88 56 112 56 112 45 Z" fill="#FFF1F2" />
          {/* Gold Zari Embellishment */}
          <line x1="72" y1="83" x2="128" y2="83" stroke="#FBBF24" strokeWidth="3" />
          {/* Flared Embroidered Lehenga Skirt */}
          <path d="M75 88 C50 115 35 155 45 168 C55 174 145 174 155 168 C165 155 150 115 125 88 Z" fill="#E11D48" />
          {/* Gold Border Lace */}
          <path d="M48 162 C70 170 130 170 152 162" stroke="#FDE047" strokeWidth="5" fill="none" />
          <circle cx="70" cy="120" r="4" fill="#FEF08A" />
          <circle cx="100" cy="130" r="5" fill="#FEF08A" />
          <circle cx="130" cy="120" r="4" fill="#FEF08A" />
          {/* Net Dupatta drape */}
          <path d="M60 55 C65 95 145 135 155 140" stroke="#F43F5E" strokeWidth="4" strokeDasharray="3 3" />
        </svg>
      );

    case 'books-story-hardcover':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#F0FDF4" rx="16" />
          {/* Hardcover Book */}
          <path d="M45 45 L155 45 C158 45 160 48 160 52 L160 155 C160 158 158 160 155 160 L45 160 C42 160 40 158 40 155 L40 52 C40 48 42 45 45 45 Z" fill="#15803D" />
          <rect x="48" y="48" width="105" height="105" rx="4" fill="#DCFCE7" />
          <rect x="40" y="45" width="12" height="115" rx="3" fill="#166534" />
          {/* Book Art Illustration */}
          <circle cx="100" cy="90" r="22" fill="#FDE047" />
          <path d="M92 88 C90 85 86 88 89 93" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
          <path d="M108 88 C110 85 114 88 111 93" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
          <path d="M96 98 C98 102 102 102 104 98" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
          <text x="100" y="132" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#166534">BEDTIME TALES</text>
        </svg>
      );

    case 'health-safety-kit':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#F0FDFA" rx="16" />
          {/* First Aid / Safety Shield box */}
          <rect x="48" y="55" width="104" height="95" rx="14" fill="#0D9488" />
          <rect x="55" y="62" width="90" height="81" rx="10" fill="#CCFBF1" />
          {/* Medical Red / Green Cross */}
          <rect x="94" y="80" width="12" height="40" rx="3" fill="#0F766E" />
          <rect x="80" y="94" width="40" height="12" rx="3" fill="#0F766E" />
          {/* Natural Mosquito Patch Sticker */}
          <circle cx="140" cy="50" r="16" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          <text x="140" y="53" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#854D0E">DEET 0%</text>
        </svg>
      );

    case 'casual-summer-tee':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#FEF3C7" rx="16" />
          {/* Tee Hanger & Body */}
          <path d="M68 48 L42 66 C39 68 40 73 45 74 L55 72 L58 155 L142 155 L145 72 L155 74 C160 73 161 68 158 66 L132 48 Z" fill="#3B82F6" />
          <path d="M82 48 C90 60 110 60 118 48 Z" fill="#FEF3C7" />
          {/* Playful Smiley Graphic */}
          <circle cx="100" cy="98" r="18" fill="#FDE047" />
          <circle cx="94" cy="94" r="2.5" fill="#1E293B" />
          <circle cx="106" cy="94" r="2.5" fill="#1E293B" />
          <path d="M94 102 C97 108 103 108 106 102" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <text x="100" y="132" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#DBEAFE">100% COTTON</text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#F8FAFC" rx="16" />
          <circle cx="100" cy="90" r="35" fill="#E2E8F0" />
          <path d="M90 85 C88 80 82 85 86 92" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <path d="M110 85 C112 80 118 85 114 92" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="4" fill="#F97316" />
          <text x="100" y="145" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748B">VORAECLAT</text>
        </svg>
      );
  }
};
