import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { getChartOfAccounts } from "../../service/AccountsService";
import "./ChartOfAccounts.css";
import { Account } from "features/accounts/interfaces/Accounts";

const ChartOfAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await getChartOfAccounts();
      setAccounts(data);
    } catch (error) {
      message.error("Failed to fetch Chart of Accounts.");
    }
  };

  const columns = [
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: () => <Button>Edit</Button>
    }
  ];

  return (
    <div>
      <h3>Chart of Accounts</h3>
      <Table columns={columns} dataSource={accounts} rowKey="accountId" />
    </div>
  );
};

export default ChartOfAccounts;
