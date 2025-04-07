'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useState, useMemo } from "react";

const AllProducts = () => {
    const { products } = useAppContext();
    const [sortOption, setSortOption] = useState('default');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Categories list
    const categories = [
        'All',
        'WallArt',
        'Furniture',
        'Carpets',
        'Artifacts',
        'Jewellery'
    ];

    // Sorting, filtering, and searching logic
    const sortedAndFilteredProducts = useMemo(() => {
        let processedProducts = [...products];

        // Search filtering
        if (searchQuery.trim() !== '') {
            processedProducts = processedProducts.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filtering
        if (selectedCategory !== 'All') {
            processedProducts = processedProducts.filter(
                product => product.category === selectedCategory
            );
        }

        // Sorting
        switch (sortOption) {
            case 'priceAsc':
                return processedProducts.sort((a, b) => a.price - b.price);
            case 'priceDesc':
                return processedProducts.sort((a, b) => b.price - a.price);
            case 'nameAsc':
                return processedProducts.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            case 'nameDesc':
                return processedProducts.sort((a, b) =>
                    b.name.localeCompare(a.name)
                );
            default:
                return processedProducts;
        }
    }, [products, sortOption, selectedCategory, searchQuery]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12 w-full">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <p className="text-2xl font-medium">All products</p>
                            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                        </div>
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Filtering and Sorting Controls */}
                <div className="w-full flex justify-between items-center my-6">
                    {/* Category Selector */}
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1 rounded-full text-sm 
                                    ${selectedCategory === category
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-200 text-gray-700'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm"
                    >
                        <option value="default">Default Sorting</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="nameAsc">Name: A to Z</option>
                        <option value="nameDesc">Name: Z to A</option>
                    </select>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
                    {sortedAndFilteredProducts.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>

                {/* No Products Message */}
                {sortedAndFilteredProducts.length === 0 && (
                    <div className="w-full text-center py-10 text-gray-500">
                        No products found matching your search or filter.
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;