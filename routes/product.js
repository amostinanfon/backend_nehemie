const router = require("express").Router();


const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const CryptoJS = require("crypto-js");
//const { json } = require("express");


// CREATE ..... METHODE DE CREATION DE PRODUIT

router.post("/", verifyTokenAndAdmin, async(req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
        console.log(savedProduct);
    }catch(err){
        res.status(500).json(err);
        console.log(err);
    }

})

// UPDATE  ::::::: mise à jour
router.put("/:id", verifyTokenAndAuthorization, async(req, res) =>{

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set : req.body
        }, {new: true});

        res.status(200).json(updatedProduct)
        console.log(updatedProduct);
    } catch (err) {
        res.status(500).json(err)
        console.log(err);
    }
})

// DELETE :::: SUPPRIMER UN ELEMENT DANS L'API

router.delete("/:id", verifyTokenAndAdmin, async(req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Produit supprimé . . .");
    }catch(err){
        res.status(500).json(err)
    }
})


// // GET PRODUCT ... AVOIR UN PRODUIT PRECIS

router.get("/find/:id",  async(req,res) => {
    try {
        const product =  await Product.findById(req.params.id);
        const { password , ...others} = product._doc;

        res.status(200).json(others)
    }catch(err){
        res.status(500).json(err)
    }
});


// GET ALL USER ... AVOIR TOUS LES UTILISATEURS

router.get("/", async(req,res, next) => {

   // RETOURNER UN NOMBRE PRECIS D'UTILISATEURS
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;

        if (qNew){
            const products = await Product.find().sort({createdAt: -1}).limit(1);
            res.status(200).json(products)
            console.log(products);
        } else if(qCategory){
            products = await Product.find({categories : {
                $in: [qCategory]
            }})
            res.status(200).json(products);

        } else {
            products = await Product.find();
            res.status(200).json(products);

        }
    }catch(err){
        res.status(500).json(err)
        console.log(err)
    }
    next();
})


module.exports = router