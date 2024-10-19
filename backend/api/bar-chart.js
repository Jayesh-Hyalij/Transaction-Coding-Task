// Bar Chart API
router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
    const ranges = [100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity];

    try {
        const products = await Product.find({ dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } });
        const rangeCounts = Array(ranges.length).fill(0);

        products.forEach(product => {
            const index = ranges.findIndex(range => product.price <= range);
            rangeCounts[index]++;
        });

        const response = ranges.map((range, i) => ({
            range: i === ranges.length - 1 ? '901-above' : `${ranges[i - 1] + 1 || 0}-${range}`,
            count: rangeCounts[i]
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bar chart data' });
    }
});
