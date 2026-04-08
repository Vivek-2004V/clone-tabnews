import { useState } from "react";
import type { JSX } from "react";
import { motion } from "framer-motion";

interface PostData {
  title: string;
  content: string;
}

export default function CreatePost(): JSX.Element {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content } as PostData),
      });

      if (response.ok) {
        setTitle("");
        setContent("");
        setMessage("✅ Post criado com sucesso!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Erro ao criar post");
      }
    } catch (error) {
      setMessage("❌ Erro ao criar post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-4"
      >
        ✍️ Criar Novo Post
      </motion.h2>

      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`p-3 mb-4 rounded-lg font-semibold ${
            message.includes("✅")
              ? "bg-green-500/30 text-green-100 border border-green-500/50"
              : "bg-red-500/30 text-red-100 border border-red-500/50"
          }`}
        >
          {message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <motion.input
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          type="text"
          placeholder="📝 Título do seu post..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/30 focus:border-white/60 outline-none transition-all backdrop-blur-sm"
        />

        <motion.textarea
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          placeholder="📄 Escreva seu conteúdo aqui..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/30 focus:border-white/60 outline-none transition-all backdrop-blur-sm min-h-[120px] resize-none"
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ⏳ Publicando...
            </motion.span>
          ) : (
            "🚀 Publicar Post"
          )}
        </motion.button>
      </form>
    </div>
  );
}
