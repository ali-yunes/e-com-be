import express from "express";

import { searchProducts, deleteProduct, getAllProducts,getCategoryProducts, updateProduct, addProduct } from "../controllers/products";


export default (router: express.Router) => {
    router.get("/products", getAllProducts);
    router.get("/products/search", searchProducts);
    router.get("/products/:category", getCategoryProducts);
    router.post("/products", addProduct);
    router.delete("/products/:id", deleteProduct);
    router.patch("/products/:id", updateProduct);
}
