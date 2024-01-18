require('dotenv').config();
const express = require('express');
const { initializeApp } = require('firebase/app'); // Fix: Import initializeApp from 'firebase/app'
const connection = require('./config/db');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const firebaseConfig = require('./config/firebase'); // Assuming you have a separate file for Firebase config
initializeApp(firebaseConfig);

const categoryRoute = require('./routes/categoryRoutes');
const requirementRoute = require('./routes/requirementRoutes');
const carRoute = require('./routes/carRoutes');
const auditreportRoute = require('./routes/auditreportRoutes');
const userRoute = require('./routes/userRoutes');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/category', categoryRoute);
app.use('/requirement', requirementRoute);
app.use('/car', carRoute);
app.use('/auditreport', auditreportRoute);
app.use('/user', userRoute);

app.listen(PORT, () => {
    connection();
    console.log(`app listening on port ${PORT}`);
});
