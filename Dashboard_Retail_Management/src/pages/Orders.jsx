import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, Search, Eye, Trash2, CheckCircle, 
  X, Printer, Calendar, CreditCard, User, Plus, Minus, Package, Clock, Loader2
} from "lucide-react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const Orders = () => {
  const { data: authData } = useQuery({ queryKey: ["authUser"] });
  const storeUser = JSON.parse(localStorage.getItem("activeStore"));
  const profile = authData?.user || storeUser;

  // --- 1. INITIAL DATA ---
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("apex_orders_list");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem("apex_orders_list", JSON.stringify(orders));
  }, [orders]);

  // --- 2. STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [showAddModal, setShowAddModal] = useState(false);

  const [newOrder, setNewOrder] = useState({
    customer: "",
    payment: "Cash",
    status: "Pending",
    description: "",
    items: [{ name: "", qty: 1, price: "" }]
  });

  // --- 3. ADD ORDER LOGIC ---
  const addItemRow = () => {
    setNewOrder({ ...newOrder, items: [...newOrder.items, { name: "", qty: 1, price: "" }] });
  };

  const removeItemRow = (index) => {
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = value;
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleSaveOrder = (e, print = false) => {
    e.preventDefault();
    if (!newOrder.customer || newOrder.items[0].name === "") {
      return toast.error("Please fill customer name and at least one item");
    }

    const totalAmount = newOrder.items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0);
    
    const finalOrder = {
      ...newOrder,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      amount: totalAmount,
    };

    setOrders([finalOrder, ...orders]);
    setShowAddModal(false);
    setSelectedOrder(finalOrder); 
    toast.success("Order Saved Successfully!");
    setNewOrder({ customer: "", payment: "Cash", status: "Pending", description: "", items: [{ name: "", qty: 1, price: "" }] });
    
    if (print) {
      setTimeout(() => window.print(), 500); // Wait for modal to render
    }
  };

  const deleteOrder = (id) => {
    if (window.confirm("Delete this order?")) {
      setOrders(orders.filter(o => o.id !== id));
      toast.error("Order deleted");
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm);
    const matchesTab = activeTab === "All" || o.status === activeTab;
    let matchesDate = true;
    if (fromDate && toDate) {
      const orderDate = new Date(o.date);
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = orderDate >= start && orderDate <= end;
    }
    return matchesSearch && matchesTab && matchesDate;
  });

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-gray-50 p-4 md:p-8 mt-14 font-sans text-left text-gray-800 overflow-x-hidden">
      
      {/* Header - Stacks on Mobile */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3">
            <ShoppingCart className="hidden sm:block" size={32} /> Order Management
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Cloud Order Tracking System</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto bg-[#13786E] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={18}/> Create New Order
        </button>
      </div>

      {/* Toolbar - Responsive Flex */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Tabs - Horizontal Scroll on Mobile */}
        <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 w-full lg:w-auto overflow-x-auto scrollbar-hide">
           {["All", "Pending", "Completed"].map(tab => (
             <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-[#13786E] text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
             >
              {tab}
             </button>
           ))}
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <input type="date" className="p-2 border rounded-xl text-xs font-bold text-gray-500 w-full md:w-auto" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <span className="text-gray-400 font-black text-[10px]">TO</span>
          <input type="date" className="p-2 border rounded-xl text-xs font-bold text-gray-500 w-full md:w-auto" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search Order..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
      </div>

      {/* Orders Table - Scrollable on Mobile */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 md:px-8 py-5">Order ID</th>
                  <th className="px-6 md:px-8 py-5">Customer</th>
                  <th className="px-6 md:px-8 py-5">Amount</th>
                  <th className="px-6 md:px-8 py-5 text-center">Status</th>
                  <th className="px-6 md:px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-6 md:px-8 py-5 font-black text-[#13786E] text-sm">{order.id}</td>
                    <td className="px-6 md:px-8 py-5 font-bold text-gray-700 text-sm">{order.customer}</td>
                    <td className="px-6 md:px-8 py-5 font-black text-gray-800 text-sm">Rs. {order.amount.toLocaleString()}</td>
                    <td className="px-6 md:px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                        order.status === "Completed" ? "bg-green-100 text-green-700 border-green-200" : "bg-orange-100 text-orange-700 border-orange-200"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Eye size={16}/></button>
                        <button onClick={() => deleteOrder(order.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-16 text-center text-gray-300 font-black uppercase tracking-[4px] text-xs italic">No orders found matching search</div>
        )}
      </div>

      {/* --- ADD ORDER MODAL - Responsive Grid --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
             <div className="bg-[#13786E] p-6 sticky top-0 z-20 flex justify-between items-center text-white">
                <h2 className="text-lg md:text-xl font-black uppercase tracking-widest">New Order Entry</h2>
                <button onClick={() => setShowAddModal(false)}><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSaveOrder} className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Name</label>
                    <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold" value={newOrder.customer} onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}/>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" value={newOrder.payment} onChange={(e) => setNewOrder({...newOrder, payment: e.target.value})}>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Order Status</label>
                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" value={newOrder.status} onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Order Description</label>
                  <textarea rows="2" placeholder="Notes or description..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold" value={newOrder.description} onChange={(e) => setNewOrder({...newOrder, description: e.target.value})}></textarea>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center border-b pb-2 border-gray-100">
                      <h3 className="text-[10px] font-black text-[#13786E] uppercase tracking-widest">Items List</h3>
                      <button type="button" onClick={addItemRow} className="text-xs font-black text-teal-600 flex items-center gap-1 hover:underline"><Plus size={14}/> Add Row</button>
                   </div>
                   
                   <div className="space-y-3">
                      {newOrder.items.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-end p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                           <div className="w-full md:flex-[3] text-left">
                              <label className="md:hidden text-[9px] font-black text-gray-400 uppercase mb-1 block">Item Name</label>
                              <input placeholder="Item Name" className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold" value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)}/>
                           </div>
                           <div className="w-full md:flex-1 text-left">
                              <label className="md:hidden text-[9px] font-black text-gray-400 uppercase mb-1 block">Qty</label>
                              <input type="number" placeholder="Qty" className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold" value={item.qty} onChange={(e) => handleItemChange(index, "qty", e.target.value)}/>
                           </div>
                           <div className="w-full md:flex-[1.5] text-left">
                              <label className="md:hidden text-[9px] font-black text-gray-400 uppercase mb-1 block">Price</label>
                              <input type="number" placeholder="Price" className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)}/>
                           </div>
                           {index > 0 && (
                             <button type="button" onClick={() => removeItemRow(index)} className="p-3 text-red-400 hover:text-red-600 transition-colors self-end md:self-auto"><Minus size={18}/></button>
                           )}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                   <div className="text-center md:text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
                      <p className="text-2xl font-black text-[#13786E]">Rs. {newOrder.items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0).toLocaleString()}</p>
                   </div>
                   <div className="flex gap-3 w-full md:w-auto">
                     <button type="button" onClick={(e) => handleSaveOrder(e, false)} className="flex-1 md:flex-none px-8 py-4 bg-gray-800 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl transition-all hover:bg-black">Save</button>
                     <button type="button" onClick={(e) => handleSaveOrder(e, true)} className="flex-1 md:flex-none px-8 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl transition-all hover:bg-teal-700">Save & Print</button>
                   </div>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* --- INVOICE VIEW MODAL - Mobile Optimized --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
            <div className="p-6 md:p-10">
               <div className="text-center border-b border-dashed border-gray-200 pb-6">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-[#13786E]">{profile?.username || profile?.name || "Apexiums Retail"}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">{profile?.address || "Address Not Provided"}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-2">Tel: {profile?.phone || profile?.contact || "N/A"}</p>
                  <p className="text-[10px] font-bold text-[#13786E] uppercase tracking-[4px] bg-teal-50 inline-block px-3 py-1 rounded-full">Invoice Receipt</p>
               </div>
               
               <div className="py-6 grid grid-cols-2 gap-y-4 text-[11px] font-black text-gray-500 uppercase">
                  <div className="text-left">
                     <p className="text-gray-400">Bill To:</p>
                     <p className="text-gray-800 text-sm truncate">{selectedOrder.customer}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-gray-400">Order ID:</p>
                     <p className="text-gray-800 text-sm">{selectedOrder.id}</p>
                  </div>
                  <div className="text-left">
                     <p className="text-gray-400">Date:</p>
                     <p className="text-gray-800">{selectedOrder.date}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-gray-400">Status:</p>
                     <p className={selectedOrder.status === "Completed" ? "text-green-600" : "text-orange-600"}>{selectedOrder.status}</p>
                  </div>
               </div>

               <div className="border-t border-b border-gray-100 py-4">
                  <table className="w-full text-left">
                     <thead className="text-[9px] font-black text-gray-400 uppercase">
                        <tr>
                          <th className="pb-2">Item</th>
                          <th className="text-center pb-2">Qty</th>
                          <th className="text-right pb-2">Total</th>
                        </tr>
                     </thead>
                     <tbody className="text-xs font-bold text-gray-700">
                        {selectedOrder.items.map((it, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="py-2">{it.name}</td>
                            <td className="text-center py-2">{it.qty}</td>
                            <td className="text-right py-2">Rs. {Number(it.qty) * Number(it.price)}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="flex justify-between items-center pt-6">
                  <p className="text-sm font-black uppercase text-gray-400">Total Payable</p>
                  <p className="text-2xl font-black text-[#13786E]">Rs. {selectedOrder.amount.toLocaleString()}</p>
               </div>

               <div className="flex flex-col sm:flex-row gap-3 pt-8 print:hidden">
                <button onClick={() => setSelectedOrder(null)} className="flex-1 py-4 border border-gray-200 rounded-2xl font-black text-gray-400 uppercase text-[10px] hover:bg-gray-50 transition-all">Close</button>
                <button onClick={() => window.print()} className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-black transition-all"><Printer size={16}/> Print Bill</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @media print { 
          .lg\\:ml-64, button, .mt-14, .bg-white.p-4, .text-center.md\\:text-left { display: none !important; } 
          body { background: white !important; padding: 0 !important; }
          .min-h-screen { min-height: auto !important; padding: 0 !important; margin: 0 !important; }
          .fixed { position: static !important; background: white !important; padding: 0 !important; }
          .max-w-xl { max-width: 100% !important; border: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Orders;