from flask import Flask, abort, request, jsonify
from datetime import datetime
import json
from bson import json_util
app = Flask(__name__)
from pymongo import MongoClient
client = MongoClient('mongodb://mongo:27017').bike_database
userReportCollection = client.user_report




@app.route('/')
def hello_world():
    return 'xyz'
    # return str(userReportCollection.insert_one(exampleReport).inserted_id)
    # return 'done'

@app.route('/user-report', methods=['POST'])
def addUserReport():
    dt = request.json
    rep = {
        'location': {
            'type': "Point",
            'coordinates': [dt['lng'], dt['lat']]
        },
        'reason': dt['reason'],
        'description': dt['description'],
        'createdAt': datetime.now()
    }
    userReportCollection.insert_one(rep)
    return 'added'
# get all the documents from the collection

@app.route('/user-report', methods=['GET'])
def getDocs():
    reports = [report for report in userReportCollection.find()]
    return json.dumps(reports, default=json_util.default)



if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')

