import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  InputNumber,
  message,
  DatePicker,
  Select
} from "antd";
import { createJournalVoucher } from "../../service/AccountsService";
import "./JournalVoucher.css";
import { JournalEntry } from "features/accounts/interfaces/Accounts";

const { Option } = Select;

const JournalVoucher: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [date, setDate] = useState<string>("");
  const [narration, setNarration] = useState<string>("");
  const [voucherType, setVoucherType] = useState<string>("");

  const addEntry = () => {
    const newEntry = {
      entryId: Date.now(),
      date,
      narration,
      voucherType,
      account: "",
      relatedParty: "",
      debit: 0,
      credit: 0
    };
    setEntries([...entries, newEntry]);
  };

  const handleSubmit = async () => {
    if (!date || !narration || !voucherType || entries.length === 0) {
      message.error("Please complete all fields.");
      return;
    }

    const payload = {
      date,
      narration,
      voucherType,
      entries
    };

    try {
      await createJournalVoucher(payload);
      message.success("Journal Voucher created successfully!");
    } catch (error) {
      message.error("Failed to create Journal Voucher.");
    }
  };

  const columns = [
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
      render: () => <Input />
    },
    {
      title: "Related Party",
      dataIndex: "relatedParty",
      key: "relatedParty",
      render: () => <Input />
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      render: () => <InputNumber min={0} />
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      render: () => <InputNumber min={0} />
    }
  ];

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Date">
        <DatePicker
          onChange={(date, dateString) => setDate(dateString?.toString())}
        />
      </Form.Item>
      <Form.Item label="Narration">
        <Input.TextArea
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Voucher Type">
        <Select value={voucherType} onChange={(value) => setVoucherType(value)}>
          <Option value="Payment">Payment</Option>
          <Option value="Receipt">Receipt</Option>
        </Select>
      </Form.Item>
      <Table
        columns={columns}
        dataSource={entries}
        rowKey="entryId"
        pagination={false}
      />
      <Button type="dashed" onClick={addEntry}>
        Add Entry
      </Button>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default JournalVoucher;
