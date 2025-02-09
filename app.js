const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const indexRouter = require('./routes/index');
const accountRouter = require('./routes/accountRouter');
const expressSession = require('express-session');
const flash = require('connect-flash');

require("dotenv").config();

const db = require('./config/mongoose-connection');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRSS_SESSION_SECRET,
    })
);
app.use(flash());
app.set(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/account', accountRouter);
app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, ()=>{
    console.log("App is Running");
})