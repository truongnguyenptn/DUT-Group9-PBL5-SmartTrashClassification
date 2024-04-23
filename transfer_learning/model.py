import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras import layers
from tensorflow.keras import Model

import matplotlib.pyplot as plt
def plot_history(history):
    # Lấy các giá trị độ chính xác và loss từ history
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    loss = history.history['loss']
    val_loss = history.history['val_loss']

    # Vẽ đồ thị độ chính xác
    plt.figure(figsize=(12, 6))
    plt.subplot(1, 2, 1)
    plt.plot(acc, label='Training Accuracy')
    plt.plot(val_acc, label='Validation Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.title('Training and Validation Accuracy')
    plt.legend()

    # Vẽ đồ thị loss
    plt.subplot(1, 2, 2)
    plt.plot(loss, label='Training Loss')
    plt.plot(val_loss, label='Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.title('Training and Validation Loss')
    plt.legend()

    # Hiển thị đồ thị
    plt.show()

def train_model():
    """
    Huấn luyện mô hình AI sử dụng dataset.
    """
    # Thiết lập các thông số huấn luyện
    batch_size = 32
    img_height = 224
    img_width = 224
    epochs = 5

    # Tạo các đối tượng ImageDataGenerator để tiền xử lý dữ liệu
    train_datagen = ImageDataGenerator(rescale=1. / 255, validation_split=0.2)

    # Load dữ liệu từ thư mục và tiền xử lý cho tập huấn luyện và tập kiểm thử
    train_data = train_datagen.flow_from_directory(
        "dataset/taphuanluyen",
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        subset='training',
        shuffle=True)  # Shuffle dữ liệu trong quá trình huấn luyện
    class_names = np.array(train_data.class_indices)
    print(class_names)
    # Tạo tập validation
    val_data = train_datagen.flow_from_directory(
        "dataset/taphuanluyen",
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation',
        shuffle=False)  # Không cần shuffle tập validation

    pretrained_model= InceptionV3(include_top=False,
                   input_shape=(224,224,3),
                   pooling='avg',classes=34,
                   weights='imagenet')
    for layer in pretrained_model.layers:
        layer.trainable=False
    #pretrained_model.summary()

    # model = tf.keras.models.Sequential([
    #     pretrained_model,
    #     tf.keras.layers.Flatten(input_shape=(224,224,3)),
    #     tf.keras.layers.Dense(1024, activation="relu"),
    #     tf.keras.layers.Dropout(0.2),
    #     tf.keras.layers.Dense(34, activation='softmax')  # Số lượng lớp dự báo (số lượng danh mục)
    # ])
    last_layer = pretrained_model.get_layer('mixed7')
    last_output = last_layer.output
    x = layers.Flatten()(last_output)
    x = layers.Dense(1024,activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    x = layers.Dense(4 , activation="softmax")(x)
    model = Model(pretrained_model.input , x)

    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    #model.summary()
    history = model.fit(train_data, epochs=epochs, validation_data=val_data)

    file_save = "TrashClassification_Model_Transfer4.h5"
    if os.path.exists(file_save):
        os.remove(file_save)
    model.save(file_save)
    plot_history(history)

train_model()