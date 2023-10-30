import express from 'express';
import products from "./products";
import auth from "./auth";

const router = express.Router();

export default (): express.Router => {
    products(router);
    auth(router);
    return router;
}
