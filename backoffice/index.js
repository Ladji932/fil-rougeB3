const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const route = require('./routes/routes');
const cors = require('cors');


const app = express();
const PORT = 3002;
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/fil-rouge')
.then(() => console.log("connected"))
.catch(err => console.log("MongoDB connection error:", err));

app.use(express.json());
app.use(cors());


app.use('/api', route); 

app.listen(PORT, (err) => {
    if (err) {
        console.log("Error in server setup", err);
    } else {
        console.log("Server listening on Port", PORT);
    }
});
