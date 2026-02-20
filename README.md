# ArticleHub — Full-Stack Article Publishing Platform

A full-stack article publishing platform built with Flask (Python) + React.

## Features

- JWT-based authentication (signup/login)
- Rich text editor with inline image uploads (React Quill)
- Public article list with pagination
- Article detail page with author bio
- Protected routes (create article, profile, my articles)
- User profile management
- Responsive design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Flask, SQLAlchemy, JWT |
| Frontend | React 18, Vite, Axios |
| Database | SQLite |
| Editor | React Quill |
| Auth | JWT (flask-jwt-extended) |

---

## Running Locally

### Prerequisites
- Python 3.8+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set SECRET_KEY and JWT_SECRET_KEY

python run.py
```

Backend runs at: http://localhost:5000

### Frontend

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env
# VITE_API_URL should point to your backend

npm run dev
```

Frontend runs at: http://localhost:3000

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |

### Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile/me` | Required | Get my profile |
| PUT | `/api/profile/me` | Required | Update my profile |

### Articles
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/articles` | No | List all articles (paginated) |
| GET | `/api/articles/:id` | No | Get article detail |
| POST | `/api/articles` | Required | Create article |
| GET | `/api/articles/my` | Required | My articles |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | Required | Upload image |

---

## Environment Variables

### Backend
```
SECRET_KEY=          # Flask secret key
JWT_SECRET_KEY=      # JWT signing key
DATABASE_URL=        # sqlite:///articles.db
UPLOAD_FOLDER=       # Path to uploads directory
MAX_CONTENT_LENGTH=  # Max file size in bytes (default: 5242880)
```

### Frontend
```
VITE_API_URL=        # Backend URL (e.g. https://your-backend.railway.app)
```

---

## Deployment (Railway)

See [DEPLOY.md](DEPLOY.md) for full Railway deployment instructions.
