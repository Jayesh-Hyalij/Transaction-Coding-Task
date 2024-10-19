const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product'); // Make sure to adjust the path based on your project structure

// Get statistics for a specific month
router.get('/statistics', async (req, res) => {
    const month = req.query.month;
    try {
        const totalSaleAmount = await Product.aggregate([
            {
                $match: {
                    sold: true,
                    date: {
                        $gte: new Date(`2024-${month}-01`),
                        $lt: new Date(`2024-${month + 1}-01`),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalSaleAmount: { $sum: '$price' },
                    totalSoldItems: { $sum: 1 },
                    totalNotSoldItems: {
                        $sum: {
                            $cond: [{ $eq: ['$sold', false] }, 1, 0],
                        },
                    },
                },
            },
        ]);

        res.json({
            totalSaleAmount: totalSaleAmount[0]?.totalSaleAmount || 0,
            totalSoldItems: totalSaleAmount[0]?.totalSoldItems || 0,
            totalNotSoldItems: totalSaleAmount[0]?.totalNotSoldItems || 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get data for bar chart
router.get('/bar-chart', async (req, res) => {
    const month = req.query.month;
    try {
        const barChartData = await Product.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(`2024-${month}-01`),
                        $lt: new Date(`2024-${month + 1}-01`),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $lte: ['$price', 50] },
                            '0-50',
                            { $cond: [{ $lte: ['$price', 100] }, '50-100', { $cond: [{ $lte: ['$price', 150] }, '100-150', '150+'] }] },
                        ],
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        const labels = ['0-50', '50-100', '100-150', '150+'];
        const data = labels.map((label) => {
            const item = barChartData.find((b) => b._id === label);
            return item ? item.count : 0;
        });

        res.json({ labels, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get data for pie chart
router.get('/pie-chart', async (req, res) => {
    const month = req.query.month;
    try {
        const pieChartData = await Product.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(`2024-${month}-01`),
                        $lt: new Date(`2024-${month + 1}-01`),
                    },
                },
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);

        const labels = pieChartData.map(item => item._id);
        const values = pieChartData.map(item => item.count);

        res.json({ labels, values });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
