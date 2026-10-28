import React from 'react';
import {
  Home,
  Menu as MenuIcon,
  Search,
  LayoutGrid,
  ShoppingBag,
  User,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: 'home' | 'shop' | 'contact' | 'franchise';
  onOpenHome: () => void;
  onOpenShop: () => void;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenAccount: () => void;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onOpenHome,
  onOpenShop,
  onOpenMenu,
  onOpenSearch,
  onOpenCart,
  onOpenAccount,
  cartCount,
}) => {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:hidden"
    >
      <div className="grid grid-cols-6 items-center h-14 max-w-lg mx-auto px-1">
        {/* 1. HOME */}
        <button
          type="button"
          onClick={onOpenHome}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-colors cursor-pointer ${
            currentPage === 'home'
              ? 'text-slate-950 font-black'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-bold tracking-wider uppercase">HOME</span>
        </button>

        {/* 2. MENU */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center gap-0.5 py-1 text-center text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <MenuIcon className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-bold tracking-wider uppercase">MENU</span>
        </button>

        {/* 3. SEARCH */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center gap-0.5 py-1 text-center text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-bold tracking-wider uppercase">SEARCH</span>
        </button>

        {/* 4. SHOP */}
        <button
          type="button"
          onClick={onOpenShop}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-colors cursor-pointer ${
            currentPage === 'shop'
              ? 'text-slate-950 font-black'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-bold tracking-wider uppercase">SHOP</span>
        </button>

        {/* 5. CART */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1 text-center text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-slate-950 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase">CART</span>
        </button>

        {/* 6. ACCOUNT */}
        <button
          type="button"
          onClick={onOpenAccount}
          className="flex flex-col items-center justify-center gap-0.5 py-1 text-center text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <User className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-bold tracking-wider uppercase">ACCOUNT</span>
        </button>
      </div>
    </nav>
  );
};
