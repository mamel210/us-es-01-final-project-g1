from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


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
    name = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f'<Exercise {self.id} - {self.name}>'

    def serialize(self):
        return {'id': self.id,
                'name': self.name}
    

class TrainingPlans(db.Model):
    __tablename__ = 'training_plans'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    level = db.Column(db.Enum('begginer', 'intermediate', 'advanced', name='level'), nullable=False)
    registration_date = db.Column(db.DateTime(), default=datetime.now, nullable=False)
    finalization_date = db.Column(db.DateTime(), nullable=False)
    quantity_session = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('training_plans', lazy='select'))

    def __repr__(self):
        return f'<TrainingPlan {self.id} - {self.name}>'

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'level': self.level,
                'registration_date': self.registration_date,
                'finalization_date': self.finalization_date,
                'quantity_session': self.quantity_session,
                'is_active': self.is_active,
                'user_id': self.user_id}


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
    training_plan_to = db.relationship('TrainingPlans', foreign_keys=[training_plan_id], backref=db.backref('sessions', lazy='select'))

    def __repr__(self):
        return f'<Session {self.id} - {self.date}>'

    def serialize(self):
        return {'id': self.id,
                'date': self.date,
                'training_plan_id': self.training_plan_id}


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

    def __repr__(self):
        return f'<SessionExercise {self.id} - session {self.session_id} - exercise {self.exercise_id}>'

    def serialize(self):
        return {'id': self.id,
                'series': self.series,
                'repetitions': self.repetitions,
                'is_done': self.is_done,
                'session_id': self.session_id,
                'exercise_id': self.exercise_id}


class MuscleExercises(db.Model):
    __tablename__= 'muscle_exercises'   
    id = db.Column(db.Integer, primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    exercise_to = db.relationship('Exercises', foreign_keys=[exercise_id], backref=db.backref('muscle_exercises', lazy='select'))

    def __repr__(self):
        return f'<MuscleExercise {self.id} - exercise {self.exercise_id}>'

    def serialize(self):
        return {'id': self.id,
               'exercise_id': self.exercise_id}


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
    name_en = db.Column(db.String(50), unique=True, nullable=False)
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
           







