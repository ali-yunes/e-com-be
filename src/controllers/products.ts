import express from "express";
import {getProducts, searchPaginatedProducts, deleteProductById, getProductById, getProductsByCategory, createProduct} from "../models/products";
import { Request } from "express";

export const getAllProducts = async (req: express.Request, res: express.Response) => {
    try{
        console.log("getProducts called")
        const products = await getProducts();
        console.log("products",products);
        return res.status(200).json(products).end();
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

export const getCategoryProducts = async (req: express.Request, res: express.Response) => {
    try{
        const {category} = req.params;

        const products = await getProductsByCategory(category);

        return res.status(200).json(products);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

type SearchQueryParams = {
    searchTerm: string,
    category: string,
    page: string,
    limit: string,
}

export const searchProducts = async (req: Request<{},{},{},SearchQueryParams>, res: express.Response) => {
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


        const products = await searchPaginatedProducts(searchTerm, category, Number(page), Number(limit));
        return res.status(200).json(products).end();
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

export const addProduct = async (req: express.Request, res: express.Response) => {
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

export const updateProduct = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const {name, description, category, price, image, quantity, sold} = req.body;

        if(!name && !description && !category && !price && !image && !quantity && !sold){
            return res.sendStatus(400);
        }

        const product = await getProductById(id);

        if(!name){
            product.name = name;
        }
        if(!description){
            product.description = description;
        }
        if(!category){
            product.category = category;
         }
        if(!price){
            product.price = price;
        }
        if(!image){
            product.image = image;
        }
        if(!quantity){
            product.quantity = quantity;
         }
        if(!sold){
            product.sold = sold;
        }

        await product.save();
        return res.status(200).json(product);

    }
    catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
