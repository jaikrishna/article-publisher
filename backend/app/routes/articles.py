from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app import db
from app.models.article import Article
from app.models.user import User
from app.utils.validators import validate_required

articles_bp = Blueprint('articles', __name__)

PAGE_SIZE = 10


@articles_bp.route('', methods=['GET'])
def get_articles():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', PAGE_SIZE, type=int)
    per_page = min(per_page, 50)  # Cap at 50

    pagination = Article.query.order_by(Article.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        'articles': [a.to_list_dict() for a in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev,
    }), 200


@articles_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_articles():
    user_id = int(get_jwt_identity())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', PAGE_SIZE, type=int)
    per_page = min(per_page, 50)

    pagination = Article.query.filter_by(user_id=user_id).order_by(
        Article.created_at.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'articles': [a.to_list_dict() for a in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev,
    }), 200


@articles_bp.route('/<int:article_id>', methods=['GET'])
def get_article(article_id):
    article = Article.query.get(article_id)
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    return jsonify({'article': article.to_dict(include_author=True)}), 200


@articles_bp.route('', methods=['POST'])
@jwt_required()
def create_article():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    missing = validate_required(data, ['title', 'content'])
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    title = data['title'].strip()
    content = data['content'].strip()

    if len(title) > 300:
        return jsonify({'error': 'Title too long (max 300 characters)'}), 400

    if not content:
        return jsonify({'error': 'Content cannot be empty'}), 400

    article = Article(title=title, content=content, user_id=user_id)
    db.session.add(article)
    db.session.commit()

    return jsonify({'article': article.to_dict(include_author=True)}), 201
