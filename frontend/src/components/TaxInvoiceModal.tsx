import React from 'react';
import {
  Printer,
  X,
  FileText,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';

export interface InvoiceOrderData {
  orderId: string;
  invoiceNumber?: string;
  date?: string;
  createdAt?: string | Date;
  status?: string;
  customerName?: string;
  customerMobile?: string;
  customerEmail?: string;
  deliveryAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    pincode: string;
  };
  billingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    pincode: string;
  };
  items: Array<{
    productId?: string;
    productName?: string;
    name?: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    hsn?: string;
  }>;
  subTotal?: number;
  discountAmount?: number;
  couponApplied?: string;
  gstAmount?: number;
  shippingFee?: number;
  totalAmount: number;
  paymentMode?: string;
  paymentMethod?: string;
  courierPartner?: string;
  awbNumber?: string;
  trackingNumber?: string;
}

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: InvoiceOrderData | null;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const invoiceNum =
    order.invoiceNumber || `INV-2026-${order.orderId.replace(/\D/g, '').slice(-6) || '123456'}`;

  const invoiceDateStr =
    order.date ||
    (order.createdAt
      ? new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }));

  const customerName = order.customerName || order.deliveryAddress?.name || 'Customer';
  const customerPhone = order.customerMobile || order.deliveryAddress?.phone || '+91 9876543210';
  const customerEmail = order.customerEmail || 'customer@voraeclat.com';

  const shipAddr = order.deliveryAddress || {
    name: customerName,
    phone: customerPhone,
    address: '102, Green Park Avenue, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  };

  const rawSubTotal =
    order.subTotal ||
    order.items.reduce((s, it) => s + it.price * (it.quantity || 1), 0);
  const discount = order.discountAmount || 0;
  const taxableVal = Math.max(0, rawSubTotal - discount);
  const gstAmount = order.gstAmount !== undefined ? order.gstAmount : Math.round(taxableVal * 0.05);
  const finalTotal = order.totalAmount || taxableVal + gstAmount;

  const paymentLabel = order.paymentMode || order.paymentMethod || 'Cash on Delivery (COD)';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Precision Print Styling: Hides all parent modals & prints ONLY the invoice in full color */}
      <style>{`
        @media print {
          /* 1. Hide everything else in the application */
          body,
          body * {
            visibility: hidden !important;
          }

          /* 2. Show ONLY the tax invoice and all of its elements */
          #printable-tax-invoice,
          #printable-tax-invoice * {
            visibility: visible !important;
          }

          /* 3. Position invoice at the absolute top-left of the physical paper */
          #printable-tax-invoice {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            z-index: 9999999 !important;
          }

          /* 4. Force browser to print exact background colors and graphics */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          @page {
            size: A4 portrait;
            margin: 6mm 10mm;
          }
        }
      `}</style>

      {/* Floating Action Bar (Hidden During Print) */}
      <div className="fixed top-3 sm:top-5 z-60 flex items-center gap-2 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-slate-700/60 print:hidden">
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mr-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Tax Invoice &bull; #{order.orderId}</span>
        </span>
        <button
          type="button"
          onClick={handlePrint}
          className="px-3.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save PDF</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Modern Graphic Invoice Canvas */}
      <div className="max-w-3xl w-full my-12 print:my-0">
        <div
          id="printable-tax-invoice"
          className="bg-white text-slate-900 rounded-none w-full shadow-2xl border border-slate-200 overflow-hidden relative font-sans text-xs"
        >
          {/* ======================================================== */}
          {/* TOP GEOMETRIC HEADER (Navy + Dynamic Amber Angled Slices) */}
          {/* ======================================================== */}
          <div className="relative bg-[#111A2C] text-white pt-8 pb-7 px-8 sm:px-10 overflow-hidden">
            {/* Angular Amber / Orange Accent Chevrons */}
            <div
              className="absolute top-0 right-[28%] bottom-0 w-16 sm:w-20 bg-amber-500 transform -skew-x-[28deg] origin-top-left"
              style={{ zIndex: 1 }}
            />
            <div
              className="absolute top-0 right-[25%] bottom-0 w-8 sm:w-10 bg-amber-600/80 transform -skew-x-[28deg] origin-top-left"
              style={{ zIndex: 0 }}
            />
            <div
              className="absolute -bottom-1 left-0 w-[42%] h-4 bg-amber-500"
              style={{ zIndex: 2 }}
            />
            <div
              className="absolute -bottom-1 left-[42%] w-10 h-4 bg-amber-500 transform -skew-x-[28deg] origin-bottom-left"
              style={{ zIndex: 2 }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Left: Official Brand Artwork Logo */}
              <div className="flex items-center">
                <img
                  src="/voraeclat-logo-art.png"
                  alt="Voraeclat - Little Things, Big Dreams"
                  className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] select-none"
                  loading="eager"
                />
              </div>

              {/* Right: INVOICE & ID NO Title */}
              <div className="sm:text-right">
                <h2 className="text-3xl sm:text-4xl font-black text-amber-500 tracking-wider uppercase leading-none font-sans">
                  INVOICE
                </h2>
                <div className="text-[11px] font-mono text-slate-300 font-bold tracking-wide mt-1">
                  ID NO : <span className="text-white font-black">{invoiceNum}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  DATE : <span className="text-slate-200 font-semibold">{invoiceDateStr}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* INVOICE TO & INVOICE FROM TWO-COLUMN SECTION */}
          {/* ======================================================== */}
          <div className="px-8 sm:px-10 pt-7 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
            {/* Invoice To : */}
            <div className="space-y-2">
              <div className="inline-block bg-[#111A2C] text-white px-3.5 py-1 text-xs font-black uppercase tracking-wider border-b-2 border-amber-500 shadow-2xs">
                Invoice To :
              </div>
              <div className="text-slate-900 font-black text-sm">{customerName}</div>
              <div className="text-slate-600 text-xs space-y-0.5 font-medium leading-relaxed">
                <div>{shipAddr.address}</div>
                <div>
                  {shipAddr.city}, {shipAddr.state || 'Maharashtra'} -{' '}
                  <strong>{shipAddr.pincode}</strong>
                </div>
                <div className="pt-0.5 text-slate-700 font-mono text-[11px]">
                  Phone : {customerPhone}
                </div>
                {customerEmail && (
                  <div className="text-slate-500 text-[11px]">Email : {customerEmail}</div>
                )}
              </div>
            </div>

            {/* Invoice From : */}
            <div className="space-y-2">
              <div className="inline-block bg-[#111A2C] text-white px-3.5 py-1 text-xs font-black uppercase tracking-wider border-b-2 border-amber-500 shadow-2xs">
                Invoice From :
              </div>
              <div className="text-slate-900 font-black text-sm">Voraeclat Retail Pvt. Ltd.</div>
              <div className="text-slate-600 text-xs space-y-0.5 font-medium leading-relaxed">
                <div>BKC, Plot No. C-42, G Block, Bandra East</div>
                <div>Mumbai, Maharashtra - 400051, India</div>
                <div className="pt-0.5 text-slate-700 font-mono text-[11px]">
                  Phone : +91 (022) 6982-4500
                </div>
                <div className="text-slate-700 font-mono text-[11px]">
                  GSTIN : 27AAACV9821L1Z4
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TABLE SECTION (Amber / Orange Header with Angular Cuts) */}
          {/* ======================================================== */}
          <div className="px-8 sm:px-10 pb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-500 text-white font-black uppercase tracking-wider text-xs">
                  <th className="py-2.5 px-4 rounded-l-none">DESCRIPTION</th>
                  <th className="py-2.5 px-3 text-right">
                    <span className="opacity-60 mr-2 text-[10px]">/</span> PRICE
                  </th>
                  <th className="py-2.5 px-3 text-center">
                    <span className="opacity-60 mr-2 text-[10px]">/</span> QTY
                  </th>
                  <th className="py-2.5 px-4 text-right rounded-r-none">
                    <span className="opacity-60 mr-2 text-[10px]">/</span> TOTAL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs text-slate-800 font-medium">
                {order.items && order.items.length > 0 ? (
                  order.items.map((it, idx) => {
                    const itPrice = Number(it.price) || 0;
                    const itQty = Number(it.quantity) || 1;
                    const itTotal = itPrice * itQty;

                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-950 text-xs">
                            {it.productName || it.name || 'Organic Baby Garment'}
                          </div>
                          {(it.size || it.color) && (
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {it.size && <span>Size: {it.size}</span>}
                              {it.size && it.color && <span> &bull; </span>}
                              {it.color && <span>Color: {it.color}</span>}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                          ₹{itPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900">{itQty}</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-slate-950">
                          ₹{itTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      Premium Baby Organic Collection
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">1</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-slate-950">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="w-full h-[1.5px] bg-slate-900 mt-0.5" />
          </div>

          {/* ======================================================== */}
          {/* PAYMENT METHOD, CONTACT INFO & TOTALS BREAKDOWN */}
          {/* ======================================================== */}
          <div className="px-8 sm:px-10 pb-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Left Column: Payment Method */}
            <div className="sm:col-span-4 space-y-2">
              <div className="inline-block bg-[#111A2C] text-white px-3 py-1 text-[11px] font-black uppercase tracking-wider border-b-2 border-amber-500">
                Payment Method :
              </div>
              <div className="text-[11px] text-slate-700 space-y-1 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 w-20">Payment Mode:</span>
                  <strong className="text-slate-950">{paymentLabel}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 w-20">Order ID:</span>
                  <span className="font-mono font-bold text-amber-700">{order.orderId}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 w-20">Courier / AWB:</span>
                  <span className="font-mono text-slate-800">
                    {order.awbNumber || order.trackingNumber || `DLV-${order.orderId.replace(/\D/g, '')}IN`}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Column: Contact Info */}
            <div className="sm:col-span-4 space-y-2">
              <div className="inline-block bg-[#111A2C] text-white px-3 py-1 text-[11px] font-black uppercase tracking-wider border-b-2 border-amber-500">
                Contact Info :
              </div>
              <div className="text-[11px] text-slate-700 space-y-1 font-medium">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>+91 (022) 6982-4500</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>support@voraeclat.com</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>www.voraeclat.com</span>
                </div>
              </div>
            </div>

            {/* Right Column: Financial Calculation */}
            <div className="sm:col-span-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-700 font-semibold">
                <span>Subtotal :</span>
                <span className="font-mono font-bold">₹{rawSubTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-semibold">
                <span>GST (5%) :</span>
                <span className="font-mono font-bold">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-semibold">
                <span>Discount :</span>
                <span className="font-mono font-bold">
                  {discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '₹0.00'}
                </span>
              </div>

              {/* Angular TOTAL Badge */}
              <div className="relative mt-2 pt-1">
                <div className="bg-amber-500 text-slate-950 font-black flex items-center justify-between py-2 px-3 text-sm rounded-none shadow-xs">
                  <span className="tracking-wider uppercase">TOTAL</span>
                  <span className="text-base font-mono font-black text-slate-950">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* THANKS FOR YOUR BUSINESS & SIGNATURE BLOCK */}
          {/* ======================================================== */}
          <div className="px-8 sm:px-10 pb-8 pt-2 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end">
            {/* Left: Thanks & Assurance */}
            <div className="sm:col-span-8 space-y-1.5">
              <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">
                Thanks for your business
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-md">
                We declare that this invoice shows the actual price of the goods described. Certified
                100% baby-safe, non-toxic, and dermatologically tested organic cotton. 15-day return
                guarantee.
              </p>
            </div>

            {/* Right: Signature Line */}
            <div className="sm:col-span-4 text-center sm:text-right space-y-1">
              <div className="font-bold text-slate-900 text-sm">Voraeclat Retail</div>
              <div className="w-36 h-[1.5px] bg-slate-900 ml-auto mr-auto sm:mr-0" />
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest pt-0.5">
                SIGNATURE
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* BOTTOM GEOMETRIC FOOTER (Navy Bar + Orange Angular Slice) */}
          {/* ======================================================== */}
          <div className="relative bg-[#111A2C] h-9 overflow-hidden">
            {/* Angled Orange Strip on Left */}
            <div
              className="absolute top-0 left-0 bottom-0 w-[55%] bg-amber-500"
              style={{ zIndex: 1 }}
            />
            <div
              className="absolute top-0 left-[55%] bottom-0 w-8 bg-amber-500 transform -skew-x-[28deg] origin-top-left"
              style={{ zIndex: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
