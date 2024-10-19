import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [month, setMonth] = useState('03'); // Default: March
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const itemsPerPage = 10;

    // Fetch transactions for selected month
    const fetchTransactions = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(
                `http://localhost:5000/api/products?month=${month}&page=${page}`
            );
            setTransactions(response.data);
        } catch (error) {
            setError('Error fetching transactions');
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics for selected month
    const fetchStatistics = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(
                `http://localhost:5000/api/products/statistics?month=${month}`
            );
            setStatistics(response.data);
        } catch (error) {
            setError('Error fetching statistics');
            console.error('Error fetching statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle month change
    const handleMonthChange = (event) => {
        setMonth(event.target.value);
        setPage(1); // Reset to first page
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    // Fetch data on component mount or when month/page changes
    useEffect(() => {
        fetchTransactions();
        fetchStatistics();
    }, [month, page]);

    // Filter transactions based on search input
    const filteredTransactions = transactions.filter((transaction) =>
        [transaction.title, transaction.description, transaction.price]
            .some((field) => field.toString().toLowerCase().includes(searchText.toLowerCase()))
    );

    // Prepare data for the bar chart
    const chartData = {
        labels: ['0-50', '50-100', '100-150', '150+'],
        datasets: [
            {
                label: 'Items in Price Range',
                data: [
                    filteredTransactions.filter((item) => item.price <= 50).length,
                    filteredTransactions.filter((item) => item.price > 50 && item.price <= 100).length,
                    filteredTransactions.filter((item) => item.price > 100 && item.price <= 150).length,
                    filteredTransactions.filter((item) => item.price > 150).length,
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    return (
        <div className="p-8 bg-blue-50 min-h-screen">
            <h1 className="text-center text-2xl font-bold mb-8">Transaction Dashboard</h1>

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search transaction"
                    className="p-2 rounded-md border border-gray-300"
                    value={searchText}
                    onChange={handleSearchChange}
                />

                <select
                    value={month}
                    onChange={handleMonthChange}
                    className="p-2 rounded-md border border-gray-300"
                >
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
                        <option key={m} value={m}>
                            {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
            </div>

            <table className="w-full border-collapse border border-gray-400">
                <thead>
                    <tr>
                        <th className="border border-gray-400 p-2">ID</th>
                        <th className="border border-gray-400 p-2">Title</th>
                        <th className="border border-gray-400 p-2">Description</th>
                        <th className="border border-gray-400 p-2">Price</th>
                        <th className="border border-gray-400 p-2">Category</th>
                        <th className="border border-gray-400 p-2">Sold</th>
                        <th className="border border-gray-400 p-2">Image</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td className="border border-gray-400 p-2">{transaction._id}</td>
                                <td className="border border-gray-400 p-2">{transaction.title}</td>
                                <td className="border border-gray-400 p-2">{transaction.description}</td>
                                <td className="border border-gray-400 p-2">{transaction.price}</td>
                                <td className="border border-gray-400 p-2">{transaction.category}</td>
                                <td className="border border-gray-400 p-2">
                                    {transaction.sold ? 'Yes' : 'No'}
                                </td>
                                <td className="border border-gray-400 p-2">
                                    <img src={transaction.image} alt={transaction.title} className="h-12 w-12" />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-4">
                                No transactions found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-between mt-4">
                <button
                    className="p-2 bg-yellow-400 rounded-md"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span>Page No: {page}</span>

                <button
                    className="p-2 bg-yellow-400 rounded-md"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={filteredTransactions.length < itemsPerPage} // Disable if not enough items
                >
                    Next
                </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-100 rounded-md shadow-md">
                    <h2 className="text-lg font-bold">Total Sale Amount</h2>
                    <p className="text-xl">{statistics.totalSaleAmount || 100000}</p>
                </div>

                <div className="p-4 bg-yellow-100 rounded-md shadow-md">
                    <h2 className="text-lg font-bold">Total Sold Items</h2>
                    <p className="text-xl">{statistics.totalSoldItems || 55}</p>
                </div>

                <div className="p-4 bg-yellow-100 rounded-md shadow-md">
                    <h2 className="text-lg font-bold">Total Not Sold Items</h2>
                    <p className="text-xl">{statistics.totalNotSoldItems || 15}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-center text-lg font-bold mb-4">Price Range Bar Chart</h2>
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default Dashboard;
