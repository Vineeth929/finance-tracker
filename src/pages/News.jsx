import React, { useEffect, useState } from 'react';
import { api } from '../hooks/useApi';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Badge from '../components/ui/Badge';
import { Newspaper, TrendingUp, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = ['All', 'crypto', 'markets', 'economy', 'business', 'general'];

const categoryConfig = {
  crypto: { icon: '₿', color: 'var(--state-stable-primary)', label: 'Crypto' },
  markets: { icon: '📈', color: 'var(--state-growing-primary)', label: 'Markets' },
  economy: { icon: '💼', color: 'var(--state-cautious-primary)', label: 'Economy' },
  business: { icon: '🏢', color: 'var(--state-stable-primary)', label: 'Business' },
  general: { icon: '📰', color: 'var(--text-secondary)', label: 'General' },
};

const categoryGradients = {
  crypto: { from: '#3B82F6', to: '#A855F7' },
  markets: { from: '#10B981', to: '#0D9488' },
  economy: { from: '#F59E0B', to: '#D97706' },
  business: { from: '#3B82F6', to: '#0D9488' },
  general: { from: '#6B7280', to: '#4B5563' },
};

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getNews();
      setArticles(data.articles || []);
    } catch (err) {
      setError('Failed to load news. Please try again later.');
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      fetchNews();
    } else {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getNewsByCategory(cat);
        setArticles(data.articles || []);
      } catch (err) {
        setError('Failed to load category. Please try again.');
        console.error('Failed to fetch news by category:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <SkeletonLoader height="h-40" count={4} />
      </div>
    );
  }

  const getCategoryGradient = (cat) => {
    const config = categoryGradients[cat] || categoryGradients.general;
    return `linear-gradient(135deg, ${config.from} 0%, ${config.to} 100%)`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const articleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="section-spacing"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ background: 'var(--state-growing-bg)' }}
          >
            <Newspaper size={32} style={{ color: 'var(--state-growing-primary)' }} />
          </div>
          <div>
            <h1 className="text-4xl font-display gradient-text">Financial News</h1>
            <p className="text-lg text-secondary">
              Market stories, insights, and global economic updates
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category Filter - Horizontal scroll with animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {categories.map((cat, idx) => (
          <motion.button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              category === cat
                ? 'shadow-lg text-white'
                : 'surface-interactive text-secondary hover:border-accent'
            }`}
            style={
              category === cat
                ? { background: 'var(--gradient-brand)' }
                : {}
            }
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Error State - Emotional Messaging */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="surface-cautious flex items-start gap-3"
        >
          <AlertCircle size={24} style={{ color: 'var(--state-cautious-primary)', flexShrink: 0 }} />
          <div>
            <p className="font-heading text-state-cautious-primary">Unable to Load News</p>
            <p className="text-sm text-secondary mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Articles Grid - Emotionally Engaging */}
      {articles.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {articles.map((article, idx) => {
            const catConfig = categoryConfig[article.category] || categoryConfig.general;
            return (
              <motion.div
                key={article.id}
                variants={articleVariants}
                whileHover={{ y: -4 }}
                className="group surface-card cursor-pointer overflow-hidden flex flex-col sm:flex-row gap-4"
              >
                {/* Image/Placeholder */}
                <div className="w-full sm:w-32 lg:w-40 h-40 sm:h-28 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden relative">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full flex items-center justify-center flex-col gap-2"
                    style={{
                      background: getCategoryGradient(article.category),
                      display: article.imageUrl ? 'none' : 'flex',
                    }}
                  >
                    <span className="text-3xl">{catConfig.icon}</span>
                    <span className="text-xs font-medium text-white">{catConfig.label}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  {/* Title & Source */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 justify-between">
                      <h3 className="text-base sm:text-lg font-heading line-clamp-2 group-hover:text-state-growing-primary transition-colors">
                        {article.title}
                      </h3>
                      <Badge
                        variant="info"
                        className="text-xs flex-shrink-0"
                        style={{ color: catConfig.color }}
                      >
                        {article.source}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-xs text-muted">
                      {new Date(article.pubDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <motion.a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ gap: '0.5rem' }}
                      className="text-state-stable-primary hover:text-state-growing-primary font-heading text-sm flex items-center gap-1 transition-colors"
                    >
                      Read More
                      <ExternalLink size={14} />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="surface-card text-center py-16 space-y-4"
        >
          <div className="text-5xl">📰</div>
          <div>
            <p className="text-xl font-heading mb-2">No Articles Available</p>
            <p className="text-secondary">Check back soon for the latest financial news and market updates</p>
          </div>
          <motion.button
            onClick={fetchNews}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary mt-4"
          >
            🔄 Refresh News
          </motion.button>
        </motion.div>
      )}

      {/* Articles Count */}
      {articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4"
        >
          <p className="text-sm text-muted flex items-center justify-center gap-2">
            <TrendingUp size={14} /> Showing {articles.length} articles
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
