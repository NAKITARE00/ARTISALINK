'use client';
import React, { useState, useEffect } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateProductModal = ({ isOpen, onClose, product }) => {
    const { getToken } = useAppContext();

    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('WallArt');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    console.log(product)

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setCategory(product.category);
            setPrice(product.price);
            setOfferPrice(product.offerPrice);
            setFiles([]);
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('productId', product._id);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('offerPrice', offerPrice);

        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            const token = await getToken();
            const { data } = await axios.put('/api/product/add', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                toast.success(data.message);
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Update Product</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <p className="text-base font-medium">Product Image</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            {[...Array(4)].map((_, index) => (
                                <label key={index} htmlFor={`image${index}`}>
                                    <input
                                        onChange={(e) => {
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = e.target.files[0];
                                            setFiles(updatedFiles);
                                        }}
                                        type="file"
                                        id={`image${index}`}
                                        hidden
                                    />
                                    <Image
                                        className="max-w-24 cursor-pointer"
                                        src={
                                            files[index]
                                                ? URL.createObjectURL(files[index])
                                                : assets.upload_area
                                        }
                                        alt=""
                                        width={100}
                                        height={100}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-base font-medium" htmlFor="product-name">
                            Product Name
                        </label>
                        <input
                            id="product-name"
                            type="text"
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-base font-medium" htmlFor="product-description">
                            Product Description
                        </label>
                        <textarea
                            id="product-description"
                            rows={4}
                            className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-5 flex-wrap">
                        <div className="flex flex-col gap-1 w-32">
                            <label className="text-base font-medium" htmlFor="category">
                                Category
                            </label>
                            <select
                                id="category"
                                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="WallArt">WallArt</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Carpets">Carpets</option>
                                <option value="Artifacts">Artifacts</option>
                                <option value="Jewellery">Jewellery</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 w-32">
                            <label className="text-base font-medium" htmlFor="product-price">
                                Stock
                            </label>
                            <input
                                id="product-price"
                                type="number"
                                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-32">
                            <label className="text-base font-medium" htmlFor="offer-price">
                                Offer Price
                            </label>
                            <input
                                id="offer-price"
                                type="number"
                                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded border-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-orange-600 text-white font-medium rounded"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductModal;

