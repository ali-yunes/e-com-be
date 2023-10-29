import express from "express";

import { deleteProduct, getProducts, updateProduct, addProduct, getProduct } from "../controllers/products";


export default (router: express.Router) => {
    router.get("/products", getProducts);
    router.get("/products/:id", getProduct);
    router.post("/products", addProduct);
    router.delete("/products/:id", deleteProduct);
    router.patch("/products/:id", updateProduct);
}
