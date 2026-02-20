import { useState, useEffect } from 'react'
import api from '../utils/api'
import ArticleCard from '../components/ArticleCard'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ArticleList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchArticles = async (p = 1) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/articles?page=${p}&per_page=10`)
      setArticles(res.data.articles)
      setTotalPages(res.data.pages)
      setTotal(res.data.total)
      setPage(p)
    } catch {
      setError('Failed to load articles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles(1)
  }, [])

  const handlePageChange = (p) => {
    fetchArticles(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Latest Articles</h1>
        {!loading && !error && (
          <p className="page-subtitle">{total} article{total !== 1 ? 's' : ''} published</p>
        )}
      </div>

      {loading && <LoadingSpinner />}

      {error && <div className="error-box">{error}</div>}

      {!loading && !error && articles.length === 0 && (
        <div className="empty-state">
          <p>No articles yet. Be the first to write one!</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
