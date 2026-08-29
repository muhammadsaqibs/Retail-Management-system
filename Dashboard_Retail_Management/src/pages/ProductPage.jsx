import React, { useState, useMemo } from "react";
import { 
  Plus, Trash2, Search, Package, Tag, Bookmark, X, DollarSign,
  Layers, Hash, RefreshCw, Briefcase, Loader2 
} from "lucide-react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const ProductPage = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useQueryClient();

  // 1. DATA FETCHING
  const results = useQueries({
    queries: [
      { queryKey: ['Products'], queryFn: async () => (await axiosInstance.get('/products/all')).data },
      { queryKey: ['categories'], queryFn: async () => (await axiosInstance.get('/categories/all')).data }, 
      { queryKey: ['brands'], queryFn: async () => (await axiosInstance.get('/brands/all')).data } 
    ]
  });

  const products = results[0]?.data?.data || [];
  const categoriesList = results[1]?.data?.data || results[1]?.data || [];
  const brandsList = results[2]?.data?.data || results[2]?.data || [];
  const isLoading = results.some(r => r.isLoading);

  // 2. FORM STATE
  const [productForm, setProductForm] = useState({ 
    Name: "", 
    Price: "", 
    companyPrice: "", 
    brandName: "", 
    categoryId: "", 
    Stock: "0", 
    Discount: "0", 
    Description: ""
  });

  const resetForm = () => {
    setProductForm({ 
      Name: "", Price: "", companyPrice: "", brandName: "", 
      categoryId: "", Stock: "0", Discount: "0", Description: "", Barcode: "" 
    });
  };

  // 3. ADD PRODUCT MUTATION
  const createProduct = useMutation({
    mutationFn: (payload) => axiosInstance.post('/products/add', payload),
    onSuccess: () => { 
      queryClient.invalidateQueries(['Products']); 
      toast.success("Product Saved Successfully!"); 
      setActiveForm(null); 
      resetForm(); 
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create product");
    }
  });

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if(!productForm.Name || !productForm.Price || !productForm.categoryId || !productForm.companyPrice) {
      return toast.error("Required: Name, Company Price, Selling Price, and Category");
    }
    createProduct.mutate(productForm);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/products/delete/${id}`);
        queryClient.invalidateQueries(['Products']);
        toast.info("Product removed");
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => (p.Name || "").toLowerCase().includes(searchItem.toLowerCase()));
  }, [products, searchItem]);

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 text-left font-sans text-gray-800 overflow-x-hidden">
      
      {/* Header - Optimized for Mobile Stacking */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black uppercase italic flex items-center justify-center lg:justify-start gap-3 text-[#13786E]">
            <Package size={32} className="hidden sm:block" /> Inventory Management
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Total SKU Items: {products.length}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search by name..." 
              value={searchItem} onChange={(e) => setSearchItem(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold shadow-sm" 
            />
          </div>
          <button 
            onClick={() => { resetForm(); setActiveForm(activeForm === 'scanner' ? null : 'scanner'); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
          >
            {activeForm === 'scanner' ? <X size={18}/> : <Search size={18}/>}
            {activeForm === 'scanner' ? "Discard" : "Scan Product"}
          </button>
          <button 
            onClick={() => { resetForm(); setActiveForm(activeForm === 'product' ? null : 'product'); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#13786E] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
          >
            {activeForm === 'product' ? <X size={18}/> : <Plus size={18}/>}
            {activeForm === 'product' ? "Discard" : "Add New Product"}
          </button>
        </div>
      </div>

      {/* FORM SECTION - Responsive Grid Layout */}
      {activeForm === 'product' && (
        <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl p-6 md:p-8 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleProductSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <FormInput label="Product Name *" icon={<Package size={14}/>} value={productForm.Name} onChange={(e)=>setProductForm({...productForm, Name: e.target.value})} />
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Layers size={14} className="text-[#13786E]"/> Category *</label>
                <select className="bg-gray-50 border border-gray-200 p-4 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#13786E] w-full" value={productForm.categoryId} onChange={(e)=>setProductForm({...productForm, categoryId: e.target.value})}>
                  <option value="">Select Category</option>
                  {categoriesList.map((cat) => <option key={cat._id} value={cat._id}>{cat.categoryName || cat.name}</option>)}
                </select>
              </div>

              <FormInput label="Company Price *" type="number" icon={<Briefcase size={14}/>} value={productForm.companyPrice} onChange={(e)=>setProductForm({...productForm, companyPrice: e.target.value})} />
              <FormInput label="Selling Price *" type="number" icon={<DollarSign size={14}/>} value={productForm.Price} onChange={(e)=>setProductForm({...productForm, Price: e.target.value})} />
              <FormInput label="Stock Amount" type="number" icon={<Hash size={14}/>} value={productForm.Stock} onChange={(e)=>setProductForm({...productForm, Stock: e.target.value})} />
              <FormInput label="Discount (%)" type="number" icon={<Tag size={14}/>} value={productForm.Discount} onChange={(e)=>setProductForm({...productForm, Discount: e.target.value})} />
              <FormInput label="Barcode" type="text" icon={<Hash size={14}/>} value={productForm.Barcode || ""} onChange={(e)=>setProductForm({...productForm, Barcode: e.target.value})} />
              
              <div className="sm:col-span-2 lg:col-span-1">
                 <FormInput label="Description" icon={<Layers size={14}/>} value={productForm.Description} onChange={(e)=>setProductForm({...productForm, Description: e.target.value})} />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
               <button type="submit" disabled={createProduct.isPending} className="w-full sm:w-auto px-10 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-all">
                  {createProduct.isPending ? <Loader2 className="animate-spin" size={16}/> : "Confirm & Save Product"}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE SECTION - Horizontal Scroll for Mobile */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[950px]">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 md:px-8 py-5">Product Info</th>
                <th className="px-6 md:px-8 py-5">Stock</th>
                <th className="px-6 md:px-8 py-5">Pricing Details</th>
                <th className="px-6 md:px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="animate-spin text-[#13786E]" size={32} />
                       <span className="font-black text-xs text-gray-400 uppercase tracking-widest">Syncing Inventory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest italic">
                    No products found in database
                  </td>
                </tr>
              ) : filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-teal-50/20 transition-colors group">
                  <td className="px-6 md:px-8 py-5">
                    <div className="flex flex-col">
                      <p className="font-bold text-gray-800 text-sm">{p.Name}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[180px] italic">{p.Description || "No description"}</p>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${Number(p.Stock) > 5 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {p.Stock} Units
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-5 text-sm">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Cost: Rs. {Number(p.companyPrice || 0).toLocaleString()}</span>
                        <span className="font-black text-[#13786E]">Sell: Rs. {Number(p.Price).toLocaleString()}</span>
                        {Number(p.Discount) > 0 && <span className="text-[9px] text-orange-500 font-black">Disc: {p.Discount}% Off</span>}
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Rs. {Number(p.companyPrice || 0).toLocaleString()} / Rs. {Number(p.Price).toLocaleString()}</p>
                  </td>
                  <td className="px-6 md:px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => window.print()} 
                        className="p-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
                        title="Print Barcode"
                      >
                        Print Barcode
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)} 
                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors shadow-sm"
                        title="Delete Product"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Internal Sub-component for Inputs
const FormInput = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2 text-left">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
      <span className="text-[#13786E]">{icon}</span> {label}
    </label>
    <input 
      {...props} 
      className="bg-gray-50 border border-gray-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700 shadow-inner w-full transition-all" 
    />
  </div>
);

export default ProductPage;