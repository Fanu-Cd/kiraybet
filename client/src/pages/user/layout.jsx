import { Outlet } from "react-router-dom";
import Navbar from "../../components/user/navbar";

const UserLayout=()=>{
    return(
    <div className="w-[98%] my-2 mx-auto h-auto">
        <Navbar />
        <Outlet />
    </div>
)
}

export default UserLayout;