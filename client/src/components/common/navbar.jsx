import ProfileCard from "./profile-card";
import NavLink from "./nav-link";
import LanguageSwitcher from "../../utils/languageswitcher";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import WordMark from "./word-mark";
import { Link } from "react-router-dom";

const Navbar = ({ links, withProfileCard, session, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="w-full flex flex-col px-2 sticky top-0 z-50 bg-white">
      <nav className="w-full flex justify-between items-center shadow-md min-h-[5rem]">
        <div className="w-[60%] flex justify-between items-center">
          <div className="w-[15rem]">
            <Link to={"/"}>
              <WordMark />
            </Link>
          </div>
          <div
            className={`hidden md:flex  md:flex-row md:justify-between md:items-center md:flex-1`}
          >
            {links?.map((link) => (
              <NavLink
                key={link.title} // Add a key for the list
                isComponent={link.isComponent}
                component={link.component}
                title={link.title}
                to={link.to}
              />
            ))}
          </div>
        </div>
        <div className="w-[40%] flex items-center justify-end gap-5">
          <div className="flex gap-5">
            {links?.length > 0 && (
              <button onClick={toggleMenu} className="md:hidden">
                {isOpen ? (
                  <FaTimes className="text-xl" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </button>
            )}
            <LanguageSwitcher />
          </div>
          <div>
            {withProfileCard && (
              <ProfileCard userData={session} logout={logout} />
            )}
          </div>
        </div>
      </nav>
      <div
        className={`max-h-[5rem] w-full flex justify-around items-center md:hidden ${
          !isOpen && `hidden`
        } bg-white p-2 border-b-slate-600 border-b`}
        style={{ zIndex: 200 }}
      >
        {links?.map((link) => (
          <NavLink
            key={link.title}
            isComponent={link.isComponent}
            component={link.component}
            title={link.title}
            to={link.to}
          />
        ))}
      </div>
    </div>
  );
};

export default Navbar;
