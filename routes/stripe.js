const router = require("express").Router();
//const stripe = require("stripe")(process.env.STRIPE_KEY);
const stripe = require("stripe")("sk_test_51KqbC1Iy4HUE4XIxv7bXpih22K38rePEfcrFM0fjm588yhqIKvsmbLMZfkkr71mlyWcl4qSB4FAtBfJHbLd708zW00Hqzu8Ell");


router.post("/payment", (req,res) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(500).json(stripeErr);
                console.log(stripeErr)
            }else {
                res.status(200).json(stripeRes);
            }
        }
    )
})

module.exports = router