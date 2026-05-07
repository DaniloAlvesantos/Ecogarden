import z from "zod";
import { URLSearchParams } from "url";
import { MapData } from "../lib/mapData.js";
import { prisma } from "../lib/prismaClient.js";
import { authenticate } from "../plugin/jwt.js";
import { uploadFile } from "../utils/upload.js";
import type { FastifyTypedInstance } from "../types.js";
import type { MapDataCoding } from "../@types/mapData.type.js";
import { CEP } from "../lib/cep.js";
import type { CEPType } from "../@types/cep.type.js";
import { recordIrrigationEvent } from "../utils/recordIrrigationEvent.js";
import { firestore_db } from "../lib/firebase/admin.js";
import { getCurrentWeather } from "../utils/getCurrentWeather.js";
import { recordSensorData } from "../utils/recordSensorEvent.js";

export async function GardenRoute(app: FastifyTypedInstance) {
  app.get(
    "/garden/count",
    {
      schema: {
        tags: ["garden"],
        description: "Count all gardens",
      },
    },
    async (_, res) => {
      const gardens = await prisma.garden.count();
      return res.send({ gardens }).code(200);
    },
  );

  app.post(
    "/garden/create",
    {
      onRequest: [authenticate],
      schema: {
        tags: ["garden"],
        description: "Create a new garden",
      },
    },
    async (req, res) => {
      const data = await req.file();

      if (!data) {
        return res.send({ error: "No file or form data received" }).code(400);
      }

      if (!data.file) {
        return res.send({ error: "Image not found" }).code(400);
      }

      const gardenSchema = z.object({
        name: z.string(),
        cep: z.string(),
        place: z.string(),
        number: z.string().transform((val) => parseInt(val, 10)),
        tamanhoM2: z.string().transform((val) => parseInt(val, 10)),
        deviceId: z.string(),
      });

      const formFields = {
        name: (data.fields.name as any)?.value,
        cep: (data.fields.cep as any)?.value,
        place: (data.fields.place as any)?.value,
        number: (data.fields.number as any)?.value,
        tamanhoM2: (data.fields.tamanhoM2 as any)?.value,
        deviceId: (data.fields.deviceId as any)?.value,
      };

      const validated = gardenSchema.safeParse(formFields);

      if (!validated.success) {
        req.log.error(validated.error);
        return res
          .send({
            error: "Validation failed.",
            details: validated.error.issues,
          })
          .code(400);
      }

      const { cep, name, number, tamanhoM2, place, deviceId } = validated.data;

      const placeParams = new URLSearchParams(place).toString();
      const response = await MapData.get<MapDataCoding>(
        `/geocoding.php?query=${placeParams}&country=br`,
      );

      const mapData = response.data.data;

      let garden = await prisma.garden.findUnique({
        where: {
          cep_number: {
            cep,
            number,
          },
        },
      });

      if (garden) {
        return res.send({ error: "Garden Already exists." }).code(400);
      }

      const uploadRes = await uploadFile(data, name);

      garden = await prisma.garden.create({
        data: {
          name,
          lat: mapData.lat,
          lng: mapData.lng,
          cep,
          number,
          tamanhoM2,
          imgUrl: uploadRes.imgUrl,
          deviceId: deviceId.replace(/:/g, ""),
          owner: {
            connect: { id: req.user.sub },
          },
        },
      });

      const collection = await recordIrrigationEvent({
        gardenId: garden.id,
        humidity: 0,
        temperature: 0,
        volume: 0,
      });

      const state = await recordSensorData(garden.id, {
        solo_humidity: 0,
        pump: false,
        flow_rate: 0,
        message: "Horta inicializada via API",
      });

      return res.send({ data: garden, collection, state }).code(201);
    },
  );

  app.get(
    "/garden/:id",
    {
      schema: {
        tags: ["garden"],
        description: "Get a garden by id",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;

      const garden = await prisma.garden.findUnique({
        where: { id },
        include: {
          owner: { select: { name: true, email: true } },
          plants: { select: { plant: true, quant: true } },
        },
      });

      if (!garden) return res.send({ error: "Garden not found" }).code(404);

      const cepResponse = await CEP.get<CEPType>(`/${garden.cep}/json`);
      if (!cepResponse) return res.send({ error: "CEP not found" }).code(404);

      const cepData = cepResponse.data;

      const irrigationSnap = await firestore_db
        .collection("garden")
        .doc(garden.id)
        .collection("irrigations")
        .orderBy("timestamp", "desc")
        .get();

      const irrigations = irrigationSnap.docs.map((doc) => {
        const d = doc.data();
        return {
          ...d,
          timestamp: d.timestamp.toDate().toISOString(),
        };
      });

      const weather = await getCurrentWeather({
        q: { city: cepData.localidade },
      });

      const data = {
        garden: {
          ...garden,
          imgUrl: `http://localhost:3333${garden.imgUrl}`,
        },
        location: {
          city: cepData.localidade,
          state: cepData.uf,
          street: cepData.logradouro,
        },
        irrigationHistory: irrigations,
        weather: { degrees: weather?.current.temp_c },
      };

      return res.send({ data }).code(200);
    },
  );

  app.get(
    "/garden/all",
    {
      schema: {
        tags: ["garden"],
        description: "Get all gardens",
      },
    },
    async (req, res) => {
      const gardens = await prisma.garden.findMany({
        include: {
          owner: { select: { name: true, email: true } },
        },
      });

      const dataPromises = gardens.map(async (garden) => {
        const cepResponse = await CEP.get<CEPType>(`/${garden.cep}/json`);
        const cepData = cepResponse.data;

        return {
          garden: {
            ...garden,
            imgUrl: `http://localhost:3333${garden.imgUrl}`,
          },
          location: {
            city: cepData.localidade,
            state: cepData.uf,
            street: cepData.logradouro,
          },
        };
      });

      const data = await Promise.all(dataPromises);
      return res.send({ data }).code(200);
    },
  );

  app.get(
    "/garden/user",
    {
      onRequest: [authenticate],
      schema: {
        tags: ["garden"],
        description: "Get all gardens by user",
      },
    },
    async (req, res) => {
      const gardens = await prisma.garden.findMany({
        where: { owner: { id: req.user.sub } },
        include: {
          owner: { select: { name: true, email: true } },
        },
      });

      return res.send({ gardens }).code(200);
    },
  );

  app.put(
    "/garden/update",
    {
      onRequest: [authenticate],
      schema: {
        tags: ["garden"],
        description: "Update a garden",
        body: z.object({
          id: z.string(),
          name: z.string(),
          cep: z.string(),
          place: z.string(),
          number: z.string().transform((val) => parseInt(val, 10)),
          tamanhoM2: z.string().transform((val) => parseInt(val, 10)),
          deviceId: z.string(),
        }),
      },
    },
    async (req, res) => {
      const { cep, name, number, place, tamanhoM2, id, deviceId } = req.body;
      console.log(id);

      const placeParams = new URLSearchParams(place).toString();
      const response = await MapData.get<MapDataCoding>(
        `/geocoding.php?query=${placeParams}&country=br`,
      );

      const mapData = response.data.data;

      let garden = await prisma.garden.findUnique({
        where: {
          id,
        },
      });

      if (!garden) res.send({ error: "Garden not found" }).code(404);

      garden = await prisma.garden.update({
        where: {
          id,
        },
        data: {
          name,
          lat: mapData.lat,
          lng: mapData.lng,
          cep,
          number,
          tamanhoM2,
          deviceId: deviceId.replace(/:/g, ""),
          owner: {
            connect: { id: req.user.sub },
          },
        },
      });

      return res.send({ garden }).code(200);
    },
  );

  app.post(
    "/garden/add/plants",
    {
      onRequest: [authenticate],
      schema: {
        tags: ["garden"],
        description: "Add many plants to a garden",
        body: z.object({
          gardenId: z.string(),
          plants: z
            .array(
              z.object({
                plantId: z.number(),
                quant: z.number().min(1),
              }),
            )
            .min(1),
        }),
      },
    },
    async (req, res) => {
      const userId = req.user.sub;
      const { gardenId, plants } = req.body;

      const garden = await prisma.garden.findUnique({
        where: { id: gardenId },
      });

      if (!garden) return res.status(404).send({ error: "Garden not found" });
      if (garden.userId !== userId)
        return res.status(403).send({ error: "Forbidden" });

      const results: any[] = [];

      for (const { plantId, quant } of plants) {
        const plant = await prisma.plant.findUnique({ where: { id: plantId } });

        if (!plant) {
          results.push({
            plantId,
            status: "error",
            message: "Plant not found",
          });
          continue;
        }

        const existing = await prisma.plantGarden.findUnique({
          where: { plantId_gardenId: { plantId, gardenId } },
        });

        if (existing) {
          const updated = await prisma.plantGarden.update({
            where: { plantId_gardenId: { plantId, gardenId } },
            data: { quant: existing.quant + quant },
          });
          results.push({ plantId, status: "updated", plantGarden: updated });
        } else {
          const created = await prisma.plantGarden.create({
            data: { plantId, gardenId, quant, dataPlantio: new Date() },
          });
          results.push({ plantId, status: "created", plantGarden: created });
        }
      }

      return res.send({ message: "Process completed", results });
    },
  );

  app.get(
    "/garden/dashboard",
    {
      schema: {
        tags: ["garden"],
        description: "Dashboard stats",
      },
      onRequest: [authenticate],
    },
    async (req, res) => {
      const userId = req.user.sub;
      const gardens = await prisma.garden.findMany({ where: { userId } });
      const sorted = gardens.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );

      return res
        .send({
          gardensCount: gardens.length,
          recentGarden: sorted.map((d) => ({ name: d.name, id: d.id })),
        })
        .code(200);
    },
  );
}
