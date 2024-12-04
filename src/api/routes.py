"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
# from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


app = Flask(__name__)  
app.config["JWT_SECRET_KEY"] = "super-secret-key"  
jwt = JWTManager(app)

@api.route('/signup', methods=['POST'])
def create_user():
    request_body = request.get_json()

    if not 'email' in request_body: 
        return jsonify({'error': 'Falta el email.'}), 400
    
    if not 'password' in request_body: 
        return jsonify({'error': 'Falta el password.'}), 400
    
    email = request_body['email'] 
    password = request_body['password'] 

    user = User(email = email, password = password, is_active = True)

    db.session.add(user)
    db.session.commit()
        
    response_body = {
            "msg": "Usuario creado con éxito"
        }
    return jsonify(response_body), 201
    
    

@api.route('/login', methods=['POST'])
def login_user():

    email = request.json.get("email", "None")
    password = request.json.get("password", "None")

    user = User.query.filter_by(email = email).first()
    if user is None: 
        return jsonify({"result": "Email o contraseña incorrecta"}), 401
    
    elif email != user.email or password != user.password: 
        return jsonify({"msg": "Usuario o contraseña incorrecta"}), 404
    
    else: 
        access_token = create_access_token(identity = user.id)
        return jsonify({"token": access_token, "user_id": user.id}), 200



@api.route('/private', methods=['GET'])
@jwt_required()  
def private_route():
    current_user = get_jwt_identity()
    
    response_body = {
        "msg": "Acceso permitido a contenido privado",
        "user": current_user
    }
    return jsonify(response_body), 200
