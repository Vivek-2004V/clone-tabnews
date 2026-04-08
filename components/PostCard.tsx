import { motion } from "framer-motion";
import type { JSX } from "react";

interface PostCardProps {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  created_at?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PostCard({
  id,
  title,
  excerpt,
  content,
  created_at,
}: PostCardProps): JSX.Element {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-4 cursor-pointer border border-gray-200 hover:shadow-xl transition-shadow duration-300"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
        {excerpt || content}
      </p>
      <div className="flex justify-between items-center">
        {created_at && (
          <small className="text-gray-400">
            📅{" "}
            {new Date(created_at).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </small>
        )}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
          >
            👍 Upvote
          </motion.button>
          <a
            href={`/post/${id}`}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
          >
            Ler mais →
          </a>
        </div>
      </div>
    </motion.div>
  );
}
