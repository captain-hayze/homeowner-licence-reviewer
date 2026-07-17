import dayjs from "dayjs";
import useSWR from "swr";
import { useState, useCallback, useEffect, useMemo } from "react";
import ReviewerLayout from "../../components/layouts/ReviewerLayout";
import { Card, Table, Button, Tag, Switch, Spin, message, Skeleton } from "antd";
import AddAccountModal from "../../components/payouts/AddAccountModal";
import useSWRMutation from "swr/mutation";
import { useAppStore } from "../../hooks/useAppStore";
import { useCurrency } from "../../hooks/useCurrency";
import { fetcher, handleMutation } from "../../utils/axios";
import type { ColumnsType } from "antd/es/table";
import PayoutDetailsModal from "../../components/payouts/PayoutDetailsModal";

export default function PayoutsPage() {
  const { user } = useAppStore((state) => state);
  const [open, setOpen] = useState(false);
  const [payoutId, setPayoutId] = useState<string | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const { formatCurrency } = useCurrency();
  const [activeAccount, setActiveAccount] = useState<PayoutAccount | null>(null);

  const { data, isLoading, mutate } = useSWR("/license-user/all-settlement-accounts", fetcher);
  const { data: payoutsData, isLoading: isLoadingPayouts } = useSWR("/license-user/payouts", fetcher);

  const { trigger: activateAccount, isMutating: isActivating } = useSWRMutation(
    `license-user/${activeAccount?.id}/activate-settlement-account`,
    handleMutation,
  );

  const accounts: PayoutAccount[] = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const payouts: Payout[] = useMemo(() => {
    return payoutsData?.data?.payouts || [];
  }, [payoutsData]);

  const handleViewDetails = (id: string) => {
    setPayoutId(id);
    setOpenDetails(true);
  }

const payoutColumns: ColumnsType<Payout> = [
  {
    title: 'Reference',
    dataIndex: 'paymentReference',
    key: 'paymentReference',
    render: (_, record: Payout) => <Button variant="text" onClick={() => handleViewDetails(record.id)}>View</Button>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: () => (
      <Tag color="green">paid</Tag>
    ),
  },
  {
    title: 'Date Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Date Paid',
    dataIndex: 'timeOfAction',
    key: 'timeOfAction',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number) => formatCurrency(amount),
  },
]

  const handleActivateAccount = useCallback(async() => {
    if (!activeAccount) return;

    try {
      const res = await activateAccount();
      
      if (res) {
        message.success("Account activated successfully");
        mutate(); // Refresh the account list
      }
    } catch (error) {
      message.error("Failed to activate account. Please try again.");
      console.error(error)
    }
  }, [activateAccount, activeAccount, mutate]);

  useEffect(() => {
    if (activeAccount && !activeAccount.isActive) {
      handleActivateAccount();
    }
  }, [activeAccount, handleActivateAccount]);

  return (
    <ReviewerLayout>
      <div className="space-y-4!">
        <Card title="Payout summary">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <div className="text-sm text-gray-500">Eligible amount</div>
              <div className="text-2xl font-semibold">{formatCurrency(user?.amountPayable || 0)}</div>
              <div className="text-sm text-gray-500">Next payout Date</div>
              <div className="text-2xl font-semibold">
                {user?.nextPayoutDate ? dayjs(user.nextPayoutDate).format('MMMM D, YYYY') : 'N/A'}
              </div>
            </div>
            <div>
              <Button type="primary" onClick={() => setOpen(true)}>
                Add Account
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Payment accounts">
          <div className="grid gap-4 sm:grid-cols-2">
            {isLoading
              ? <Skeleton />
              : (<>
                {accounts.map((account) => (
                  <Card key={account.accountNumber} size="small" className="border-gray-200 shadow-sm">
                    <div className="flex items-start gap-3">
                    {activeAccount?.id === account.id && isActivating 
                      ? (<Spin className="animate-spin" />)
                      : (<Switch
                          defaultChecked={account.isActive}
                          value={account.isActive}
                          onChange={() => setActiveAccount(account)}
                          size="small"
                        />
                      )}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-base font-semibold">{account.accountName}</div>
                          <Tag color={account.isActive ? "green" : "gray"}>
                            {account.isActive ? "Active" : "Inactive"}
                          </Tag>
                        </div>
                        <div className="text-sm text-gray-500">{account.bankName}</div>
                        <div className="text-sm text-gray-500">{account.accountNumber}</div>
                        {/* <Tag color={account.accountType === "bank" ? "blue" : "green"}>
                          {account.accountType === "bank" ? "Bank" : "Mobile wallet"}
                        </Tag> */}
                      </div>
                    </div>
                  </Card>
                ))}
              </>)}
          </div>
          {!isLoading && accounts.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No payout accounts found. Please add an account to receive payouts.
            </div>
          )}
        </Card>

        <Card title="Past payout requests">
          <Table
            dataSource={payouts}
            columns={payoutColumns}
            loading={isLoadingPayouts}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>

      <AddAccountModal
        open={open}
        onClose={() => setOpen(false)}
      />
      <PayoutDetailsModal
        id={payoutId || ''}
        open={openDetails}
        onClose={() => setOpenDetails(false)}
      />
    </ReviewerLayout>
  )
}
