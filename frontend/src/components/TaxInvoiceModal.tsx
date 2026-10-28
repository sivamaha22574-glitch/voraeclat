import React from 'react';
import {
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Download,
  Building2,
  Phone,
  Mail,
  MapPin,
  Truck,
  QrCode,
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

// Convert numbers into Indian Rupee Words
function numberToWordsINR(num: number): string {
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ' + a[n % 10] + ' ';
    } else if (n > 0) {
      str += a[n] + ' ';
    }
    return str.trim();
  }

  const rounded = Math.round(num);
  if (rounded === 0) return 'Zero Rupees Only';

  const crore = Math.floor(rounded / 10000000);
  const lakh = Math.floor((rounded % 10000000) / 100000);
  const thousand = Math.floor((rounded % 100000) / 1000);
  const remainder = rounded % 1000;

  let result = '';
  if (crore > 0) result += inWords(crore) + ' Crore ';
  if (lakh > 0) result += inWords(lakh) + ' Lakh ';
  if (thousand > 0) result += inWords(thousand) + ' Thousand ';
  if (remainder > 0) result += inWords(remainder);

  return 'Rupees ' + result.trim() + ' Only';
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const invoiceNum = order.invoiceNumber || `INV-2026-${order.orderId.replace(/\D/g, '').slice(-4) || '8210'}`;
  const invoiceDateStr = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }));

  const customerName = order.customerName || order.deliveryAddress?.name || 'Valued Customer';
  const customerPhone = order.customerMobile || order.deliveryAddress?.phone || '+91 9876543210';
  const customerEmail = order.customerEmail || 'customer@voraeclat.com';
  
  const shipAddr = order.deliveryAddress || {
    name: customerName,
    phone: customerPhone,
    address: '102, Green Park Avenue, Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051'
  };

  const billAddr = order.billingAddress || shipAddr;

  const rawSubTotal = order.subTotal || order.items.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
  const discount = order.discountAmount || 0;
  const taxableVal = Math.max(0, rawSubTotal - discount);
  const cgstVal = Math.round((taxableVal * 0.025) * 100) / 100;
  const sgstVal = Math.round((taxableVal * 0.025) * 100) / 100;
  const shippingCharge = order.shippingFee !== undefined ? order.shippingFee : (rawSubTotal >= 499 ? 0 : 49);
  const finalTotal = order.totalAmount || (taxableVal + cgstVal + sgstVal + shippingCharge);

  const paymentLabel = order.paymentMode || order.paymentMethod || 'Cash on Delivery (COD)';
  const isPaid = !paymentLabel.toUpperCase().includes('COD');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Top Floating Control Bar - Hidden During Print */}
      <div className="fixed top-3 sm:top-5 z-60 flex items-center gap-2 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-slate-700/60 print:hidden">
        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mr-2">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Tax Invoice &bull; {order.orderId}</span>
        </span>
        <button
          type="button"
          onClick={handlePrint}
          className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
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

      {/* Printable Invoice Sheet */}
      <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full my-12 print:my-0 shadow-2xl border border-slate-200 overflow-hidden relative print:shadow-none print:border-none print:rounded-none font-sans text-xs">
        {/* Subtle Decorative Header Strip */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 print:h-1" />

        <div className="p-6 sm:p-8 md:p-10 space-y-6">
          {/* ======================================================== */}
          {/* 1. HEADER: BRAND & LEGAL ENTITY INFO */}
          {/* ======================================================== */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            {/* Left: Brand & Registered Office */}
            <div className="space-y-1.5 max-w-sm">
              <div className="flex items-center gap-2">
                <img
                  src="/voraeclat-mark.png"
                  alt="Voraeclat"
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <h1 className="text-xl font-black text-slate-950 tracking-tight leading-none">VORAECLAT</h1>
                  <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase">Little Things, Big Dreams</span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-600 leading-snug space-y-0.5">
                <div className="font-bold text-slate-900">Voraeclat Retail Private Limited</div>
                <div>Bandra Kurla Complex (BKC), Plot No. C-42, G Block</div>
                <div>Mumbai, Maharashtra - 400051, India</div>
                <div className="pt-0.5 font-mono text-[10px] text-slate-700 flex flex-wrap gap-x-3">
                  <span><strong>GSTIN:</strong> 27AAACV9821L1Z4</span>
                  <span><strong>CIN:</strong> U52100MH2024PTC398124</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-0.5">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> support@voraeclat.com</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> +91 (022) 6982-4500</span>
                </div>
              </div>
            </div>

            {/* Right: Tax Invoice Details Badge */}
            <div className="sm:text-right space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 min-w-[240px] print:bg-white print:border-slate-300">
              <div className="inline-block bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                Original for Recipient
              </div>
              <h2 className="text-lg font-black text-slate-950">TAX INVOICE</h2>
              <div className="text-[11px] space-y-1 text-slate-700 font-medium">
                <div className="flex sm:justify-end gap-2">
                  <span className="text-slate-500">Invoice No:</span>
                  <strong className="font-mono text-slate-950 font-bold">{invoiceNum}</strong>
                </div>
                <div className="flex sm:justify-end gap-2">
                  <span className="text-slate-500">Invoice Date:</span>
                  <strong className="text-slate-900">{invoiceDateStr}</strong>
                </div>
                <div className="flex sm:justify-end gap-2">
                  <span className="text-slate-500">Order ID:</span>
                  <strong className="font-mono text-amber-700 font-bold">{order.orderId}</strong>
                </div>
                <div className="flex sm:justify-end gap-2">
                  <span className="text-slate-500">Place of Supply:</span>
                  <span className="text-slate-900">{shipAddr.state || 'Maharashtra'} (State Code 27)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. BILLED TO & SHIPPED TO TWO-COLUMN BOXES */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Billed To */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 print:bg-white space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" /> Billed To (Buyer)
              </div>
              <div className="font-bold text-slate-950 text-sm">{billAddr.name}</div>
              <div className="text-[11px] text-slate-600 leading-snug">
                {billAddr.address}, {billAddr.city}
              </div>
              <div className="text-[11px] text-slate-600">
                {billAddr.state || 'Maharashtra'} - <strong>{billAddr.pincode}</strong>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 font-mono">
                Phone: {customerPhone} {customerEmail && `| Email: ${customerEmail}`}
              </div>
            </div>

            {/* Shipped To & Logistics */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 print:bg-white space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Truck className="w-3 h-3 text-slate-400" /> Shipped To (Consignee)
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.2 rounded-full">
                  {order.courierPartner || 'Delhivery Express'}
                </span>
              </div>
              <div className="font-bold text-slate-950 text-sm">{shipAddr.name}</div>
              <div className="text-[11px] text-slate-600 leading-snug">
                {shipAddr.address}, {shipAddr.city}
              </div>
              <div className="text-[11px] text-slate-600">
                {shipAddr.state || 'Maharashtra'} - <strong>{shipAddr.pincode}</strong>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 font-mono flex items-center gap-2">
                <span>AWB: <strong>{order.awbNumber || order.trackingNumber || `DLV-${order.orderId.replace(/\D/g, '')}IN`}</strong></span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. ITEMIZED TAX INVOICE TABLE */}
          {/* ======================================================== */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">HSN/SAC</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Taxable Val</th>
                  <th className="py-2.5 px-3 text-right">CGST (2.5%)</th>
                  <th className="py-2.5 px-3 text-right">SGST (2.5%)</th>
                  <th className="py-2.5 px-3 text-right font-black">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => {
                    const itPrice = Number(item.price) || 0;
                    const itQty = Number(item.quantity) || 1;
                    const itGross = itPrice * itQty;
                    const itCgst = Math.round(itGross * 0.025 * 100) / 100;
                    const itSgst = Math.round(itGross * 0.025 * 100) / 100;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{item.productName || item.name || 'Organic Baby Garment'}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            {item.size && <span>Size: <strong>{item.size}</strong></span>}
                            {item.color && <span>&bull; Color: <strong>{item.color}</strong></span>}
                            <span>&bull; Pure Combed Cotton &bull; Skin-Safe</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-[10px] text-slate-500">
                          {item.hsn || '61112000'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">{itQty}</td>
                        <td className="py-2.5 px-3 text-right font-mono">₹{itPrice.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">₹{itGross.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">₹{itCgst.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">₹{itSgst.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-slate-950">
                          ₹{(itGross + itCgst + itSgst).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-4 text-center text-slate-400">
                      No line items recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ======================================================== */}
          {/* 4. FINANCIAL SUMMARY & AMOUNT IN WORDS */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start pt-2">
            {/* Left: Amount in Words & Payment Mode Banner */}
            <div className="sm:col-span-7 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                  Invoice Amount in Words:
                </span>
                <span className="font-bold text-slate-900 text-xs italic">
                  {numberToWordsINR(finalTotal)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                    Payment Method
                  </span>
                  <strong className="text-slate-900">{paymentLabel}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                    Payment Status
                  </span>
                  <span className={`inline-flex items-center gap-1 font-black px-2 py-0.5 rounded-full text-[10px] ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {isPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : null}
                    {isPaid ? 'PAID IN FULL' : 'PAYABLE ON DELIVERY'}
                  </span>
                </div>
              </div>

              {/* Baby Safe Certification Assurance */}
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[10px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>100% Certified Baby-Safe:</strong> Tested for zero toxic dyes, AZO-free, and packaged under sterilized cleanroom protocols.
                </span>
              </div>
            </div>

            {/* Right: Calculations Box */}
            <div className="sm:col-span-5 bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-mono">₹{rawSubTotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon &amp; Club Savings:</span>
                  <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Net Taxable Amount:</span>
                <span className="font-mono font-medium">₹{taxableVal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Central GST (CGST 2.5%):</span>
                <span className="font-mono">₹{cgstVal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>State GST (SGST 2.5%):</span>
                <span className="font-mono">₹{sgstVal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping &amp; Logistics:</span>
                <span className="font-mono font-semibold">
                  {shippingCharge === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingCharge}`}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-950">
                <span>Total Invoice Value:</span>
                <span className="font-mono text-base text-amber-700">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. TERMS, SIGNATURE & LEGAL DECLARATION */}
          {/* ======================================================== */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end text-[10px] text-slate-500">
            {/* Terms & Conditions */}
            <div className="sm:col-span-8 space-y-1">
              <div className="font-bold text-slate-700 uppercase tracking-wider">Terms &amp; Conditions</div>
              <ol className="list-decimal pl-3 space-y-0.5 leading-relaxed">
                <li>Goods once sold can be exchanged or returned within 15 days under our Hassle-Free Baby Guarantee.</li>
                <li>All disputes are subject to Mumbai, Maharashtra jurisdiction exclusively.</li>
                <li>This is a computer-generated Tax Invoice generated in compliance with Section 31 of CGST Act, 2017.</li>
              </ol>
            </div>

            {/* Authorized Signatory Stamp Box */}
            <div className="sm:col-span-4 text-center sm:text-right space-y-1">
              <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                For Voraeclat Retail Pvt Ltd
              </div>
              <div className="h-12 flex items-center justify-center sm:justify-end py-1">
                {/* Simulated Digital Signature Stamp */}
                <div className="border border-dashed border-amber-400 bg-amber-50/60 px-3 py-1 rounded-lg inline-flex flex-col items-center">
                  <span className="font-serif italic font-bold text-slate-900 text-xs">Voraeclat Auth Sign</span>
                  <span className="text-[8px] font-mono text-amber-700">DIGITALLY SIGNED &bull; 256-BIT</span>
                </div>
              </div>
              <div className="font-bold text-slate-900 text-[10px]">Authorized Signatory</div>
            </div>
          </div>
        </div>

        {/* Bottom Print Note Footer */}
        <div className="bg-slate-100 p-2 text-center text-[10px] text-slate-400 border-t border-slate-200">
          Thank you for choosing Voraeclat &bull; Keeping Your Little Ones Stylish, Safe &amp; Happy &bull; www.voraeclat.com
        </div>
      </div>
    </div>
  );
};
