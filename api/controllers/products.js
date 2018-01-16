const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product.find()
    .select('_id name price productImage')
    .exec()
    .then(docs =>{
        const response ={
            count: docs.length,
            products: docs.map(doc =>{
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/products/'+ doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err =>{
        res.status(500).json({
                error: err
        })
    })
}

exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id:  new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path.replace(/\\/, '/')
    })
    product.save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Product created',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/products/'+ result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.products_get_product_by_id = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price productImage price')
    .exec()
    .then(doc => {
        if (doc){
            res.status(200).json(doc);
        } else{
            res.status(404).json({ message: 'no product found'});
        }  
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
}

exports.products_patch_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {}
    for  (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps})
    .exec()
    .then( result => {
        res.status(200).json({
            //result: result,
            message: 'Product updated',
            request:{
                type: 'GET',
                url: 'http://localhost:3000/products/'+ result._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            response: result,
            message: 'Product deleted'
        })
    })
    .catch(err => {
        res.status(500).json({ error: err})
    })
}