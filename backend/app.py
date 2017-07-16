from flask import Flask, request
from datetime import datetime
import json
from bson import json_util
app = Flask(__name__)
from pymongo import MongoClient
from dateutil import parser
client = MongoClient('mongodb://mongo:27017').bike_database
userReportCollection = client.user_report
bikeCoordCollection = client.coords
accidentsCollection = client.accidents

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
def getReports():
    # reports = [1,2,3]
    reports = [report for report in userReportCollection.find()]
    return json.dumps(reports, default=json_util.default)

@app.route('/new-user-report', methods=['GET'])
def getLatest():
    date = request.args.get('since')
    dt = parser.parse(date)
    # date1 = datetime(int(date[:3])0, int(date[5]), int(date[5:7]), int(date[7]), int(date[8:10]), int(date[10:12]))
    latest_reports = [reps for reps in userReportCollection.find({'createdAt': {'$gt': dt}})]
    return json.dumps(latest_reports, default=json_util.default)

@app.route('/bike-coords', methods=['GET'])
def getBikeCoords():
    coords = [coord for coord in bikeCoordCollection.find()]
    return json.dumps(coords, default=json_util.default)

@app.route('/accidents',methods=['GET'])
def getAccidents():
    accs = [a for a in accidentsCollection.find()]
    return json.dumps(accs, default=json_util.default)


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')

