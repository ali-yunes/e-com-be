import express from "express";
import {getItems, searchPaginatedItems, deleteItemById, getItemById, getItemsByCategory, createItem} from "../models/items";
import { Request } from "express";

export const getAllItems = async (req: express.Request, res: express.Response) => {
    try{
        console.log("getItems called")
        const items = await getItems();
        console.log("items",items);
        return res.status(200).json(items).end();
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

export const getCategoryItems = async (req: express.Request, res: express.Response) => { 
    try{
        const {category} = req.params;

        const items = await getItemsByCategory(category);

        return res.status(200).json(items);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

type SearchQueryParams = {
    searchTerm: string,
    category: string,
    page: number,
    limit: number,
}

export const searchItems = async (req: Request<{},{},{},SearchQueryParams>, res: express.Response) => {
    try{
        const {searchTerm, category, page, limit} = req.query;

        if(!searchTerm || !category || !page || !limit){
            return res.sendStatus(400);
        }


        const items = await searchPaginatedItems(searchTerm, category, page, limit);
        return res.status(200).json(items).end();
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

export const addItem = async (req: express.Request, res: express.Response) => {
    try{
        const {sellerId, name, description, category, price, image, quantity, sold} = req.body;

        if(!sellerId || !name || !description || !category || !price || !image || !quantity || !sold){
            return res.sendStatus(400);
        }

        const item = await createItem({sellerId, name, description, category, price, image, quantity, sold});

        return res.status(200).json(item);

    
    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
 }

export const deleteItem = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;

        const deletedItem = await deleteItemById(id);

        return res.status(200).json(deletedItem);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
 }

export const updateItem = async (req: express.Request, res: express.Response) => { 
    try{
        const {id} = req.params;
        const {name, description, category, price, image, quantity, sold} = req.body;

        if(!name && !description && !category && !price && !image && !quantity && !sold){
            return res.sendStatus(400);
        }

        const item = await getItemById(id);

        if(!name){
            item.name = name;
        }
        if(!description){
            item.description = description;
        }
        if(!category){
            item.category = category;
         }
        if(!price){
            item.price = price;
        }
        if(!image){
            item.image = image;
        }
        if(!quantity){
            item.quantity = quantity;
         }
        if(!sold){
            item.sold = sold;
        }

        await item.save();
        return res.status(200).json(item);

    }
    catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
}