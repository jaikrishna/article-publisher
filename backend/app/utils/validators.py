import re


def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password(password):
    """Minimum 6 characters."""
    return len(password) >= 6


def validate_required(data, fields):
    """Returns list of missing fields."""
    missing = []
    for field in fields:
        if not data.get(field) or not str(data.get(field)).strip():
            missing.append(field)
    return missing
