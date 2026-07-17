"use client"
import { useMemo, useCallback } from "react";
import { Modal, Form, Input, Select, message } from "antd"
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { fetcher, handleMutation } from "../../utils/axios";
import type { AxiosError } from "axios";

export default function AddAccountModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [form] = Form.useForm<PayoutAccount>()
  const { data, isLoading: isLoadingBanks } = useSWR("/payment/banks", fetcher);

  const allBanks: Bank[] = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const { trigger: resolveAccount, isMutating: isResolving } = useSWRMutation(
    "/payment/resolve-account",
    handleMutation,
  );

  const { trigger: addAccount, isMutating: isAdding } = useSWRMutation(
    "/license-user/settlement-account",
    handleMutation,
  );

  const handleOk = async () => {
    const values = await form.validateFields();
    await handleSubmit(values);
  }

  const handleResolve = useCallback(async () => {
    try {
      const accountNumber = form.getFieldValue('accountNumber');
      const bankCode = form.getFieldValue('bankCode');

      if (!accountNumber || !bankCode) {
        message.warning("Please enter account number and select bank to resolve account name");
        return;
      } else if (accountNumber.length < 10) {
        message.warning("Account number must be at least 10 digits");
        return;
      }
      const resp = await resolveAccount({accountNumber, bankCode});
      form.setFieldValue('accountName', resp?.data?.accountName);
    } catch (error) {
      console.error(error);
      message.error("Failed to resolve account. Please try again.");
      // Don't update lastResolveAttempt on failure to allow manual retry
    }
  }, [resolveAccount, form]);

  async function handleSubmit(values: PayoutAccount) {
    try {
      await addAccount({
        ...values,
        bankName: allBanks.find((bank: Bank) => bank.code === values.bankCode)?.name || '',
      });
      message.success("Settlement account created");
      form.resetFields();
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      console.error("Error creating settlement account:", error);
      message.error(axiosError.response?.data?.error || "Failed to create settlement account. Please try again.");
    }
  }

  return (
    <Modal
      title="Add payout account"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Save account"
      okButtonProps={{
        disabled: isAdding || isResolving || !form.getFieldValue('accountName'),
        loading: isAdding || isResolving
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Bank name"
          name="bankCode"
          rules={[{ required: true, message: "Please select a bank" }]}
        >
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
            }
            placeholder="Select a bank"
            loading={isLoadingBanks}
            style={{ width: '100%' }}
            options={allBanks.map((d: Bank) => ({
              value: d.code,
              label: d.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Account number"
          name="accountNumber"
          rules={[{ required: true, message: "Enter account number" }]}
          className="space-y-1!"
        >
          <Input
            placeholder="0001234567"
            onBlur={() => handleResolve()}
          />
          {form.getFieldValue('accountName') && (<span className="text-sm text-gray-500">Account holder: {form.getFieldValue('accountName')}</span>)}
        </Form.Item>
        {/* <Form.Item
          label="Account type"
          name="accountType"
          rules={[{ required: true, message: "Select account type" }]}
        >
          <Radio.Group>
            <Radio value="bank">Bank account</Radio>
            <Radio value="mobile">Mobile wallet</Radio>
          </Radio.Group>
        </Form.Item> */}
      </Form>
    </Modal>
  )
}
