import { Link } from 'react-router-dom'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ArticleCard({ article }) {
  return (
    <article className="article-card">
      <Link to={`/articles/${article.id}`} className="article-card-link">
        <h2 className="article-card-title">{article.title}</h2>
      </Link>
      <p className="article-card-excerpt">{article.excerpt}</p>
      <div className="article-card-meta">
        <span className="article-card-author">
          By <strong>{article.author?.name || 'Unknown'}</strong>
        </span>
        <span className="article-card-date">{formatDate(article.created_at)}</span>
      </div>
      <Link to={`/articles/${article.id}`} className="read-more">
        Read more →
      </Link>
    </article>
  )
}
