import { AppDataSource } from "../config/data-source.js"

export const getClients = async (req, res) => {

    const repo = AppDataSource.getRepository("Client")

    const clients = await repo.find()

    res.json(clients)
}

export const addClient = async (req, res) => {

    const repo = AppDataSource.getRepository("Client")

    const client = repo.create(req.body)

    await repo.save(client)

    res.json(client)
}

export const getClientById = async (req, res) => {

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
}

export const updateClient = async (req, res) => {

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
}

export const deleteClient = async (req, res) => {

    const repo = AppDataSource.getRepository("Client")

    await repo.delete(req.params.id)

    res.json({
        message: "Client supprimé"
    })
}