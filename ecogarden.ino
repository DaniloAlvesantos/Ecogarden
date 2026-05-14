#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "Lab 3";
const char* password = "fatecitapira";
const char* mqtt_server = "192.168.0.107";

WiFiClient espClient;
PubSubClient client(espClient);

// --- PINS ---
const int humidityPin = 34;
const int pumpPin = 14;
const int flowRatePin = 27;

// --- START HUMIDITY SETUP ---
const int dry_val = 3500;
const int wet_val = 990;

const int min_h = 40;
const int max_h = 80;
const int max_pump_sec = 30 * 1000UL; // 30s
// const long interval = 30 * 60 * 1000UL; // 30min
const long interval = 0.5 * 60 * 1000UL; // 30s

typedef struct {
  int h;
  int p;
} humidityState;
// --- END HUMIDITY SETUP ---

// --- START FLOW RATE SETUP ---
const float pulsePerLiters = 6740.0; 
const float flowFactor = 112.33;

volatile unsigned long pulseCounter = 0;
unsigned long generatedPulses = 0;
unsigned long previousFlowTime = 0;

volatile unsigned long previousPulseTime = 0;

unsigned long pumpStartTime = 0;
bool isPumpOn = false;

typedef struct {
  float volume_total;
  float liter_min;
  bool atualizado;
} flowState;

void IRAM_ATTR icr_sensor() {
  unsigned long tempoAtual = micros();
  if (tempoAtual - previousPulseTime > 2000) { 
    pulseCounter++;
    previousPulseTime = tempoAtual;
  }
}
// --- END FLOW RATE SETUP ---

char deviceId[13];
char stateTopic[50];

void getDeviceId(char* outBuffer) {
  uint64_t chipId = ESP.getEfuseMac();
  snprintf(outBuffer, 13, "%04X%08X", (uint32_t)(chipId >> 32), (uint32_t)chipId);
}

void setUpStateTopic() {
  getDeviceId(deviceId);
  snprintf(stateTopic, sizeof(stateTopic), "ecogarden/%s/state", deviceId);
}

// pumpState is true if pumped the water
// void sendGardenData(int humidity, int temp, bool pumpState, int flowRate, char* message) {
void sendGardenData(int humidity, bool pumpState, float flowRate, char* message) {
  JsonDocument doc;

  doc["solo_humidity"] = humidity;
  doc["pump"] = pumpState;
  doc["flow_rate"] = flowRate;
  
  if(message != nullptr) {
    doc["message"] = message;
  } else {
    doc["message"] = nullptr; // Correção do 'null'
  }

  char buffer[256];
  serializeJson(doc, buffer);

  client.publish(stateTopic, buffer);
}

humidityState getSoloHumidty() {  
  int h = analogRead(humidityPin);

  int p = map(h, dry_val, wet_val, 0, 100);
  p = constrain(p, 0, 100);
  
  humidityState state;
  state.h = h;
  state.p = p;

  return state;
}

flowState getFlow() {
  static flowState state = {0.0, 0.0, false}; 
  
  state.atualizado = false; 

  if (millis() - previousFlowTime >= 1000) {
    
    noInterrupts();
    unsigned long pulsosNoSegundo = pulseCounter;
    pulseCounter = 0;
    interrupts();

    if (pulsosNoSegundo < 3) {
      pulsosNoSegundo = 0;
    }

    generatedPulses += pulsosNoSegundo;

    state.liter_min = pulsosNoSegundo / flowFactor;
    state.volume_total = generatedPulses / pulsePerLiters;
    
    state.atualizado = true; 

    previousFlowTime = millis();
  }

  return state;
}

unsigned long lastWorkflowRun = 0;

void getWorkflow() {
  humidityState h_state = getSoloHumidty();
  Serial.println(h_state.p);
  if(h_state.p <= min_h && !isPumpOn) {
    isPumpOn = true;
    generatedPulses = 0;
    pulseCounter = 0;
    pumpStartTime = millis();
    digitalWrite(pumpPin, LOW);
    sendGardenData(h_state.p, true, 0.0, (char*)"Starting irrigation...");
  }

  if(isPumpOn) {
    flowState f_state = getFlow();
    h_state = getSoloHumidty();

    bool stopReasonTime = (millis() - pumpStartTime) >= max_pump_sec;
    bool stopReasonHum = h_state.p >= max_h;

    if(stopReasonTime || stopReasonHum) {
      digitalWrite(pumpPin, HIGH);
      
      const char* msg = stopReasonTime ? "Max pump time reached!" : "Success";
      sendGardenData(h_state.p, isPumpOn, f_state.volume_total, (char*)msg);

      isPumpOn = false;
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  JsonDocument doc;

  DeserializationError error = deserializeJson(doc, payload, length);

  if(error) {
    Serial.print("deserializeJson() failed: ");
    Serial.print(error.c_str());
    return;
  }
}

void reconnect() {
  while(!client.connected()) {
    Serial.print("Attemping MQTT connection...");
    String clientId = "GARDEN_FATEC";
    clientId += String(random(0xffff), HEX);

    if(client.connect(clientId.c_str())) {
      Serial.println("Connected");

      client.subscribe(stateTopic);
      //sendGardenData(0, false, 0.0, "Conectei!! : )");
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println("Try again in 5 seconds");
      
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  setUpStateTopic();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  pinMode(humidityPin, INPUT);

  /*PUMP (rele)*/
  pinMode(pumpPin, OUTPUT);
  digitalWrite(pumpPin, HIGH);

  /*Flow Rate*/
  pinMode(flowRatePin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(flowRatePin), icr_sensor, RISING);
}


void loop() {
  if(!client.connected()) {
    reconnect();
  }

  client.loop();

  unsigned long currentMilis = millis();

  if(currentMilis - lastWorkflowRun >= interval || isPumpOn) {
    getWorkflow();

    if(!isPumpOn) lastWorkflowRun = currentMilis;
  }
}
