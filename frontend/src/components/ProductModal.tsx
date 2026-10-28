import React, { useState } from 'react';
import {
  X,
  Heart,
  Ruler,
  Check,
  ShieldCheck,
  Tag,
  Sparkles,
  ShoppingBag,
  Zap,
  Gift,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Product } from '../types';
import { BABY_SIZE_GUIDE } from '../data/checklists';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product, size?: string, color?: { name: string; hex: string }) => void;
  deliveryPincode: string;
  isClubMember: boolean;
  onBuyNow?: (p: Product, size?: string, color?: { name: string; hex: string }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0
      ? product.colors[0]
      : { name: 'Sapphire Blue', hex: '#1E3A8A' }
  );
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  const [addGiftBox, setAddGiftBox] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [addedNotice, setAddedNotice] = useState(false);

  const isSunflowerDress =
    product.id === 'ps-sunflower-dress' ||
    product.name.toLowerCase().includes('sunflower') ||
    product.name.toLowerCase().includes('sapphire');

  // Curated 4-frame gallery matching the reference image layout (4 frames only)
  const galleryImages = [
    // 1. Top-left: Main front full shot
    product.imageUrl ||
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
    // 2. Top-right: Infographic / model side background
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
    // 3. Bottom-left: Close-up portrait of collar and print
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    // 4. Bottom-right: Full environmental architectural arch shot
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=85',
  ];

  // Specific Key Highlights extracted dynamically or from Sunflower Sapphire model
  const keyHighlights = {
    fit: isSunflowerDress ? 'A-line fit' : 'Relaxed / Flared fit',
    topFabric: isSunflowerDress ? 'Viscose' : product.fabricOrMaterial || 'Pure Cotton Viscose',
    neck: isSunflowerDress ? 'Shirt Collar' : 'Band / Round Neck',
    sleeveStyling: '3/4th',
    sleeveLength: '16 Inches',
    topTechnique: isSunflowerDress ? 'Print' : 'Placement Print',
    length: '46" (Calf Length)',
    packageContains: 'Top only',
    transparency: 'Opaque',
    weaveType: 'Machine Weave',
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
      onBuyNow(product, selectedSize, selectedColor);
    } else {
      onAddToCart(product, selectedSize, selectedColor);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-7xl h-full sm:h-auto sm:max-h-[94vh] sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Product View"
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-800 shadow-md border border-slate-200 transition-all cursor-pointer hover:rotate-90 duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wishlist Floating Button */}
        <button
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-4 right-16 z-30 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 shadow-md border border-slate-200 transition-all cursor-pointer ${
            isWishlisted ? 'text-rose-600' : 'text-slate-600'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Main 2-Column Split: Gallery on Left (52%), Purchase Panel on Right (48%) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* =====================================================================
              LEFT COLUMN: 2-COLUMN PHOTO GALLERY GRID (MATCHING SCREENSHOT)
             ===================================================================== */}
          <div className="lg:col-span-7 bg-[#fbfbfb] p-3 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              {/* Card 1 (Top-Left): Full Model Front Shot */}
              <div
                onClick={() => setActivePhotoIndex(0)}
                className={`relative rounded-xl overflow-hidden aspect-[3/4] bg-slate-100 border border-slate-200/80 cursor-pointer shadow-xs group ${
                  activePhotoIndex === 0 ? 'ring-2 ring-slate-900' : ''
                }`}
              >
                <img
                  src={galleryImages[0]}
                  alt={`${product.name} Front Shot`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                />
              </div>

              {/* Card 2 (Top-Right): Dark Infographic "Style Highlights" Card */}
              <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-[#1a2332] text-white p-4 sm:p-5 flex flex-col justify-between border border-slate-800 shadow-xs">
                {/* Background model silhouette on right */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-35 pointer-events-none overflow-hidden">
                  <img
                    src={galleryImages[1]}
                    alt="Model Silhouette"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332] via-[#1a2332]/60 to-transparent" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-1.5">
                    <span>Style Highlights</span>
                  </h3>

                  <div className="space-y-3 sm:space-y-3.5 text-xs">
                    <div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                        Fabric
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        {keyHighlights.topFabric}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                        Length
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        {keyHighlights.length}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                        Technique
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        {keyHighlights.topTechnique}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                        Package Contains
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        {keyHighlights.packageContains}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-amber-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Certified Craftsmanship
                  </span>
                  <span className="text-slate-400">Premium Fit</span>
                </div>
              </div>

              {/* Card 3 (Middle-Left): Close-up Portrait Shot */}
              <div
                onClick={() => setActivePhotoIndex(2)}
                className={`relative rounded-xl overflow-hidden aspect-[3/4] bg-slate-100 border border-slate-200/80 cursor-pointer shadow-xs group ${
                  activePhotoIndex === 2 ? 'ring-2 ring-slate-900' : ''
                }`}
              >
                <img
                  src={galleryImages[2]}
                  alt={`${product.name} Neckline Detail`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                />
              </div>

              {/* Card 4 (Middle-Right): Environmental Architecture Shot */}
              <div
                onClick={() => setActivePhotoIndex(3)}
                className={`relative rounded-xl overflow-hidden aspect-[3/4] bg-slate-100 border border-slate-200/80 cursor-pointer shadow-xs group ${
                  activePhotoIndex === 3 ? 'ring-2 ring-slate-900' : ''
                }`}
              >
                <img
                  src={galleryImages[3]}
                  alt={`${product.name} Ambience Shot`}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
                />
              </div>
            </div>
          </div>

          {/* =====================================================================
              RIGHT COLUMN: PURCHASE MODULE, OFFERS, SPECIFICATIONS & CTAS
             ===================================================================== */}
          <div className="lg:col-span-5 p-5 sm:p-7 lg:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
            <div>
              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-950 tracking-tight leading-snug mb-2 font-serif">
                {product.name}
              </h1>

              {/* Price Row: Terracotta Red bold price, strike-through MRP, % OFF */}
              <div className="flex items-baseline gap-2.5 mb-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#c2410c] font-mono tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm sm:text-base text-slate-400 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#c2410c]">
                  {product.discountPercent}% OFF
                </span>
              </div>

              {/* Tax Included Note */}
              <div className="text-xs text-slate-400 mb-3">Tax included.</div>

              {/* Certified Badge Ribbon (Magenta with icon from screenshot) */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#be185d] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>CERTIFIED</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    SIZE
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>SIZE GUIDE</span>
                  </button>
                </div>

                {/* Size Chips */}
                <div className="flex flex-wrap gap-2">
                  {(product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL']).map(
                    (sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[44px] h-10 px-3 flex items-center justify-center text-xs font-bold transition-all cursor-pointer rounded-xs ${
                          selectedSize === sz
                            ? 'border-2 border-slate-950 bg-white text-slate-950 shadow-xs'
                            : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {sz}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Size Chart Modal / Drawer if toggled */}
              {showSizeGuide && (
                <div className="mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900 mb-2">Standard Apparel Measurements</div>
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="py-1">Size</th>
                        <th className="py-1">Bust (Inches)</th>
                        <th className="py-1">Waist (Inches)</th>
                        <th className="py-1">Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-1 font-bold">S</td>
                        <td className="py-1">36"</td>
                        <td className="py-1">32"</td>
                        <td className="py-1">46"</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">M</td>
                        <td className="py-1">38"</td>
                        <td className="py-1">34"</td>
                        <td className="py-1">46"</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">L</td>
                        <td className="py-1">40"</td>
                        <td className="py-1">36"</td>
                        <td className="py-1">46"</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">XL</td>
                        <td className="py-1">42"</td>
                        <td className="py-1">38"</td>
                        <td className="py-1">46"</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-bold">XXL</td>
                        <td className="py-1">44"</td>
                        <td className="py-1">40"</td>
                        <td className="py-1">46"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Apply Offers! Card (Matching exact screenshot styling) */}
              <div className="bg-[#fff6f6] rounded-xl p-4 border border-rose-100/90 mb-5 space-y-2.5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Apply Offers!</h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-800">
                      <strong className="font-semibold text-slate-950">Kurtas:</strong> Buy any 2 at{' '}
                      <span className="font-bold text-slate-950">₹1,499</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => alert('Offer applied: Buy any 2 Kurtas at ₹1,499!')}
                      className="text-xs font-semibold text-[#be185d] hover:text-[#9d174d] cursor-pointer"
                    >
                      Shop
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-800">
                      <strong className="font-semibold text-slate-950">Maternity:</strong> Buy any 2
                      at <span className="font-bold text-slate-950">₹1,999</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => alert('Offer applied: Buy any 2 Maternity styles at ₹1,999!')}
                      className="text-xs font-semibold text-[#be185d] hover:text-[#9d174d] cursor-pointer"
                    >
                      Shop
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-800">
                      <strong className="font-semibold text-slate-950">Leggings:</strong> Buy any 3
                      at <span className="font-bold text-slate-950">₹999</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => alert('Offer applied: Buy any 3 Leggings at ₹999!')}
                      className="text-xs font-semibold text-[#be185d] hover:text-[#9d174d] cursor-pointer"
                    >
                      Shop
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-800">
                      <strong className="font-bold text-slate-950">SALE: UP TO 50% OFF</strong> on
                      selected styles
                    </span>
                    <button
                      type="button"
                      onClick={() => alert('Sale offer active! Instant discount applied at checkout.')}
                      className="text-xs font-semibold text-[#be185d] hover:text-[#9d174d] cursor-pointer"
                    >
                      Shop
                    </button>
                  </div>
                </div>
              </div>

              {/* Add a HAY! Gift Box Box (Matching screenshot) */}
              <div className="border border-pink-200 bg-[#fffbfc] rounded-xl p-3.5 mb-5 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="gift-box"
                    checked={addGiftBox}
                    onChange={(e) => setAddGiftBox(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <label htmlFor="gift-box" className="cursor-pointer">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>Add a HAY! Gift Box</span>
                      <span>🎁</span>
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Make your order extra special with our signature gift box.
                    </div>
                    <div className="text-xs font-bold text-slate-900 font-mono mt-1">₹399</div>
                  </label>
                </div>

                {/* Gift Box Graphic preview */}
                <div className="relative shrink-0 w-20 h-14 bg-rose-900/10 rounded-lg overflow-hidden border border-rose-200/60 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80"
                    alt="Signature Gift Box"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-rose-950/80 text-[8px] text-white text-center py-0.5 font-bold">
                    Gift Box
                  </span>
                </div>
              </div>

              {/* Key Highlights Table (Exact 2x3 grid from screenshot) */}
              <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
                  Key Highlights
                </h3>

                <div className="border-t border-b border-slate-200 divide-y divide-slate-100 text-xs">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 py-2.5">
                    <div>
                      <div className="text-slate-400 text-[11px]">Fit</div>
                      <div className="font-semibold text-slate-900">{keyHighlights.fit}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Top Fabric</div>
                      <div className="font-semibold text-slate-900">{keyHighlights.topFabric}</div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 py-2.5">
                    <div>
                      <div className="text-slate-400 text-[11px]">Neck</div>
                      <div className="font-semibold text-slate-900">{keyHighlights.neck}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Sleeve Styling</div>
                      <div className="font-semibold text-slate-900">
                        {keyHighlights.sleeveStyling}
                      </div>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-2 py-2.5">
                    <div>
                      <div className="text-slate-400 text-[11px]">Sleeve Length</div>
                      <div className="font-semibold text-slate-900">
                        {keyHighlights.sleeveLength}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Top Technique</div>
                      <div className="font-semibold text-slate-900">
                        {keyHighlights.topTechnique}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Extra Specs if toggled */}
                  {showMoreSpecs && (
                    <>
                      <div className="grid grid-cols-2 py-2.5">
                        <div>
                          <div className="text-slate-400 text-[11px]">Length</div>
                          <div className="font-semibold text-slate-900">{keyHighlights.length}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-[11px]">Package Contains</div>
                          <div className="font-semibold text-slate-900">
                            {keyHighlights.packageContains}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 py-2.5">
                        <div>
                          <div className="text-slate-400 text-[11px]">Weave Type</div>
                          <div className="font-semibold text-slate-900">
                            {keyHighlights.weaveType}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-[11px]">Transparency</div>
                          <div className="font-semibold text-slate-900">
                            {keyHighlights.transparency}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Show More Link */}
                <button
                  type="button"
                  onClick={() => setShowMoreSpecs(!showMoreSpecs)}
                  className="mt-2 text-xs font-semibold text-[#be185d] hover:text-[#9d174d] cursor-pointer flex items-center gap-1"
                >
                  <span>{showMoreSpecs ? 'Show Less' : 'Show More'}</span>
                  {showMoreSpecs ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Scarcity Bar: "HURRY, ONLY 9 ITEMS LEFT IN STOCK!" */}
              <div className="mb-6 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
                  HURRY, ONLY 9 ITEMS LEFT IN STOCK!
                </div>
                <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-2/5 rounded-full" />
                </div>
              </div>

              {/* Dual Action Buttons: ADD TO CART & BUY NOW */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-950 font-bold uppercase tracking-wider text-xs sm:text-sm border-2 border-slate-950 rounded-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedNotice ? 'Added to Bag ✓' : 'ADD TO CART'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNowClick}
                  className="w-full py-3.5 px-4 bg-slate-950 hover:bg-slate-900 text-white font-bold uppercase tracking-wider text-xs sm:text-sm border-2 border-slate-950 rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
