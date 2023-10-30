import express from "express";

import {deleteProduct, getProducts, updateProduct, addProduct, getProduct, addReview} from "../controllers/products";
import { isAuthenticated } from "../middleware";

export default (router: express.Router) => {
    router.get("/products", getProducts);
    router.get("/products/:id", getProduct);
    router.post("/products", isAuthenticated, addProduct);
    router.post("/products/:id/review", isAuthenticated, addReview);
    router.delete("/products/:id", isAuthenticated, deleteProduct);
    router.patch("/products/:id", isAuthenticated, updateProduct);
}
