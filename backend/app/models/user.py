from datetime import datetime
from app import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    bio = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    articles = db.relationship('Article', backref='author', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_email=False):
        data = {
            'id': self.id,
            'name': self.name,
            'bio': self.bio or '',
            'created_at': self.created_at.isoformat(),
        }
        if include_email:
            data['email'] = self.email
        return data
