const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');


dotenv.config();

app.use(cors());


mongoose.connect("mongodb+srv://nehemie:nehemie@cluster0.your6.mongodb.net/?retryWrites=true&w=majority")
        .then(() =>console.log(' connected to database !!!'))
        .catch(err => console.log(err));
 
app.use(express.json());
//app.use(cors({origin: ["http://localhost:5000/api/checkout/", "https://checkout.stripe.com"]}));

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute); 
app.use('/api/products', productRoute); 
app.use('/api/carts', cartRoute); 
app.use('/api/orders', orderRoute); 
app.use('/api/checkout', stripeRoute); 


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running")
})