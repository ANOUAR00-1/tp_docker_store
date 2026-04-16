import { AppDataSource } from "../config/data-source.js"

export const getClients = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Client")
        const clients = await repo.find()
        res.json(clients)
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des clients",
            error: error.message
        })
    }
}

export const addClient = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Client")
        const client = repo.create(req.body)
        await repo.save(client)
        res.status(201).json(client)
    } catch (error) {
        res.status(400).json({
            message: "Erreur lors de l'ajout du client",
            error: error.message
        })
    }
}

export const getClientById = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Client")
        const client = await repo.findOneBy({
            id: req.params.id
        })

        if (!client) {
            return res.status(404).json({
                message: "Client non trouvé"
            })
        }

        res.json(client)
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération du client",
            error: error.message
        })
    }
}

export const updateClient = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Client")
        const client = await repo.findOneBy({
            id: req.params.id
        })

        if (!client) {
            return res.status(404).json({
                message: "Client non trouvé"
            })
        }

        repo.merge(client, req.body)
        await repo.save(client)
        res.json(client)
    } catch (error) {
        res.status(400).json({
            message: "Erreur lors de la mise à jour du client",
            error: error.message
        })
    }
}

export const deleteClient = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Client")
        const result = await repo.delete(req.params.id)

        if (result.affected === 0) {
            return res.status(404).json({ message: "Client non trouvé" })
        }

        res.json({
            message: "Client supprimé"
        })
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression du client",
            error: error.message
        })
    }
}