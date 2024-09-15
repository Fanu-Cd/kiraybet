import { Flex } from "antd";
import { HomeIllustration } from "../../assets/icons/home-illustration";
import ProfileCard from "./profile-card";
import NavLink from "./nav-link";
import LanguageSwitcher from "../../utils/languageswitcher";

const Navbar = () => {
  const links = [
    { title: "", icon: <HomeIllustration />, isIcon: true ,to:'/'},
    { title: "My Houses", to: "/me/my-houses" },
    { title: "Rent", to: "/me/rent" },
    { title: "Mortgage", to: "/me/mortgage" },
  ];

  return (
    <nav className="min-h-[5rem] flex justify-between items-center shadow-md">
      <div className="w-[35%]">
        <Flex align="center" justify="space-between">
          {links.map((link) => (
            <NavLink isIcon={link.isIcon} icon={link.icon} title={link.title} to={link.to} />
          ))}
        </Flex>
      </div>
      <div className="w-[40%] flex items-center justify-end gap-3">
        <LanguageSwitcher />
        <ProfileCard />
      </div>
    </nav>
  );
};

export default Navbar;
