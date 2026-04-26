import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import thambiIcon from "../../assets/pic1.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center relative">

          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-3">
            <motion.img 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              src={thambiIcon} alt="Thambi Icon" className="w-12 h-12 object-contain" 
            />
            <span className="font-extrabold text-2xl tracking-tight text-white">THAMBI</span>
          </Link>

          {/* Nav Links - Center (Pill) */}
          <div className="hidden md:flex items-center bg-[#0a0a0a]/90 backdrop-blur-xl rounded-full p-1.5 shadow-lg border border-slate-800 absolute left-1/2 -translate-x-1/2">
            <a href="#services" className="text-slate-400 hover:text-amber-400 hover:bg-white/5 px-5 py-2.5 rounded-full text-sm font-medium transition-colors">Services</a>
            <a href="#about" className="text-slate-400 hover:text-amber-400 hover:bg-white/5 px-5 py-2.5 rounded-full text-sm font-medium transition-colors">About</a>
            <a href="#contact" className="text-slate-400 hover:text-amber-400 hover:bg-white/5 px-5 py-2.5 rounded-full text-sm font-medium transition-colors">Contact</a>
          </div>

          {/* Action Buttons - Right (Pill) */}
          <div className="hidden md:flex items-center bg-[#0a0a0a]/90 backdrop-blur-xl rounded-full p-1.5 shadow-lg border border-slate-800">
            <button className="bg-lime-600 hover:bg-lime-500 text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm">
              Book a demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center bg-[#0a0a0a]/90 backdrop-blur-xl rounded-full p-2.5 shadow-lg border border-slate-800">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white transition-colors">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-4 right-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl overflow-hidden"
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            <a href="#services" className="block px-3 py-2 text-base font-medium text-slate-400 hover:text-amber-400 hover:bg-white/5 rounded-md">Services</a>
            <a href="#about" className="block px-3 py-2 text-base font-medium text-slate-400 hover:text-amber-400 hover:bg-white/5 rounded-md">About</a>
            <a href="#contact" className="block px-3 py-2 text-base font-medium text-slate-400 hover:text-amber-400 hover:bg-white/5 rounded-md">Contact</a>
            <hr className="border-slate-800 my-2" />
            <button className="w-full mt-2 bg-lime-600 hover:bg-lime-500 text-black px-5 py-3 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-3">
              Book a demo
              <img alt="Thambi Icon" className="w-7 h-7 object-contain" src="/src/assets/pic1.png" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}