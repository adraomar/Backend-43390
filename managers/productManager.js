import fs from "fs";

class Producto {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

export default class ProductManager {
    constructor() {
        this.path = "./managers/products.json";
        this.products = [];
    }

    addProduct = async(title, description, price, thumbnail, code, stock) => {
        try {
            let found = this.products.find((prod) => prod.code === code);

            if(found) {
                console.log(`[Error]: No se pudo agregar porque ya existe un producto con el codigo: ${code}`);
            } else {
                let prod = new Producto(title, description, price, thumbnail, code, stock);
                let idx = this.products.length;
                this.products.push({idx, ...prod});

                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
            }
        } catch (error) {
            console.log(error);
        }
    }

    getProducts = async() => {
        try {
            if(fs.existsSync(this.path)) {
                let data = await fs.promises.readFile(this.path, 'utf-8');
                this.products = JSON.parse(data);

                return this.products;
            } else {
                return "[Error]: No se ha encontrado un archivo con los productos cargados.";
            }
        } catch (error) {
            return error;
        }
    }

    getProductsById = async(productid) => {
        try {
            if(fs.existsSync(this.path)) {
                let data = await fs.promises.readFile(this.path, 'utf-8');
                this.products = JSON.parse(data);
                let product = this.products.find((prod) => prod.idx === productid);

                if(product) {
                    return product;
                } else {
                    return `[Error]: No se ha encontrado un producto con el ID: ${productid}`;
                }
            } else {
                return `[Error]: No se ha eencotnrado un archivo con los productos cargados.`;
            }
        } catch (error) {
            return error;
        }
    }

    deleteProductById = async (productid) => {
        try {   
            if(fs.existsSync(this.path)) {
                let data = await fs.promises.readFile(this.path, 'utf-8');
                this.products = JSON.parse(data);
                const index = this.products.findIndex(prod => prod.idx === productid);

                if(index > -1) {
                    this.products.splice(index, 1);
                } else {
                    console.log(`[Error]: No se ha encontrado un producto con el ID: ${productid}`);
                } 

                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
                console.log(`El producto ID: ${index} ha sido eliminado correctamente`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateProductById = async (product) => {
        try {
            if(fs.existsSync(this.path)) {
                let data = await fs.promises.readFile(this.path, 'utf-8');
                this.products = JSON.parse(data);
                let prod = this.products.find((prod) => prod.idx === product.idx);

                if(prod) {
                    let filter = this.products.filter((p) => p.idx !== product.idx);

                    if(filter) {
                        filter.push(product);
                        console.log(`Se ha actualizado el producto ID: ${product.idx}`);

                        await fs.promises.writeFile(this.path, JSON.stringify(filter));
                    } else {
                        console.log(`[Error]: No se ha encontrado un producto con el ID: ${product.idx}`);
                    }
                } else {
                    console.log(`[Error]: No se ha encontrado un producto con el ID: ${product.idx}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}