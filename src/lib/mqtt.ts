import mqtt from "mqtt";

const PORT = process.env.MQTT_PORT;
const HOST = "localhost";

const mqttClient = mqtt.connect(`mqtt://${HOST}:${PORT}`);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT");
});

export { mqttClient };
