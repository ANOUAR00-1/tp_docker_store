import express from "express"

import {
    getProducts,
    addProduct,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js"

import { verifyToken } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", getProducts)

router.get("/:id", getProductById)

router.post("/", verifyToken, addProduct)

router.put("/:id", updateProduct)

router.delete("/:id", deleteProduct)

export default router
