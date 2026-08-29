import React, { useState, useEffect } from "react";
import { 
  Users, Plus, Edit2, Trash2, Search, X, 
  User, Phone, Mail, MapPin, DollarSign, Calendar,
  TrendingUp, UserCheck, Loader2
} from "lucide-react";
import { toast } from "react-toastify";

const Customers = () => {
  // --- 1. LOCAL STORAGE LOGIC ---
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("apex_customers_list");
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        name: "M. Zubair", 
        email: "zubair@example.com", 
        phone: "0300-1122334", 
        address: "Pindi Bhattian, Punjab",
        totalSpent: 45000,
        joinedDate: "2024-01-10"
      },
      { 
        id: 2, 
        name: "Ali Raza", 
        email: "ali@example.com", 
        phone: "0321-9988776", 
        address: "DHA Phase 6, Lahore",
        totalSpent: 12500,
        joinedDate: "2024-03-15"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("apex_customers_list", JSON.stringify(customers));
  }, [customers]);

  // --- 2. STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const emptyCustomer = { 
    id: null, name: "", email: "", phone: "", address: "", totalSpent: "", joinedDate: new Date().toISOString().split('T')[0] 
  };
  const [currentCustomer, setCurrentCustomer] = useState(emptyCustomer);

  // --- 3. CRUD FUNCTIONS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCustomer.name || !currentCustomer.phone) {
      return toast.error("Name and Phone are required!");
    }

    if (currentCustomer.id) {
      setCustomers(customers.map(c => c.id === currentCustomer.id ? currentCustomer : c));
      toast.success("Customer record updated");
    } else {
      const newCustomer = { ...currentCustomer, id: Date.now() };
      setCustomers([newCustomer, ...customers]);
      toast.success("New customer added successfully");
    }
    setIsModalOpen(false);
  };

  const deleteCustomer = (id) => {
    if (window.confirm("Are you sure you want to remove this customer?")) {
      setCustomers(customers.filter(c => c.id !== id));
      toast.info("Customer removed");
    }
  };

  const filteredCustomers = customers.filter(c =>
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || "").includes(searchTerm) ||
    (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats Calculation
  const topPurchase = customers.length > 0 
    ? Math.max(...customers.map(c => Number(c.totalSpent) || 0)) 
    : 0;

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-gray-50 p-4 md:p-8 mt-14 font-sans text-left overflow-x-hidden">
      
      {/* Header & Stats - Responsive Stack */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 border-b pb-6 border-gray-200">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center justify-center lg:justify-start gap-3">
            <Users className="hidden sm:block" size={32} /> Customers List
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Directory of Registered Store Clients</p>
        </div>
        <button
          onClick={() => { setCurrentCustomer(emptyCustomer); setIsModalOpen(true); }}
          className="w-full lg:w-auto bg-[#13786E] hover:bg-[#0e5a52] text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 font-black uppercase tracking-widest text-[10px] transition-all"
        >
          <Plus size={18} /> Register New Customer
        </button>
      </div>

      {/* Mini Stats Grid - Responsive Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-teal-50 p-4 rounded-2xl text-[#13786E] shadow-inner"><UserCheck size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Clients</p>
            <h3 className="text-xl font-black text-gray-800">{customers.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-inner"><TrendingUp size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Purchases</p>
            <h3 className="text-xl font-black text-gray-800">Rs. {topPurchase.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Search Bar - Responsive */}
      <div className="bg-white p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" placeholder="Search by name, phone or email..."
          className="w-full outline-none text-gray-700 bg-transparent font-bold text-sm"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customers Table - Responsive Scrollable Container */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-md border border-gray-100 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-100/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Customer Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Store Spent</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Location</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-teal-50/30 transition-colors group text-sm">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-base">{customer.name}</span>
                      <span className="text-[10px] text-[#13786E] font-black uppercase tracking-widest">ID: {customer.id.toString().slice(-6)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2 text-gray-700 font-bold"><Phone size={12} className="text-teal-600"/> {customer.phone}</span>
                      <span className="flex items-center gap-2 text-gray-400 text-xs font-bold"><Mail size={12}/> {customer.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-black text-xs border border-emerald-100">
                      Rs. {Number(customer.totalSpent || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-gray-500 text-xs italic font-bold">
                      <MapPin size={12} className="text-blue-500"/> {customer.address}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setCurrentCustomer(customer); setIsModalOpen(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm"><Edit2 size={16}/></button>
                      <button onClick={() => deleteCustomer(customer.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all shadow-sm"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest italic">
                     No customer data available
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL - Fully Responsive Layout --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl max-h-[95vh] shadow-2xl overflow-y-auto animate-in zoom-in duration-200">
            <div className="bg-[#13786E] p-6 md:p-8 flex justify-between items-center text-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest">{currentCustomer.id ? "Update Profile" : "Client Registration"}</h2>
                <p className="text-[10px] text-teal-200 font-bold uppercase mt-1 tracking-widest">Apexiums Client Portal</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform bg-white/10 p-2 rounded-full"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <User size={14} className="text-[#13786E]"/> Customer Full Name *
                </label>
                <input 
                  type="text" value={currentCustomer.name} onChange={(e) => setCurrentCustomer({...currentCustomer, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-bold text-gray-700 shadow-inner" 
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                   <Phone size={14} className="text-[#13786E]"/> Mobile Number *
                </label>
                <input 
                  type="text" value={currentCustomer.phone} onChange={(e) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-bold text-gray-700 shadow-inner" 
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                   <Mail size={14} className="text-[#13786E]"/> Email Address
                </label>
                <input 
                  type="email" value={currentCustomer.email} onChange={(e) => setCurrentCustomer({...currentCustomer, email: e.target.value})}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-bold text-gray-700 shadow-inner" 
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                   <MapPin size={14} className="text-[#13786E]"/> Physical Address
                </label>
                <input 
                  type="text" value={currentCustomer.address} onChange={(e) => setCurrentCustomer({...currentCustomer, address: e.target.value})}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-bold text-gray-700 shadow-inner" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                   <DollarSign size={14} className="text-[#13786E]"/> Store Credit/Spent
                </label>
                <input 
                  type="number" value={currentCustomer.totalSpent} onChange={(e) => setCurrentCustomer({...currentCustomer, totalSpent: e.target.value})}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-black text-[#13786E] shadow-inner" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                   <Calendar size={14} className="text-[#13786E]"/> Join Date
                </label>
                <input 
                  type="date" value={currentCustomer.joinedDate} onChange={(e) => setCurrentCustomer({...currentCustomer, joinedDate: e.target.value})}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-bold text-gray-700 shadow-inner" 
                />
              </div>

              <div className="md:col-span-2 pt-6 flex flex-col-reverse sm:flex-row gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-gray-100 rounded-2xl font-black text-gray-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-colors">Discard Changes</button>
                <button type="submit" className="flex-1 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all hover:bg-teal-700">Save Customer Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;