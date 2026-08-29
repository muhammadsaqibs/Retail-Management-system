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

  // Fetch actual products
  const { data: productsData } = useQuery({ 
    queryKey: ['Products'], 
    queryFn: async () => (await axiosInstance.get('/products/all')).data 
  });
  const products = productsData?.data || productsData || [];

  const [barcodeInput, setBarcodeInput] = useState("");
  const barcodeInputRef = useRef(null);

  // Focus scanner input when scanner is opened
  useEffect(() => {
    if (isScannerOpen && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [isScannerOpen]);

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput) return;
    const found = products.find(p => p.Barcode === barcodeInput || p.Name.toLowerCase() === barcodeInput.toLowerCase());
    if (found) {
      addToCart(found);
      setBarcodeInput("");
      toast.success(`${found.Name} Added!`);
    } else {
      toast.error("Product not found!");
      setBarcodeInput("");
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter(p => p.Name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, products]);

  const saveOrder = async (print = false) => {
    if (cart.length === 0) return toast.error("Cart is empty");
    try {
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        customer: "Walk-in Customer",
        amount: grandTotal,
        status: "Completed",
        items: cart.map(c => ({ name: c.Name, qty: c.qty, price: c.Price }))
      };
      
      const savedOrders = JSON.parse(localStorage.getItem("apex_orders_list") || "[]");
      localStorage.setItem("apex_orders_list", JSON.stringify([newOrder, ...savedOrders]));
      
      toast.success("Order saved successfully");
      if (print) {
        setTimeout(() => window.print(), 500);
      }
      setCart([]); setTax(0); setDiscount(0); setSearchTerm("");
    } catch (err) {
      toast.error("Failed to save order");
    }
  };

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (Number(item.Price || 0) * item.qty), 0), [cart]);
  const grandTotal = subtotal + Number(tax) - Number(discount);

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-gray-50 p-4 md:p-6 mt-14 font-sans text-left overflow-x-hidden print:m-0 print:p-0 print:bg-white print:min-h-0">
      
      {/* MAIN POS INTERFACE - HIDDEN ON PRINT */}
      <div className="no-print flex flex-col gap-6">
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
            <div className="bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative border-4 border-[#13786E] h-32 md:h-48 flex items-center justify-center animate-in zoom-in duration-300 shadow-2xl p-6">
               <form onSubmit={handleBarcodeSubmit} className="w-full flex flex-col items-center gap-4">
                 <ScanLine size={48} className="text-[#13786E]" />
                 <input 
                   ref={barcodeInputRef}
                   type="text" 
                   value={barcodeInput}
                   onChange={(e) => setBarcodeInput(e.target.value)}
                   placeholder="Scan Barcode Here..."
                   className="w-full max-w-sm px-6 py-4 rounded-2xl bg-black/50 text-white border border-[#13786E] outline-none focus:ring-2 focus:ring-teal-400 font-bold text-center uppercase tracking-widest"
                 />
                 <button type="submit" className="hidden">Submit</button>
               </form>
               <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-white uppercase">Scanner Ready</span>
               </div>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input 
                  type="text" placeholder="Manual Item Search..." 
                  className="w-full outline-none font-bold text-sm bg-transparent"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {searchTerm && searchResults.length > 0 && (
              <div className="absolute z-50 w-full bg-white mt-2 rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                {searchResults.map(p => (
                  <div 
                    key={p._id} 
                    onClick={() => { addToCart(p); setSearchTerm(""); }}
                    className="p-4 hover:bg-teal-50 cursor-pointer border-b border-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-sm text-gray-800">{p.Name}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Stock: {p.Stock}</p>
                    </div>
                    <p className="font-black text-[#13786E]">Rs. {Number(p.Price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
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
                    <tr key={item._id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 text-sm">{item.Name}</p>
                        <p className="text-[9px] text-gray-400 font-black tracking-widest uppercase">Unit: Rs.{Number(item.Price).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button onClick={() => setCart(cart.map(i => i._id === item._id ? {...i, qty: Math.max(1, i.qty - 1)} : i))} className="p-1 text-gray-400 hover:text-red-500"><Minus size={14}/></button>
                          <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                          <button onClick={() => setCart(cart.map(i => i._id === item._id ? {...i, qty: i.qty + 1} : i))} className="p-1 text-[#13786E] hover:scale-125"><Plus size={14}/></button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-800 text-sm">Rs. {(item.Price * item.qty).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => setCart(cart.filter(i => i._id !== item._id))} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
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
                <button onClick={() => saveOrder(false)} className="w-full bg-gray-800 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95">
                    <Save size={18}/> Save
                </button>
                <button onClick={() => saveOrder(true)} className="w-full bg-[#13786E] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all hover:bg-[#0e5a52]">
                    <Printer size={18}/> Save & Print
                </button>
            </div>
            </div>
          </div>
        </div>
      </div>
      </div> {/* END NO-PRINT WRAPPER */}

      {/* --- PRINT ONLY RECEIPT TEMPLATE --- */}
      <div className="hidden print-only print:block text-black bg-white p-2 max-w-[80mm] mx-auto font-sans">
        <div className="text-center mb-4 border-b-2 border-black pb-4 text-black">
           <h1 className="text-2xl font-black uppercase">{profile?.username || profile?.name || "RETAIL STORE"}</h1>
           <p className="text-xs font-bold mt-1">{profile?.address || "Address Not Provided"}</p>
           <p className="text-xs font-bold">Tel: {profile?.phone || profile?.contact || "N/A"}</p>
        </div>
        
        <div className="flex justify-between text-xs font-bold mb-4 border-b border-black pb-2 text-black">
           <span>Date: {new Date().toLocaleDateString()}</span>
           <span>Time: {new Date().toLocaleTimeString()}</span>
        </div>

        <table className="w-full text-left text-xs font-bold mb-4 text-black">
           <thead>
              <tr className="border-b border-black">
                 <th className="py-1">Item</th>
                 <th className="py-1 text-center">Qty</th>
                 <th className="py-1 text-right">Price</th>
              </tr>
           </thead>
           <tbody>
              {cart.map((item, idx) => (
                <tr key={idx} className="border-b border-dashed border-gray-400">
                   <td className="py-2 pr-2">{item.Name}</td>
                   <td className="py-2 text-center">{item.qty}</td>
                   <td className="py-2 text-right">{item.Price * item.qty}</td>
                </tr>
              ))}
           </tbody>
        </table>

        <div className="flex flex-col gap-1 text-xs font-bold border-t-2 border-black pt-2 mb-6 text-black">
           <div className="flex justify-between"><span>Subtotal:</span><span>Rs. {subtotal}</span></div>
           <div className="flex justify-between"><span>GST/Tax:</span><span>Rs. {tax}</span></div>
           <div className="flex justify-between"><span>Discount:</span><span>Rs. {discount}</span></div>
           <div className="flex justify-between text-lg font-black mt-2 pt-2 border-t border-black">
              <span>TOTAL:</span><span>Rs. {grandTotal}</span>
           </div>
        </div>

        <div className="text-center text-[10px] font-bold text-black border-t border-dashed border-gray-400 pt-4">
           <p>Thank you for shopping with us!</p>
           <p>Software by Apexiums</p>
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
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
          @page { margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default Billing;