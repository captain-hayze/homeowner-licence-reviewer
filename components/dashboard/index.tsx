"use client"
import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import { useRouter } from "next/navigation"
import { ColumnsType } from "antd/lib/table";
import { fetcher } from "@/utils/axios";
import useSWR from "swr";
import dayjs from "dayjs";
import { useCurrency } from "@/hooks/useCurrency";
import { useMemo } from "react";

type dashboardStats = {
  totalPayouts: number;
  totalEarnings: number;
  pendingPayouts: number;
  pendingEarnings: number;
  completedReviewsCount: number;
};


export default function Dashboard() {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const { data, isLoading } = useSWR("/license-review-requests/reviewer/dashboard", fetcher);

  const recentReviews: ReviewRequest[] = useMemo(() => {
    return data?.data?.recentAssignedReviews || [];
  }, [data]);

  const stats: dashboardStats = useMemo(() => {
    return {
      totalPayouts: data?.data?.totalPayouts || 0,
      totalEarnings: data?.data?.totalEarnings || 0,
      pendingPayouts: data?.data?.pendingPayouts || 0,
      pendingEarnings: data?.data?.pendingEarnings || 0,
      completedReviewsCount: data?.data?.completedReviewsCount || 0,
    }
    }, [data]);

  const columns: ColumnsType<ReviewRequest> = [
    {
      title: "ID",
      dataIndex: "reviewRequest",
      key: "id",
      render: (request) => request?.homeOwnerProject?.publicId,
    },
    {
      title: "Project Name",
      dataIndex: "reviewRequest",
      key: "name",
      render: (request) => request?.homeOwnerProject?.name
    },
    {
      title: "Status",
      dataIndex: "reviewRequest",
      key: "status",
      render: (request) => {
        const status = request?.status;
        return (
          <Tag color={status === "COMPLETED"
            ? "green"
            : status === "IN_REVIEW"
              ? "orange"
              : "blue"}
            >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Assigned At",
      dataIndex: "assignedTime",
      key: "assignedTime",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    }
  ];


  const onRowClick = (record: ReviewRequest) => {
    router.push(`/reviews/${record.reviewRequest.id}`);
  }

  return (
      <div className="space-y-4">
        <Row gutter={16} className="mb-4">
          <Col span={8}>
            <Card onClick={() => router.push("/payouts")} hoverable>
              <Statistic title="Earnings" value={formatCurrency(stats.totalEarnings)} />
            </Card>
          </Col>
          <Col span={8}>
            <Card onClick={() => router.push("/payouts")} hoverable>
              <Statistic title="Pending Payouts" value={formatCurrency(stats.pendingPayouts)} />
            </Card>
          </Col>
          <Col span={8}>
            <Card onClick={() => router.push("/reviews")} hoverable>
              <Statistic title="Completed Reviews" value={stats.completedReviewsCount} />
            </Card>
          </Col>
        </Row>

        <Card title="Recent Reviews">
          <Table
            dataSource={recentReviews}
            columns={columns}
            loading={isLoading}
            rowKey="id"
            rowClassName="cursor-pointer"
            pagination={false}
            onRow={(data) => {
              return {
                onClick: () => {
                  onRowClick(data);
                },
              };
            }}
          />
        </Card>
      </div>
  )
}
