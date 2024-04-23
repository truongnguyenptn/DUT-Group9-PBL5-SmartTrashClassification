import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator


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
    train_data = train_datagen.flow_from_directory(
        "data/dataset/taphuanluyen",
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        subset='training')
    
    validation_data = train_datagen.flow_from_directory(
        "data/dataset/tapvalidation",
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation')


    model = tf.keras.models.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(img_height, img_width, 3)),
        tf.keras.layers.MaxPooling2D((2, 2)),

        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),

        tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),

        tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.2),

        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(1024, activation="relu"),
        tf.keras.layers.Dense(4, activation='softmax')  # Số lượng lớp dự báo (số lượng danh mục)
    ])


    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])


    model.fit(train_data, validation_data = validation_data, epochs=epochs)


    # print("Evaluate on test data")
    # results = model.evaluate(validation_data)
    # print("test loss, test acc:", results)

    model.save("CNN_model.h5")

train_model()
