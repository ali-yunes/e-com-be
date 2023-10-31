import express from 'express';
import products from "./products";
import auth from "./auth";
import {forceSSL} from "../middleware";

const router = express.Router();

export default (): express.Router => {
    router.use(forceSSL);
    products(router);
    auth(router);
    return router;
}
