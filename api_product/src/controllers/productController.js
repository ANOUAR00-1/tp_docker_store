import { AppDataSource } from "../config/data-source.js"
import { connectRabbitMQ, publishMessage, consumeMessage } from 'shared';

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



export const startProductValidator = async () => {
    try {
        const channel = await connectRabbitMQ();

        const queueName = 'product_validation_queue';
        const routingKeyToListen = 'order.validate';
        const routingKeyToSend = 'order.validated';

        console.log(`[*] Product Service started Validator... Waiting for '${routingKeyToListen}' messages.`);

        await consumeMessage(
            channel,
            queueName,
            routingKeyToListen,
            async (data) => {

                let isValid = true;
                let errorMessage = "";
                let totalAmount = 0;

                const repo = AppDataSource.getRepository("Product");

                try {
                    for (const item of data.products) {
                        const product = await repo.findOneBy({ id: item.product_id });

                        if (!product) {
                            isValid = false;
                            errorMessage = `Le produit ${item.product_id} n'existe pas.`;
                            break;
                        }
                        if (product.stock < item.qte) {
                            isValid = false;
                            errorMessage = `Le produit ${product.name} est en rupture de stock. Quantité demandée: ${item.qte}, Stock disponible: ${product.stock}.`;
                            break;
                        }

                        totalAmount += Number(product.price) * item.qte;
                    }

                    if (isValid) {
                        for (const item of data.products) {
                            await repo.decrement({ id: item.product_id }, "stock", item.qte);
                        }
                    }
                } catch (err) {
                    isValid = false;
                    errorMessage = err.message;
                }

                const response = {
                    commandId: data.commandId,
                    service: "product",
                    isValid,
                    errorMessage,
                    totalAmount
                };

                await publishMessage(channel, routingKeyToSend, response);
            }
        );

    } catch (error) {
        console.error("Error starting Product Validator:", error.message);
    }
};