from __future__ import print_function
from flask import Flask, abort, request, jsonify
from bson.son import SON
from datetime import datetime
import json
import sys
from bson import json_util
app = Flask(__name__)
from pymongo import MongoClient, GEOSPHERE
client = MongoClient('mongodb://mongo:27017').bike_database
client.coords.create_index([("location", GEOSPHERE)])
userReportCollection = client.user_report
bikeCoordCollection = client.coords



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

@app.route('/bike-coords', methods=['GET'])
def getBikeCoords():
    params = request.args.to_dict()
    lat = float(params.get('lat'))
    lng = float(params.get('lng'))
    rad = float(params.get('radius'))

    query = {'location': {'$nearSphere': {'$geometry': {'type': 'Point', 'coordinates': [lng, lat]}, '$maxDistance': rad}}}

    coords = []
    if lat is None or lng is None or rad is None:
        coords = [coord for coord in bikeCoordCollection.find()]
    else:
        coords = [coord for coord in bikeCoordCollection.find(query)]
    return json.dumps(coords, default=json_util.default)


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')