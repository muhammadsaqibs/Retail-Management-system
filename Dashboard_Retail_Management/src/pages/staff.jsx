import React, { useState } from "react";
import { 
  Plus, Trash2, Edit, Search, 
  UserPlus, X, UserCheck, FileText, 
  Phone, Mail, Briefcase, MapPin, Loader2
} from "lucide-react";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

const Staff = () => {
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [editingId, setEditingId] = useState(null);

  // 1. Initial Dummy Data
  const [staffList, setStaffList] = useState([
    {
      id: 1, Name: "Zeeshan Ali", FatherName: "Ali Ahmed", Designation: "Manager", 
      CNICnumber: "42101-1234567-1", MobileNumber: "0300-1122334", 
      Address: "Street 4, Karachi", Gender: "Male", email: "zeeshan@example.com",
      bankHolderName: "Zeeshan Ali", AccountNumber: "PK12MEZN00123", BranchName: "Meezan Main"
    }
  ]);

  // 2. Form State
  const [formData, setFormData] = useState({
    Name: "", FatherName: "", Designation: "", CNICnumber: "",
    MobileNumber: "", Address: "", Gender: "", bankHolderName: "",
    AccountNumber: "", BranchName: "", email: ""
  });

  const resetForm = () => {
    setFormData({
      Name: "", FatherName: "", Designation: "", CNICnumber: "",
      MobileNumber: "", Address: "", Gender: "", bankHolderName: "",
      AccountNumber: "", BranchName: "", email: ""
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.Name || !formData.Designation) {
      return toast.error("Please fill all required fields");
    }

    if (editingId) {
      setStaffList(staffList.map(staff => 
        staff.id === editingId ? { ...formData, id: editingId } : staff
      ));
      toast.success("✅ Staff record updated!");
    } else {
      const newStaff = { ...formData, id: Date.now() };
      setStaffList([...staffList, newStaff]);
      toast.success("✅ Staff member added successfully!");
    }

    resetForm();
    setShowStaffForm(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#13786E",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        setStaffList(staffList.filter(staff => staff.id !== id));
        Swal.fire("Deleted!", "Staff record has been removed.", "success");
      }
    });
  };

  const handleEdit = (staff) => {
    setFormData(staff);
    setEditingId(staff.id);
    setShowStaffForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredStaff = staffList.filter(staff => 
    staff.Name?.toLowerCase().includes(searchItem.toLowerCase()) ||
    staff.Designation?.toLowerCase().includes(searchItem.toLowerCase()) ||
    staff.CNICnumber?.includes(searchItem)
  );

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 font-sans text-left overflow-x-hidden">
      
      {/* Header Section - Responsive Stacking */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 uppercase italic tracking-tighter">
            Staff Management
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">Manage your team members and their information</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#13786E] outline-none shadow-sm text-sm font-bold"
            />
          </div>
          <button
            onClick={() => {
              if (showStaffForm) resetForm();
              setShowStaffForm(!showStaffForm);
            }}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95 ${
              showStaffForm ? "bg-gray-200 text-gray-700" : "bg-[#13786E] text-white hover:bg-[#0e5e56]"
            }`}
          >
            {showStaffForm ? <X size={18} /> : <UserPlus size={18} />}
            {showStaffForm ? "Cancel" : "Add Staff Member"}
          </button>
        </div>
      </div>

      {/* Form Section - Responsive Grid */}
      {showStaffForm && (
        <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl p-6 md:p-10 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3 uppercase tracking-tight">
            <UserCheck className="text-[#13786E]" size={24} /> {editingId ? "Edit Staff Details" : "New Staff Registration"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Personal Details */}
              <div className="space-y-5">
                <p className="text-[10px] font-black uppercase tracking-[2px] text-teal-600 border-b border-teal-50 pb-2">1. Personal Identity</p>
                <InputField label="Full Name" name="Name" value={formData.Name} onChange={handleInputChange} placeholder="e.g. Ali Ahmed" />
                <InputField label="Father's Name" name="FatherName" value={formData.FatherName} onChange={handleInputChange} />
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                  <select name="Gender" value={formData.Gender} onChange={handleInputChange} className="border border-gray-200 p-3.5 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Professional Info */}
              <div className="space-y-5">
                <p className="text-[10px] font-black uppercase tracking-[2px] text-teal-600 border-b border-teal-50 pb-2">2. Job Assignment</p>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Designation</label>
                  <select name="Designation" value={formData.Designation} onChange={handleInputChange} className="border border-gray-200 p-3.5 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#13786E] text-sm font-bold text-gray-700">
                    <option value="">Select Designation</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Office Boy">Office Boy</option>
                  </select>
                </div>
                <InputField label="CNIC Number" name="CNICnumber" value={formData.CNICnumber} onChange={handleInputChange} placeholder="XXXXX-XXXXXXX-X" />
                <InputField label="Mobile Number" name="MobileNumber" value={formData.MobileNumber} onChange={handleInputChange} />
                <InputField label="Current Address" name="Address" value={formData.Address} onChange={handleInputChange} />
              </div>

              {/* Bank Info */}
              <div className="space-y-5">
                <p className="text-[10px] font-black uppercase tracking-[2px] text-teal-600 border-b border-teal-50 pb-2">3. Payroll & Banking</p>
                <InputField label="Bank Holder Name" name="bankHolderName" value={formData.bankHolderName} onChange={handleInputChange} />
                <InputField label="Account Number (IBAN)" name="AccountNumber" value={formData.AccountNumber} onChange={handleInputChange} />
                <InputField label="Bank Branch Name" name="BranchName" value={formData.BranchName} onChange={handleInputChange} />
              </div>

            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
              <button type="button" onClick={resetForm} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Reset Form</button>
              <button type="submit" className="px-12 py-4 bg-[#13786E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-teal-700 active:scale-95 transition-all">
                {editingId ? "Update Staff Record" : "Confirm Registration"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section - Responsive Scroll */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Team Member</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Designation</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Contact Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-teal-50/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{staff.Name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">CNIC: {staff.CNICnumber}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-teal-50 text-[#13786E] rounded-full text-[9px] font-black uppercase border border-teal-100">
                        {staff.Designation}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-0.5">
                        <p className="flex items-center gap-2 text-xs font-bold text-gray-600 tracking-tight"><Phone size={12} className="text-teal-600"/> {staff.MobileNumber}</p>
                        <p className="flex items-center gap-2 text-[10px] font-bold text-gray-400 lowercase"><Mail size={12}/> {staff.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(staff)} 
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 shadow-sm transition-all"
                          title="Edit Member"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(staff.id)} 
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 shadow-sm transition-all"
                          title="Delete Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest italic">
                    No matching staff records found
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

// Internal Input Component for responsiveness and clean code
const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      {...props}
      className="border border-gray-200 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-[#13786E] bg-gray-50/50 text-sm font-bold text-gray-700 shadow-inner w-full transition-all"
    />
  </div>
);

export default Staff;