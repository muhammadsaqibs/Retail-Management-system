import React, { useState, useEffect } from "react";
import { 
  ScanLine, 
  Camera, 
  Package, 
  Tag, 
  ShoppingCart, 
  X, 
  RefreshCcw, 
  AlertCircle 
} from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";

const Scanner = () => {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  // Dummy Inventory for Matching Barcodes
  const dummyInventory = [
    { barcode: "123456", name: "Lays Masala Large", price: 100, stock: 45, category: "Snacks" },
    { barcode: "987654", name: "Coca Cola 1.5L", price: 210, stock: 20, category: "Beverages" },
    { barcode: "112233", name: "Lux Soap 150g", price: 145, stock: 12, category: "Personal Care" }
  ];

  useEffect(() => {
    // 1. Initialize Scanner
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 150 }, // Barcode box size
      rememberLastUsedCamera: true,
      supportedScanTypes: [0] // 0 means camera scan
    });

    const onScanSuccess = (decodedText) => {
      // Audio feedback (optional)
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play();

      handleBarcodeMatch(decodedText);
    };

    const onScanFailure = (error) => {
      // Silence errors to avoid console spamming
    };

    scanner.render(onScanSuccess, onScanFailure);

    // Clean up when component unmounts
    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, []);

  const handleBarcodeMatch = (code) => {
    const product = dummyInventory.find(item => item.barcode === code);
    
    if (product) {
      setScannedProduct(product);
      setScanHistory(prev => [{ ...product, time: new Date().toLocaleTimeString() }, ...prev]);
      toast.success(`Product Found: ${product.name}`);
    } else {
      setScannedProduct({ barcode: code, name: "Unknown Product", price: 0, stock: 0, category: "N/A" });
      toast.error("Code Scanned! Product not in database.");
    }
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-50 p-8 mt-14 font-sans text-left">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#13786E] uppercase tracking-tighter flex items-center gap-2">
          <ScanLine size={30} /> Intelligent Scanner
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time Barcode & QR Detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
        
        {/* LEFT COLUMN: Camera Viewport */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
          <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-xs font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
              <Camera size={14} className="text-[#13786E]"/> Live Viewfinder
            </h2>
            <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Terminal</span>
            </div>
          </div>

          <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
            {/* The Scanner will be mounted here */}
            <div id="reader" className="w-full"></div>
            
            {/* Design Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40"></div>
          </div>

          <div className="p-4 bg-teal-50/50 text-center">
             <p className="text-[10px] text-[#13786E] font-bold uppercase tracking-widest italic flex items-center justify-center gap-2">
               <AlertCircle size={12}/> Place the barcode within the central frame
             </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Result & History */}
        <div className="flex flex-col gap-6 overflow-hidden">
          
          {/* Current Scanned Product Info */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-t-4 border-[#13786E] relative">
            {scannedProduct ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-teal-50 p-4 rounded-2xl text-[#13786E]">
                    <Package size={32} />
                  </div>
                  <button onClick={() => setScannedProduct(null)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <X size={20}/>
                  </button>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-[3px]">Matched Result</p>
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight">{scannedProduct.name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{scannedProduct.category}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Selling Price</p>
                    <p className="text-xl font-black text-gray-800">Rs. {scannedProduct.price}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Available Stock</p>
                    <p className="text-xl font-black text-gray-800">{scannedProduct.stock} Pcs</p>
                  </div>
                </div>

                <button className="w-full mt-6 bg-[#13786E] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                  <ShoppingCart size={16}/> Add to Billing Cart
                </button>
              </div>
            ) : (
              <div className="py-14 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                  <ScanLine size={32} className="text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-400 text-sm uppercase tracking-widest">Waiting for Scan...</h3>
              </div>
            )}
          </div>

          {/* Recent Scans List */}
          <div className="bg-white rounded-[2rem] border border-gray-100 flex-1 flex flex-col overflow-hidden">
             <div className="p-5 border-b bg-gray-50/30 flex justify-between items-center">
                <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                   <RefreshCcw size={12}/> Scanned History
                </h2>
                <button onClick={() => setScanHistory([])} className="text-[9px] font-bold text-red-400 hover:underline uppercase">Clear Logs</button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {scanHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-teal-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border text-[#13786E]"><Tag size={12}/></div>
                      <div>
                        <p className="text-xs font-bold text-gray-700">{item.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{item.time}</p>
                      </div>
                    </div>
                    <p className="text-xs font-black text-gray-800">Rs. {item.price}</p>
                  </div>
                ))}
                {scanHistory.length === 0 && (
                  <p className="text-center py-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No scans recorded yet</p>
                )}
             </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        #reader { border: none !important; }
        #reader__dashboard_section_csr button { 
          background-color: #13786E !important; 
          color: white !important; 
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
        }
      `}</style>
    </div>
  );
};

export default Scanner;