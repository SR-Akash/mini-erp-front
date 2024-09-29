import React, { useState } from "react";
import { Tabs } from "antd";
import ItemProfile from "./components/ItemProfile/ItemProfile";
import EmployeeProfile from "./components/EmployeeProfile/EmployeeProfile";
import Account from "./components/Account/Account";
import CustomerProfile from "./components/CustomerProfile/CustomerProfile";
import SupplierProfile from "./components/SupplierProfile/SupplierProfile";
import OtherCustomerProfile from "./components/OtherCustomerProfile/OtherCustomerProfile";
import Bank from "./components/Bank/BankLandingPage"; // Import the Bank component
import "./ConfigurationPage.css"; // Custom styles

const { TabPane } = Tabs;

const ConfigurationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("ItemProfile");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "ItemProfile":
        return <ItemProfile />;
      case "EmployeeProfile":
        return <EmployeeProfile />;
      case "Account":
        return <Account />;
      case "CustomerProfile":
        return <CustomerProfile />;
      case "SupplierProfile":
        return <SupplierProfile />;
      case "OtherCustomerProfile":
        return <OtherCustomerProfile />;
      case "Bank":
        return <Bank />;
      default:
        return <ItemProfile />;
    }
  };

  return (
    <div className="configuration-container">
      <h2>Configuration</h2> <br />
      <div className="tab-layout">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          tabPosition="left" // Set the tabs position to the left
          className="custom-tabs"
        >
          <TabPane tab="Item Profile" key="ItemProfile" />
          <TabPane tab="Customer Profile" key="CustomerProfile" />
          <TabPane tab="Supplier Profile" key="SupplierProfile" />
          <TabPane tab="Other Customer Profile" key="OtherCustomerProfile" />
          <TabPane tab="Bank" key="Bank" /> {/* Add the Bank tab */}
        </Tabs>
        <div className="tab-content">{renderActiveTab()}</div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
