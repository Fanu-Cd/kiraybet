import { Typography } from "antd";
import { NavLink as RouterLink } from "react-router-dom";
const { Text } = Typography;

const NavLink = ({ isIcon, icon, title, to }) => {
  return (
    <div>
      {isIcon ? (
        <RouterLink to={to}>{icon}</RouterLink>
      ) : (
        <RouterLink
          to={to}
          className={
            ({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold" // Active styles
                : "text-gray-500" // Inactive styles
          }
        >
          <Text>{title}</Text>
        </RouterLink>
      )}
    </div>
  );
};

export default NavLink;
