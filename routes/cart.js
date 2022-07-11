const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const Cart = require("../models/Cart");



// CREATE ..... METHODE DE CREATION DE CARTE

router.post("/", verifyToken , async(req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
        console.log(savedCart);
    }catch(err){
        res.status(500).json(err);
        console.log(err);
    }

})

// UPDATE  ::::::: mise à jour dess cartes
router.put("/:id", verifyTokenAndAuthorization, async(req, res) =>{

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set : req.body
        }, {new: true});

        res.status(200).json(updatedCart)
        console.log(updatedCart);
    } catch (err) {
        res.status(500).json(err)
        console.log(err);
    }
})

// // DELETE :::: SUPPRIMER UNE CARTE DANS L'API

router.delete("/:id", verifyTokenAndAuthorization, async(req,res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Carte supprimée . . .");
    }catch(err){
        res.status(500).json(err)
    }
})


// // // GET USER CART  ... AVOIR UNE CARTE PRECISE

router.get("/find/:userId", verifyTokenAndAuthorization , async(req,res) => {
    try {
        const cart =  await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
});


// // GET ALL USER CARTS ... AVOIR TOUTES LES CARTES UTILISATEURS

router.get("/", verifyTokenAndAdmin ,async(req,res) => {

    try {
        const carts = await Cart.find();
        return res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})




module.exports = router;