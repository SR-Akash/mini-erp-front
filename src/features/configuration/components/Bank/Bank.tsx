import React from "react";
import { Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Bank.css"; // Bank-specific styles

const Bank: React.FC = () => {
  const columns = [
    { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
    { title: "Branch", dataIndex: "branch", key: "branch" },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber"
    }
  ];

  const data = [
    {
      key: "1",
      bankName: "ABC Bank",
      branch: "Main Branch",
      accountNumber: "123456789"
    }
  ];

  return (
    <div className="bank-container">
      <div className="header-container">
        <h3>Bank List</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="create-button"
        >
          Create
        </Button>
      </div>

      <Table columns={columns} dataSource={data} className="bank-table" />
    </div>
  );
};

export default Bank;
