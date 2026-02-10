"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { menuData } from "./menuData";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import {
  SearchIcon,
  CartIcon,
  MenuIcon,
  CloseIcon,
} from "./icons";
import GlobalSearchModal from "../Common/GlobalSearch";
import { HeaderSetting } from "@prisma/client";
import { useAppSelector } from "@/redux/store";

type IProps = {
  headerData?: HeaderSetting | null;
};

const MainHeader = ({ headerData }: IProps) => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const { data: session } = useSession();
  const { handleCartClick, cartCount, totalPrice } = useCart();


  const handleOpenCartModal = () => {
    handleCartClick();
  };

  // Fetch Menu Data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menu");
        if (res.ok) {
          const data = await res.json();
          // Map DB structure to MenuItem structure
          const formattedMenu = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            path: item.path ? (item.path.startsWith('/') ? item.path : `/${item.path}`) : "/",
            submenu: item.children?.length > 0 ? item.children.map((child: any) => ({
              id: child.id,
              title: child.title,
              path: child.path ? (child.path.startsWith('/') ? child.path : `/${child.path}`) : "/",
            })) : undefined
          }));
          setMenuItems(formattedMenu);
        }
      } catch (error) {
        console.error("Failed to fetch menu", error);
        // Fallback or leave empty? For now leave empty or use static as initial state if critical
      }
    };
    fetchMenu();
  }, []);

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setNavigationOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 bg-white top-0 w-full z-50 transition-all  ease-in-out duration-300 ${stickyMenu && "shadow-sm"
          }`}
      >


        {/* Main Header */}
        <div className="px-4 mx-auto max-w-7xl sm:px-6 xl:px-0 b ">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div>
              <Link className="block shrink-0" href="/">
                <Image
                  src={headerData?.headerLogo || "/images/logo/logo.svg"}
                  alt="Logo"
                  width={136}
                  height={33}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Menu - Hidden on mobile */}
            <div className="hidden xl:block">
              <DesktopMenu menuData={menuItems.length > 0 ? menuItems : menuData} stickyMenu={stickyMenu} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                className="transition hover:text-blue focus:outline-none"
                onClick={() => setSearchModalOpen(true)}
                aria-label="Tìm kiếm"
              >
                <SearchIcon />
              </button>





              <button
                className="relative text-gray-700 transition hover:text-blue focus:outline-none"
                onClick={handleOpenCartModal}
                aria-label="Giỏ hàng"
              >
                <CartIcon />
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] text-white bg-red-600 text-[10px] font-normal rounded-full inline-flex items-center justify-center">
                  {cartCount || 0}
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="transition xl:hidden focus:outline-none"
                onClick={() => setNavigationOpen(!navigationOpen)}
                aria-label={navigationOpen ? "Đóng menu" : "Mở menu"}
              >
                {navigationOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header >

      {/* Mobile Menu - Offcanvas */}

      < MobileMenu
        headerLogo={headerData?.headerLogo || null
        }
        isOpen={navigationOpen}
        onClose={() => setNavigationOpen(false)}
        menuData={menuItems.length > 0 ? menuItems : menuData}
      />

      {/* Search Modal Placeholder */}
      {
        searchModalOpen && (
          <GlobalSearchModal
            searchModalOpen={searchModalOpen}
            setSearchModalOpen={setSearchModalOpen}
          />
        )
      }
    </>
  );
};

export default MainHeader;
