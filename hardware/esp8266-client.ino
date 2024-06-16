// Rx D1  TX D2 
  #include <TinyGPS++.h>
  #include <SoftwareSerial.h>
  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
  #include <ArduinoJson.h>
  #include <WiFiClient.h>

const int trigPin = 12;
const int echoPin = 14;
const int trigPin2 = 5;
const int echoPin2 = 4;
long duration, duration2;
float distanceCm, distanceCm2;

//define sound velocity in cm/uS
#define SOUND_VELOCITY 0.034
#define CM_TO_INCH 0.393701

  TinyGPSPlus gps;
  SoftwareSerial SerialGPS(6, 7); 

  const char* ssid = "Truong";
  const char* password = "12345678";
  const char* backendUrl = "http://172.20.10.2:5050/bin/update";


  // Default location (16°03'58.0"N 108°08'38.6"E)
  float Latitude = 16.066111, Longitude = 108.144056;
  String LatitudeString = "16.066111", LongitudeString = "108.144056";

  int year , month , date, hour , minute , second;
  String DateString , TimeString ;

  WiFiServer server(80);

  void setup() {
    Serial.begin(9600);
    SerialGPS.begin(9600);
    Serial.println();
    Serial.print("Connecting to WiFi");
    WiFi.begin(ssid, password);

    pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
    pinMode(echoPin, INPUT);

    pinMode(trigPin2, OUTPUT); // Sets the trigPin2 as an Output
    pinMode(echoPin2, INPUT);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 60) { // 30s timeout
      delay(500);
      Serial.print(".");
      attempts++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("");
      Serial.println("WiFi connected");
      server.begin();
      Serial.println("Server started");
      Serial.println(WiFi.localIP());
    } else {
      Serial.println("");
      Serial.println("WiFi connection failed");
    }
  }

  void loop() {



    ///
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(2);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  distanceCm = duration * SOUND_VELOCITY/2;

  delayMicroseconds(2);
  digitalWrite(trigPin2, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin2, HIGH);
  delayMicroseconds(2);
  digitalWrite(trigPin2, LOW);
  duration2 = pulseIn(echoPin2, HIGH);
  distanceCm2 = duration2 * SOUND_VELOCITY / 2;
  int status = 0;

  if (distanceCm2 <=30 || distanceCm <=30) {
    status = 1;
  }
  // Calculate the distance
    while (SerialGPS.available() > 0)
      if (gps.encode(SerialGPS.read())) {
        if (gps.location.isValid()) {
          Latitude = gps.location.lat();
          LatitudeString = String(Latitude, 6);
          Longitude = gps.location.lng();
          LongitudeString = String(Longitude, 6);
        }

        if (gps.date.isValid()) {
          DateString = "";
          date = gps.date.day();
          month = gps.date.month();
          year = gps.date.year();

          if (date < 10) DateString += '0';
          DateString += String(date);
          DateString += " / ";

          if (month < 10) DateString += '0';
          DateString += String(month);
          DateString += " / ";
          DateString += String(year);
        }

        if (gps.time.isValid()) {
          TimeString = "";
          hour = gps.time.hour() + 7; // adjust UTC
          minute = gps.time.minute();
          second = gps.time.second();

          if (hour < 10) TimeString += '0';
          TimeString += String(hour);
          TimeString += " : ";

          if (minute < 10) TimeString += '0';
          TimeString += String(minute);
          TimeString += " : ";

          if (second < 10) TimeString += '0';
          TimeString += String(second);
        }
      }

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      
      // Prepare JSON payload
      DynamicJsonDocument jsonDoc(200);
      jsonDoc["id"] = "999";
      jsonDoc["name"] = "Thùng rác PBL5 ĐHBKĐN";
      jsonDoc["lat"] = 16.074687, // Your latitude value
      jsonDoc["lng"] = 108.153904; // Your longitude value
      jsonDoc["status"] = String(status); // Replace with your desired status
      jsonDoc["ultraSonicDistance1"] = String(distanceCm);
      jsonDoc["ultraSonicDistance2"] = String(distanceCm2);

      Serial.println("Distance1: " + String(distanceCm));
      Serial.println("Distance2: " + String(distanceCm2));
      // 0 empty - 1 full
      
      String payload;
      serializeJson(jsonDoc, payload);
   WiFiClient client;
      
      // Your Domain name with URL path or IP address with path
      http.begin(client, backendUrl);
      // Send POST request
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(payload);
      
      // Check response
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        
        String response = http.getString();
        Serial.println("Response: " + response);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      
      http.end();
    } else {
      Serial.println("WiFi not connected");
    }
    
    delay(2000); // Adjust delay according to your needs
  }