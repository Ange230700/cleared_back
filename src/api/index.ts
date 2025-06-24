// src\index.ts

import express from "express";
import cors from "cors";

import { CollectionController } from "~/src/api/controllers/CollectionController";

const app = express();
app.use(cors());
app.use(express.json());

const collectionController = new CollectionController();

app.get("/collections", (req, res) =>
  collectionController.getAllCollections(req, res),
);

app.get("/collections/:collection_id", (req, res) =>
  collectionController.getCollectionById(req, res),
);

app.post("/collections", (req, res) =>
  collectionController.createCollection(req, res),
);

app.put("/collections/:collection_id", (req, res) =>
  collectionController.updateCollection(req, res),
);

app.delete("/collections/:collection_id", (req, res) =>
  collectionController.deleteCollection(req, res),
);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
