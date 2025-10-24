import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function NavbarPage() {
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchValue, setSearchValue } = useAuth();

  const handleSearchoption = () => {
    setIsSearch(false);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value !== "") {
      navigate(`/movies-app/movies-search?search=${e.target.value}`, {
        replace: true,
      });
    } else {
      navigate("/", { replace: true });
      setSearchValue("");
    }
  };

  const handleAccount = () => {
    navigate("/account", { replace: true });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-gradient-to-b from-black/100 to-transparent py-3 sm:py-4 px-3 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Left - Logo + Links */}
        <div className="flex items-center gap-3 sm:gap-6">
          <img
            className="w-24 sm:w-28 md:w-32 cursor-pointer"
            src="https://res.cloudinary.com/dcttatiuj/image/upload/v1756137061/Group_7399_l7pcod.png"
            alt="logo"
            onClick={() => navigate("/home")}
          />

          {/* Desktop Links */}
          <ul className="hidden sm:flex gap-4 md:gap-6 text-white font-medium">
            <Link to="/home" className="hover:text-gray-300">
              <li>Home</li>
            </Link>
            <Link to="/popular" className="hover:text-gray-300">
              <li>Popular</li>
            </Link>
          </ul>
        </div>

        {/* Right - Search + Avatar/Menu */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Search */}
          {isSearch ? (
            <FaSearch
              onClick={handleSearchoption}
              className="text-white cursor-pointer"
              size={20}
            />
          ) : (
            <div className="flex items-center gap-1 w-[70vw] xs:w-[65vw] sm:w-auto max-w-[520px]">
              <input
                type="text"
                value={searchValue}
                placeholder="Search..."
                onChange={handleInputChange}
                className="w-full sm:w-64 md:w-72 lg:w-80 bg-black/70 text-white border border-white/70 rounded-sm py-1.5 px-3 outline-none placeholder:text-white/70"
              />
              <button onClick={() => setIsSearch(true)} className="text-white text-sm px-1">
                ✕
              </button>
            </div>
          )}

          {/* Avatar (Desktop only) */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User"
            onClick={handleAccount}
            className="hidden sm:block w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/70 cursor-pointer"
          />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white text-xl sm:hidden w-8 h-8 grid place-items-center"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="fixed top-14 left-0 w-full z-30 bg-black/95 backdrop-blur text-white flex flex-col items-start py-4 px-5 sm:hidden">
          <Link
            to="/home"
            className="w-full py-2 hover:text-gray-300 text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/popular"
            className="w-full py-2 hover:text-gray-300 text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Popular
          </Link>
          {/* Account inside mobile menu */}
          <button
            onClick={() => {
              handleAccount();
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 py-2 hover:text-gray-300 text-left"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <span>Account</span>
          </button>
        </div>
      )}
    </>
  );
}

export default NavbarPage;
