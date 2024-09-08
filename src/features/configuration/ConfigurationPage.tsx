import React, { useState } from "react";
import ItemProfile from "./components/ItemProfile/ItemProfile";
import EmployeeProfile from "./components/EmployeeProfile/EmployeeProfile";
import Account from "./components/Account/Account";
import CustomerProfile from "./components/CustomerProfile/CustomerProfile";
import SupplierProfile from "./components/SupplierProfile/SupplierProfile";
import OtherCustomerProfile from "./components/OtherCustomerProfile/OtherCustomerProfile";
import "./ConfigurationPage.css";

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
      default:
        return <ItemProfile />;
    }
  };

  return (
    <div>
      <h2>Configuration</h2> <br />
      <div className="tabs">
        <button onClick={() => setActiveTab("ItemProfile")}>
          Item Profile
        </button>
        <button onClick={() => setActiveTab("EmployeeProfile")}>
          Employee Profile
        </button>
        <button onClick={() => setActiveTab("Account")}>Account</button>
        <button onClick={() => setActiveTab("CustomerProfile")}>
          Customer Profile
        </button>
        <button onClick={() => setActiveTab("SupplierProfile")}>
          Supplier Profile
        </button>
        <button onClick={() => setActiveTab("OtherCustomerProfile")}>
          Other Customer Profile
        </button>
      </div>
      <div className="tab-content">{renderActiveTab()}</div>
    </div>
  );
};

export default ConfigurationPage;
