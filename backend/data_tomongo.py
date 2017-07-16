import pandas as pd
from pymongo import MongoClient

client = MongoClient()
db = client.bike_database
collection = db.bike_coord
coords = db.coords
for f in range(1, 21):
    current_file = pd.read_json('a10_{}.json'.format(f))
    file_size = len(current_file)

    for i in range(file_size):
        row = current_file['features'][i]
        df = pd.DataFrame.from_dict(row)
        row_coordinates = pd.DataFrame(df['geometry']['coordinates'])
        row_coordinates.columns = ['long', 'lat']
        row_timestamps = pd.DataFrame(df['properties']['timestamps'])
        row_timestamps.columns = ['timestamp']
        length = len(row_coordinates)
        bike_coord = pd.concat([row_coordinates, row_timestamps], axis=1)

        for n in range(length):
            long = bike_coord.loc[n]['long']
            lat = bike_coord.loc[n]['lat']
            timestamp = bike_coord.loc[n]['timestamp']
            coord = {"location": {"type": "Point", "coordinates": [long, lat]}, "timestamp": timestamp}
            coords.insert_one(coord)

