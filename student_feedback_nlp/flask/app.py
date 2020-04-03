
from flask import Flask, jsonify, request
import pickle

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from flask_cors import CORS

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


#Firebase Init
cred = credentials.Certificate('./key.json')
firebase_admin.initialize_app(cred)

afs = firestore.client()

# load model
# model = pickle.load(open('model.pkl','rb'))

# app
app = Flask(__name__)
CORS(app)


# routes
@app.route('/')
def prit():
    return "Hey there"


@app.route('/api/addFeedback' , methods=['POST'])
def addFeedback():
    if request.method == "POST":

      

        analyser= pickle.load(open("./nlp_teacher2.pickle.dat", "rb"))
        score = analyser.polarity_scores(request.form.get("content"))
        
        todo_ref = afs.collection(u'feedback')

        todo_id = request.form.get("teacher")

        todo = todo_ref.document(todo_id).get()
        doct = todo.to_dict()


        if  doct :
            score1 =  doct['score']
            count = doct['count'] + 1
        
        else :
            score1= 0
            count=1
            
        score1 = score1 + score['compound']
        


        doc_ref = afs.collection(u'feedback').document(request.form.get("teacher"))
        doc_ref.set({
            u'score': score1,
            u'id': request.form.get("teacher"),
            u'count':count
        })

        # else:
        # x = 1
        # doc_ref = afs.collection(u'feedback').document(request.form.get("teacher"))
        # doc_ref.set({
        #     u'score': score['compound'],
        #     u'id': request.form.get('teacher'),
        #     u'count': x
        # })
        
        return jsonify(data = score['compound'])


@app.route("/api/score/<id>", methods=["GET"])
def score(id):
    print(id)
    todo_ref = afs.collection(u'feedback')
    todo = todo_ref.document(id).get()   
    record = todo.to_dict()
    score = record['score']/record['count']
    print(record)
    return jsonify(data= score)




if __name__ == '__main__':
    app.run(port = 5000, debug=True)