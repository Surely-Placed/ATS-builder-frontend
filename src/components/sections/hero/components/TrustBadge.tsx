import { motion } from "framer-motion";

export const TrustBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="flex -space-x-1.5">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-[#0a0e27]" />
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-[#0a0e27]" />
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-red-500 border-2 border-[#0a0e27]" />
      </div>
      <span className="text-[0.875rem] text-[#a8b2d1] font-normal">
        Trusted by 100,000+ professionals worldwide
      </span>
    </motion.div>
  );
};
