import { Flex } from "antd";
import ProfileCard from "./profile-card";
import NavLink from "./nav-link";
import LanguageSwitcher from "../../utils/languageswitcher";

const Navbar = ({ links, withProfileCard,session }) => {
  
  return (
    <nav className="min-h-[5rem] flex justify-between items-center shadow-md">
      <div className="w-[45%]">
        <Flex align="center" justify="space-between">
          {links.map((link) => (
            <NavLink
              isComponent={link.isComponent}
              component={link.component}
              title={link.title}
              to={link.to}
            />
          ))}
        </Flex>
      </div>
      <div className="w-[40%] flex items-center justify-end gap-3">
        <LanguageSwitcher />
        {withProfileCard && <ProfileCard userData={session} />}
      </div>
    </nav>
  );
};

export default Navbar;
