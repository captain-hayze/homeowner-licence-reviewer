import { useMemo } from 'react'
import { Modal, Skeleton, Tag, Image, Divider } from 'antd';
import dayjs from 'dayjs';
import useSWR from "swr";
import { fetcher } from '../../utils/axios';

export default function PayoutDetailsModal(
{
  open,
  id,
  onClose,
}: {
  open: boolean;
  id: string;
  onClose: () => void;
}) {
  const { data, isLoading } = useSWR(open && id ? `/license-user/payouts/${id}` : null, fetcher);

  const payoutDetails: Payout | null = useMemo(() => {
    return data?.data || null;
  }, [data]);

//   const statusColor = payoutDetails?.status?.toLowerCase() === 'paid'
//     ? 'green'
//     : payoutDetails?.status?.toLowerCase() === 'pending'
//       ? 'orange'
//       : 'default';

  const labelValue = (label: string, value: string | number | null | undefined) => (
    <div className="space-y-1">
      <div className="text-xs uppercase tracking-[0.12em] text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{value ?? 'N/A'}</div>
    </div>
  );

  return (
    <Modal
      title="Payout details"
      open={open}
      onOk={onClose}
      onCancel={onClose}
      okText="Close"
      width={720}
      bodyStyle={{ padding: '24px' }}
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : payoutDetails ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-[1.8fr_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Amount</div>
                    <div className="mt-2 text-3xl font-semibold text-slate-900">
                      ₦{payoutDetails.amount.toLocaleString()}
                    </div>
                  </div>
                  <Tag color={'green'} className="uppercase text-xs font-semibold">
                    {payoutDetails.status}
                  </Tag>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {labelValue('Reference', payoutDetails.paymentReference)}
                  {labelValue('Transaction', `${payoutDetails.transactionType} / ${payoutDetails.actionType}`)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Timing</div>
              <div className="mt-3 space-y-3">
                {labelValue('Created', dayjs(payoutDetails.createdAt).format('MMMM D, YYYY h:mm A'))}
                {labelValue('Paid', dayjs(payoutDetails.timeOfAction).format('MMMM D, YYYY h:mm A'))}
                {labelValue('Updated', dayjs(payoutDetails.updatedAt).format('MMMM D, YYYY h:mm A'))}
              </div>
            </div>
          </div>

          <Divider />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Settlement account</div>
              <div className="mt-4 space-y-3">
                {labelValue('Account name', payoutDetails.settlementAccount.accountName)}
                {labelValue('Bank', payoutDetails.settlementAccount.bankName)}
                {labelValue('Account number', payoutDetails.settlementAccount.accountNumber)}
                {labelValue('Bank code', payoutDetails.settlementAccount.bankCode)}
                {labelValue('Account type', payoutDetails.settlementAccount.accountType)}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Receipt</div>
              <div className="mt-4 space-y-3">
                {payoutDetails.receiptImageUrl ? (
                  <div className="space-y-2">
                    <Image
                      src={payoutDetails.receiptImageUrl}
                      alt="Payout receipt"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 520,
                        objectFit: 'contain',
                        borderRadius: 12,
                      }}
                      preview={{
                        src: payoutDetails.receiptImageUrl,
                        mask: <div className="text-white">Tap to expand</div>,
                      }}
                    />
                    <div className="text-xs text-gray-500 break-all">
                      Reference URL:
                      <a
                        href={payoutDetails.receiptImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-1 text-blue-600 hover:underline"
                      >
                        {payoutDetails.receiptImageUrl}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                    No receipt image available.
                  </div>
                )}

                {payoutDetails.receipt && (
                  <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Receipt token</div>
                    <div className="break-all">{payoutDetails.receipt}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No payout details available.</div>
      )}
    </Modal>
  )
}
