import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from keras.layers import Dense, Flatten
from tensorflow.keras.models import Sequential


def train_model():
    """
    Huấn luyện mô hình AI sử dụng dataset.
    """
    # Thiết lập các thông số huấn luyện
    batch_size = 32
    img_height = 224
    img_width = 224
    epochs = 15

    # Tạo các đối tượng ImageDataGenerator để tiền xử lý dữ liệu
    train_datagen = ImageDataGenerator(rescale=1. / 255, validation_split=0.2)

    # Load dữ liệu từ thư mục và tiền xử lý cho tập huấn luyện và tập kiểm thử
    # train_data = train_datagen.flow_from_directory(
    #     "data/dataset/taphuanluyen",
    #     target_size=(img_height, img_width),
    #     batch_size=batch_size,
    #     class_mode='categorical',
    #     subset='training')
    
    
    # validation_data = train_datagen.flow_from_directory(
    #     "data/dataset/tapvalidation",
    #     target_size=(img_height, img_width),
    #     batch_size=batch_size,
    #     class_mode='categorical',
    #     subset='validation')

    model = tf.keras.models.Sequential()

    pretrained_model= tf.keras.applications.ResNet50(include_top=False,
                   input_shape=(224,224,3),
                   pooling='avg',classes=4,
                   weights='imagenet')
    
    for layer in pretrained_model.layers:
        layer.trainable=False

    model.add(pretrained_model)
    model.add(Flatten())
    model.add(Dense(512, activation='relu'))
    model.add(Dense(4, activation='softmax'))



    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    model.summary()
    #model.fit(train_data, epochs=epochs)


    # print("Evaluate on test data")
    # results = model.evaluate(validation_data)
    # print("test loss, test acc:", results)

    #model.save("Resnet_TL_model.h5")

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
