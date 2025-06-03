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

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
