from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    name = db.Column(db.String(80), unique=False, nullable=False)
    age = db.Column(db.String(80), unique=False, nullable=False)
    weight = db.Column(db.String(80), unique=False, nullable=False)
    height = db.Column(db.String(80), unique=False, nullable=False)
    target_weight = db.Column(db.String(80), unique=False, nullable=False)
    registration_date = db.Column(db.DateTime(), default= False, nullable=False)

    def __repr__(self):
        return f'<User {self.id} - {self.email}>'

    def serialize(self):
        return {'id': self.id,
                'email': self.email,
                'is_active': self.is_active}


class TrainingPlans(db.Model):
    __tablename__ = 'training_plans'
    id = db.Column(db.Integer, primary_key=True)   
    name = db.Column(db.String(80), unique=False, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    burn_calories = db.Column(db.Integer, nullable=False) 
    level = db.Column(db.Enum('begginer', 'intermediate','advanced', name='level'), nullable=False)  
    registration_date = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False) 
    finalization_date = db.Column(db.DateTime(), nullable=False)
    quantity_session = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('training_plans', lazy='select'))


class TrainingSessions(db.Model):
    __tablename__ = 'training_sessions'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime(), default=False, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    training_plan_id = db.Column(db.Integer, db.ForeignKey('training_plans.id'), nullable=False)
    training_plan_to = db.relationship('TrainingPlans', foreign_keys=[training_plan_id], backref=db.backref('training_sessions', lazy='select'))

