const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(results => {
        res.status(200).json({
            count: results.length,
            orders: results.map( result => {
                return {
                    _id: result.id,
                    product: result.product,
                    request: {
                        type: 'GET',
                        url: 'localhost:3000/orders/' + result._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product){
            return res.status(400).json({
                message: 'product not found'
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
        return order.save();
    })
    .then(result => {
        res.status(201).json({
            message: 'Order is saved',
            createdOrder:{
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'localhost:3000/orders/' + result._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.orders_get_order_by_id = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order =>{
        if (!order){
            return res.status(404).json({
                message: 'order not found'
            })
        }
        res.status(200).json({
            order: order
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'cound not find the order',
            error: err
        });
    })
}

exports.orders_delete_order = (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Order deleted'
        })
    })
    .catch(err => {
        res.status(200).json({
            message: 'something went wrong and cound\'t delete the order'
        })
    })
}