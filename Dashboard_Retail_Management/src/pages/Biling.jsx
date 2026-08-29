import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  ReceiptCent, Search, Plus, Minus, Trash2, 
  RefreshCcw, Save, ScanLine, CameraOff, Printer, Loader2 
} from "lucide-react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Html5Qrcode } from "html5-qrcode";
import axiosInstance from "../lib/axios";

const Billing = () => {
  const { data: authData } = useQuery({ queryKey: ["authUser"] });
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));
  const profile = authData?.user || storeUser;

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  
  const scannerRef = useRef(null);

  // Dummy products list (Replace with actual backend search later)
  const products = [
    { id: 1, barcode: "123456", name: "Premium Basmati Rice 5kg", price: 1250 },
    { id: 2, barcode: "987654", name: "Cooking Oil 5L", price: 2450 },
    { id: 3, barcode: "112233", name: "Dairy Milk Chocolate", price: 180 },
  ];

  // --- SCANNER START/STOP LOGIC ---
  useEffect(() => {
    if (isScannerOpen) {
      scannerRef.current = new Html5Qrcode("billing-scanner");
      scannerRef.current.start(
        { facingMode: "environment" }, // Mobile back camera focus
        { fps: 10, qrbox: { width: 250, height: 180 } },
        (decodedText) => {
          const found = products.find(p => p.barcode === decodedText);
          if (found) {
            setCart(prev => {
              const existing = prev.find(item => item.id === found.id);
              if (existing) {
                return prev.map(item => item.id === found.id ? { ...item, qty: item.qty + 1 } : item);
              }
              return [...prev, { ...found, qty: 1 }];
            });
            toast.success(`${found.name} Added!`);
          }
        },
        (err) => {}
      ).catch(err => {
        console.error("Scanner Error:", err);
        setIsScannerOpen(false);
      });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => scannerRef.current.clear());
      }
    };
  }, [isScannerOpen]);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);
  const grandTotal = subtotal + Number(tax) - Number(discount);

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-gray-50 p-4 md:p-6 mt-14 font-sans text-left overflow-x-hidden">
      
      {/* Header - Stack on very small devices */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-xl md:text-2xl font-black text-[#13786E] uppercase tracking-tighter flex items-center justify-center sm:justify-start gap-2">
            <ReceiptCent size={28} /> Terminal Billing
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic hidden sm:block">
            Secure POS Terminal Operational
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsScannerOpen(!isScannerOpen)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase transition-all shadow-lg active:scale-95 ${isScannerOpen ? "bg-red-500 text-white" : "bg-gray-900 text-white"}`}
            >
              {isScannerOpen ? <CameraOff size={16}/> : <ScanLine size={16}/>}
              {isScannerOpen ? "Stop Scan" : "Scanner"}
            </button>
            <button onClick={() => {setCart([]); setTax(0); setDiscount(0);}} className="bg-white border border-gray-200 p-2.5 rounded-xl text-red-500 hover:bg-red-50 shadow-sm">
               <RefreshCcw size={18} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-180px)]">
        
        {/* LEFT COLUMN: Cart & Scanner */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          
          {/* RESPONSIVE SCANNER VIEWPORT */}
          {isScannerOpen && (
            <div className="bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative border-4 border-[#13786E] h-48 md:h-72 flex items-center justify-center animate-in zoom-in duration-300 shadow-2xl">
               <div id="billing-scanner" className="w-full h-full"></div>
               <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-white uppercase">Active</span>
               </div>
            </div>
          )}

          {/* Search Box */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <Search className="text-gray-400" size={20} />
              <input 
                type="text" placeholder="Manual Item Search..." 
                className="w-full outline-none font-bold text-sm bg-transparent"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          {/* Cart Table Container */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-md z-10 border-b">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4 text-center">Quantity</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                    <th className="px-6 py-4 text-center">X</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest italic">
                        No items in cart
                      </td>
                    </tr>
                  ) : cart.map((item) => (
                    <tr key={item.id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-[9px] text-gray-400 font-black tracking-widest uppercase">Unit: Rs.{item.price}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button onClick={() => setCart(cart.map(i => i.id === item.id ? {...i, qty: Math.max(1, i.qty - 1)} : i))} className="p-1 text-gray-400 hover:text-red-500"><Minus size={14}/></button>
                          <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => setCart(cart.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i))} className="p-1 text-[#13786E] hover:scale-125"><Plus size={14}/></button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-800 text-sm">Rs. {(item.price * item.qty).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Summary */}
        <div className="flex flex-col gap-6 h-full">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 flex-1 flex flex-col border-t-4 border-t-[#13786E]">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 border-b pb-2">Checkout Details</h2>
            <div className="space-y-5 flex-1">
              <div className="flex justify-between font-bold text-gray-400 text-xs uppercase tracking-widest">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manual GST</span>
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                   <span className="text-xs font-black text-orange-600">Rs.</span>
                   <input type="number" className="w-16 md:w-20 bg-transparent text-right outline-none font-black text-orange-600" value={tax} onChange={(e) => setTax(e.target.value)}/>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount</span>
                <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100">
                   <span className="text-xs font-black text-[#13786E]">Rs.</span>
                   <input type="number" className="w-16 md:w-20 bg-transparent text-right outline-none font-black text-[#13786E]" value={discount} onChange={(e) => setDiscount(e.target.value)}/>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-4 border-dashed border-gray-50">
                <p className="text-[10px] font-black text-[#13786E] uppercase tracking-[3px]">Net Payable</p>
                <h3 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter text-left">Rs. {grandTotal.toLocaleString()}</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
                <button onClick={() => toast.info("Syncing Transaction...")} className="w-full bg-gray-800 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95">
                    <Save size={18}/> Process Order
                </button>
                <button onClick={() => window.print()} className="w-full bg-[#13786E] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all hover:bg-[#0e5a52]">
                    <Printer size={18}/> Print Receipt
                </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        #billing-scanner video { 
          width: 100% !important; 
          height: 100% !important; 
          object-fit: cover !important; 
          border-radius: 1.5rem; 
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        
        @media print { 
          .lg\\:ml-64, button, .mt-14, .mb-6 { display: none !important; } 
          body { background: white; margin: 0; padding: 0; }
          .bg-white { box-shadow: none !important; border: none !important; }
          .lg\\:col-span-2 { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default Billing;