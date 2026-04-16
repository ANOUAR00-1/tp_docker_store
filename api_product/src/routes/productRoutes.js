import express from "express"

import {
    getProducts,
    addProduct,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js"

const router = express.Router()

router.get("/", getProducts)

router.get("/:id", getProductById)

router.post("/", addProduct)

router.put("/:id", updateProduct)

router.delete("/:id", deleteProduct)

export default router
