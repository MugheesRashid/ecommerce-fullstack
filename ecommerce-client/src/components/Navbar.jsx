import React, { useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  UserRound,
  Heart,
  ShoppingCart,
  TextAlignJustify,
  HomeIcon,
  Logs,
  Store,
  Globe,
  Headset,
  Building2,
  XIcon,
  LogOut,
} from "lucide-react";
import { UserContextData } from "../assets/context/UserContext";

const countries = [
  { name: "Germany", flag: "/flags/DE@2x.png" },
  { name: "Canada", flag: "/flags/CN@2x.png" },
  { name: "France", flag: "/flags/FR@2x.png" },
];

function CountryDropdown({ defaultLabel = "Select a country" }) {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`rounded-lg p-3 flex items-center justify-between cursor-pointer text-[13px] w-${
          defaultLabel.length > 10 ? 40 : 32
        }`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span className="flex flex-row gap-1 items-center justify-center">
            {selected ? defaultLabel + " " : defaultLabel}
          </span>
          {selected && (
            <img src={selected.flag} alt={selected.name} className="w-5 h-4" />
          )}
        </div>
        {open ? (
          <img
            src="/control/Vector2.png"
            alt="Arrow Up"
            className="w-2.5 h-1.5 ml-4"
          />
        ) : (
          <img
            src="/control/Vector.png"
            alt="Arrow Down"
            className="w-2.5 h-1.5 ml-4"
          />
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full rounded-lg bg-white shadow-lg z-20">
          {countries.map((country) => (
            <div
              key={country.name}
              className="flex text-[13px] flex-row items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelected(country);
                setOpen(false);
              }}
            >
              <span>{defaultLabel}</span>
              <img src={country.flag} alt={country.name} className="w-5 h-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, clearUser } = useContext(UserContextData);

  const categories = [
    "All Category",
    "Electronics",
    "Clothing",
    "Accessories",
    "Books",
    "Furniture",
  ];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
    }
  };

  // Handle category filter
  const handleCategoryClick = (category) => {
    const categoryName = category === "All Category" ? "" : category.toLowerCase();
    if (categoryName) {
      navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    } else {
      navigate("/products");
    }
    setMobileOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    clearUser();
    navigate("/");
    setMobileOpen(false);
  };

  // Handle profile click
  const handleProfileClick = () => {
    navigate("/user");
    setMobileOpen(false);
  };

  // Handle cart click
  const handleCartClick = () => {
    navigate("/cart");
    setMobileOpen(false);
  };

  // Handle wishlist click
  const handleWishlistClick = () => {
    navigate("/user");
    setMobileOpen(false);
  };

  // Handle login click
  const handleLoginClick = () => {
    navigate("/auth/login");
    setMobileOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <div className="navbar border-b border-solid border-[#e0e0e0] flex flex-col md:flex-row items-center justify-between md:px-10 pt-3 pb-2 md:pb-5 text-[#1C1C1C]">
        {/* Logo and Mobile Menu */}
        <div className="top text-blue text-3xl font-bold flex flex-row md:items-center w-full justify-between px-5 md:p-0 md:w-auto md:justify-center md:gap-2">
          <div className="flex flex-row gap-2 items-center cursor-pointer" onClick={() => navigate("/")}>
            <TextAlignJustify
              className="flex md:hidden"
              height={24}
              width={24}
              onClick={(e) => {
                e.stopPropagation();
                setMobileOpen(!mobileOpen);
              }}
            />
            <img src="./logo.png" alt="Logo" />
          </div>

          {/* Mobile Icons */}
          <div className="mobile_others md:hidden flex flex-row items-center gap-6 text-[12px] text-[#8B96A5FF]">
            {user ? (
              <>
                <div
                  className="wishlist flex flex-col items-center gap-0.5 cursor-pointer"
                  onClick={handleWishlistClick}
                >
                  <Heart
                    color="rgba(0, 0, 0, 1)"
                    height={24}
                    width={24}
                  />
                </div>
                <div
                  className="cart flex flex-col items-center gap-0.5 cursor-pointer"
                  onClick={handleCartClick}
                >
                  <ShoppingCart
                    color="rgba(0, 0, 0, 1)"
                    height={24}
                    width={24}
                  />
                </div>
              </>
            ) : (
              <div
                className="login flex flex-col items-center gap-0.5 cursor-pointer"
                onClick={handleLoginClick}
              >
                <UserRound color="rgba(0, 0, 0, 1)" height={24} width={24} />
                <span className="text-[10px]">Login</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="input hidden border-2 border-solid border-blue-500 rounded-lg h-10 w-1/2 md:flex flex-row items-center gap-0"
        >
          <input
            className="h-full border-none outline-0 w-3/5 px-4"
            placeholder="Search products..."
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <select
            className="h-full w-[25%] text-[#8B96A5FF] px-3 border-l border-solid border-blue-500 text-[14px] font-semibold"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="books">Books</option>
            <option value="furniture">Furniture</option>
          </select>
          <button
            type="submit"
            className="h-full w-[15%] bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {/* Desktop Navigation Icons */}
        <div className="others hidden md:flex flex-row items-center gap-6 text-[12px] text-[#8B96A5FF]">
          {user ? (
            <>
              <div
                className="profile flex flex-col items-center gap-0.5 cursor-pointer hover:text-blue-500"
                onClick={handleProfileClick}
              >
                <UserRound
                  fill="rgba(139, 150, 165, 1)"
                  color="rgba(139, 150, 165, 1)"
                  height={21}
                  width={21}
                />
                <p>Profile</p>
              </div>

              <div
                className="wishlist flex flex-col items-center gap-0.5 cursor-pointer hover:text-blue-500"
                onClick={handleWishlistClick}
              >
                <Heart
                  fill="rgba(139, 150, 165, 1)"
                  color="rgba(139, 150, 165, 1)"
                  height={21}
                  width={21}
                />
                <p>Wishlist</p>
              </div>

              <div
                className="cart flex flex-col items-center gap-0.5 cursor-pointer hover:text-blue-500"
                onClick={handleCartClick}
              >
                <ShoppingCart
                  fill="rgba(139, 150, 165, 1)"
                  color="rgba(139, 150, 165, 1)"
                  height={21}
                  width={21}
                />
                <p>My Cart</p>
              </div>

              <div
                className="logout flex flex-col items-center gap-0.5 cursor-pointer hover:text-red-500"
                onClick={handleLogout}
              >
                <LogOut
                  color="rgba(139, 150, 165, 1)"
                  height={21}
                  width={21}
                />
                <p>Logout</p>
              </div>
            </>
          ) : (
            <div
              className="login flex flex-col items-center gap-0.5 cursor-pointer hover:text-blue-500"
              onClick={handleLoginClick}
            >
              <UserRound
                fill="rgba(139, 150, 165, 1)"
                color="rgba(139, 150, 165, 1)"
                height={21}
                width={21}
              />
              <p>Login</p>
            </div>
          )}
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mobile_input w-full md:hidden px-5 mt-2"
        >
          <input
            className="h-full bg-[#F7FAFC] py-3 outline-0 w-full px-4 border border-solid border-zinc-500 rounded-lg"
            placeholder="🔍 Search products..."
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {/* Mobile Categories */}
        <div className="mobile_category pl-5 mt-5 flex flex-row gap-3 whitespace-nowrap w-full overflow-auto md:hidden pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-2 py-2 rounded-lg text-blue-600 ${
                selectedCategory === category.toLowerCase()
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Category Bar */}
      <div className="further hidden md:flex flex-row justify-around py-1 items-center border-b border-solid border-[#e0e0e0] text-[#1C1C1C]">
        <div className="left flex flex-row justify-center items-center gap-4 font-medium text-[13px]">
          <div className="flex flex-row cursor-pointer hover:text-blue-500">
            <TextAlignJustify
              className="mt-1 mr-1"
              height={15}
              width={15}
            />
            <span>Category</span>
          </div>
          {[
            "Hot Deals",
            "Flash Sales",
            "Top 100 Offers",
            "New Arrivals",
          ].map((item, index) => (
            <p key={index} className="cursor-pointer hover:text-blue-500">
              {item}
            </p>
          ))}
          <select className="w-15 cursor-pointer hover:text-blue-500" name="" id="">
            <option value="help">Help</option>
            <option value="contact">Contact</option>
            <option value="faq">FAQ</option>
          </select>
        </div>
        <div className="right flex flex-row justify-center items-center gap-4 font-medium text-[15px]">
          <CountryDropdown defaultLabel="Ship to" />
          <CountryDropdown defaultLabel="Select a country" />
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        style={{ left: `${mobileOpen ? "0" : "-100%"}` }}
        className="mobile transition-all linear duration-300 text-[18px] w-[80vw] h-screen fixed top-0 left-0 border-b border-solid border-[#e0e0e0] flex flex-col justify-start items-left gap-5 text-[#1C1C1C] bg-[#fff] z-50"
      >
        <XIcon
          onClick={() => setMobileOpen(!mobileOpen)}
          className="absolute top-5 right-5 cursor-pointer"
          height={24}
          width={24}
        />

        {/* User Info Section */}
        <div className="top flex flex-col justify-start items-left gap-2 p-5 bg-[#EFF2F4]">
          {user ? (
            <>
              <img
                className="w-12 h-12 rounded-full"
                src={user.profileImage || "./ppf.webp"}
                alt="Profile"
              />
              <div className="flex flex-col">
                <p className="font-semibold">{user.fullname}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </>
          ) : (
            <div className="flex flex-row gap-2">
              <button
                onClick={handleLoginClick}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/auth/register");
                  setMobileOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-black rounded"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="post_center p-5 flex flex-col justify-center items-start gap-3 border-b border-solid border-[#e0e0e0]">
          <p
            className="flex items-center justify-center gap-3 cursor-pointer hover:text-blue-500"
            onClick={() => {
              navigate("/");
              setMobileOpen(false);
            }}
          >
            <HomeIcon color="rgba(139, 150, 165, 1)" /> Home
          </p>
          <p
            className="flex items-center justify-center gap-3 cursor-pointer hover:text-blue-500"
            onClick={() => {
              navigate("/products");
              setMobileOpen(false);
            }}
          >
            <Logs color="rgba(139, 150, 165, 1)" /> Products
          </p>
          {user && (
            <>
              <p
                className="flex items-center justify-center gap-3 cursor-pointer hover:text-blue-500"
                onClick={handleWishlistClick}
              >
                <Heart color="rgba(139, 150, 165, 1)" /> Wishlist
              </p>
              <p
                className="flex items-center justify-center gap-3 cursor-pointer hover:text-blue-500"
                onClick={handleCartClick}
              >
                <ShoppingCart color="rgba(139, 150, 165, 1)" /> My Cart
              </p>
              <p
                className="flex items-center justify-center gap-3 cursor-pointer hover:text-blue-500"
                onClick={handleProfileClick}
              >
                <Store color="rgba(139, 150, 165, 1)" /> My Account
              </p>
            </>
          )}
        </div>

        {/* Additional Links */}
        <div className="post_center p-5 flex flex-col justify-center items-start gap-3 border-b border-solid border-[#e0e0e0]">
          <p className="flex items-center justify-center gap-3 cursor-pointer hover:text-blue-500">
            <Globe color="rgba(139, 150, 165, 1)" />
            English | USD
          </p>
          <p className="flex items-center justify-center gap-3 cursor-pointer hover:text-blue-500">
            <Headset color="rgba(139, 150, 165, 1)" />
            Contact us
          </p>
          <p className="flex items-center justify-center gap-3 cursor-pointer hover:text-blue-500">
            <Building2 color="rgba(139, 150, 165, 1)" />
            About Us
          </p>
        </div>

        {/* Footer Links */}
        <div className="bottom p-5 flex flex-col justify-center items-start gap-3">
          <p className="cursor-pointer hover:text-blue-500">User Agreement</p>
          <p className="cursor-pointer hover:text-blue-500">Partnership</p>
          <p className="cursor-pointer hover:text-blue-500">Privacy Policy</p>
        </div>

        {/* Logout Button */}
        {user && (
          <div className="p-5 border-t border-solid border-[#e0e0e0]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <LogOut height={18} width={18} /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
