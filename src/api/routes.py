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

# current_user = {'user_id'}    


@api.route('/training-plans', methods=['GET', 'POST'])
@jwt_required()
def training_plans():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        rows = db.session.execute(db.select(TrainingPlans)).where(TrainingPlans.user_id == current_user['user_id']).scalars()
        result = [row.serialize() for row in rows]    
        response_body['message'] = 'Listado de Planes de Entrenamiento'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = TrainingPlans(name=data.get('name'),
                            duration_minutes=data.get('duration_minutes'),
                            burn_calories=data.get('burn_calories'),
                            level=data.get('level'),
                            registration_date=data.get('registration_date'),
                            finalization_date=data.get('finalization_date'),
                            quantity_session=data.get('quantity_session'),
                            is_active=data.get('is_active'),
                            user_id=current_user['user_id'])
        db.session.add(row)
        db.session.commit()
        # TODO: tengo que crear todos los ejercicios que tiene el plan
        response_body['message'] = 'Mensaje desde el POST'
        response_body['results'] = row.serialize()
        return response_body, 200


@api.route('/training-plans/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def training_plan(id):
    response_body = {}
    current_user = get_jwt_identity()
    row = db.session.execute(db.select(Authors).where(Authors.id == id)).scalar()
    if not row:
        response_body['message'] = f'El autor {id} no existe'
        response_body['results'] = {}
        return response_body, 404
    if row.user_id != current_user['id']:
        print(row.serialize())
        response_body['message'] = f'Usted no puede modicar, ver o borrar los datos del author {id}'
        response_body['results'] = {}
        return response_body, 200
    if request.method == 'GET':
        response_body['message'] = f'Mensaje desde el GET de {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.name = data.get('name')
        row.duration_minutes=data.get('duration_minutes'),
        row.burn_calories=data.get('burn_calories'),
        row.level=data.get('level'),
        row.registration_date=data.get('registration_date'),
        row.finalization_date=data.get('finalization_date'),
        row.quantity_session=data.get('quantity_session'),
        row.is_active=data.get('is_active')
        db.session.commit()
        response_body['message'] = f'Mensaje desde el PUT de {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        row.is_active=False
        db.session.commit()
        response_body['message'] = f'Mensaje desde el DELETE de {id}'
        response_body['results'] = {}
        return response_body, 200
        