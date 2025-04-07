'use client'

import { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiDollarSign, FiActivity, FiSettings, FiLogOut, FiHome } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Router } from 'next/router';
import UpdateProductModal from '@/components/UpdateProductModal';

const Admin = () => {
    // State for active tab
    const [activeTab, setActiveTab] = useState('dashboard');
    // State for data
    const [users, setUsers] = useState([]);
    const { getToken } = useAppContext();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);



    useEffect(() => {
        setTimeout(() => {

            setStats({
                totalUsers: 124,
                totalArtisans: 42,
                totalProducts: 87,
                totalOrders: 215,
                revenue: 8450.75,
                monthlyGrowth: 12.5,
                popularCategories: [
                    { name: 'Home Decor', value: 35 },
                    { name: 'Jewelry', value: 28 },
                    { name: 'Art', value: 20 },
                    { name: 'Clothing', value: 15 },
                    { name: 'Other', value: 2 }
                ]
            });

            setIsLoading(false);
        }, 1000);

        const fetchUsers = async () => {
            try {
                const token = await getToken();

                const { data } = await axios.get('/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(data);

                if (data.success) {
                    setUsers(data.users);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                const token = await getToken();

                const { data } = await axios.get('/api/admin/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (data.success) {
                    setProducts(data.products);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false)
            }
        }

        const fetchOrders = async () => {
            try {
                const token = await getToken();

                const { data } = await axios.get('/api/admin/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (data.success) {
                    setOrders(data.orders);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers();
        fetchProducts();
        fetchOrders();
    }, []);

    // Chart data
    const orderData = [
        { name: 'Jan', orders: 12 },
        { name: 'Feb', orders: 19 },
        { name: 'Mar', orders: 15 },
        { name: 'Apr', orders: 22 },
        { name: 'May', orders: 18 },
        { name: 'Jun', orders: 25 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    // Handle delete actions
    const handleDelete = async (type, id) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                const token = await getToken();

                const { data } = await axios.delete('/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    data: { userId: id },
                });

                if (data.success) {
                    toast.success(`${type} deleted successfully`);
                    setUsers((prev) => prev.filter((u) => u._id !== id));
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const handleDeleteProduct = async (type, id) => {
        if (window.confirm(`Are you sure you want to delete this product?`)) {
            try {
                const token = await getToken();

                const { data } = await axios.delete('/api/admin/products', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    data: { productId: id },
                });

                if (data.success) {
                    toast.success(`${type} deleted successfully`);
                    setProducts((prev) => prev.filter((u) => u._id !== id));
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    // Handle edit actions
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-800 text-white">
                <div className="p-4 border-b border-indigo-700">
                    <h1 className="text-2xl font-bold">ArtisanHub Admin</h1>
                    <p className="text-sm text-indigo-200">Admin Dashboard</p>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                            >
                                <FiHome className="mr-3" />
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'users' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                            >
                                <FiUsers className="mr-3" />
                                Users
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'products' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                            >
                                <FiShoppingBag className="mr-3" />
                                Products
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'orders' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                            >
                                <FiDollarSign className="mr-3" />
                                Orders
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'reports' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                            >
                                <FiActivity className="mr-3" />
                                Reports & Analytics
                            </button>
                        </li>

                    </ul>
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-indigo-700">
                    <button className="flex items-center w-full p-3 rounded-lg hover:bg-indigo-700">
                        <FiLogOut className="mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 capitalize">
                        {activeTab === 'dashboard' && 'Dashboard'}
                        {activeTab === 'users' && 'User Management'}
                        {activeTab === 'products' && 'Product Management'}
                        {activeTab === 'orders' && 'Order Management'}
                        {activeTab === 'reports' && 'Reports & Analytics'}
                        {activeTab === 'logs' && 'System Logs'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                            AD
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Dashboard Tab */}
                            {activeTab === 'dashboard' && (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                                                    <p className="text-3xl font-semibold mt-1">{stats.totalUsers}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                                                    <FiUsers size={20} />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2"><span className="text-green-500">+{stats.monthlyGrowth}%</span> from last month</p>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Artisans</p>
                                                    <p className="text-3xl font-semibold mt-1">{stats.totalArtisans}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                                    <FiUsers size={20} />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2"><span className="text-green-500">+8.2%</span> from last month</p>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                                                    <p className="text-3xl font-semibold mt-1">{stats.totalProducts}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                                    <FiShoppingBag size={20} />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2"><span className="text-green-500">+5.7%</span> from last month</p>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                                    <p className="text-3xl font-semibold mt-1">${stats.revenue}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                                                    <FiDollarSign size={20} />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2"><span className="text-green-500">+15.3%</span> from last month</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-semibold mb-4">Monthly Orders</h3>
                                            <div className="h-64">
                                                <BarChart width={500} height={300} data={orderData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="orders" fill="#8884d8" />
                                                </BarChart>
                                            </div>
                                        </div>

                                        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
                                            <div className="h-64 flex justify-center">
                                                <PieChart width={400} height={300}>
                                                    <Pie
                                                        data={stats.popularCategories}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {stats.popularCategories.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </div>
                                        </div> */}
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {orders.slice(0, 5).map((order) => (
                                                        <tr key={order._id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.amount}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold">User Management</h3>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users.map((user) => (
                                                    <tr key={user._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user._id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleEdit('user', user)}
                                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete('user', user._id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Products Tab */}
                            {activeTab === 'products' && (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold">Product Management</h3>
                                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                                            Add New Product
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artisan</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {products.map((product) => (
                                                    <tr key={product._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product._id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KSH{product.price}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.artisan}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct('product', product._id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold">Order Management</h3>
                                        <div className="flex space-x-2">
                                            <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option>All Status</option>
                                                <option>Pending</option>
                                                <option>Processing</option>
                                                <option>Shipped</option>
                                                <option>Completed</option>
                                                <option>Cancelled</option>
                                            </select>
                                            <input
                                                type="date"
                                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KSH{order.amount}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleEdit('order', order)}
                                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Reports Tab */}
                            {activeTab === 'reports' && (
                                <div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                                        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                                        <div className="h-80">
                                            <BarChart width={800} height={300} data={orderData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                                            </BarChart>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
                                            <div className="h-64">
                                                <PieChart width={400} height={300}>
                                                    <Pie
                                                        data={stats.popularCategories}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {stats.popularCategories.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                                            <div className="space-y-4">
                                                {products.slice(0, 5).map((product, index) => (
                                                    <div key={product._id} className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                                            <span className="text-gray-600 font-medium">{index + 1}</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-medium">{product.name}</h4>
                                                            <p className="text-xs text-gray-500">{product.category}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold">KSH{product.price}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                        </>
                    )}
                </main>
            </div>
            <UpdateProductModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}  // Close modal on cancel
                product={selectedProduct}  // Pass the selected product for editing
            />
        </div>
    );
}

export default Admin;