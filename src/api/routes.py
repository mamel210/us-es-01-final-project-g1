"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from api.models import db, Users, TrainingPlans, Exercises, SessionExercises, TrainingExercises, Sessions


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200
 

@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active)).scalar()
    if not user:
        response_body['message'] = "Bad email or password"
        return response_body, 401
    access_token = create_access_token(identity={"email": user.email, 'user_id': user.id, "is_admin": user.is_admin})
    response_body['message'] = f'Usuario {email} logeado con exito'
    response_body['access_token'] = access_token
    response_body['results'] = user.serialize()
    return response_body, 200

@api.route("/register", methods=["POST"])
def register():
    response_body = {}
    data = request.json
    email = request.json.get("email", None)
    row = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if row: 
        response_body['message'] = "El email ya esta registrado"
        return jsonify(response_body), 404
    user = Users(email = data.get("email"),
                password = data.get("password"),
                is_active = True,
                is_admin = False,
                name = data.get("name"),
                age = data.get("age"),
                weight = data.get("weight"),
                height = data.get("height"),
                target_weight = data.get("target_weight"))   
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity={"email": user.email, 'user_id': user.id, "is_admin": user.is_admin})
    response_body['message'] = f'Usuario {email} Registrado con éxito'
    response_body['access_token'] = access_token
    response_body['results'] = user.serialize()
    return jsonify(response_body), 200


@api.route('/training-plans', methods=['GET', 'POST'])
@jwt_required()
def training_plans():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        rows = db.session.execute(db.select(TrainingPlans).where(TrainingPlans.user_id == current_user['user_id'])).scalars()
        result = [row.serialize() for row in rows]    
        response_body['message'] = 'Listado de Planes de Entrenamiento'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = TrainingPlans(name=data.get('name'),
                            level=data.get('level'),
                            registration_date=data.get('registration_date'),
                            finalization_date=data.get('finalization_date'),
                            quantity_session=data.get('quantity_session'),
                            is_active=data.get('is_active'),
                            user_id=current_user['user_id'])
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Plan de entrenamiento creado exitosamente'
        response_body['results'] = row.serialize()
        return response_body, 200

@api.route('/training-plans/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def training_plan(id):
    response_body = {}
    current_user = get_jwt_identity()
    row = db.session.execute(db.select(TrainingPlans).where(TrainingPlans.id == id)).scalar()
    if not row:
        response_body['message'] = f'El plan de entrenamiento {id} no existe'
        response_body['results'] = {}
        return response_body, 404
    if row.user_id != current_user['user_id']:
        response_body['message'] = f'Usted no puede modificar, ver o borrar los datos del plan {id}'
        response_body['results'] = {}
        return response_body, 403
    if request.method == 'GET':
        response_body['message'] = f'Detalle del plan de entrenamiento {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.name = data.get('name')
        row.level = data.get('level')
        row.registration_date = data.get('registration_date')
        row.finalization_date = data.get('finalization_date')
        row.quantity_session = data.get('quantity_session')
        row.is_active = data.get('is_active')
        db.session.commit()
        response_body['message'] = f'Plan de entrenamiento {id} actualizado correctamente'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        row.is_active = False
        db.session.commit()
        response_body['message'] = f'Plan de entrenamiento {id} eliminado correctamente'
        response_body['results'] = {}
        return response_body, 200

@api.route('/sessions', methods=['GET', 'POST'])
@jwt_required()
def sessions():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        rows = db.session.execute(db.select(Sessions)).where(Sessions.training_plan_to.user_id == current_user['user_id']).scalars()
        result = [row.serialize() for row in rows]    
        response_body['message'] = 'Listado de Sesiones'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        plan = data.get('training_plan_id', None)
        if not plan: 
            response_body['message'] = 'Faltan datos en el request (training_plan_id)'
            return response_body, 400
        row = db.session.execute(db.select(TrainingPlans).where(TrainingPlans.id == plan))
        if not row:
            response_body['message'] = 'El Plan no existe'
            return response_body, 400
        if row.user_id != current_user['user_id']:
            response_body['message'] = 'Sin Autorizacion'
            return response_body, 401
        row = Sessions(date=data.get('date'),
                       training_plan_id=data.get('training_plan_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Sesión creada exitosamente'
        response_body['results'] = row.serialize()
        return response_body, 200

@api.route('/exercises', methods=['GET', 'POST'])
@jwt_required()
def exercises():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Exercises)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'Listado de Ejercicios'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Exercises(name=data.get('name'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Ejercicio creado exitosamente'
        response_body['results'] = row.serialize()
        return response_body, 200

@api.route('/session-exercises', methods=['GET', 'POST'])
@jwt_required()
def session_exercises():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(SessionExercises)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'Listado de Ejercicios por Sesión'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = SessionExercises(session_id=data.get('session_id'),
                               exercise_id=data.get('exercise_id'),
                               repetitions=data.get('repetitions'),
                               series=data.get('series'),
                               is_done=data.get('is_done'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Ejercicio añadido a la sesión exitosamente'
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/training-exercises', methods=['GET', 'POST'])
@jwt_required()
def training_exercises():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(TrainingExercises)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = 'Listado de Ejercicios por Plan de Entrenamiento'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = TrainingExercises(training_plan_id=data.get('training_plan_id'),
                                exercise_id=data.get('exercise_id'),
                                repetitions=data.get('repetitions'),
                                series=data.get('series'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Ejercicio añadido al plan de entrenamiento exitosamente'
        response_body['results'] = row.serialize()
        return response_body, 200
