import React, { useState } from "react";
import { Tabs } from "antd";
import ChartOfAccounts from "../ChartOfAccounts/ChartOfAccounts";
import JournalVoucher from "../JournalVoucher/JournalVoucher";
import "./AccountsLandingPage.css";

const { TabPane } = Tabs;

const AccountsLandingPage: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>("1");

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <div className="accounts-landing-page">
      <h2>Accounts Module</h2>
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <TabPane tab="Chart of Accounts" key="1">
          {/* ChartOfAccounts component will render when this tab is active */}
          {activeTabKey === "1" && <ChartOfAccounts />}
        </TabPane>
        <TabPane tab="Journal Voucher" key="2">
          {/* JournalVoucher component will render when this tab is active */}
          {activeTabKey === "2" && <JournalVoucher />}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AccountsLandingPage;
