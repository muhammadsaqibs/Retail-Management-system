import React, { useState } from "react";
import { 
  Users, Search, UserPlus, Trash2, Edit, 
  ShieldCheck, Mail, ShieldAlert, X, 
  MoreVertical, CheckCircle2, AlertTriangle, UserCircle, Loader2
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const AllUsers = () => {
  const [searchItem, setSearchItem] = useState("");
  const queryClient = useQueryClient();

  // 1. Fetch All Users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/all-users');
      return res.data?.users || res.data?.data || [];
    }
  });

  // 2. Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/auth/user/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      Swal.fire("Deleted!", "User account has been removed.", "success");
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete User Account?",
      text: "This user will lose all system access immediately!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, delete user"
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  // Filter Search
  const filteredUsers = Array.isArray(usersData) ? usersData.filter(user => 
    (user.Name || "").toLowerCase().includes(searchItem.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(searchItem.toLowerCase())
  ) : [];

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 font-sans text-left overflow-x-hidden">
      
      {/* Header Section - Responsive Stack */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center justify-center lg:justify-start gap-3 uppercase italic">
            <Users className="text-[#13786E] hidden sm:block" size={32} /> User Management
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">Manage system access, roles and user accounts</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] w-full shadow-sm text-sm font-bold"
            />
          </div>
          <button 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#13786E] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#0e5e56] shadow-lg active:scale-95 transition-all"
          >
            <UserPlus size={18} /> Add New User
          </button>
        </div>
      </div>

      {/* Stats Quick Overview - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Users</p>
            <p className="text-xl md:text-2xl font-black text-gray-800 tracking-tighter">{filteredUsers.length}</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md border-b-4 border-b-teal-500">
            <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest">Active Database</p>
            <p className="text-xl md:text-2xl font-black text-gray-800 tracking-tighter">{filteredUsers.length}</p>
         </div>
      </div>

      {/* Users Table - Responsive Horizontal Scroll */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">User Identity</th>
                <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Role / Level</th>
                <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Access Protocol</th>
                <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</th>
                <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="animate-spin text-[#13786E]" size={32} />
                       <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Decrypting user list...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <tr key={user._id || idx} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-6 md:px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-[#13786E] font-black border border-teal-200 shadow-inner flex-shrink-0">
                          {user.Name ? user.Name.charAt(0).toUpperCase() : <UserCircle size={20}/>}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-gray-800 leading-none mb-1 truncate">{user.Name || "System Operator"}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 font-bold italic truncate">
                            <Mail size={12} className="text-gray-300"/> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <span className="text-[10px] font-black text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200 uppercase tracking-tighter">
                        {user.role || "Operator"}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      {user.role?.toLowerCase() === 'admin' ? (
                        <div className="flex items-center gap-1.5 text-purple-600 font-black text-[10px] uppercase">
                          <ShieldCheck size={16} /> Full Root Access
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-blue-500 font-black text-[10px] uppercase">
                          <ShieldAlert size={16} className="opacity-50" /> Restricted User
                        </div>
                      )}
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100">
                        <CheckCircle2 size={12} /> Live
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 shadow-sm transition-all" title="Modify Permissions">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-transparent hover:border-red-100 shadow-sm transition-all"
                          title="Terminate Account"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <AlertTriangle size={48} className="opacity-20" />
                      <p className="font-black text-xs uppercase tracking-widest">No users found in records</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Info Footer */}
      <div className="mt-8 text-center">
         <p className="text-[9px] font-black text-gray-400 uppercase tracking-[4px]">
            © 2024 Apexiums Cloud Security • Protocol V2.1
         </p>
      </div>

    </div>
  );
};

export default AllUsers;