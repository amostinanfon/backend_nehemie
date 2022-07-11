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
const bodyParser = require ('body-parser');
const morgan = require('morgan');


const { createProxyMiddleware } = require('http-proxy-middleware');


dotenv.config();

//app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", 
    'Origin,X-Requested-With,Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });


mongoose.connect("mongodb+srv://nehemie:nehemie@cluster0.your6.mongodb.net/?retryWrites=true&w=majority")
        .then(() =>console.log(' connected to database !!!'))
        .catch(err => console.log(err));
 
app.use(express.json());
//app.use(cors({origin: ["http://localhost:5000/api/checkout/", "https://checkout.stripe.com"]}));


// app.use('/api', createProxyMiddleware({ target: 'https://sunset7.netlify.app', changeOrigin: true }));
// app.use('/api', createProxyMiddleware({ target: 'https://adminsun7.netlify.app', changeOrigin: true }));
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute); 
app.use('/api/products', productRoute); 
app.use('/api/carts', cartRoute); 
app.use('/api/orders', orderRoute); 
app.use('/api/checkout', stripeRoute); 


app.listen(process.env.PORT || 8080, () => {
    console.log("Backend server is running")
})