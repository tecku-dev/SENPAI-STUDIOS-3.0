import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Video,
  Code,
  Palette,
  Zap,
  Award,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Link as LinkIcon,
  Play,
  Download,
  ExternalLink,
  Cuboid as Cube,
  Sparkles,
  Layers,
  Send,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const slideIn = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Build WhatsApp link from env or placeholder number
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "YOUR_NUMBER"; // e.g., 15551234567
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senpai%20Studios%2C%20I%27d%20like%20to%20discuss%20a%20project.`;

// Confirmation Modal
function ConfirmationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <motion.div
          className="relative z-10 max-w-md w-[92%] bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center"
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 12 }}
        >
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">We got it! 🎉</h3>
          <p className="text-gray-300 text-sm mb-4">
            You’ll hear from us within 24 hours via Email, WhatsApp, and Discord (if provided).
            You can also reach us now:
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
            >
              <Phone size={14} />
              WhatsApp
            </a>
            <a
              href="https://discord.gg/auJHCKZ2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
            >
              <div className="w-4 h-4 bg-[#5865F2] rounded text-[10px] font-bold text-white flex items-center justify-center">
                D
              </div>
              Discord
            </a>
            <a
              href="mailto:studiossenpai07@gmail.com"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-red-600/20 text-red-300 hover:bg-red-600/30"
            >
              <Mail size={14} />
              Email
            </a>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    "home" | "portfolio" | "assets" | "about" | "hire"
  >("home");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    country: "",
    budget: "",
    discordId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // added

  // Force autoplay for background videos
  const heroBgRef = useRef<HTMLVideoElement | null>(null);
  const aboutBgRef = useRef<HTMLVideoElement | null>(null);
  const assetsBgRef = useRef<HTMLVideoElement | null>(null);
  const hireBgRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videos = [
      heroBgRef.current,
      aboutBgRef.current,
      assetsBgRef.current,
      hireBgRef.current,
    ];
    videos.forEach((v) => {
      if (!v) return;
      v.muted = true; // must be muted for autoplay
      v.preload = "metadata"; // Optimize loading
      v.setAttribute("playsinline", "true");
      v.setAttribute("webkit-playsinline", "true");
      const p = v.play();
      if (p && typeof (p as any).catch === "function") {
        (p as Promise<void>).catch(() => {
          // Autoplay might be blocked on some devices; will start on first user interaction
        });
      }
    });
  }, []);

  // Handle form submission (EmailJS + fallback)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const templateParams = {
        user_email: formData.email,
        user_phone: formData.phone || "Not provided",
        user_country: formData.country,
        user_budget: formData.budget,
        user_discord_id: formData.discordId || "Not provided",
        sent_at: new Date().toLocaleString(),
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string
      );

      setIsModalOpen(true);
      setSubmitMessage("Message sent! We’ll reach out within 24 hours.");
      setFormData({
        email: "",
        phone: "",
        country: "",
        budget: "",
        discordId: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);
      try {
        // Fallback to mailto
        const subject = encodeURIComponent(
          "New Project Inquiry - Senpai Studios"
        );
        const body = encodeURIComponent(`
New project inquiry details:

Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Country: ${formData.country}
Budget: ${formData.budget}
Discord ID: ${formData.discordId || "Not provided"}

Please respond to this inquiry as soon as possible.

