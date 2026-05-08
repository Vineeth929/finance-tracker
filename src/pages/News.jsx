import React, { useEffect, useState } from 'react';
import { api } from '../hooks/useApi';
import GlassCard from '../components/ui/GlassCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Badge from '../components/ui/Badge';

const categories = ['All', 'crypto', 'markets', 'economy', 'business', 'general'];

const categoryGradients = {
  crypto: 'from-indigo-500 to-purple-500',
  markets: 'from-emerald-500 to-teal-500',
  economy: 'from-amber-500 to-orange-500',
  business: 'from-blue-500 to-cyan-500',
  general: 'from-slate-500 to-gray-500',
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

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold gradient-text">Financial News</h1>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              category === cat
                ? 'gradient-brand text-white shadow-lg'
                : 'glass hover:bg-white/20'
            }`}
            style={category !== cat ? { color: 'var(--text-secondary)' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <GlassCard className="p-4 border-l-4" style={{ borderColor: 'var(--color-danger)' }}>
          <p style={{ color: 'var(--color-danger)' }}>⚠️ {error}</p>
        </GlassCard>
      )}

      {/* Articles */}
      <div className="space-y-4">
        {articles.map((article) => (
          <GlassCard key={article.id} className="p-6 flex gap-4 cursor-pointer hover:bg-white/10">
            {/* Image or Placeholder */}
            <div className="w-32 h-32 rounded-lg flex-shrink-0 overflow-hidden">
              {article.imageUrl ? (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full bg-gradient-to-br ${categoryGradients[article.category] || categoryGradients.general} flex items-center justify-center`}
                style={{ display: article.imageUrl ? 'none' : 'flex' }}
              >
                <span className="text-3xl">📰</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold line-clamp-2">{article.title}</h3>
                <Badge variant="info">{article.source}</Badge>
              </div>
              <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
                {article.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(article.pubDate).toLocaleDateString()}
                </span>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
                >
                  Read More →
                </a>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {articles.length === 0 && !error && (
        <GlassCard className="text-center py-12">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            No articles available. Check back soon! 📰
          </p>
        </GlassCard>
      )}
    </div>
  );
}
