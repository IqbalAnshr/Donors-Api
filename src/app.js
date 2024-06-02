const express = require("express");
const dotenv = require("dotenv");
const route = require("./routes");
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

const swaggerFilePath = path.join(__dirname, './docs/donorDoc.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());

app.use('/profilePictures', express.static('uploads/profile_pictures')); 

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/api', route);

app.listen(PORT, () => { 
    console.log(`Server is running on the port: ${PORT}`); 
});