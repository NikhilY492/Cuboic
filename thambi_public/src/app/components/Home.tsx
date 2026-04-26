import { motion } from "motion/react";
import { ArrowRight, Bot, Store, LineChart, ShieldCheck, Zap, MonitorSmartphone, Megaphone } from "lucide-react";
import heroImg from "../../assets/bg.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Home() {
  const HERO_BG = "https://images.unsplash.com/photo-1685040235380-a42a129ade4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc2MzQzNTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-black">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-900/30 text-lime-400 font-medium mb-6 border border-lime-600/30 backdrop-blur-md">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                </span>
                Meet Thambi. The Future of Dining.
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                Modernize Your Restaurant with <span className="text-lime-500">Robotics</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
                Seamlessly integrated delivery robots, cutting-edge POS systems, and dynamic on-screen advertising campaigns designed to boost your revenue and reduce operational costs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex justify-center items-center gap-2 bg-lime-600/90 hover:bg-lime-600 backdrop-blur-xl text-black px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-lime-600/20 border border-lime-500/20">
                  Book a Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="inline-flex justify-center items-center gap-2 bg-black hover:bg-[#0a0a0a] backdrop-blur-xl border border-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:border-slate-700">
                  Explore Services
                </button>
              </div>
            </motion.div>

            {/* Right Graphic Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block h-full min-h-[500px]"
            >
              {/* Main Image Block (using attached image) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[85%] rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-slate-800 bg-[#0a0a0a] backdrop-blur-xl p-2">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                  <ImageWithFallback src={heroImg} alt="Thambi Ecosystem" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              </div>

              {/* Floating Stat Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute left-0 top-1/4 bg-[#0a0a0a]/80 backdrop-blur-xl p-5 rounded-2xl shadow-2xl shadow-black/50 border border-slate-800 flex items-center gap-4"
              >
                <div className="bg-lime-900/40 text-lime-400 p-3 rounded-xl border border-lime-800/50">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400">Efficiency Boost</p>
                  <p className="text-xl font-bold text-white">+45%</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute right-10 -bottom-8 bg-[#0a0a0a]/80 backdrop-blur-xl p-5 rounded-2xl shadow-2xl shadow-black/50 border border-slate-800 flex items-center gap-4"
              >
                <div className="bg-amber-900/40 text-amber-400 p-3 rounded-xl border border-amber-800/50">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400">Active Robots</p>
                  <p className="text-xl font-bold text-white">2,500+</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-lime-500 font-bold tracking-wider uppercase text-sm mb-3">Our Core Ecosystem</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              Three Pillars of Restaurant Innovation
            </h3>
            <p className="text-lg text-slate-400">
              Thambi provides a fully integrated suite of services that communicate seamlessly, creating an unmatched dining experience for your guests and a highly profitable model for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-black/60 backdrop-blur-2xl rounded-3xl overflow-hidden border border-slate-800 group shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="h-64 overflow-hidden relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1767966926615-748201123f94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHJvYm90JTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzYzODU4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Delivery Robot"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl p-2.5 rounded-xl text-lime-500 shadow-lg border border-slate-700">
                  <Bot className="w-6 h-6" />
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-white mb-3">Smart Delivery Robots</h4>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Automate table service with intelligent, obstacle-avoiding delivery robots. Reduce wait staff fatigue, deliver food piping hot, and entertain guests seamlessly.
                </p>
                <a href="#" className="inline-flex items-center text-lime-500 font-semibold hover:text-lime-400">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </motion.div>

            {/* Service 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-black/60 backdrop-blur-2xl rounded-3xl overflow-hidden border border-slate-800 group shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="h-64 overflow-hidden relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1742238896849-303d74d8a8de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwb3MlMjBzeXN0ZW18ZW58MXx8fHwxNzc2Mzg1ODI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="POS System"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl p-2.5 rounded-xl text-amber-400 shadow-lg border border-slate-700">
                  <MonitorSmartphone className="w-6 h-6" />
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-white mb-3">Integrated POS Systems</h4>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  A cloud-based point of sale that speaks directly to your robots. Streamline ordering, kitchen display systems, and checkout with one unified dashboard.
                </p>
                <a href="#" className="inline-flex items-center text-amber-400 font-semibold hover:text-amber-300">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </motion.div>

            {/* Service 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-black/60 backdrop-blur-2xl rounded-3xl overflow-hidden border border-slate-800 group shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="h-64 overflow-hidden relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1762417582156-e172b6db6d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2NyZWVuJTIwYWR2ZXJ0aXNlbWVudHxlbnwxfHx8fDE3NzYzODU4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Ad Campaigns"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl p-2.5 rounded-xl text-amber-500 shadow-lg border border-slate-700">
                  <Megaphone className="w-6 h-6" />
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-white mb-3">Robot Ad Campaigns</h4>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Turn robots into moving digital billboards. Play high-definition video ads, partner with local brands, and create a lucrative new revenue stream for your venue.
                </p>
                <a href="#" className="inline-flex items-center text-amber-500 font-semibold hover:text-amber-400">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-black border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                Why Partner with Thambi?
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                We don't just sell hardware; we provide a complete technological ecosystem designed to elevate your restaurant's efficiency, customer satisfaction, and bottom line.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1 bg-lime-900/30 backdrop-blur-xl p-2 rounded-lg border border-lime-800/50">
                    <Zap className="w-6 h-6 text-lime-500" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white mb-1">Seamless Integration</h5>
                    <p className="text-slate-400">Our POS, kitchen systems, and delivery robots communicate instantly, eliminating miscommunications and delays.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1 bg-lime-900/30 backdrop-blur-xl p-2 rounded-lg border border-lime-800/50">
                    <ShieldCheck className="w-6 h-6 text-lime-500" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white mb-1">Reliable & Safe Navigation</h5>
                    <p className="text-slate-400">Equipped with Lidar and 3D depth cameras, our robots safely navigate complex, crowded restaurant environments.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1 bg-amber-900/30 backdrop-blur-xl p-2 rounded-lg border border-amber-800/50">
                    <Store className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white mb-1">New Revenue Streams</h5>
                    <p className="text-slate-400">Subsidize costs or generate pure profit by running local business advertisements on the robots' HD screens.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-lime-600 to-amber-500 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl" />
              <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl p-8 shadow-xl relative border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-6">The Thambi Workflow</h3>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                  {/* Step 1 */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-lime-500 text-black font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">1</div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111] backdrop-blur-xl p-4 rounded-xl border border-slate-800 shadow-md">
                      <h4 className="font-bold text-white text-lg">Order Placed</h4>
                      <p className="text-sm text-slate-400 mt-1">Via our integrated POS or directly from table-side QR codes.</p>
                    </div>
                  </motion.div>
                  {/* Step 2 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-amber-400 text-black font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">2</div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111] backdrop-blur-xl p-4 rounded-xl border border-slate-800 shadow-md">
                      <h4 className="font-bold text-white text-lg">Kitchen & Robot Sync</h4>
                      <p className="text-sm text-slate-400 mt-1">Kitchen prepares food, robot auto-navigates to the pickup window.</p>
                    </div>
                  </motion.div>
                  {/* Step 3 */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-amber-600 text-black font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">3</div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111] backdrop-blur-xl p-4 rounded-xl border border-slate-800 shadow-md">
                      <h4 className="font-bold text-white text-lg">Delivery & Ads</h4>
                      <p className="text-sm text-slate-400 mt-1">Robot delivers to the exact table while displaying targeted ads.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(132,204,22,0.1),transparent_50%)]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to Step into the Future?</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join hundreds of visionary restaurants leveraging Thambi to slash wait times, delight customers, and boost their bottom line.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-lime-600/90 hover:bg-lime-600 backdrop-blur-xl text-black px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-lime-600/20 border border-lime-500/20">
              Contact Sales
            </button>
            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:border-slate-600">
              Request a Free Demo
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}