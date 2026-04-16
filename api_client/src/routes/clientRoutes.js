import express from "express"

import {
    getClients,
    addClient,
    getClientById,
    updateClient,
    deleteClient
} from "../controllers/ClientController.js"

const router = express.Router()

router.get("/", getClients)

router.get("/:id", getClientById)

router.post("/", addClient)

router.put("/:id", updateClient)

router.delete("/:id", deleteClient)

export default router