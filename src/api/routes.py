"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from api.models import db, Users, SessionExerciseSeries, TrainingPlanStatus, TrainingPlans, Exercises, SessionExercises, TrainingExercises, Sessions, MuscleExercises, Categories, Muscles 
import requests
from datetime import date


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API



@api.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    user_id = get_jwt_identity()
    return jsonify({"message": "Valid Token", "user_id": user_id}), 200
 

@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active)).scalar()
    if not user:
        response_body['message'] = "There is no account with this email, please register."
        return response_body, 404
    
    if user.password != password:
        response_body['message'] = "Incorrect password, please try again."
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


def calculate_status(plan):
    today = date.today()
    plan_finalization_date = plan.finalization_date.date()

    # Respetar el estado actual si es `deleted` o `completed`
    if plan.status == TrainingPlanStatus.DELETED.value:
        return TrainingPlanStatus.DELETED.value
    elif plan.status == TrainingPlanStatus.COMPLETED.value:
        return TrainingPlanStatus.COMPLETED.value
    elif plan_finalization_date < today:
        return TrainingPlanStatus.EXPIRED.value
    elif plan.registration_date.date() <= today <= plan_finalization_date:
        return TrainingPlanStatus.ACTIVE.value

    return plan.status


@api.route('/training-plans', methods=['GET', 'POST'])
@jwt_required()
def training_plans():
    response_body = {}
    current_user = get_jwt_identity()

    if request.method == 'GET':
        rows = db.session.execute(
        db.select(TrainingPlans)
        .where(
            TrainingPlans.user_id == current_user['user_id'],
            TrainingPlans.status != 'deleted'  # Filtrar los planes expirados
        )
        ).scalars()
           
        result = []
        for plan in rows:
            plan.status = calculate_status(plan)
            
            current_sessions_count = db.session.query(Sessions).filter_by(training_plan_id=plan.id).count()
            
            serialized_plan = plan.serialize()

            serialized_plan['current_sessions'] = current_sessions_count  # Agregar el conteo de sesiones actuales

            result.append(serialized_plan)

        response_body['message'] = 'Listado de Planes de Entrenamiento'
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        exercise_data = data.get('exercises', []) 
        row = TrainingPlans(name=data.get('name'),
                            level=data.get('level'),
                            registration_date=data.get('registration_date'),
                            finalization_date=data.get('finalization_date'),
                            quantity_session=data.get('quantity_session'),
                            status='active',
                            user_id=current_user['user_id'])
        db.session.add(row)
        db.session.flush()

        for exercise in exercise_data:
            exercise_row =  TrainingExercises(
                training_plan_id=row.id,
                exercise_id=exercise['exercise_id'],
                repetitions=exercise['repetitions'],
                series=exercise['series']
            )
            db.session.add(exercise_row)

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
        current_sessions_count = db.session.query(Sessions).filter_by(training_plan_id=id).count()
        serialized_plan = row.serialize()
        serialized_plan['current_sessions'] = current_sessions_count

        response_body['message'] = f'Detalle del plan de entrenamiento {id}'
        response_body['results'] = serialized_plan
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        new_registration_date = data.get('registration_date')
        new_finalization_date = data.get('finalization_date')

        # Validación: La fecha de finalización debe ser mayor o igual a la fecha de registro
        if new_registration_date and new_finalization_date:
            if new_finalization_date < new_registration_date:
                response_body['message'] = "La fecha de finalización debe ser mayor o igual a la fecha de registro."
                return response_body, 400

        current_sessions_count = db.session.query(Sessions).filter_by(training_plan_id=id).count()

        # Validación de `quantity_session`
        new_quantity_session = data.get('quantity_session')
        if new_quantity_session is not None:
            try:
                # Convertir new_quantity_session a un entero
                new_quantity_session = int(new_quantity_session)
            except ValueError:
                response_body['message'] = "La cantidad de sesiones debe ser un número entero."
                return response_body, 400

            if new_quantity_session < current_sessions_count:
                response_body['message'] = (
                    f"No se puede asignar {new_quantity_session} sesiones ya que el plan tiene {current_sessions_count} sesiones actuales."
                )
                return response_body, 400

        # Asignación de valores a las propiedades del plan
        row.name = data.get('name')
        row.level = data.get('level')
        row.registration_date = new_registration_date
        row.finalization_date = new_finalization_date
        row.quantity_session = new_quantity_session if new_quantity_session is not None else row.quantity_session

        # Actualizar el estado solo si está presente en los datos
        if 'status' in data:
            row.status = data['status']

         # Actualizar los ejercicios asociados
        updated_exercises = data.get('exercises', [])

        # Recoger los IDs de ejercicios existentes asociados a este plan
        current_exercise_ids = {exercise.exercise_id for exercise in row.training_exercises}

         # Recoger los IDs de ejercicios actualizados
        updated_exercise_ids = {exercise['exercise_id'] for exercise in updated_exercises}

        # Eliminar ejercicios que no están en la nueva lista
        exercises_to_delete = current_exercise_ids - updated_exercise_ids
        TrainingExercises.query.filter(
            TrainingExercises.training_plan_id == id,
            TrainingExercises.exercise_id.in_(exercises_to_delete)
        ).delete(synchronize_session='fetch')

          # Insertar o actualizar los ejercicios
        for exercise_data in updated_exercises:
            exercise = TrainingExercises.query.filter_by(
                training_plan_id=id,
                exercise_id=exercise_data['exercise_id']
            ).first()
            if exercise:
                # Actualizar los ejercicios existentes
                exercise.repetitions = exercise_data['repetitions']
                exercise.series = exercise_data['series']
            else:
                # Insertar los nuevos ejercicios
                new_exercise = TrainingExercises(
                    training_plan_id=id,
                    exercise_id=exercise_data['exercise_id'],
                    repetitions=exercise_data['repetitions'],
                    series=exercise_data['series']
                )
                db.session.add(new_exercise)

        db.session.commit()
        response_body['message'] = f'Plan de entrenamiento {id} actualizado correctamente'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        row.status = 'deleted' 
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
        rows = db.session.execute(
            db.select(Sessions)
            .join(TrainingPlans)
            .where(
                TrainingPlans.user_id == current_user['user_id'],
                TrainingPlans.status != "deleted"
            )
        ).scalars()

        result = []
        for session in rows:
            serialized_session = session.serialize()
            training_plan = session.training_plan_to  # Accede al plan asociado

            # Calcula el estado actual del plan
            training_plan.status = calculate_status(training_plan)

            # Agrega el estado del plan al objeto serializado de la sesión
            serialized_session['training_plan_status'] = training_plan.status

            result.append(serialized_session)
        
        response_body['message'] = 'Listado de Sesiones'
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        plan_id = data.get('training_plan_id', None)
        
        if not plan_id: 
            response_body['message'] = 'Faltan datos en el request (training_plan_id)'
            return response_body, 400
        
        training_plan = db.session.execute(db.select(TrainingPlans).where(TrainingPlans.id == plan_id)).scalars().first()
        if not training_plan:
            response_body['message'] = 'El Plan no existe'
            return response_body, 400
        
        if training_plan.user_id != current_user['user_id']:
            response_body['message'] = 'Sin Autorizacion'
            return response_body, 401
        
        # Validación de fecha: La fecha de la sesión no debe ser posterior a la fecha de finalización del plan
        session_date_str = data.get('date')
        if not session_date_str:
            response_body['message'] = 'Faltan datos en el request (date)'
            return response_body, 400

        session_date = date.fromisoformat(session_date_str)
        plan_finalization_date = training_plan.finalization_date.date()

        if session_date > plan_finalization_date:
            response_body['message'] = f'La sesión no puede ser creada en una fecha posterior a la fecha de finalización del plan ({plan_finalization_date}).'
            return response_body, 400
        
        
        current_sessions_count = db.session.query(Sessions).filter_by(training_plan_id=plan_id).count()
        if current_sessions_count >= training_plan.quantity_session:
            response_body['message'] = 'Se ha alcanzado el número máximo de sesiones para este plan'
            return response_body, 400
        
        new_session = Sessions(
            date=data.get('date'),
            training_plan_id=plan_id,
            name=data.get('name')
        )

        db.session.add(new_session)
        db.session.flush()  # Obtener el ID de la nueva sesin antes del commit

        # Obtener los exercises del TrainingPlan y crear los ejercicios de sesion
        training_exercises = db.session.query(TrainingExercises).filter_by(training_plan_id=plan_id).all()
        for exercise in training_exercises:
            session_exercise = SessionExercises(
                session_id=new_session.id,
                exercise_id=exercise.exercise_id,
                repetitions=exercise.repetitions,
                series=exercise.series,
                is_done=False  # inicializamos como no completado
            )
            db.session.add(session_exercise)

        db.session.commit()
        response_body['message'] = 'Sesión creada exitosamente con ejercicios del plan'
        response_body['results'] = new_session.serialize()
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
        row = Exercises(name=data.get('name'),
                        description=data.get('description'),
                        muscle=data.get('muscle'),
                        exercise_base=data.get('exercise_base'),
                        category_id=data.get('category_id'))
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
        result = []

        for session_exercise in rows:
            # Verificamos si faltan valores en 'series' o 'repetitions'
            if session_exercise.series is None or session_exercise.repetitions is None:
                # Obtenemos el TrainingExercise correspondiente
                training_exercise = db.session.query(TrainingExercises).filter_by(
                    exercise_id=session_exercise.exercise_id,
                    training_plan_id=session_exercise.session_to.training_plan_id
                ).first()

                # Si encontramos un TrainingExercise, asignamos los valores si están vacíos en session_exercise
                if training_exercise:
                    session_exercise.series = training_exercise.series
                    session_exercise.repetitions = training_exercise.repetitions
                    db.session.commit()  # Solo guardar si realmente actualizamos algo

            result.append(session_exercise.serialize())

        response_body['message'] = 'Listado de Ejercicios por Sesión'
        response_body['results'] = result
        return response_body, 200

    if request.method == 'POST':
        data = request.json
        training_exercise = db.session.query(TrainingExercises).filter_by(
            exercise_id=data.get('exercise_id'),
            training_plan_id=data.get('training_plan_id')
        ).first()

        # Usar valores de TrainingExercises para series y repeticiones
        row = SessionExercises(
            session_id=data.get('session_id'),
            exercise_id=data.get('exercise_id'),
            repetitions=training_exercise.repetitions if training_exercise else data.get('repetitions', 1),
            series=training_exercise.series if training_exercise else data.get('series', 1),
            is_done=data.get('is_done', False)
        )
        
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

        # Verifica si `data` es un solo objeto o una lista de objetos
        exercises_data = data if isinstance(data, list) else [data]
        new_exercises = []
        for exercise in exercises_data:
            row = TrainingExercises(
                training_plan_id=exercise.get('training_plan_id'),
                exercise_id=exercise.get('exercise_id'),
                repetitions=exercise.get('repetitions'),
                series=exercise.get('series')
            )
            db.session.add(row)
            new_exercises.append(row)

        db.session.commit()
        response_body['message'] = 'Ejercicio añadido al plan de entrenamiento exitosamente'
        response_body['results'] = row.serialize()
        return response_body, 200



