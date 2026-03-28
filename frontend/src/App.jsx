

import React, { useState, useEffect } from 'react';
import { 
  MapPin, FileText, CheckCircle, Clock, IndianRupee, 
  Info, ShieldCheck, PhoneCall, Phone, ChevronRight, ArrowRight, Smartphone, Settings, Users, Activity, Lock, User
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function App() {
  const [authStep, setAuthStep] = useState('login');

  const [appNumber, setAppNumber] = useState('');
const [trackMessage, setTrackMessage] = useState('');
  
  // Login States
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [farmerData, setFarmerData] = useState(null); 
  
  // Admin Login States
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  
  const [activeView, setActiveView] = useState('home'); 
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [activeCallId, setActiveCallId] = useState(null);
  const [callStatus, setCallStatus] = useState('');

  // --- Dynamic Data States ---
  const [schemes, setSchemes] = useState([]); // Database schemes
  const [keypadFarmers, setKeypadFarmers] = useState([]); // Database keypad list
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 🔗 DATABASE FETCHING LOGIC
  // ==========================================

  // 1. Fetch Keypad Farmers (Admin Only)
  useEffect(() => {
    if (authStep === 'admin') {
      fetch(`${API_BASE_URL}/admin/farmers/keypad`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setKeypadFarmers(data.farmers);
          }
        })
        .catch(err => console.error("Error fetching keypad farmers:", err));
    }
  }, [authStep]);

  const handleTrack = () => {
  if (appNumber === "12345678999") {
    setTrackMessage("Application Found ✅");
  } else {
    setTrackMessage("No record found ❌");
  }
};
  // 2. Fetch Filtered Schemes (Farmer Dashboard Only)
  useEffect(() => {
    if (authStep === 'dashboard' && farmerData) {
      setLoading(true);
      fetch(`${API_BASE_URL}/farmers/${farmerData.phoneNo}/schemes`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSchemes(data.schemes || []);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching schemes:", err);
          setLoading(false);
        });
    }
  }, [authStep, farmerData]);

  // 3. Send OTP Request to Backend
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phoneInput.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("Connecting..."); 
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNo: phoneInput })
      });
      
      const data = await response.json();

      if (data.success) {
        setErrorMsg('');
        setFarmerData(data.farmerData); 
        setAuthStep('otp'); 
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Backend server not responding.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify OTP Request to Backend
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("Verifying...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNo: phoneInput, otp: otpInput })
      });
      
      const data = await response.json();

      if (data.success) {
        setErrorMsg('');
        setAuthStep('dashboard'); 
      } else {
        setErrorMsg(data.message || "Invalid OTP");
      }
    } catch (err) {
      setErrorMsg("Server error during verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === '12345') {
      setErrorMsg(''); 
      setAuthStep('admin');
    } else {
      setErrorMsg("Invalid credentials. Try admin / 12345");
    }
  };

  const triggerAICall = async (farmer) => {
    setActiveCallId(farmer._id);
    setCallStatus('Connecting Live...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/trigger-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerPhone: farmer.phoneNo, farmerName: farmer.name })
      });
      const data = await response.json();
      if (data.success) {
        setCallStatus('Calling... Ringing! 🔔');
        setTimeout(() => setCallStatus('Call Connected! AI Speaking 🤖'), 2000);
        setTimeout(() => {
          setCallStatus('Call Ended ✅');
          setTimeout(() => { setCallStatus(''); setActiveCallId(null); }, 3000);
        }, 7000);
      } else {
        setCallStatus('Twilio Error ❌');
        setTimeout(() => setActiveCallId(null), 3000);
      }
    } catch (err) {
      setCallStatus('Network Error ❌');
      setTimeout(() => setActiveCallId(null), 3000);
    }
  };

  // --- VIEWS RENDER ---

  if (authStep === 'login') {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center p-4 relative">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          <div className="bg-orange-500 p-6 text-center text-white">
            <ShieldCheck size={40} className="mx-auto mb-2 text-orange-100" />
            <h1 className="text-2xl font-bold mb-1 tracking-tighter italic">Krishi Sahayak</h1>
            <p className="text-orange-50 text-[10px] uppercase tracking-widest font-bold">Empowering Indian Farmers</p>
          </div>
          <div className="p-6">
            <h2 className="text-lg font-bold text-blue-900 mb-5 text-center">Login to your account</h2>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">+91</span>
                  <input 
                    type="number" 
                    placeholder="Enter registered number"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition text-sm"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                  />
                </div>
                {errorMsg && <p className={`text-[10px] mt-1.5 ${errorMsg.includes('wait') || errorMsg.includes('Connect') ? 'text-blue-500 font-bold' : 'text-red-500 font-bold'}`}>{errorMsg}</p>}
              </div>
              <button disabled={loading} type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow-md text-sm">
                {loading ? "Processing..." : "Get OTP"} <ArrowRight size={16} />
              </button>
            </form>
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <button onClick={() => { setAuthStep('admin-login'); setErrorMsg(''); }} className="text-xs font-bold text-blue-800 hover:text-blue-900 flex items-center justify-center gap-1 mx-auto transition">
                <Settings size={14} /> Admin Portal (Staff)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authStep === 'otp') {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl overflow-hidden p-6 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-1 italic">Verify OTP</h2>
          <p className="text-gray-500 text-xs mb-5 uppercase tracking-tighter">SENT TO +91 {phoneInput}</p>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input 
              type="text" 
              maxLength="4"
              placeholder="0000"
              className="w-full text-center text-3xl tracking-widest font-bold py-2.5 rounded-lg border border-gray-300 outline-none"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
            />
            {errorMsg && <p className="text-red-500 text-[10px] mt-1 font-bold">{errorMsg}</p>}
            <button disabled={loading} type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition shadow-md text-sm">
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (authStep === 'admin-login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <h1 className="text-2xl font-black text-blue-900 text-center mb-8 flex items-center justify-center gap-2">
            <Lock className="text-blue-600" /> Admin Access
          </h1>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input type="text" placeholder="Username" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
            {errorMsg && <p className="text-red-500 text-[10px] font-bold text-center">{errorMsg}</p>}
            <button className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl">LOGIN AS STAFF</button>
          </form>
          <button onClick={() => setAuthStep('login')} className="mt-4 w-full text-center text-xs text-gray-400 font-bold uppercase underline">Back to Farmer Login</button>
        </div>
      </div>
    );
  }

  if (authStep === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
        <header className="bg-blue-900 text-white p-3 sticky top-0 z-10 shadow-md">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-lg font-bold italic tracking-wide">Krishi Sahayak <span className="font-light text-blue-200 text-sm">| Admin</span></h1>
            <button onClick={() => setAuthStep('login')} className="text-blue-100 hover:text-white text-xs font-medium border border-blue-700 px-2.5 py-1 rounded transition">Logout</button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-orange-600" size={20} />
            <h2 className="text-xl font-black text-blue-900 uppercase tracking-tighter underline decoration-orange-500 underline-offset-8">Pending Keypad Calls</h2>
          </div>
          
          <div className="grid gap-4">
            {keypadFarmers.length > 0 ? keypadFarmers.map(farmer => (
              <div key={farmer._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-blue-300 transition-colors">
                <div>
                  <h3 className="text-lg font-black text-blue-900 italic">{farmer.name}</h3>
                  <div className="space-y-0.5 mt-1">
                    <p className="text-xs text-gray-600 font-bold flex items-center gap-1.5"><Phone size={12} className="text-orange-500"/> +91 {farmer.phoneNo}</p>
                    <p className="text-xs text-gray-600 font-bold flex items-center gap-1.5"><MapPin size={12} className="text-green-600"/> {farmer.location?.district}, {farmer.location?.state}</p>
                  </div>
                </div>
                <div className="w-full sm:w-56">
                  <button 
                    onClick={() => triggerAICall(farmer)}
                    disabled={activeCallId !== null && activeCallId !== farmer._id}
                    className={`w-full py-2 px-3 rounded-lg font-black shadow-sm flex justify-center items-center gap-1.5 transition text-[10px] uppercase tracking-widest ${
                      activeCallId === farmer._id ? 'bg-blue-50 text-blue-800 border border-blue-300 animate-pulse' : activeCallId !== null ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    <PhoneCall size={14} /> {activeCallId === farmer._id ? 'Call Active' : 'Trigger AI Call'}
                  </button>
                  {activeCallId === farmer._id && <p className="mt-2 text-[10px] text-center font-bold text-blue-700">{callStatus}</p>}
                </div>
              </div>
            )) : <p className="text-center text-gray-400 py-20 font-bold italic animate-pulse">Fetching farmers from MongoDB...</p>}
          </div>
        </main>
      </div>
    );
  }

  // FARMER DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-16 relative">
      <header className="bg-orange-500 text-white p-3 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-black italic tracking-wide">Krishi Sahayak</h1>
        <button onClick={() => setAuthStep('login')} className="text-xs font-bold border border-orange-400 px-3 py-1 rounded transition">Logout</button>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-2">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700 opacity-50"></div>
          <h2 className="text-2xl font-black text-blue-900 leading-none italic">Welcome! , {farmerData?.name} Ji </h2>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"><MapPin size={12} className="text-orange-500"/> {farmerData?.location?.district}</span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"><Activity size={12} className="text-green-600"/> {farmerData?.landArea} Acres</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm">
          <button onClick={() => setActiveView('home')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-tighter ${activeView === 'home' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-400'}`}>New Schemes</button>
          <button onClick={() => setActiveView('track')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-tighter ${activeView === 'track' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-400'}`}>Track Status</button>
        </div>

        {activeView === 'home' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-blue-900 uppercase tracking-[0.2rem] mb-4 flex items-center gap-2 px-1">✨ Recommended Schemes</h3>
            {loading ? (
              <p className="text-center font-bold text-gray-300 py-10 animate-pulse tracking-widest uppercase text-[10px]">Filtering Schemes via AI Profile...</p>
            ) : schemes.length > 0 ? schemes.map((scheme) => (
              <div key={scheme._id} className="bg-white rounded-3xl shadow-sm border-2 border-emerald-50 overflow-hidden hover:border-orange-200 transition-all p-6 group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-black text-blue-900 group-hover:text-orange-600 transition leading-none italic">{scheme.name}</h4>
                  <span className="bg-emerald-50 text-emerald-700 text-[8px] px-2 py-1 rounded-full font-black border border-emerald-100 uppercase tracking-tighter shadow-sm">Verified</span>
                </div>
                <p className="text-gray-500 text-xs mb-6 leading-relaxed font-medium">{scheme.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-emerald-50">
                   <div className="flex items-center gap-2 text-emerald-600 font-black text-xs">
                     <IndianRupee size={16} /> ₹{scheme.benefits.match(/\d+/)?.[0] || "Subsidy"} Benefits
                   </div>
                   <button onClick={() => setSelectedScheme(scheme)} className="bg-green-600 hover:bg-green-700 text-white font-black px-5 py-2.5 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-green-100 transition-all active:scale-95">Verify & Apply</button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <p className="font-bold text-gray-300 uppercase text-xs">No matching schemes found for your profile.</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'track' && (
  <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-100">
    
    <Clock className="mx-auto text-gray-200 mb-4" size={48} />

    <h3 className="font-black text-gray-400 uppercase text-xs tracking-[0.2rem] mb-4">
      Track Application
    </h3>

    {/* 🔥 INPUT BOX */}
    <input
      type="number"
      placeholder="Enter Application Number"
      value={appNumber}
      onChange={(e) => setAppNumber(e.target.value)}
      className="w-full max-w-xs mx-auto px-4 py-3 rounded-xl border border-gray-300 outline-none text-sm text-center font-bold tracking-widest mb-4"
    />

    {/* 🔥 SUBMIT BUTTON */}
    <button
      onClick={handleTrack}
      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md"
    >
      Submit
    </button>

    {/* OPTIONAL MESSAGE */}
    {trackMessage && (
      <p className="text-[10px] text-gray-400 font-bold mt-4 italic">
        {trackMessage}
      </p>
    )}

  </div>
)}
      </main>

      {/* MODAL */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-t-[3rem] sm:rounded-[3rem] max-w-sm w-full p-8 shadow-2xl border-t-8 border-orange-500 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black text-blue-900 italic tracking-tighter leading-none">{selectedScheme.name}</h2>
              <button onClick={() => setSelectedScheme(null)} className="bg-gray-50 p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">✕</button>
            </div>
            <div className="space-y-6 mb-10">
              <div className="bg-blue-50/50 p-5 rounded-[2rem] border-2 border-blue-100">
                <h4 className="font-black text-blue-900 text-[10px] mb-4 uppercase flex items-center gap-2 tracking-[0.2rem]">
                  <FileText size={16} className="text-blue-500" /> Required Paperwork:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedScheme.requiredDocuments.map((doc, i) => (
                    <span key={i} className="bg-white px-3 py-1.5 rounded-xl text-[9px] font-black text-blue-700 border border-blue-100 shadow-sm">{doc}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">CSC Charges</p>
                  <p className="font-black text-slate-800">₹{selectedScheme.cscCharges}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Priority</p>
                  <p className="font-black text-emerald-600">HIGH</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <a href={selectedScheme.applyLink} target="_blank" rel="noreferrer" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-[2rem] font-black shadow-xl shadow-green-100 transition-all uppercase tracking-widest text-sm active:scale-95">Open Official Portal</a>
              <button onClick={() => setSelectedScheme(null)} className="text-gray-300 font-black text-[10px] py-2 uppercase hover:text-orange-500 transition">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}