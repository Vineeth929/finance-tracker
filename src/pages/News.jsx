import React, { useEffect, useState } from 'react';
import { api } from '../hooks/useApi';
import GlassCard from '../components/ui/GlassCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Badge from '../components/ui/Badge';

const categories = ['All', 'crypto', 'markets', 'economy', 'business', 'general'];

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await api.getNews();
      setArticles(data.articles || []);
    } catch (err) {
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
        const data = await api.getNewsByCategory(cat);
        setArticles(data.articles || []);
      } catch (err) {
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
                : 'glass text-gray-300 hover:bg-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-4">
        {articles.map((article) => (
          <GlassCard key={article.id} className="p-6 flex gap-4 cursor-pointer hover:bg-white/10">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold line-clamp-2">{article.title}</h3>
                <Badge variant="info">{article.source}</Badge>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2 mb-3">{article.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
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

      {articles.length === 0 && (
        <GlassCard className="text-center py-12">
          <p className="text-gray-400 text-lg">No articles available. Check back soon! 📰</p>
        </GlassCard>
      )}
    </div>
  );
}
