'''Database info'''
from app import db


class Person(db.Model):
    '''Data for the person database'''
    #id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80),
                         unique=True,
                         nullable=False,
                         primary_key=True)
    score = db.Column(db.Integer(), nullable=False)

    def __repr__(self):
        return '<Person %r>' % self.username
