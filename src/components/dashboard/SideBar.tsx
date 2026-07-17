import { Button, Menu, message } from "antd"
import {
  DashboardOutlined,
  FileTextOutlined,
  WalletOutlined,
  LogoutOutlined,
} from "@ant-design/icons"
import { useAppStore } from "../../hooks/useAppStore";
import { Link, useNavigate } from "react-router-dom";
import type { ItemType, MenuItemType } from "antd/lib/menu/interface";


export default function SideBar({ mode = "inline" }: { mode?: "inline" | "vertical" }) {
  const { setUser, setToken, setIsAuthenticated } = useAppStore((state) => state);
  const navigate = useNavigate();

  const mainMenuItems: ItemType<MenuItemType>[] = [
    {
      key: 'dashboard',
      label: <Link to="/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
      type: 'item'
    },
    {
      key: 'reviews',
      label: <Link to="/reviews">Reviews</Link>,
      icon: <FileTextOutlined />,
      type: 'item'
    },
    {
      key: 'payouts',
      label: <Link to="/payouts">Payouts</Link>,
      icon: <WalletOutlined />,
      type: 'item'
    },
  ]

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    localStorage.removeItem("app-store");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    navigate("/");
    message.success("Logged out successfully");
  }

  const bottomMenuItems: ItemType<MenuItemType>[] = [
    {
      key: 'logout',
      label: <Button
        type="text"
        className="text-red-500! text-lg font-semibold!"
        onClick={handleLogout}
      >Logout</Button>,
      icon: <LogoutOutlined className="text-lg" />,
      type: 'item'
    }
  ]

  return (
    <div className="bg-white flex flex-col h-full">
      <div className="h-14 bg-black text-white p-4 border-b border-gray-300 text-xl font-bold">Reviewer</div>
      <Menu
        mode={mode}
        items={mainMenuItems}
        className="flex-1 relative flex flex-col mt-8!"
      />
      <Menu
        mode={mode}
        className="border-t border-gray-300 mb-6!"
        items={bottomMenuItems}
      />
    </div>
  )
}
