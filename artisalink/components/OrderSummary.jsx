import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItems,
    setCartItems
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const taxAmount = Math.floor(getCartAmount() * 0.02);
  const totalAmount = getCartAmount() + taxAmount;
  const cartItemsArray = Object.keys(cartItems)
    .map(key => ({ product: key, quantity: cartItems[key] }))
    .filter(item => item.quantity > 0);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        const token = await getToken();
        const { data } = await axios.get('/api/user/get-address', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          setUserAddresses(data.addresses);
          setSelectedAddress(data.addresses[0] || null);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, [user, getToken]);

  const handlePayment = async () => {
    if (!selectedAddress) return toast.error("Please select a delivery address");
    if (!phoneNumber) return toast.error("Please enter your phone number");
    if (cartItemsArray.length === 0) return toast.error("Your cart is empty");

    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!formattedPhone) return toast.error("Invalid phone number format");

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const token = await getToken();

      const orderRes = await axios.post('/api/order/create', {
        address: selectedAddress._id,
        items: cartItemsArray,
        totalAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || "Order creation failed");
      }

      setCartItems({});
      toast.success("Payment request sent to your phone...");

      // Redirect to STK Push trigger page
      router.push(`/mpesa?phone=${formattedPhone}&amount=${totalAmount}`);
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error.message);
      toast.error(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
      return `254${digits.substring(1)}`;
    }
    if (digits.startsWith('254') && digits.length === 12) {
      return digits;
    }
    if (digits.length === 9) {
      return `254${digits}`;
    }
    return null;
  };

  const toggleAddressDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectAddress = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full md:w-96 bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Order Summary
      </h2>

      {/* Address Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Address
        </label>
        <div className="relative">
          <button
            onClick={toggleAddressDropdown}
            className="w-full flex justify-between items-center px-4 py-3 bg-white border rounded-md shadow-sm"
          >
            <span className="truncate">
              {selectedAddress
                ? `${selectedAddress.area}, ${selectedAddress.city}`
                : "Select address"}
            </span>
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {isDropdownOpen && (
            <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
              {userAddresses.map((address) => (
                <li
                  key={address._id}
                  onClick={() => selectAddress(address)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                >
                  {address.fullName}, {address.area}
                </li>
              ))}
              <li
                onClick={() => router.push("/add-address")}
                className="px-4 py-2 text-blue-600 hover:bg-gray-100 cursor-pointer text-center"
              >
                + Add New Address
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          M-Pesa Payment
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g. 0722000000"
          className="w-full px-4 py-3 border rounded-md shadow-sm"
        />
        {paymentError && (
          <p className="mt-2 text-sm text-red-600">{paymentError}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter your M-Pesa registered phone number
        </p>
      </div>

      {/* Order Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({getCartCount()})</span>
          <span>{currency}{getCartAmount()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (2%)</span>
          <span>{currency}{taxAmount}</span>
        </div>
        <div className="flex justify-between pt-3 border-t font-medium text-lg">
          <span>Total</span>
          <span>{currency}{totalAmount}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${isProcessing
          ? "bg-orange-400 cursor-not-allowed"
          : "bg-orange-600 hover:bg-orange-700"
          }`}
      >
        {isProcessing ? "Processing..." : `Pay ${currency}${totalAmount}`}
      </button>
    </div>
  );
};

export default OrderSummary;
