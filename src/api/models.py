from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean, unique=False, nullable=False)
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
    duration_minutes = db.Column(db.Time, nullable=False)
    burn_calories = db.Column(db.Integer, nullable=False)
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
                'duration_minutes': self.duration_minutes,
                'burn_calories': self.burn_calories,
                'level': self.level,
                'registration_date': self.registration_date,
                'finalization_date': self.finalization_date,
                'quantity_session': self.quantity_session,
                'is_active': self.is_active,
                'user_id': self.user_id}


class TrainingExercises(db.Model):
    __tablename__ = 'training_exercises'
    id = db.Column(db.Integer, primary_key=True)
    duration_minutes = db.Column(db.Time, nullable=False)
    repetitions = db.Column(db.Integer, nullable=False)
    resting_time = db.Column(db.Time, nullable=False)
    series = db.Column(db.Integer, nullable=False)
    training_plan_id = db.Column(db.Integer, db.ForeignKey('training_plans.id'), nullable=False)
    training_plan_to = db.relationship('TrainingPlans', foreign_keys=[training_plan_id], backref=db.backref('training_exercises', lazy='select'))
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    exercise_to = db.relationship('Exercises', foreign_keys=[exercise_id], backref=db.backref('training_exercises', lazy='select'))

    def __repr__(self):
        return f'<TrainingExercise {self.id} - exercise {self.exercise_id} min>'

    def serialize(self):
        return {'id': self.id,
                'duration_minutes': self.duration_minutes,
                'repetitions': self.repetitions,
                'resting_time': self.resting_time,
                'series': self.series,
                'training_plan_id': self.training_plan_id,
                'exercise_id': self.exercise_id}
    

class Sessions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime(), default=datetime.now, nullable=False)
    duration_minutes = db.Column(db.Time, nullable=False)
    training_plan_id = db.Column(db.Integer, db.ForeignKey('training_plans.id'), nullable=False)
    training_plan_to = db.relationship('TrainingPlans', foreign_keys=[training_plan_id], backref=db.backref('sessions', lazy='select'))

    def __repr__(self):
        return f'<Session {self.id} - {self.date}>'

    def serialize(self):
        return {'id': self.id,
                'date': self.date,
                'duration_minutes': self.duration_minutes,
                'training_plan_id': self.training_plan_id}


class SessionExercises(db.Model):
    __tablename__ = 'session_exercises'
    id = db.Column(db.Integer, primary_key=True)
    duration_minutes = db.Column(db.Time, nullable=False)
    series = db.Column(db.Integer, nullable=False)
    repetitions = db.Column(db.Integer, nullable=False)
    resting_time = db.Column(db.Time, nullable=False)
    is_done = db.Column(db.Boolean, default=False, nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    session_to = db.relationship('Sessions', foreign_keys=[session_id], backref=db.backref('exercises', lazy='select'))
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    exercise_to = db.relationship('Exercises', foreign_keys=[exercise_id], backref=db.backref('session_exercises', lazy='select'))

    def __repr__(self):
        return f'<SessionExercise {self.id} - session {self.session_id} - exercise {self.exercise_id}>'

    def serialize(self):
        return {'id': self.id,
                'duration_minutes': self.duration_minutes,
                'series': self.series,
                'repetitions': self.repetitions,
                'resting_time': self.resting_time,
                'is_done': self.is_done,
                'session_id': self.session_id,
                'exercise_id': self.exercise_id}
