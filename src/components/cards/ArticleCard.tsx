import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { Clock, User } from 'lucide-react';

export const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <article className="card-navy card-navy-hover overflow-hidden flex flex-col group h-full bg-white">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md border border-border-light text-navy text-xs font-bold shadow-xs">
          {article.category}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center text-xs text-text-secondary space-x-3 mb-2">
            <span className="flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-steel" />
              {article.author.name}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-text-muted" />
              {article.readTime}
            </span>
          </div>

          <h3 className="text-lg font-bold text-navy group-hover:text-steel transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-xs text-text-secondary mt-2 line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">{article.publishedAt}</span>
          <Link
            to={`/articles/${article.slug}`}
            className="text-xs font-bold text-navy hover:text-steel transition-colors"
          >
            Read Article →
          </Link>
        </div>
      </div>
    </article>
  );
};
