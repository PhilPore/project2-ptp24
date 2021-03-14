'''Database info'''
from app import DB


class Person(DB.Model):
    '''Data for the person database'''
    #id = db.Column(db.Integer, primary_key=True)
    username = DB.Column(DB.String(80),
                         unique=True,
                         nullable=False,
                         primary_key=True)
    score = DB.Column(DB.Integer(), nullable=False)

    def __repr__(self):
        return '<Person %r>' % self.username
