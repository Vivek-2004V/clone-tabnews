import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { JSX } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import LoadingSpinner from "../../components/LoadingSpinner";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  upvotes_count?: number;
  comments_count?: number;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author?: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

export default function PostDetail(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [upvoted, setUpvoted] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch post details
    Promise.all([
      fetch(`/api/posts?id=${id}`),
      fetch(`/api/comments?post_id=${id}`),
    ])
      .then(async ([postRes, commentsRes]) => {
        if (!postRes.ok) throw new Error("Post not found");

        const [postData, commentsData] = await Promise.all([
          postRes.json(),
          commentsRes.json(),
        ]);

        setPost(Array.isArray(postData) ? postData[0] : postData);
        setComments(Array.isArray(commentsData) ? commentsData : []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!commentContent.trim() || !id) return;

    setSubmittingComment(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: id,
          content: commentContent,
        }),
      });

      if (response.ok) {
        setCommentContent("");
        // Refresh comments
        const commentsRes = await fetch(`/api/comments?post_id=${id}`);
        const commentsData = await commentsRes.json();
        setComments(Array.isArray(commentsData) ? commentsData : []);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpvote = async (): Promise<void> => {
    if (!id) return;

    try {
      const method = upvoted ? "DELETE" : "POST";
      await fetch("/api/upvote", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: id,
          user_id: 1, // Default user for demo
        }),
      });

      setUpvoted(!upvoted);

      // Refresh post data
      const postRes = await fetch(`/api/posts?id=${id}`);
      const postData = await postRes.json();
      setPost(Array.isArray(postData) ? postData[0] : postData);
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6"
      >
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-6 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
            >
              ← Voltar
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 backdrop-blur-lg border border-red-500/50 rounded-2xl p-8 text-center text-white"
          >
            <h1 className="text-2xl font-bold mb-2">❌ Post não encontrado</h1>
            <p className="text-white/70">{error || "O post que você procura não existe."}</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all backdrop-blur-sm"
          >
            ← Voltar para Home
          </motion.button>
        </Link>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6 border border-white/20"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200"
          >
            <span className="text-sm text-gray-500">
              📅{" "}
              {new Date(post.created_at).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-sm text-gray-500">
              💬 {post.comments_count || 0} comentários
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="prose prose-lg max-w-none mb-8 text-gray-700 leading-relaxed"
          >
            {post.content.split("\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpvote}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                upvoted
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              👍 {post.upvotes_count || 0}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
            >
              🔗 Compartilhar
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            💬 Comentários ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 pb-8 border-b border-gray-200">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Deixe seu comentário..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 outline-none resize-none mb-3 bg-gray-50 hover:bg-white transition-all"
              rows={3}
            />
            <motion.button
              type="submit"
              disabled={submittingComment || !commentContent.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {submittingComment ? "Enviando..." : "Comentar"}
            </motion.button>
          </form>

          {/* Comments List */}
          <motion.div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Seja o primeiro a comentar! 💭
              </p>
            ) : (
              comments.map((comment, idx) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-gray-800">
                      👤 {comment.author || "Usuário"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
