# app/modules/auth/service.py
from app.db import db
from app.models.user import User
from app.modules.auth.schema import UserRegisterSchema, UserLoginSchema
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime, timezone
from marshmallow import ValidationError
from typing import Tuple, Dict, Any


class AuthService:
    @staticmethod
    def register_user(raw_data: Dict[str, Any]) -> Tuple[User, str]:
        try:
            validated_data = UserRegisterSchema().load(raw_data)
        except ValidationError as err:
            raise ValueError(err.messages)  # or return err.messages_dict for field-specific errors

        if User.query.filter_by(email=validated_data["email"]).first():
            raise ValueError("Email already registered")

        user = User(
            email=validated_data["email"],
            name=validated_data.get("name"),
        )
        user.set_password(validated_data["password"])

        db.session.add(user)
        db.session.commit()

        from flask_jwt_extended import create_access_token
        token = create_access_token(identity=str(user.id))

        return user, token

    @staticmethod
    def login_user(raw_data: Dict[str, Any]) -> Tuple[User, str]:
        validated_data = UserLoginSchema().load(raw_data)

        user = User.query.filter_by(email=validated_data["email"]).first()
        if not user or not user.check_password(validated_data["password"]):
            raise ValueError("Invalid credentials")

        user.last_login = datetime.now(timezone.utc)
        db.session.commit()

        from flask_jwt_extended import create_access_token
        token = create_access_token(identity=str(user.id))

        return user, token

    @staticmethod
    def get_current_user(user_id: int) -> User:
        user = db.session.get(User, user_id)
        if not user:
            raise ValueError("User not found")
        return user