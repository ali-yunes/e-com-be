import express from "express";
import {
    getProductsPaginated,
    deleteProductById,
    getProductById,
    createProduct,
    updateProductById,
    addReviewToProduct
} from "../models/products";
import { Request } from "express";

type SearchQueryParams = {
    searchTerm: string,
    category: string,
    page: string,
    limit: string,
}

export const getProducts = async (req: Request<{},{},{},SearchQueryParams>, res: express.Response) => {
    try{
        let {searchTerm, category, page, limit} = req.query;

        if(!searchTerm){
            searchTerm = "";
        }
        if(!category){
            category = "";
        }
        if(!page){
            page = "0";
        }
        if(!limit){
            limit = "10";
        }

        const products = await getProductsPaginated(searchTerm, category, Number(page), Number(limit));
        return res.status(200).json(products).end();
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}


interface AddProductReq{
    sellerId: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
    quantity: number;
    sold: number;
}

export const addProduct = async (req: express.Request<{},{},AddProductReq>, res: express.Response) => {
    try{
        const {sellerId, name, description, category, price, image, quantity, sold} = req.body;

        if(!sellerId || !name || !description || !category || !price || !image || !quantity || !sold){
            return res.sendStatus(400);
        }

        const product = await createProduct({sellerId, name, description, category, price, image, quantity, sold});

        return res.status(200).json(product);


    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
 }

 export const getProduct = async (req: express.Request, res: express.Response) => {
     try{
         const {id} = req.params;

         const product = await getProductById(id);

         return res.status(200).json(product[0]);

     } catch (error) {
         console.log(error);
         return res.sendStatus(400);
     }
 }

export const deleteProduct = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;

        const deletedProduct = await deleteProductById(id);

        return res.status(200).json(deletedProduct);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
 }

interface UpdateProductReq{
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    image?: string;
    quantity?: number;
    sold?: number;
}

export const updateProduct = async (req: express.Request<{id:string},{},UpdateProductReq>, res: express.Response) => {
    try{
        const {id} = req.params;
        const {name, description, category, price, image, quantity, sold} = req.body;

        if(!name && !description && !category && !price && !image && !quantity && !sold){
            return res.sendStatus(400);
        }

        const product = await updateProductById(id, {name, description, category, price, image, quantity, sold});

        return res.status(200).json(product);
    }
    catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

interface AddReviewReq{
    userId: string;
    title: string;
    comment: string;
    rating: number;
}


export const addReview = async (req: express.Request<{id:string},{},AddReviewReq>, res: express.Response) => {
    try{
        const {id} = req.params;
        const {userId, title, comment, rating} = req.body;

        if(!userId || !title || !comment || !rating){
            return res.sendStatus(400);
        }

        const product = await addReviewToProduct(id,{userId, title, comment, rating});

        return res.status(200).json(product);
    }
    catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
