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
    const [roles, setRoles] = useState([]);




    useEffect(() => {
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

        console.log(orders.product)

        const fetchRoles = async () => {
            try {
                const token = await getToken();

                const { data } = await axios.get('/api/admin/role', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (data.success) {
                    setRoles(data.roles);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };


        fetchUsers();
        fetchProducts();
        fetchOrders();
        fetchRoles();
    }, []);

    useEffect(() => {
        if (users.length || products.length || orders.length || roles.length) {
            const artisanRoles = roles.filter(role => role.role === 'Seller');
            const artisanUserIds = artisanRoles.map(role => role.userId);
            const uniqueArtisans = users.filter(user => artisanUserIds.includes(user._id));

            setStats({
                totalUsers: users.length,
                totalArtisans: uniqueArtisans.length,
                totalProducts: products.length,
                totalOrders: orders.length
            });
        }
    }, [users, products, orders, roles]);

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
                                onClick={() => setActiveTab('roles')}
                                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'roles' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                            >
                                <FiSettings className="mr-3" />
                                Roles
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
                        {activeTab === 'roles' && 'Role Management'}
                        {activeTab === 'reports' && 'Reports & Analytics'}
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
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Orders</p>
                                                    <p className="text-3xl font-semibold mt-1">{stats.totalOrders}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                                    <FiUsers size={20} />
                                                </div>
                                            </div>
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
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users.map((user) => (
                                                    <tr key={user._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user._id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KSH{product.offerPrice}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.userId}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
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
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th> */}
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userId}</td>
                                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td> */}
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
                                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleEdit('order', order)}
                                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                            >
                                                                View
                                                            </button>
                                                        </td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Roles Tab */}
                            {activeTab === 'roles' && (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold">Role Management</h3>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {roles.map((role) => (
                                                    <tr key={role._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role._id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role._id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.role}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleDelete('role', role._id)}
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