import mqtt from "mqtt";

const PORT = process.env.MQTT_PORT;
const HOST = process.env.MQTT_HOST;

const mqttClient = mqtt.connect(`mqtt://${HOST}:${PORT}`);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT");
});

export { mqttClient };
