import fp from "fastify-plugin";
import { mqttClient } from "../lib/mqtt.js";
import type { FastifyInstance } from "fastify";
import { recordSensorData } from "../utils/recordSensorEvent.js";
import { prisma } from "../lib/prismaClient.js";

function mqttPlugin(fastify: FastifyInstance) {
  mqttClient.subscribe("ecogarden/+/state");

  mqttClient.on("message", async (topic, message) => {
    const deviceId = topic.split("/")[1];
    const state = JSON.parse(message.toString());

    if (!deviceId) return;

    console.log({topic, message: JSON.parse(message.toString()) })

    const garden = await prisma.garden.findUnique({
      where: {
        deviceId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!garden) return;

    await recordSensorData(garden.id, state);
  });

  fastify.decorate("mqtt", mqttClient);
}

export default mqttPlugin;
