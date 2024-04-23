from flask import Flask,render_template,request,jsonify
import numpy as np
import cv2
import tensorflow as tf
from flask_swagger_ui import get_swaggerui_blueprint
from flasgger import Swagger

app = Flask(__name__)
swagger = Swagger(app)
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
	class_names = ['CD', 'batlua', 'book', 'bowlsanddishes', 'bucket', 'cans', 'cardboard', 'chattayrua', 'coffee', 'daulocthuocla', 'diapers', 'egg', 'food', 'fruit', 'glass trash', 'household', 'khautrang', 'milk_carton', 'nylon', 'packaging', 'pants', 'paper', 'paper_box', 'pen', 'pin', 'plastic_bottle', 'shirt', 'shoes', 'spray', 'tabletcapsule', 'teabag', 'thietbidientu', 'tissues', 'vogasmini']
	
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
		model_path = './saved_models/TrashClassification_Model_Transfer4.h5'
		# model = tf.keras.models.load_model(model_path)
		model = tf.keras.models.load_model(model_path)
  
		#print(model)	

		class_predicted = prediction(img,model)
		data = {'class':class_predicted}

		return jsonify(data)

	


if __name__ == '__main__':
	app.run()