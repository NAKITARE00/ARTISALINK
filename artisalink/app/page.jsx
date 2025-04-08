'use client'
import React, { useEffect, useState } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpdateRoleModal from "@/components/UpdateRoleModal";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const Home = () => {
  const { user } = useUser();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);


  useEffect(() => {
    const checkUserRole = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`/api/user/role/${user.id}`);

          // Success case - role exists
          if (response.data.success) {
            setUserRole(response.data);
          }
        } catch (error) {
          // 404 means no role exists (this is OK!)
          if (error.response?.status === 404) {
            setUserRole(null); // Triggers the modal
            setShowRoleModal(true);
          } else {
            console.error("Role check error:", error);
          }
        } finally {
          setLoadingRole(false);
        }
      }

    };

    checkUserRole();
  }, [user]);


  // if (loadingRole) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <UpdateRoleModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          user_id={user?.id}
        />
        {/* Optional manual trigger for testing/demo */}
        {process.env.NODE_ENV === 'development' && !userRole?.role && (
          <button
            onClick={() => setShowRoleModal(true)}
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded"
          >
            Set Role (Dev Only)
          </button>
        )}
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;