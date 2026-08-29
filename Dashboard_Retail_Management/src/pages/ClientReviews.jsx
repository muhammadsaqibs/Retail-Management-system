import React, { useState } from "react";
import { 
  UserCheck, Search, Plus, Star, Mail, 
  Phone, MessageSquare, Trash2, Edit, 
  UserCircle, X, Loader2
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const Clients = () => {
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useQueryClient();

  // 1. Fetch Clients Data
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await axiosInstance.get('/clients'); 
      return res.data?.data || res.data || [];
    }
  });

  // 2. Delete Client Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      Swal.fire("Deleted!", "Client record removed.", "success");
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Client?",
      text: "This will remove purchase history and reviews.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#13786E",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete"
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  // Helper function for Stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
      />
    ));
  };

  // Filter Search
  const filteredClients = Array.isArray(clientsData) ? clientsData.filter(client => 
    client.name?.toLowerCase().includes(searchItem.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchItem.toLowerCase())
  ) : [];

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-16 font-sans text-left overflow-x-hidden">
      
      {/* Header Section - Responsive Stacking */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center justify-center lg:justify-start gap-3 uppercase italic">
            <UserCheck className="text-[#13786E]" size={32} /> Client Reviews
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">Manage customer relationships and feedback</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#13786E] shadow-sm text-sm font-bold"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#13786E] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#0e5e56] shadow-lg transition-all active:scale-95">
            <Plus size={18} /> Add Client
          </button>
        </div>
      </div>

      {/* Stats Section - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatsCard title="Total Clients" value={filteredClients.length} icon={<UserCircle size={20}/>} color="text-blue-600" />
        <StatsCard title="Average Rating" value="4.8/5" icon={<Star size={20}/>} color="text-yellow-500" />
        <StatsCard title="Positive Feedback" value="92%" icon={<MessageSquare size={20}/>} color="text-emerald-600" className="sm:col-span-2 lg:col-span-1" />
      </div>

      {/* Clients Table - Horizontal Scroll on Mobile */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Client Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Latest Review</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="animate-spin text-[#13786E]" size={32} />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Library...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client, idx) => (
                  <tr key={client._id || idx} className="hover:bg-teal-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-[#13786E] font-black flex-shrink-0">
                          {client.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-gray-800 truncate">{client.name}</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">Loyalty Member</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <p className="flex items-center gap-2 text-gray-600 font-bold"><Mail size={12} className="text-gray-400"/> {client.email}</p>
                        <p className="flex items-center gap-2 text-gray-600 font-bold"><Phone size={12} className="text-gray-400"/> {client.phone || "+92 3XX XXXXXXX"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-xs text-gray-500 italic line-clamp-2 leading-relaxed">
                          "{client.review || "Excellent service and high-quality products from Apexiums Retail!"}"
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {renderStars(client.rating || 5)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:shadow-sm border border-gray-100 transition-all">
                          <Edit size={16}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(client._id || client.id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-transparent hover:border-red-100 transition-all"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest italic">
                    No clients matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Internal Stats Card Component
const StatsCard = ({ title, value, icon, color, className }) => (
  <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md ${className}`}>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-gray-800 tracking-tighter">{value}</p>
    </div>
    <div className={`p-3.5 rounded-2xl bg-gray-50 shadow-inner ${color}`}>
      {icon}
    </div>
  </div>
);

export default Clients;