import { motion } from "framer-motion";

export const CTAButtons = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="flex flex-wrap items-center justify-center gap-4 mb-16"
    >
      <button
        className="px-8 py-3.5 rounded-lg text-base font-semibold text-white border-0 cursor-pointer transition-all duration-300"
        style={{
          background: "#5b66f5",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#7480ff";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(91, 102, 245, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#5b66f5";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
        }}
      >
        Build my CV
      </button>
      <button
        className="px-8 py-3.5 rounded-lg text-base font-semibold text-white cursor-pointer transition-all duration-300"
        style={{
          background: "transparent",
          border: "2px solid rgba(255, 255, 255, 0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        }}
      >
        Request demo
      </button>
    </motion.div>
  );
};