Best regards,
Senpai Studios Contact Form
        `);
        const mailtoLink = `mailto:studiossenpai07@gmail.com?subject=${subject}&body=${body}`;
        window.open(mailtoLink, "_blank");
        setSubmitMessage(
          "Email client opened! Please send the email to complete your inquiry."
        );
      } catch {
        setSubmitMessage(
          "Error sending your message. Please try again or contact us directly."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Assets page data (replace with real files in public/downloads/* if you have them)
  const assetPacks = [
    {
      id: "cap",
      icon: <Video className="text-blue-400" size={28} />,
      title: "Cinematic Video Pack",
      description:
        "Transitions, LUTs, SFX, overlays, and motion elements to speed up your edits.",
      items: ["120+ transitions", "30 LUTs", "80 SFX", "20 overlays"],
      size: "1.2 GB",
      version: "v1.0",
      link: `${import.meta.env.BASE_URL}downloads/cinematic-video-pack.zip`,
    },
    {
      id: "dap",
      icon: <Palette className="text-cyan-400" size={28} />,
      title: "Design Asset Pack",
      description:
        "Logos, brand kits, icons, gradients, and ready-to-use social post templates.",
      items: ["40 logos", "12 brand kits", "300 icons", "60 gradients"],
      size: "480 MB",
      version: "v1.3",
      link: `${import.meta.env.BASE_URL}downloads/design-asset-pack.zip`,
    },
    {
      id: "map",
      icon: <Zap className="text-yellow-400" size={28} />,
      title: "Marketing Starter Pack",
      description:
        "Ad creatives, social templates, and campaign-ready assets for fast launches.",
      items: ["90 ad creatives", "120 social templates", "14 campaign kits"],
      size: "320 MB",
      version: "v2.0",
      link: `${import.meta.env.BASE_URL}downloads/marketing-starter-pack.zip`,
    },
  ];

  // Placeholder portfolio cards (you'll swap href with YouTube links later)
  const portfolioPlaceholders = [
    {
      id: 1,
      title: "Edit Reel — Dynamic Cuts",
      thumb:
        "https://images.pexels.com/photos/799115/pexels-photo-799115.jpeg?auto=compress&cs=tinysrgb&w=800",
      href: "#", // replace with https://youtube.com/...
      tags: ["Cinematic", "Sound Design", "Motion"],
    },
    {
      id: 2,
      title: "Anime AMV — Impact",
      thumb:
        "https://images.pexels.com/photos/633409/pexels-photo-633409.jpeg?auto=compress&cs=tinysrgb&w=800",
      href: "#",
      tags: ["Anime", "AMV", "Transitions"],
    },
    {
      id: 3,
      title: "Gaming Montage — Clutch",
      thumb:
        "https://images.pexels.com/photos/907221/pexels-photo-907221.jpeg?auto=compress&cs=tinysrgb&w=800",
      href: "#",
      tags: ["Gaming", "VFX", "Sync"],
    },
    {
      id: 4,
      title: "Shorts Pack — Viral Pace",
      thumb:
        "https://images.pexels.com/photos/1607696/pexels-photo-1607696.jpeg?auto=compress&cs=tinysrgb&w=800",
      href: "#",
      tags: ["Shorts", "Snappy", "Hooks"],
    },
    {
      id: 5,
      title: "Documentary Cut — Story First",
      thumb:
        "https://images.pexels.com/photos/337994/pexels-photo-337994.jpeg?auto=compress&cs=tinysrgb&w=800",
      href: "#",
      tags: ["Docu", "Narrative", "Color"],
    },
    {
      id: 6,
      title: "Brand Film — Identity",
      thumb:
        "https://images.pexels.com/photos/1050305/pexels-photo-1050305.jpeg?auto=compress&cs=tinysrgb&w=800",
      href: "#",
      tags: ["Brand", "Grade", "Sound"],
    },
  ];

  // ——— Pages ———
  const renderHomePage = () => (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Video from public/ */}
        <video
          ref={heroBgRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect width='1920' height='1080' fill='%23000'/%3E%3C/svg%3E"
        >
          <source
            src={`${import.meta.env.BASE_URL}background.webm`}
            type="video/webm"
          />
          <source
            src={`${import.meta.env.BASE_URL}background.mp4`}
            type="video/mp4"
          />
        </video>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Floating 3D Objects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Software Logo Elements */}
          <motion.div
            className="absolute top-16 left-16 w-16 h-16 rounded-xl overflow-hidden shadow-2xl"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}Adobe_Premiere_Pro_CC.webp`}
              alt="Premiere Pro"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute top-32 right-24 w-14 h-14 rounded-xl overflow-hidden shadow-2xl"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -8, 8, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}Adobe_After_Effects_CC_icon.webp`}
              alt="After Effects"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-24 w-12 h-12 rounded-xl overflow-hidden shadow-2xl"
            animate={{
              y: [0, -12, 0],
              x: [0, 8, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}DaVinci-Resolve.webp`}
              alt="DaVinci Resolve"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-40 right-32 w-10 h-10 rounded-xl overflow-hidden shadow-2xl"
            animate={{
              y: [0, 18, 0],
              x: [0, -6, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: "drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}Apple-Motion-logo.webp`}
              alt="Apple Motion"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute top-20 left-10 text-blue-400/20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Cube size={60} />
          </motion.div>

          <motion.div
            className="absolute top-40 right-20 text-purple-400/20"
            animate={{
              y: [0, 30, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Layers size={80} />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-1/4 text-cyan-400/20"
            animate={{
              y: [0, -25, 0],
              x: [0, 15, 0],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={50} />
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-1/4 text-yellow-400/20"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Video size={70} />
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="inline-block px-3 py-1 text-sm bg-blue-600/20 text-blue-400 rounded-full mb-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            CREATIVE EDITING AGENCY
          </motion.span>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <span className="text-white">Senpai Studios</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Cuts. Color. Character.
            </span>
          </motion.h1>

          <motion.p
            className="max-w-2xl text-gray-300 mb-8"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            We turn raw footage into feeling — cinematic edits, viral shorts, and brand films that move people.
          </motion.p>

          <motion.div
            className="flex gap-4"
            variants={slideIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.9 }}
          >
            <button
              onClick={() => setCurrentPage("portfolio")}
              className="bg-white text-black px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              See Portfolio
            </button>
            <button
              onClick={() => setCurrentPage("hire")}
              className="border border-white/20 px-6 py-3 rounded-full text-white hover:bg-white/5 transition-all duration-300"
            >
              Hire Us
            </button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );

  const renderPortfolioPage = () => (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        {/* Background Video */}
        <video
          ref={hireBgRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src={`${import.meta.env.BASE_URL}background.webm`}
            type="video/webm"
          />
          <source
            src={`${import.meta.env.BASE_URL}background.mp4`}
            type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="relative z-10 text-5xl md:text-6xl font-bold mb-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Portfolio
            </span>
          </motion.h1>
          <motion.p
            className="relative z-10 text-lg text-gray-300 max-w-3xl mx-auto mb-10"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.25 }}
          >
            Designed to match the vibe. Add your YouTube links later — cards are ready.
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioPlaceholders.map((v, i) => (
            <motion.div
              key={v.id}
              className="group bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300"
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <div className="relative">
                <img
                  src={v.thumb}
                  alt={v.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <a
                    href={v.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white inline-flex items-center gap-2"
                  >
                    <Play size={18} />
                    Watch on YouTube
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {v.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-white/5 border border-white/10 rounded-full px-2 py-1 text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAssetsPage = () => (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Video */}
        <video
          ref={assetsBgRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src={`${import.meta.env.BASE_URL}background.webm`}
            type="video/webm"
          />
          <source
            src={`${import.meta.env.BASE_URL}background.mp4`}
            type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="relative z-10 text-5xl md:text-6xl font-bold mb-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Senpai Assets
            </span>
          </motion.h1>
          <motion.p
            className="relative z-10 text-xl text-gray-300 max-w-3xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Download-ready packs and templates with the same sleek style and smooth motion.
          </motion.p>
        </div>
      </section>

      {/* Assets */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Packs
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assetPacks.map((pack, i) => (
              <motion.div
                key={pack.id}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
                variants={scaleUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {pack.icon}
                  <h3 className="text-xl font-bold">{pack.title}</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">{pack.description}</p>
                <ul className="text-gray-400 text-sm space-y-2 mb-5">
                  {pack.items.map((it, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="text-green-400" size={16} /> {it}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>Size: {pack.size}</span>
                  <span>Version: {pack.version}</span>
                </div>
                <a
                  href={pack.link}
                  download
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white transition-all duration-300"
                >
                  <Download size={18} /> Download
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderAboutPage = () => (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Video */}
        <video
          ref={aboutBgRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src={`${import.meta.env.BASE_URL}background.webm`}
            type="video/webm"
          />
          <source
            src={`${import.meta.env.BASE_URL}background.mp4`}
            type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            className="relative z-10 text-5xl md:text-6xl font-bold mb-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              About Senpai Studios
            </span>
          </motion.h1>
          <motion.p
            className="relative z-10 text-lg text-gray-300 leading-relaxed"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            We're an editing agency obsessed with story, speed, and style. We cut with rhythm, grade with taste,
            and design motion that feels alive. From anime AMVs to gaming montages, brand films to documentary cuts —
            our goal is simple: turn raw footage into emotions people remember.
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="text-yellow-400" />,
              title: "Speed",
              desc: "Snappy workflows, on-time delivery, zero fluff.",
            },
            {
              icon: <Palette className="text-cyan-400" />,
              title: "Style",
              desc: "Cinematic color, clean typography, tasteful motion.",
            },
            {
              icon: <Video className="text-blue-400" />,
              title: "Story",
              desc: "Edits that breathe — pacing that pulls you in.",
            },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300"
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-2xl mb-4">{b.icon}</div>
              <h3 className="text-xl font-bold mb-2">{b.title}</h3>
              <p className="text-gray-300">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentPage("hire")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white transition-all duration-300"
          >
            Work with us <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );

  const renderHirePage = () => (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        {/* Background Video */}
        <video
          ref={hireBgRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src={`${import.meta.env.BASE_URL}background.webm`}
            type="video/webm"
          />
          <source
            src={`${import.meta.env.BASE_URL}background.mp4`}
            type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Floating App Logos (sides) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-28 left-6 w-14 h-14 rounded-xl overflow-hidden shadow-2xl"
            animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}Adobe_Premiere_Pro_CC.webp`}
              alt="Premiere Pro"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute top-40 right-6 w-12 h-12 rounded-xl overflow-hidden shadow-2xl"
            animate={{ y: [0, 14, 0], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}Adobe_After_Effects_CC_icon.webp`}
              alt="After Effects"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-8 w-12 h-12 rounded-xl overflow-hidden shadow-2xl"
            animate={{
              y: [0, -10, 0],
              x: [0, 8, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}DaVinci-Resolve.webp`}
              alt="DaVinci Resolve"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-44 right-8 w-10 h-10 rounded-xl overflow-hidden shadow-2xl"
            animate={{
              y: [0, 12, 0],
              x: [0, -6, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: "drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}Apple-Motion-logo.webp`}
              alt="Apple Motion"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto">
          <motion.h1
            className="relative z-10 text-5xl md:text-6xl font-bold mb-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Hire Us
            </span>
          </motion.h1>
          <motion.p
            className="relative z-10 text-lg text-gray-300 max-w-3xl mx-auto mb-10"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Fill out the form below and we'll get back to you within 24 hours.
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm"
            variants={scaleUp}
            initial="hidden"
            animate="visible"
          >
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Phone size={16} />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Country */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <MapPin size={16} />
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="">Select your country</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="India">India</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <DollarSign size={16} />
                  Budget (USD) *
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="">Select your budget range</option>
                  <option value="$500 - $1,000">$500 - $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000+">$10,000+</option>
                </select>
              </div>

              {/* Discord ID */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <MessageSquare size={16} />
                  Discord ID (Optional)
                </label>
                <input
                  type="text"
                  name="discordId"
                  value={formData.discordId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  placeholder="username#1234"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-4 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Send size={18} />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </span>
              </motion.button>

              {/* Success/Error Message */}
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-green-400 text-sm"
                >
                  {submitMessage}
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Options */}
          <motion.div
            className="mt-12 text-center"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-400 mb-6">Or reach us directly:</p>
            <div className="flex justify-center gap-6">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
              >
                <Phone size={20} />
                WhatsApp
              </a>
              <a
                href="https://discord.gg/auJHCKZ2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#5865F2] hover:text-[#4752C4] transition-colors duration-300"
              >
                <div className="w-6 h-6 bg-[#5865F2] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">D</span>
                </div>
                Discord
              </a>
              <a
                href="mailto:studiossenpai07@gmail.com"
                className="flex items-center gap-2 text-[#EA4335] hover:text-[#D33B2C] transition-colors duration-300"
              >
                <Mail size={20} />
                Gmail
              </a>
              <a
                href="https://instagram.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-500 hover:text-pink-400 transition-colors duration-300"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">I</span>
                </div>
                Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );

  // ——— Layout ———
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar (Transparent, pill-shaped) */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(96%,1120px)]">
        <div className="flex justify-between items-center h-14 rounded-full bg-transparent backdrop-blur-md ring-1 ring-white/10 shadow-lg px-4">
          {/* Brand (click to go Home) */}
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="flex items-center space-x-3"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            <img
              src={`${import.meta.env.BASE_URL}senpai-logo.jpg`}
              alt="Senpai Studios logo"
              className="h-9 w-9 object-contain rounded-md ring-1 ring-white/10 bg-black"
              loading="eager"
            />
            <span className="text-xl font-bold">Senpai Studios</span>
          </motion.button>

          {/* Right-side nav: Portfolio, Assets, About, Hire Us */}
          <div className="hidden md:flex">
            <div className="flex items-center gap-6 rounded-full px-5 py-2">
              <button
                onClick={() => setCurrentPage("home")}
                className={`text-gray-300 hover:text-white px-2 py-1 transition-all duration-300 ${
                  currentPage === "home" ? "text-white" : ""
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage("portfolio")}
                className={`text-gray-300 hover:text-white px-2 py-1 transition-all duration-300 ${
                  currentPage === "portfolio" ? "text-white" : ""
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setCurrentPage("assets")}
                className={`text-gray-300 hover:text-white px-2 py-1 transition-all duration-300 ${
                  currentPage === "assets" ? "text-white" : ""
                }`}
              >
                Assets
              </button>
              <button
                onClick={() => setCurrentPage("about")}
                className={`text-gray-300 hover:text-white px-2 py-1 transition-all duration-300 ${
                  currentPage === "about" ? "text-white" : ""
                }`}
              >
                About
              </button>
              <motion.button
                onClick={() => setCurrentPage("hire")}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                Hire Us
              </motion.button>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 w-[min(96%,1120px)] z-40 px-4">
          <div className="rounded-2xl bg-black/60 backdrop-blur-md ring-1 ring-white/10 shadow-lg p-4 space-y-2">
            <button
              onClick={() => {
                setCurrentPage("home");
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 ${
                currentPage === "home" ? "text-white" : "text-gray-300"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentPage("portfolio");
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 ${
                currentPage === "portfolio" ? "text-white" : "text-gray-300"
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => {
                setCurrentPage("assets");
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 ${
                currentPage === "assets" ? "text-white" : "text-gray-300"
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => {
                setCurrentPage("about");
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 ${
                currentPage === "about" ? "text-white" : "text-gray-300"
              }`}
            >
              About
            </button>
            <button
              onClick={() => {
                setCurrentPage("hire");
                setIsMenuOpen(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-all duration-300"
            >
              Hire Us
            </button>
          </div>
        </div>
      )}

      {/* Page transitions */}
      <AnimatePresence mode="wait">
        {currentPage === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: -12,
              transition: { duration: 0.25, ease: "easeIn" },
            }}
          >
            {renderHomePage()}
          </motion.div>
        )}
        {currentPage === "portfolio" && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: -12,
              transition: { duration: 0.25, ease: "easeIn" },
            }}
          >
            {renderPortfolioPage()}
          </motion.div>
        )}
        {currentPage === "assets" && (
          <motion.div
            key="assets"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: -12,
              transition: { duration: 0.25, ease: "easeIn" },
            }}
          >
            {renderAssetsPage()}
          </motion.div>
        )}
        {currentPage === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: -12,
              transition: { duration: 0.25, ease: "easeIn" },
            }}
          >
            {renderAboutPage()}
          </motion.div>
        )}
        {currentPage === "hire" && (
          <motion.div
            key="hire"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: -12,
              transition: { duration: 0.25, ease: "easeIn" },
            }}
          >
            {renderHirePage()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          © {new Date().getFullYear()} Senpai Studios — Crafted with care.
        </div>
      </footer>
    </div>
  );
}

export default App;