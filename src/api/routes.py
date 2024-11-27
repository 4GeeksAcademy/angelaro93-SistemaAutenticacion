"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


app = Flask(__name__)  
app.config["JWT_SECRET_KEY"] = "super-secret-key"  
jwt = JWTManager(app)

@api.route('/signup', methods=['POST'])
def create_user():
    request_body = request.json

    if not request_body or 'email' not in request_body or 'password' not in request_body or 'is_active' not in request_body:
        response_body = {
            "msg": "Faltan datos obligatorios"
        }
        return jsonify(response_body), 400

    user_query = User.query.filter_by(email=request_body["email"]).first()
    if user_query is None:
        hashed_password = generate_password_hash(request_body["password"])
        new_user = User(
            email=request_body["email"],
            password=hashed_password,
            is_active=request_body["is_active"]
        )
        db.session.add(new_user)
        db.session.commit()
        
        response_body = {
            "msg": "Usuario creado con éxito"
        }
        return jsonify(response_body), 201
    else:
        response_body = {
            "msg": "Usuario ya existe"
        }
        return jsonify(response_body), 404
    

@api.route('/login', methods=['POST'])
def login_user():
    request_body = request.json

    if not request_body or 'email' not in request_body or 'password' not in request_body:
        response_body = {
            "msg": "Faltan datos obligatorios"
        }
        return jsonify(response_body), 400

    user_query = User.query.filter_by(email=request_body["email"]).first()
    if user_query is None:
        response_body = {
            "msg": "Usuario no encontrado"
        }
        return jsonify(response_body), 404

    if not check_password_hash(user_query.password, request_body["password"]):
        response_body = {
            "msg": "Contraseña incorrecta"
        }
        return jsonify(response_body), 401

    access_token = create_access_token(identity={"email": user_query.email})
    
    response_body = {
        "msg": "Inicio de sesión correcto",
        "access_token": access_token
    }
    return jsonify(response_body), 200


@api.route('/private', methods=['GET'])
@jwt_required()  
def private_route():
    current_user = get_jwt_identity()
    
    response_body = {
        "msg": "Acceso permitido a contenido privado",
        "user": current_user
    }
    return jsonify(response_body), 200
