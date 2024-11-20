from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import Column, String
from sqlalchemy import Enum
db = SQLAlchemy()
from enum import Enum
from sqlalchemy import Enum as SqlEnum  # Importa SQLAlchemy Enum


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean, unique=False, nullable=False)
    is_admin = db.Column(db.Boolean, unique=False, nullable=False)
    name = db.Column(db.String(80), unique=False, nullable=False)
    age = db.Column(db.Integer, unique=False, nullable=False)
    weight = db.Column(db.Float, unique=False, nullable=False)
    height = db.Column(db.Float, unique=False, nullable=False)
    target_weight = db.Column(db.Float, unique=False, nullable=False)
    registration_date = db.Column(db.DateTime(), default=datetime.now, nullable=False)

    def __repr__(self):
        return f'<User {self.id} - {self.email}>'

    def serialize(self):
        return {'id': self.id,
                'email': self.email,
                'is_active': self.is_active,
                'is_admin': self.is_admin,
                'name': self.name,
                'age': self.age,
                'weight': self.weight,
                'height': self.height,
                'target_weight': self.target_weight,
                'registration_date': self.registration_date}
    

class Exercises(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=False)
    description = db.Column(db.Text(), unique=False, nullable=False)
    muscle_id = db.Column(db.Integer, db.ForeignKey('muscles.id'), nullable=False)  # ForeignKey a Muscles
    muscle_to = db.relationship('Muscles', foreign_keys=[muscle_id], backref=db.backref('exercises', lazy='select'))  # Relación con Muscles
    exercise_base = db.Column(db.String(), unique=False, nullable=False) 
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    category_to = db.relationship('Categories', foreign_keys=[category_id], backref=db.backref('exercises', lazy='select'))
    image_url = Column(String)

    def __repr__(self):
        return f'<Exercise {self.id} - {self.name} - category {self.category_id}>'

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'description': self.description,
                'muscle_id': self.muscle_id,
                'muscle_name': self.muscle_to.name if self.muscle_to else None,
                'muscle_name_en': self.muscle_to.name_en if self.muscle_to else None,
                'image_url_main': self.muscle_to.image_url_main if self.muscle_to else None,
                'image_url_secondary': self.muscle_to.image_url_secondary if self.muscle_to else None,
                'exercise_base': self.exercise_base,
                'category_id': self.category_id,
                'category_name': self.category_to.name if self.category_to else None,
                'image_url': self.image_url if self.image_url else None 
                }
    

class TrainingPlanStatus(Enum):
    ACTIVE = 'active'
    COMPLETED = 'completed'
    EXPIRED = 'expired'
    DELETED = 'deleted'


class TrainingPlans(db.Model):
    __tablename__ = 'training_plans'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    level = db.Column(db.Enum('begginer', 'intermediate', 'advanced', name='level'), nullable=False)
    registration_date = db.Column(db.DateTime(), default=datetime.now, nullable=False)
    finalization_date = db.Column(db.DateTime(), nullable=False)
    quantity_session = db.Column(db.Integer, nullable=False)
    status = db.Column(
        SqlEnum('active', 'completed', 'expired', 'deleted', name='plan_status'),
        nullable=False,
        default=TrainingPlanStatus.ACTIVE.value
    )
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('training_plans', lazy='select'))

    def __repr__(self):
        return f'<TrainingPlan {self.id} - {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'level': self.level,
            'registration_date': self.registration_date,
            'finalization_date': self.finalization_date,
            'quantity_session': self.quantity_session,
            'status': self.status,
            'user_id': self.user_id
        }


class TrainingExercises(db.Model):
    __tablename__ = 'training_exercises'
    id = db.Column(db.Integer, primary_key=True)
    repetitions = db.Column(db.Integer, nullable=False)
    series = db.Column(db.Integer, nullable=False)
    training_plan_id = db.Column(db.Integer, db.ForeignKey('training_plans.id'), nullable=False)
    training_plan_to = db.relationship('TrainingPlans', foreign_keys=[training_plan_id], backref=db.backref('training_exercises', lazy='select'))
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    exercise_to = db.relationship('Exercises', foreign_keys=[exercise_id], backref=db.backref('training_exercises', lazy='select'))

    def __repr__(self):
        return f'<TrainingExercise {self.id} - exercise {self.exercise_id} min>'

    def serialize(self):
        return {'id': self.id,
                'repetitions': self.repetitions,
                'series': self.series,
                'training_plan_id': self.training_plan_id,
                'exercise_id': self.exercise_id}
    

