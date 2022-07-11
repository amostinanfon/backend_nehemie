const jwt = require("jsonwebtoken");


const verifyToken = async(req, res, next) => {
    const authHeader = req.headers.token;

    try {
        if (!authHeader) {
            res.status(401).json("Provide right token");
        }
            const token = authHeader.split(" ")[1]
        
        if(!token) {
            res.status(401).json("Correct token is required !!!");
        }
            jwt.verify(token, process.env.JWT_SEC, (err, user) =>{
                if (err) res.status(403).json(" Jeton Invalide!!!");
                req.user = user;
                next();
            })
        } catch (err){
        return res.status(401).json("Vous n'etes pas connecté !!!")
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () =>{

        if( req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else{
            res.status(403).json("Vous n'etes authorise a le faire")
        }
    }
    )
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () =>{

        if(req.user.isAdmin){
            next();
        } else{
            res.status(403).json("Vous n'etes pas Administrateur")
        }
    }
    )
}


module.exports = { 
        verifyToken, 
        verifyTokenAndAuthorization , 
        verifyTokenAndAdmin                       
    }