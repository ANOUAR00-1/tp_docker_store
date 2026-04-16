import { AppDataSource } from "../config/data-source.js"

export const getProducts = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Product")
        const products = await repo.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des produits",
            error: error.message
        })
    }
}

export const addProduct = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Product")
        const product = repo.create(req.body)
        await repo.save(product)
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json({
            message: "Erreur lors de l'ajout du produit",
            error: error.message
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Product")
        const product = await repo.findOneBy({
            id: req.params.id
        })

        if (!product) {
            return res.status(404).json({
                message: "Produit non trouvé"
            })
        }

        res.json(product)
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération du produit",
            error: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Product")
        const product = await repo.findOneBy({
            id: req.params.id
        })

        if (!product) {
            return res.status(404).json({
                message: "Produit non trouvé"
            })
        }

        repo.merge(product, req.body)
        await repo.save(product)
        res.json(product)
    } catch (error) {
        res.status(400).json({
            message: "Erreur lors de la mise à jour du produit",
            error: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository("Product")
        const result = await repo.delete(req.params.id)

        if (result.affected === 0) {
            return res.status(404).json({ message: "Produit non trouvé" })
        }

        res.json({
            message: "Produit supprimé"
        })
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression du produit",
            error: error.message
        })
    }
}