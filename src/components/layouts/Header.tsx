import { Button } from "antd"
import { MenuOutlined } from "@ant-design/icons"

export default function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header
      className="bg-white h-14 px-4 border-b border-gray-300 flex items-center justify-between"
    >
      <span className="text-base font-semibold text-gray-500">Review and manage license applications</span>
      <span className="lg:hidden block">
        <Button
            key="1"
            icon={<MenuOutlined className="text-lg!" />}
            onClick={onMenuClick}
            type="text"
            size="small"
        />
      </span>
    </header>
  )
}
