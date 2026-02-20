import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import api from '../utils/api'
import toast from 'react-hot-toast'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function CreateArticle() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const quillRef = useRef(null)

  const imageHandler = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/gif,image/webp'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image must be under 5MB')
        return
      }

      const toastId = toast.loading('Uploading image…')
      try {
        const formData = new FormData()
        formData.append('image', file)
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        const url = res.data.url
        const editor = quillRef.current?.getEditor()
        if (editor) {
          const range = editor.getSelection(true)
          editor.insertEmbed(range.index, 'image', url)
          editor.setSelection(range.index + 1)
        }
        toast.success('Image uploaded', { id: toastId })
      } catch {
        toast.error('Image upload failed', { id: toastId })
      }
    }
    input.click()
  }

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ color: [] }, { background: [] }],
        ['clean'],
      ],
      handlers: { image: imageHandler },
    },
  }), [])

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image', 'color', 'background',
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please enter a title')
      return
    }

    const strippedContent = content.replace(/<[^>]*>/g, '').trim()
    if (!strippedContent && !content.includes('<img')) {
      setError('Please write some content')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.post('/articles', { title: title.trim(), content })
      toast.success('Article published!')
      navigate(`/articles/${res.data.article.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish article')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Write an Article</h1>
      </div>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a compelling title…"
            maxLength={300}
            className="title-input"
          />
          <span className="char-count">{title.length}/300</span>
        </div>

        <div className="form-group editor-group">
          <label>Content</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Tell your story…"
            className="quill-editor"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Publishing…' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  )
}
