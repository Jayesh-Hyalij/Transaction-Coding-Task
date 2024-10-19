// Statistics API
router.get('/statistics', async (req, res) => {
    const { month } = req.query;

    try {
        const products = await Product.find({ dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } });

        const totalSaleAmount = products.reduce((sum, product) => sum + product.price, 0);
        const totalSoldItems = products.filter(product => product.sold).length;
        const totalNotSoldItems = products.length - totalSoldItems;

        res.status(200).json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});