class Sessions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime(), nullable=False)
    training_plan_id = db.Column(db.Integer, db.ForeignKey('training_plans.id'), nullable=False)
    name = db.Column(db.String(255), nullable=True)
    training_plan_to = db.relationship('TrainingPlans', foreign_keys=[training_plan_id], backref=db.backref('sessions', lazy='select'))

    def __repr__(self):
        return f'<Session {self.id} - {self.date}>'

    def serialize(self):
        return {'id': self.id,
                'date': self.date,
                'training_plan_id': self.training_plan_id,
                'training_plan_name': self.training_plan_to.name if self.training_plan_to else None,
                'name': self.name}


class SessionExercises(db.Model):
    __tablename__ = 'session_exercises'
    id = db.Column(db.Integer, primary_key=True)
    series = db.Column(db.Integer, nullable=False)
    repetitions = db.Column(db.Integer, nullable=False)
    is_done = db.Column(db.Boolean, default=False, nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    session_to = db.relationship('Sessions', foreign_keys=[session_id], backref=db.backref('exercises', lazy='select'))
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    exercise_to = db.relationship('Exercises', foreign_keys=[exercise_id], backref=db.backref('session_exercises', lazy='select'))

    # Relación con SessionExerciseSeries
    series_list = db.relationship('SessionExerciseSeries', lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<SessionExercise {self.id} - session {self.session_id} - exercise {self.exercise_id}>'

    def serialize(self):
        return {
            'id': self.id,
            'series': self.series,
            'repetitions': self.repetitions,
            'is_done': self.is_done,
            'session_id': self.session_id,
            'exercise_id': self.exercise_id,
            'series_list': [series.serialize() for series in self.series_list]
        }
    

class SessionExerciseSeries(db.Model):
    __tablename__ = 'session_exercise_series'
    id = db.Column(db.Integer, primary_key=True)
    session_exercise_id = db.Column(db.Integer, db.ForeignKey('session_exercises.id'), nullable=False)
    series_number = db.Column(db.Integer, nullable=False) 
    repetitions_completed = db.Column(db.Integer, nullable=False, default=0)  # Repeticiones completadas en esta serie

    # Relaciones
    session_exercise = db.relationship(
        'SessionExercises',
        foreign_keys=[session_exercise_id],
        overlaps="series_list"
    )

    def serialize(self):
        return {
            'id': self.id,
            'session_exercise_id': self.session_exercise_id,
            'series_number': self.series_number,
            'repetitions_completed': self.repetitions_completed
        }


class MuscleExercises(db.Model):
    __tablename__= 'muscle_exercises'   
    id = db.Column(db.Integer, primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    exercise_to = db.relationship('Exercises', foreign_keys=[exercise_id], backref=db.backref('muscle_exercises', lazy='select'))
    muscle_id = db.Column(db.Integer, db.ForeignKey('muscles.id'), nullable=False)
    muscle_to = db.relationship('Muscles', foreign_keys=[muscle_id], backref=db.backref('muscle_exercises', lazy='select'))

    def __repr__(self):
        return f'<MuscleExercise {self.id} - exercise {self.exercise_id} - muscle {self.muscle_id}>'

    def serialize(self):
        return {'id': self.id,
               'exercise_id': self.exercise_id,
               'muscle_id': self.muscle_id}


class Categories(db.Model):
    __tablename__= 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return f'<Categorie {self.id} - {self.name}'

    def serialize(self):
        return {'id': self.id,
                'name': self.name}


class Muscles(db.Model):
    __tablename__= 'muscles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    name_en = db.Column(db.String(50), unique=False, nullable=False)
    is_front = db.Column(db.Boolean, default=False, nullable=False)
    image_url_main = db.Column(db.String(), unique=True, nullable=False)
    image_url_secondary = db.Column(db.String(), unique=True, nullable=False)

    def __repr__(self):
        return f'<Muscle {self.id} - {self.name} - {self.name_en}'

    def serialize(self):
        return {'id': self.id,
           'name': self.name,
           'name_en': self.name_en,
           'is_front': self.is_front,
           'image_url_main': self.image_url_main,
           'image_url_secondary': self.image_url_secondary}
           