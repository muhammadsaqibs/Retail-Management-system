import React, { useState, useEffect } from "react";
import { 
  MessageSquare, Send, Users, Clock, Trash2, Loader2, X, CheckCircle 
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const MessageCenter = () => {
  const [stores, setStores] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState("all");
  const [messageText, setMessageText] = useState("");

  // --- 1. FETCH DATA (Stores and History) ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [storesRes, historyRes] = await Promise.all([
        axiosInstance.get("/stores/all"),
        axiosInstance.get("/messages/history")
      ]);
      
      setStores(storesRes.data.data || storesRes.data || []);
      setSentMessages(historyRes.data.data || historyRes.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to sync communication data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. SEND MESSAGE LOGIC ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return toast.error("Please type a message");

    const recipientStore = stores.find(s => s._id === selectedRecipient);
    
    const payload = {
      recipient: selectedRecipient,
      recipientName: selectedRecipient === "all" ? "All Stores" : recipientStore?.name,
      text: messageText,
      type: selectedRecipient === "all" ? "broadcast" : "individual"
    };

    try {
      const res = await axiosInstance.post("/messages/send", payload);
      const newMessage = res.data.data || res.data;
      setSentMessages([newMessage, ...sentMessages]);
      setMessageText("");
      toast.success(selectedRecipient === "all" ? "Broadcast Sent!" : "Message Sent!");
    } catch (error) {
      toast.error("Failed to transmit message");
    }
  };

  // --- 3. DELETE HISTORY ---
  const deleteHistory = async (id) => {
    if (window.confirm("Remove this log entry?")) {
      try {
        await axiosInstance.delete(`/messages/delete/${id}`);
        setSentMessages((prev) => prev.filter(m => m._id !== id));
        toast.info("Log removed");
      } catch (error) {
        toast.error("Delete operation failed");
      }
    }
  };

  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 text-left font-sans text-gray-800 overflow-x-hidden">
      
      {/* Page Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-black text-[#13786E] tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3">
          <MessageSquare className="hidden sm:block" /> Message Center
        </h1>
        <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">
            {isLoading ? "Synchronizing..." : "End-to-End Encrypted Terminal"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT COLUMN: Message Composer */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 h-full">
            <form onSubmit={handleSendMessage} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">
                    1. Target Audience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRecipient("all")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest active:scale-95 ${
                      selectedRecipient === "all" 
                      ? "border-[#13786E] bg-teal-50 text-[#13786E] shadow-sm" 
                      : "border-gray-50 bg-gray-50 text-gray-400"
                    }`}
                  >
                    <Users size={18} /> Broadcast ALL
                  </button>
                  
                  <select
                    value={selectedRecipient !== "all" ? selectedRecipient : ""}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    className="p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none text-xs font-bold text-gray-600 focus:border-[#13786E] transition-all cursor-pointer shadow-inner"
                  >
                    <option value="" disabled>Select Store...</option>
                    {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">
                    2. Content Body
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your announcement or alert here..."
                  className="w-full h-48 md:h-64 p-5 rounded-3xl border border-gray-100 outline-none bg-gray-50/50 focus:ring-2 focus:ring-[#13786E]/20 focus:bg-white transition-all font-medium text-sm shadow-inner"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#13786E] text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all hover:bg-teal-700"
              >
                {selectedRecipient === "all" ? <Users size={18}/> : <Send size={18} />} 
                {selectedRecipient === "all" ? "Execute Broadcast Bulk" : "Transmit Individual Signal"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-time History Log */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 h-[500px] lg:h-auto flex flex-col overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-black text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-[#13786E]" /> Recent Log
            </h2>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
                  <Loader2 className="animate-spin" size={24}/>
                  <span className="text-[9px] font-black uppercase">Loading Log...</span>
               </div>
            ) : sentMessages.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-300 opacity-50 italic">
                  <span className="text-[10px] font-black uppercase">No outgoing logs</span>
               </div>
            ) : (
              sentMessages.map((msg) => (
                <div key={msg._id} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 relative group transition-all hover:bg-white hover:shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      msg.type === 'broadcast' 
                      ? 'bg-purple-50 text-purple-600 border-purple-100' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {msg.type}
                    </span>
                    <button 
                        onClick={() => deleteHistory(msg._id)} 
                        className="p-1 md:opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all bg-white rounded-lg shadow-sm border"
                    >
                        <Trash2 size={12}/>
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-[#13786E] uppercase tracking-tighter flex items-center gap-1">
                        To: <span className="text-gray-800">{msg.recipientName}</span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed mt-1">
                        {msg.text}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                     <p className="text-[8px] text-gray-400 font-bold italic">
                        {new Date(msg.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                     </p>
                     <CheckCircle size={10} className="text-teal-500"/>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F5F9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default MessageCenter;