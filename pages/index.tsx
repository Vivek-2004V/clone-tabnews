import { useEffect, useState } from "react";
import type { JSX } from "react";
import { motion } from "framer-motion";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import CreatePost from "../components/CreatePost";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

export default function Home(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Post[]) => {
        setPosts(data);
        setError(null);
      })
      .catch((err: Error) => {
        console.error("Error fetching posts:", err);
        setError(err.message);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-white mb-2">
            📰 TabNews Clone
          </h1>
          <p className="text-white/80 text-lg">
            Compartilhe e descubra histórias incríveis
          </p>
        </motion.div>

        {/* Create Post Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <CreatePost />
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-lg border border-red-500/50 rounded-xl p-4 mb-6 text-white"
          >
            ❌ Erro ao carregar posts: {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20"
          >
            <p className="text-white/60 text-lg">
              📝 Nenhum post disponível. Crie o primeiro!
            </p>
          </motion.div>
        )}

        {/* Posts List with Stagger Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              created_at={post.created_at}
            />
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-white/60 text-sm"
        >
          <p>✨ Desenvolvido com Next.js + Framer Motion</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