@api.route('/muscles', methods=['GET'])
@jwt_required()
def muscles():
    response_body = {}

    rows = db.session.execute(db.select(Muscles)).scalars()

    result = [row.serialize() for row in rows]

    response_body['message'] = 'Listado de musculos'
    response_body['results'] = result

    return jsonify(response_body), 200


@api.route('/session-exercises', methods=['PUT'])
@jwt_required()
def update_session_exercises():
    data = request.json.get("exercises", [])
    
    if not data:
        return {"message": "No se proporcionaron ejercicios para actualizar"}, 400

    response_body = {"updated": [], "failed": []}
    training_plan_id_set = set() 

    for exercise_data in data:
        session_exercise_id = exercise_data.get("id")
        session_exercise = db.session.get(SessionExercises, session_exercise_id)

        if not session_exercise:
            response_body["failed"].append({"id": session_exercise_id, "message": "El ejercicio no existe"})
            continue

        # Actualizamos o creamos los registros de series
        series_repetitions = exercise_data.get("seriesRepetitions", [])
        for index, reps_completed in enumerate(series_repetitions):
            series_number = index + 1
            series = SessionExerciseSeries.query.filter_by(
                session_exercise_id=session_exercise_id,
                series_number=series_number
            ).first()
            if series:
                series.repetitions_completed = reps_completed
            else:
                new_series = SessionExerciseSeries(
                    session_exercise_id=session_exercise_id,
                    series_number=series_number,
                    repetitions_completed=reps_completed
                )
                db.session.add(new_series)

        # Determinar si el ejercicio está completo
        total_series = len(series_repetitions)
        training_exercise = TrainingExercises.query.filter_by(
            training_plan_id=session_exercise.session_to.training_plan_id,
            exercise_id=session_exercise.exercise_id
        ).first()

        total_repetitions = training_exercise.repetitions if training_exercise else 1
        completed_series_count = sum(1 for reps in series_repetitions if reps >= total_repetitions)

        session_exercise.series = completed_series_count
        session_exercise.repetitions = sum(series_repetitions)
        session_exercise.is_done = completed_series_count == total_series

        response_body["updated"].append(session_exercise.serialize())

        training_plan_id_set.add(session_exercise.session_to.training_plan_id)

    # Verificar si el plan está completo
    for plan_id in training_plan_id_set:
        training_plan = TrainingPlans.query.get(plan_id)
        all_sessions_complete = all(
            all(exercise.is_done for exercise in session.exercises)
            for session in training_plan.sessions
        )
        if all_sessions_complete:
            training_plan.status = 'completed'

    db.session.commit()
    return {"message": "Progreso actualizado correctamente", "results": response_body}, 200


