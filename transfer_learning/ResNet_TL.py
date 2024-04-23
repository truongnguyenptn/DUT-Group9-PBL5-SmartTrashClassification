import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten

import tensorflow as tf
def train_model():

    data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip('horizontal'),
    tf.keras.layers.RandomRotation(0.2),
    ])
    global_average_layer = tf.keras.layers.GlobalAveragePooling2D()
    prediction_layer = tf.keras.layers.Dense(4, activation='sigmoid')

    preprocess_input = tf.keras.applications.resnet50.preprocess_input
    # Thiết lập các thông số huấn luyện
    batch_size = 32
    img_height = 224
    img_width = 224
    epochs = 1

    # Tạo các đối tượng ImageDataGenerator để tiền xử lý dữ liệu
    train_datagen = ImageDataGenerator(rescale=1. / 255, validation_split=0.2)

    # Load dữ liệu từ thư mục và tiền xử lý cho tập huấn luyện và tập kiểm thử
    train_data = train_datagen.flow_from_directory(
        "dataset/taphuanluyen",
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        subset='training')
    
    
    validation_data = train_datagen.flow_from_directory(
        "dataset/tapvalidation",
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation')


    resnet_model = Sequential()

    pretrained_model= tf.keras.applications.ResNet50(include_top=False,
                   input_shape=(224,224,3),
                   pooling='avg',classes=5,
                   weights='imagenet')
    for layer in pretrained_model.layers:
        layer.trainable=False

    resnet_model.add(pretrained_model)
    resnet_model.add(Flatten(name='Flatten_0'))
    resnet_model.add(Dense(512, activation='relu', name='Dense_512'))
    resnet_model.add(Dense(4, activation='softmax', name='Dense_4'))
     
    tf.keras.backend.clear_session()
    resnet_model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),loss='categorical_crossentropy',metrics=['accuracy'])


    resnet_model.fit(train_data, epochs=epochs)


    # print("Evaluate on test data")
    # results = model.evaluate(validation_data)
    # print("test loss, test acc:", results)

    resnet_model.save("Resnet_TL_model.keras")

    # fig1 = plt.gcf()
    # plt.plot(history.history['accuracy'])
    # plt.plot(history.history['val_accuracy'])
    # plt.axis(ymin=0.4,ymax=1)
    # plt.grid()
    # plt.title('Model Accuracy')
    # plt.ylabel('Accuracy')
    # plt.xlabel('Epochs')
    # plt.legend(['train', 'validation'])
    # plt.show()


    # plt.plot(history.history['loss'])
    # plt.plot(history.history['val_loss'])
    # plt.grid()
    # plt.title('Model Loss')
    # plt.ylabel('Loss')
    # plt.xlabel('Epochs')
    # plt.legend(['train', 'validation'])
    # plt.show()


train_model()