import { Typography } from "antd";
import { NavLink as RouterLink } from "react-router-dom";
const { Text } = Typography;

const NavLink = ({ isComponent, component, title, to }) => {
  return (
    <div>
      {isComponent ? (
        <RouterLink to={to}>{component}</RouterLink>
      ) : (
        <RouterLink
          to={to}
          className={
            ({ isActive }) => `${isActive && `!text-teal-500 underline underline-offset-8 font-semibold`}` // Inactive styles
          }
        >
          <Text>{title}</Text>
        </RouterLink>
      )}
    </div>
  );
};

export default NavLink;
