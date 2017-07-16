import re
from pymongo import MongoClient
import requests
client = MongoClient()
db = client.bike_database
collection = db.accidents

c = 0

with open('data_utf.xml') as f:
    c += 1
    for line in f:
        if not line.startswith('<ZDARZENIE'):
            continue


        m = re.search("<JEDNOSTKA_MIEJSCA>(.*)</JEDNOSTKA_MIEJSCA>.*<GPS_X_GUS>(.*)</GPS_X_GUS>.*<GPS_Y_GUS>(.*)</GPS_Y_GUS>", line)
        n = re.search("<MIEJSCOWOSC>(.*)</MIEJSCOWOSC><ULICA_ADRES>(.*)</ULICA_ADRES><ZSSD_KOD>(.*)</ZSSD_KOD>", line)
        try:
            a = n[2] + " " + n[3] + ", " + n[1]
            data = {
                "location_old": {
                    "type": "Point",
                    "coordinates": [m[2], m[3]]
                },
                "location_name": a,
                "name": m[1]
            }

            print("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDYaCKLmxnGZYWLbbwQlMQAWpyssFpzGWU&address=" + a)

            r = requests.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDYaCKLmxnGZYWLbbwQlMQAWpyssFpzGWU&address=" + a)
            loc = r.json()['results'][0]['geometry']['location']
            data['location'] = {
                'type': 'Point',
                'coordinates': [loc['lng'], loc['lat']]
            }

            collection.insert_one(data)
            print(m[1])
        except:
            pass
        # break
        # break
