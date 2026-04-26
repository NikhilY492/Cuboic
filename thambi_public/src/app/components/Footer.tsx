import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="bg-black backdrop-blur-xl text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-2xl tracking-tight text-white">Thambi</span>
            </div>
            <p className="text-sm leading-relaxed">
              Revolutionizing restaurant operations with intelligent delivery robots, integrated POS systems, and dynamic digital advertising.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Solutions</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-amber-400 transition-colors text-sm">Delivery Robots</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors text-sm">Restaurant POS</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors text-sm">Digital Billboards</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors text-sm">Integration API</a></li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-amber-400 transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors text-sm">Press & Media</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors text-sm">Contact Support</a></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-lime-500 shrink-0" />
                <span>123 Robotics Blvd, Innovation District, Tech City 94016</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-lime-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-lime-500 shrink-0" />
                <span>hello@thambi-robotics.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500"
        >
          <p>© {new Date().getFullYear()} Thambi Robotics. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}