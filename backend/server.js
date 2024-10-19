const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const productRoutes = require('./routes/products');
const cors = require('cors');

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000; 
const PORT = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
}));

app.get('/api/products', (req, res) => {
    res.json([{ id: 1, title: 'Product A', price: 100, }]);
});

app.get('/api/products/statistics', (req, res) => {
    res.json({ totalProducts: 100, SoldProducts: 60 });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});