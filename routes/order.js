const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const Order = require("../models/Order");



// CREATE ..... METHODE DE CREATION DE Cartes

router.post("/", verifyToken , async(req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder= await newOrder.save();
        res.status(200).json(newOrder);
        console.log(newOrder);
    }catch(err){
        res.status(500).json(err);
        console.log(err);
    }

})

// UPDATE  ::::::: mise à jour dess cartes
router.put("/:id", verifyTokenAndAuthorization, async(req, res) =>{

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set : req.body
        }, {new: true});

        res.status(200).json(updatedOrder)
        console.log(updatedOrder);
    } catch (err) {
        res.status(500).json(err)
        console.log(err);
    }
})

// // DELETE :::: SUPPRIMER UNE CARTE DANS L'API

router.delete("/:id", verifyTokenAndAdmin , async(req,res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Ordre supprimée . . .");
    }catch(err){
        res.status(500).json(err)
    }
})


// // // GET USER Order  ... AVOIR UN ORDRE PRECIS

router.get("/find/:userId", verifyTokenAndAuthorization , async(req,res) => {
    try {
        const cart =  await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
});


// GET ALL USER CARTS ... AVOIR TOUTES LES CARTES DES UTILISATEURS

router.get("/", verifyTokenAndAdmin ,async(req,res) => {

    try {
        const orders = await Order.find();
        return res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})


// GET MONTHLY INCOME 
router.get("/income", verifyTokenAndAdmin, async(req, res) =>{

    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));

    try{
        const income = await Order.aggregate([
            { 
                    $match: { 
                            createdAt: { $gte: previousMonth },
                            ...( productId && {
                                products: { $elemMatch : { productId }},
                            }),
            } ,
        },
            {
                    $project:{ 
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
               {
                   $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                }
            }
        ]);
    res.status(200).json(income);
    }catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});



module.exports = router;