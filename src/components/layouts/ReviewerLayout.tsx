"use client"
import React, { useState } from "react"
import { Layout, Drawer } from "antd"
import SideBar from "../dashboard/SideBar"
import AppHeader from "./Header"

const { Sider, Content } = Layout

export default function ReviewerLayout({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)

  return (
    <Layout className="min-h-screen!">
      <div className="lg:block hidden">
        <Sider width={220} className="bg-white border-r border-gray-300 h-full">
          <SideBar mode="vertical" />
        </Sider>
      </div>
      <div className="lg:hidden block">
        <Drawer placement="left" open={visible} onClose={() => setVisible(false)}>
          <SideBar mode="vertical" />
        </Drawer>
      </div>
      <Layout>
        <AppHeader onMenuClick={() => setVisible(true)} />
        <Content className="p-4">{children}</Content>
      </Layout>
    </Layout>
  )
}
