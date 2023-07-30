import express from "express";
import ProductManager from "./managers/productManager.js";

const app = express();
const DEFAULT_PORT = 3000;
const pm = new ProductManager();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("<h1>Hola Mundo</h1>");
});

app.get('/products', async (req, res) => {
    let products = await pm.getProducts();
    let limit = req.query.limit;
    let limitedProducts = [];

    for(let i = 0; i < limit; i++) {
        limitedProducts.push(products[i]);
    }
    
    if(limit !== undefined) {
        res.send(limitedProducts);
    } else {
        res.send(products);
    }
});

app.get('/products/:id', async (req, res) => {
    let idx = parseInt(req.params.id);

    let product = await pm.getProductsById(idx);
    res.send(product);
});

app.listen(DEFAULT_PORT, (err) => {
    if (err) {
        console.log(err);
    }

    console.log(`[Express]: Server express ejecutandose en el puerto ${DEFAULT_PORT}`);
})