# Obtener todas las imgs en lotes
def fetch_all_images():
    image_dict = {}
    limit = 100
    offset = 0
    total_images = 317  # total de imgs esperadas
    while offset < total_images:
        response = requests.get(f'https://wger.de/api/v2/exerciseimage/?limit={limit}&offset={offset}')
        if response.status_code == 200:
            images_data = response.json()
            # Actualizar image_dict con las nuevas imgs
            image_dict.update({img["exercise_base"]: img["image"] for img in images_data["results"]})
            offset += limit
        else:
            print("Error al obtener imgs:", response.status_code)
            break
    return image_dict


# la idea es que mandemos esta una unica vez para poder popular los datos basicos.
@api.route('/initial-setup', methods=['GET'])
@jwt_required()
def initial_setup():
    response_body = {}
    current_user = get_jwt_identity()
    if not current_user["is_admin"]: 
        return {"message": "Unauthorized"}, 401

    # Llamar a fetch_all_images para obtener todas las imgs de ejercicios o las que se puedan
    image_dict = fetch_all_images()

    # Procesar y almacenar musculos
    url = 'https://wger.de/api/v2/muscle/'
    response = requests.get(url)
    if response.status_code == 200:
        muscles_data = response.json()
        for row in muscles_data["results"]:
            muscle = Muscles(
                id=row['id'],
                name=row['name'],
                name_en=row['name_en'],
                is_front=row['is_front'],
                image_url_main=row['image_url_main'],
                image_url_secondary=row['image_url_secondary']
            )
            db.session.add(muscle)
        db.session.commit()
    
    # Procesar y almacenar categorias
    url = 'https://wger.de/api/v2/exercisecategory/'
    response = requests.get(url)
    if response.status_code == 200:
        categories_data = response.json()
        for row in categories_data["results"]:
            category = Categories(id=row['id'], name=row['name'])
            db.session.add(category)
        db.session.commit()

    # Obtener y almacenar ejercicios en varios lotes con language=4 (español)
    limit = 100
    offset = 0
    response_body["exercises"] = []
    while True:
        url = f'https://wger.de/api/v2/exercise/?limit={limit}&offset={offset}&language=4&equipment=7'
        response = requests.get(url)
        if response.status_code != 200:
            break

        exercises_data = response.json()["results"]
        for row in exercises_data:
            # Verificar si el ejercicio tiene un msculo asociado y si ese musculo estae en la base de datos
            muscle_id = row['muscles'][0] if row['muscles'] else None
            if muscle_id:
                muscle = db.session.query(Muscles).filter_by(id=muscle_id).first()
                if not muscle:
                    print(f"Omitiendo ejercicio {row['name']} - músculo {muscle_id} no encontrado.")
                    continue  # Si el musculo no existe, omitir este ejercicio
            else:
                print(f"Omitiendo ejercicio {row['name']} - sin músculo especificado.")
                continue  # Si no hay ningún musculo especificado, omitir el ejercicio

            # Verificar si el ejercicio ya existe en la base de datos
            existing_exercise = db.session.query(Exercises).filter_by(id=row['id']).first()
            if existing_exercise:
                continue  # Omitir si el ejercicio ya está en la base de datos

            # Obtener la URL de la imagen si está disponible
            exercise_image_url = image_dict.get(row['exercise_base'], None)

            # Crear y almacenar el ejercicio
            exercise = Exercises(
                id=row['id'],
                name=row['name'],
                description=row['description'],
                muscle_id=muscle_id,
                exercise_base=row['exercise_base'],
                category_id=row['category'],
                image_url=exercise_image_url
            )
            db.session.add(exercise)
            response_body["exercises"].append({"id": row['id'], "name": row['name'], "image_url": exercise_image_url})  # Agregar a la respuesta

        db.session.commit()
        offset += limit
        if not exercises_data:
            break  # Termina cuando no hay más ejercicios disponibles

    response_body["message"] = "Setup completo"
    return response_body, 200

@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200