import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/navbar";
import WordMark from "../../components/common/word-mark";
import { useSession } from "../../context/session-provider";
const UserLayout = () => {
  const router = useNavigate();
  const links = [
    { title: "Rent", to: "/me/rent" },
    { title: "Saved", to: "/me/saved" },
    { title: "Chat", to: "/me/chats" },
    { title: "Complaints", to: "/me/complaint" },
  ];
  const { session, setSession } = useSession();
  const onLogout = () => {
    localStorage.removeItem("userId");
    setSession(null);
    router("/");
  };
  return (
    <div className="w-[98%] my-2 mx-auto h-auto">
      <Navbar
        links={links}
        withProfileCard={true}
        session={session}
        logout={onLogout}
      />
      <Outlet />
    </div>
  );
};

export default UserLayout;
