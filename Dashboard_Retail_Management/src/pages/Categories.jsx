import React, { useState } from "react";
import { 
  Search, Plus, Edit, Trash2, 
  Layers, X, FolderOpen, CheckCircle2, Save, RefreshCw, Loader2
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const Categories = () => {
  const [searchItem, setSearchItem] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null); 
  
  const queryClient = useQueryClient();

  // 1. Fetch Categories
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories/all');
      return res.data;
    }
  });

  const categoriesArray = Array.isArray(rawData) 
    ? rawData 
    : (rawData?.categories || rawData?.data || []);

  // 2. Create Category Mutation
  const createMutation = useMutation({
    mutationFn: (categoryName) => axiosInstance.post('/categories/add', { categoryName }),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success("Category added successfully!");
      setNewCategory("");
      setShowAddForm(false);
    }
  });

  // 3. Update Category Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, categoryName }) => axiosInstance.put(`/categories/update/${id}`, { categoryName }),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success("Category updated!");
      setEditCategory(null);
    },
    onError: () => toast.error("Failed to update")
  });

  // 4. Delete Category
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/categories/delete/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      Swal.fire("Deleted!", "Category removed.", "success");
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Items in this category might be affected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#13786E",
      confirmButtonText: "Yes, delete it"
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const filteredCategories = categoriesArray.filter(cat => 
    (cat?.categoryName || cat?.name)?.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 text-left font-sans overflow-x-hidden">
      
      {/* Header - Stack on Mobile */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center justify-center lg:justify-start gap-3">
            <Layers className="text-[#13786E]" /> Categories
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">Classify your inventory products</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text" placeholder="Quick Search..."
              value={searchItem} onChange={(e) => setSearchItem(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] shadow-sm text-sm font-bold"
            />
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#13786E] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
          >
            {showAddForm ? <X size={18}/> : <Plus size={18}/>}
            {showAddForm ? "Cancel" : "Add Category"}
          </button>
        </div>
      </div>

      {/* Add Form - Responsive Flex */}
      {showAddForm && (
        <div className="bg-white border border-teal-100 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 mb-8 shadow-xl animate-in fade-in slide-in-from-top-4">
          <form onSubmit={(e) => { e.preventDefault(); if(newCategory) createMutation.mutate(newCategory); }} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">New Category Name</label>
              <input 
                type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Beverages, Electronics..."
                className="w-full border border-gray-200 p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] font-bold text-gray-700 shadow-inner"
              />
            </div>
            <button 
              type="submit" disabled={createMutation.isPending}
              className="w-full sm:w-auto px-10 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 h-[56px]"
            >
              {createMutation.isPending ? <Loader2 className="animate-spin" size={16}/> : "Save Category"}
            </button>
          </form>
        </div>
      )}

      {/* Categories Table - Responsive Scroll */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[650px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Classification</th>
                <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Type</th>
                <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</th>
                <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="animate-spin text-[#13786E]" size={32} />
                       <span className="font-black text-xs text-gray-400 uppercase tracking-widest">Syncing Library...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest">
                    No categories found
                  </td>
                </tr>
              ) : filteredCategories.map((cat) => (
                  <tr key={cat._id || cat.id} className="hover:bg-teal-50/40 transition-colors">
                    <td className="px-6 md:px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-50 rounded-2xl text-[#13786E] shadow-inner flex-shrink-0"><FolderOpen size={20} /></div>
                        <span className="font-bold text-gray-800 tracking-tight truncate max-w-[200px]">{cat.categoryName || cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Retail Standard</span>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit uppercase border border-emerald-100">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditCategory(cat)}
                          className="p-2.5 text-blue-600 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat._id || cat.id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- EDIT MODAL - Mobile Optimized --- */}
      {editCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-[#13786E] p-6 md:p-8 flex justify-between items-center text-white">
              <h2 className="text-xl font-black uppercase tracking-widest">Update Category</h2>
              <button onClick={() => setEditCategory(null)} className="bg-white/10 p-2 rounded-full hover:rotate-90 transition-transform"><X size={20}/></button>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Edit Category Name</label>
                <input 
                  type="text" 
                  value={editCategory.categoryName || editCategory.name}
                  onChange={(e) => setEditCategory({...editCategory, categoryName: e.target.value})}
                  className="w-full border border-gray-200 p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] font-bold text-lg text-gray-700 shadow-inner"
                />
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button onClick={() => setEditCategory(null)} className="flex-1 py-4 border border-gray-200 rounded-2xl font-black uppercase text-[10px] text-gray-400 hover:bg-gray-50 transition-colors">Cancel</button>
                <button 
                  onClick={() => updateMutation.mutate({ id: editCategory._id, categoryName: editCategory.categoryName })}
                  className="flex-1 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-[#0e5a52] transition-all"
                >
                  {updateMutation.isPending ? <RefreshCw className="animate-spin" size={16}/> : <Save size={16}/>}
                  Confirm Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;