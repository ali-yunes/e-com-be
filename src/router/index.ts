import express from 'express';
import products from "./products";

const router = express.Router();

export default (): express.Router => {
    products(router);
    return router;
}
