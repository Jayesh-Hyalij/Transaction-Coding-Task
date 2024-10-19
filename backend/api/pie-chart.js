// Pie Chart API
router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;

    try {
        const products = await Product.find({ dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } });
        const categoryCounts = {};

        products.forEach(product => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });

        const response = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pie chart data' });
    }
});
