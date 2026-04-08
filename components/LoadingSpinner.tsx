import { motion } from "framer-motion";
import type { JSX } from "react";

export default function LoadingSpinner(): JSX.Element {
  return (
    <div className="flex justify-center items-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
      />
    </div>
  );
}
