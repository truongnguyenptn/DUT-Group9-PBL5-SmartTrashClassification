import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.preprocessing.image import ImageDataGenerator


def load_and_predict():
    # Load the saved model
    loaded_model = tf.keras.models.load_model("Resnet_TL_model.keras")
    
    # Prepare test data generator
    batch_size = 32
    img_height = 224
    img_width = 224
    test_datagen = ImageDataGenerator(rescale=1. / 255)

    test_data = test_datagen.flow_from_directory(
        "dataset/tapkiemthu",
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical')

    # Make predictions on test data
    print("Predicting on test data...")
    predictions = loaded_model.predict(test_data)
    predicted_classes = np.argmax(predictions, axis=1)
    
    # Display the predicted classes
    print("Predicted classes:", predicted_classes)

def prediction(img,model):
	#rescaling image
	img = img/255

	#converting to tensor
	tensor_img = tf.convert_to_tensor(img,dtype=tf.float32)

	#resizing image
	tensor_img = tf.image.resize(tensor_img,[224,224])
	tensor_img = tensor_img[tf.newaxis,...,]

	class_names = ['glass', 'hazardous', 'non-recycables','paper','plastic','trash']

	#predicting image
	return class_names[model.predict(tensor_img).argmax()]

# Call the function to load and evaluate the model
load_and_predict()