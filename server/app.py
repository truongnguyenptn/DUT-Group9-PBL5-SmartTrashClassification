from flask import Flask,render_template,request,jsonify
import numpy as np
import cv2
import tensorflow as tf
from openrouteservice import client
from flask_swagger_ui import get_swaggerui_blueprint
from flasgger import Swagger
from pymongo import MongoClient
from flask_cors import CORS

import subprocess
app = Flask(__name__)
CORS(app) 
swagger = Swagger(app)
mongoClient = MongoClient('mongodb+srv://truongnguyenptn:dut-iot@cluster0.qb6iquw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = mongoClient['trash_bin_db']
collection = db['trash_bins']
# Define Swagger UI blueprint
# SWAGGER_URL = '/api/docs'  # URL for accessing Swagger UI (usually /swagger)
# API_URL = '/swagger.json'   # URL for accessing the API definition
# swaggerui_blueprint = get_swaggerui_blueprint(
#     SWAGGER_URL,
#     API_URL,
#     config={
#         'app_name': "Trash Classifier API"  # Swagger UI configuration
#     }
# )
# app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)



def prediction(img,model):
	#rescaling image
	img = img/255

	#converting to tensor
	tensor_img = tf.convert_to_tensor(img,dtype=tf.float32)

	#resizing image
	tensor_img = tf.image.resize(tensor_img,[224,224])
	tensor_img = tensor_img[tf.newaxis,...,]
	print("index",model.predict(tensor_img).argmax())
	class_names = ['CD', 'batlua', 'book', 'bowlsanddishes', 'bucket', 'cans', 'cardboard', 'chattayrua', 'coffee', 'daulocthuocla', 'diapers', 'egg', 'food', 'fruit', 'glass trash', 'household', 'khautrang', 'milk_carton', 'nylon', 'pants', 'paper', 'paper_box', 'pen', 'pin', 'plastic_bottle', 'shirt', 'shoes', 'tabletcapsule', 'thietbidientu', 'vogasmini']
	
	#predicting image
	return class_names[model.predict(tensor_img).argmax()]

@app.route('/',methods=['GET'])
def index_page():
	return render_template('index.html')

@app.route('/predict',methods=['POST'])
def submit():
	"""
    Trash Classifier API
    ---
    parameters:
      - name: img
        in: formData
        type: file
        required: true
        description: The image file to classify
    responses:
      200:
        description: Class prediction
        schema:
          properties:
            class:
              type: string
              description: The predicted class
    """
	if request.method == "POST":
		#print('request data:',request.get_data())

		img_data = request.files['img']
		#print('image data:',type(img_data))
		#print('*****')
		#print('')


		#create byte string of img file
		img_byte_string = img_data.read()
		#print('type of data:',type(img_byte_string))
		#print('*****')
  
		#print('')

		#read byte string to form 1d array
		img_array = np.frombuffer(img_byte_string,dtype=np.uint8)
		#print("shape of array:",img_array.shape)
		#print(type(img_array))
		#print('*****')
		#print('')

		#ready array to form 3 dimensional array
		img = cv2.imdecode(img_array,cv2.IMREAD_COLOR)
		#print(img.shape)
		#print('*****')
		#print('')


		#display img
		#cv2.imshow("input image",img)
		#cv2.waitKey(0)
		#cv2.destroyAllWindows()

		
		#cv2.imshow("img",img)
		#cv2.waitKey(0)
		#cv2.destroyAllWindows()


		#loading model net
		model_path = './saved_models/Model.h5'
		# model = tf.keras.models.load_model(model_path)
		model = tf.keras.models.load_model(model_path)
  
		#print(model)	

		class_predicted = prediction(img,model)
		data = {'class':class_predicted}

		return jsonify(data)

@app.route("/find_route", methods=['POST'])
def find_route():
    """
    Find Route API
    ---
    parameters:
      - name: geojson
        in: body
        type: object
        required: true
        description: GeoJSON containing coordinates
        schema:
          type: object
          properties:
            geojson:
              type: array
              items:
                type: array
                items:
                  type: number
    # responses:
    #   200:
    #     description: Directions response
    #     schema:
    #       type: object
    #       properties:
    #         // Define your response schema here
    """
    json_data = request.json
    coordinates = json_data.get('geojson')
    reversed_coordinates = [[lng, lat] for lat, lng in coordinates]
    print(reversed_coordinates)

    api_key = '5b3ce3597851110001cf6248af5aa7185732404599ff7695349f6726'
    ors_client = client.Client(key=api_key)

    matrix = ors_client.distance_matrix(
        locations=reversed_coordinates,
        profile='driving-hgv',  # Specify the transportation profile
        metrics=['duration'],  # Specify whether to calculate distance, duration, or both
    )
    # Print the distance matrix
    print(matrix)

    distance_matrix = matrix['durations']
    print(distance_matrix)


    npoints = len(reversed_coordinates)
    size_1 = (1 << npoints) + 5
    size_2 = npoints + 1
    dp = [[0] * size_2 for _ in range(size_1)]
    par = [[0] * size_2 for _ in range(size_1)]

    for i in range(size_1):
        for j in range(size_2):
            dp[i][j] = int(1e18)
            par[i][j] = -1

    dp[1][0] = 0
    par[1][0] = -1

    for mask in range(size_1):
        for last in range(npoints - 1):
            if dp[mask][last] == 1e18:
                continue
            for nxt in range(npoints - 1):
                if (mask >> nxt) & 1:
                    continue
                else:
                    dist = distance_matrix[last][nxt]
                    nmask = mask + (1 << nxt)
                    if dp[nmask][nxt] > dp[mask][last] + dist:
                        dp[nmask][nxt] = dp[mask][last] + dist
                        par[nmask][nxt] = last
    for last in range(npoints - 1):
        nxt = npoints - 1
        dist = distance_matrix[last][nxt]
        mask = (1 << (npoints-1)) - 1
        nmask = (1 << npoints) - 1
        if dp[nmask][nxt] > dp[mask][last] + dist:
            dp[nmask][nxt] = dp[mask][last] + dist
            par[nmask][nxt] = last

    done = (1 << npoints) - 1
    print(dp[(1 << npoints) - 1][npoints - 1])
    cur = (done, npoints - 1)

    route = []
    while cur[1] != -1:
        print(cur)
        route.append(cur[1])
        pre1 = par[cur[0]][cur[1]]
        pre0 = cur[0] - (1 << cur[1])
        cur = (pre0, pre1)
    route.reverse()
    print(route)
    route_coordinates = []
    for index, value in enumerate(route):
        route_coordinates.append(reversed_coordinates[value])

    response = ors_client.directions(
            coordinates= route_coordinates,
            profile='driving-hgv',
            format='geojson',
            preference='shortest'
    )
    # print(response)
    return response

@app.route('/bin/update', methods=['POST'])
def update_bin():
    """
    Update Trash Bin
    ---
    parameters:
      - in: body
        name: body
        required: true
        description: JSON object containing trash bin information
        schema:
          type: object
          properties:
            lat:
              type: number
              format: float
              description: Latitude of the trash bin
            lng:
              type: number
              format: float
              description: Longitude of the trash bin
            status:
              type: string
              description: Status of the trash bin
            id:
              type: string
              description: ID of the trash bin
    responses:
      200:
        description: Bin updated successfully
    """
    data = request.json
    print(data)

    lat = data.get('lat')
    lng = data.get('lng')
    status = data.get('status')
    _id = data.get('id')

    # Update or insert document based on provided _id
    result = collection.update_one(
        {'_id': _id},
        {'$set': {'lat': lat, 'lng': lng, 'status': status}},
        upsert=True
    )

    return jsonify({'message': 'Bin updated successfully'}), 200

@app.route('/bins', methods=['GET'])
def get_bins():
    """
    Get All Trash Bins
    ---
    responses:
      200:
        description: List of all trash bins
      404:
        description: No bins found
    """
    bins = list(collection.find({}))
    if bins:
        return jsonify(bins), 200
    else:
        return jsonify({'message': 'No bins found'}), 404

@app.route('/bin', methods=['GET'])
def get_bin():
    """
    Get Trash Bin by ID
    ---
    parameters:
      - name: id
        in: query
        type: string
        required: true
        description: ID of the trash bin
    responses:
      200:
        description: Bin information retrieved successfully
      404:
        description: Bin not found
    """
    bin_id = request.args.get('id')
    bin_info = collection.find_one({'_id': bin_id})
    if bin_info:
        return jsonify(bin_info), 200
    else:
        return jsonify({'message': 'Bin not found'}), 404

@app.route('/route', methods=['GET'])
def route_page():
    return render_template('route.html')

if __name__ == '__main__':
    gunicorn_command = "gunicorn --timeout 18000 -b 0.0.0.0:5050 app:app"
    subprocess.run(gunicorn_command, shell=True)