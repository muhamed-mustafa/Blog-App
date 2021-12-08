const express  = require('express'),
      mongoose = require("mongoose"),
      bodyParser   = require("body-parser"),
      path         = require("path"),
      multer       = require('./middlewares/uploadFiles');

require("dotenv/config");

const app = express();

app.use(multer);
app.use(bodyParser.json());
app.use('/images' , express.static(path.join(__dirname, "images")));

app.use((req , res , next) =>
{
    res.setHeader('Access-Control-Allow-Origin' , '*');
    res.setHeader('Access-Control-Allow-Methods' , 'OPTIONS ,GET , POST , PATCH , PUT , DELETE');
    res.setHeader('Access-Control-Allow-Headers' , 'Content-Type , Authorization');
    next();
});

const postRoutes = require('./routes/post.route');
const authRoutes = require('./routes/auth.route');
app.use('/feed' , postRoutes);
app.use('/auth' , authRoutes);

mongoose
.connect(
    `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@${process.env.DBSERVER}/${process.env.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
.then(() => { console.log("Database Connection is ready...")})
.catch((e) => console.log("Error is : " + e));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("server is running http://localhost:3000"));

