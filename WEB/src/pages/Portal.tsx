import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { User, ShieldCheck, ArrowRight, Eye } from 'lucide-react';

export function Portal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl flex flex-col items-center"
      >
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-xl rounded-2xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
            <Eye className="w-10 h-10 text-teal-600 dark:text-teal-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Welcome to PublicEye</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Choose your gateway to the city's digital governance and reporting platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* User Portal Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 cursor-pointer overflow-hidden transition-all"
            onClick={() => navigate('/login')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 dark:bg-teal-900/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-200 dark:shadow-teal-900/40">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">User Login</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">Report issues, track progress, and help improve your city infrastructure.</p>
              <div className="flex items-center text-teal-600 dark:text-teal-400 font-bold gap-2 group-hover:gap-4 transition-all">
                Enter User Portal <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Admin Portal Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group relative bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20 border border-slate-800 cursor-pointer overflow-hidden transition-all"
            onClick={() => navigate('/admin/login')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/40">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Admin Login</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-8 leading-relaxed">Secure gateway for municipal authorities to manage city-wide reports.</p>
              <div className="flex items-center text-teal-400 font-bold gap-2 group-hover:gap-4 transition-all">
                Access Admin Panel <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>

        <p className="mt-16 text-[10px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.4em]">
          Smart City Infrastructure • PublicEye v2.0
        </p>
      </motion.div>
    </div>
  );
}
