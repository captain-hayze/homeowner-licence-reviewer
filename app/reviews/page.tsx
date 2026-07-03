"use client"
import React from "react"
import ReviewerLayout from "../../components/layouts/ReviewerLayout"
import { Tabs, Table, Tag } from "antd"
import { useRouter } from "next/navigation"
import { ColumnsType } from "antd/lib/table";
import { fetcher } from "@/utils/axios";
import useSWR from "swr";
import dayjs from "dayjs"

export default function ReviewsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("ALL");

  const { data, isLoading } = useSWR("/license-review-user/assigned-review-requests", fetcher);

  const reviews: Review[] = React.useMemo(() => {
    if (!data) return [];
    return data?.data.filter((r: Review) => {
      if (activeTab === "ALL") return true;
      return r.status === activeTab;
    }) || [];
  }, [data, activeTab]);

  const columns: ColumnsType<Review> = [
    {
      title: "ID",
      dataIndex: "homeOwnerProject",
      key: "id",
      render: (project: HomeOwnerProject) => project.publicId,
    },
    {
      title: "Project Name",
      dataIndex: "homeOwnerProject",
      key: "name",
      render: (project: HomeOwnerProject) => project.name
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: string) => (
        <Tag color={s === "COMPLETED" ? "green" : s === "IN_REVIEW" ? "orange" : "blue"}>{s}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    }
  ]


  const onRowClick = (record: Review) => {
    router.push(`/reviews/${record.id}`);
  }

  return (
    <ReviewerLayout>
      <Tabs defaultActiveKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="All" key="ALL">
          <Table
            columns={columns}
            rowClassName="cursor-pointer"
            dataSource={reviews}
            loading={isLoading}
            onRow={(data) => {
              return {
                onClick: () => {
                  onRowClick(data);
                },
              };
            }}
        />
        </Tabs.TabPane>
        <Tabs.TabPane tab="In Review" key="IN_REVIEW">
          <Table
            rowClassName="cursor-pointer"
            columns={columns}
            loading={isLoading}
            dataSource={reviews}
            onRow={(data) => {
              return {
                onClick: () => {
                  onRowClick(data);
                },
              };
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Completed" key="COMPLETED">
          <Table
            rowClassName="cursor-pointer"
            columns={columns}
            loading={isLoading}
            dataSource={reviews}
            onRow={(data) => {
              return {
                onClick: () => {
                  onRowClick(data);
                },
              };
            }}
          />
        </Tabs.TabPane>
      </Tabs>
    </ReviewerLayout>
  )
}
