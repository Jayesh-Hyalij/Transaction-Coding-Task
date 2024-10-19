// Combined API
router.get('/combined', async (req, res) => {
    const { month } = req.query;

    try {
        const [statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:5000/api/products/statistics?month=${month}`),
            axios.get(`http://localhost:5000/api/products/bar-chart?month=${month}`),
            axios.get(`http://localhost:5000/api/products/pie-chart?month=${month}`)
        ]);

        res.status(200).json({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch combined data' });
    }
});
