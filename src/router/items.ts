import express from "express";

import { searchItems, deleteItem, getAllItems,getCategoryItems, updateItem, addItem } from "../controllers/items";


export default (router: express.Router) => {
    router.get("/items", getAllItems);
    router.get("/items/:category", getCategoryItems);
    router.get("/items/search", searchItems);
    router.post("/items", addItem);
    router.delete("/items/:id", deleteItem);
    router.patch("/items/:id", updateItem);
}