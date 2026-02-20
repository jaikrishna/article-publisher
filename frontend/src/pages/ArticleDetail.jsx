import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get(`/articles/${id}`)
        setArticle(res.data.article)
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Article not found.')
        } else {
          setError('Failed to load article.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="page-container">
      <div className="error-box">{error}</div>
      <Link to="/" className="btn-secondary">← Back to articles</Link>
    </div>
  )
  if (!article) return null

  return (
    <div className="page-container article-detail">
      <Link to="/" className="back-link">← All Articles</Link>

      <article>
        <header className="article-header">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span>By <strong>{article.author?.name}</strong></span>
            <span className="dot">·</span>
            <span>{formatDate(article.created_at)}</span>
          </div>
        </header>

        <div
          className="article-content ql-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {article.author && (
        <div className="author-card">
          <h3 className="author-card-title">About the Author</h3>
          <div className="author-info">
            <div className="author-avatar">
              {article.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="author-details">
              <h4 className="author-name">{article.author.name}</h4>
              {article.author.bio ? (
                <p className="author-bio">{article.author.bio}</p>
              ) : (
                <p className="author-bio author-bio-empty">No bio provided.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
