import { AppDataSource } from "../config/data-source.js"

export const getProducts = async (req, res) => {

    const repo = AppDataSource.getRepository("Product")

    const products = await repo.find()

    res.json(products)
}
export const addProduct = async (req, res) => {

    const repo = AppDataSource.getRepository("Product")

    const product = repo.create(req.body)

    await repo.save(product)

    res.json(product)
}

export const getProductById = async (req, res) => {

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
}
export const updateProduct = async (req, res) => {

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
}

export const deleteProduct = async (req, res) => {

    const repo = AppDataSource.getRepository("Product")

    await repo.delete(req.params.id)

    res.json({
        message: "Produit supprimé"
    })
}
