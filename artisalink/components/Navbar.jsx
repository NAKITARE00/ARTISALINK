"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, router } = useAppContext(); // Get userRole from context
  const { openSignIn } = useClerk();
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const checkUserRole = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`/api/user/role/${user.id}`);
          setUserRole(response.data);

        } catch (error) {
          toast.error(error.message);
        }
      }

    };
    checkUserRole();
  }, [user]);
  console.log(userRole?.role?.role);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {/* Show Seller Dashboard only if user has role "Seller" */}

        {userRole?.role?.role === 'Seller' && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        {
          user
            ? <>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
                </UserButton.MenuItems>
              </UserButton>
            </>
            : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>
        }
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {/* Show Seller Dashboard only if user has role "Seller" */}
        {userRole?.role?.role === 'Seller' && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        {
          user
            ? <>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push('/all-products')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
                </UserButton.MenuItems>
              </UserButton>
            </>
            : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>
        }
      </div>
    </nav>
  );
};

export default Navbar;
