from datetime import datetime
from app import db


class Article(db.Model):
    __tablename__ = 'articles'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self, include_author=True):
        data = {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
        if include_author and self.author:
            data['author'] = self.author.to_dict()
        return data

    def to_list_dict(self):
        """Lighter version for list views — truncates content."""
        import re
        plain_text = re.sub(r'<[^>]+>', '', self.content)
        excerpt = plain_text[:200] + '...' if len(plain_text) > 200 else plain_text
        return {
            'id': self.id,
            'title': self.title,
            'excerpt': excerpt,
            'user_id': self.user_id,
            'author': self.author.to_dict() if self.author else None,
            'created_at': self.created_at.isoformat(),
        }
