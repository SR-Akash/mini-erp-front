// src/features/purchase/components/PurchaseLandingPage/PurchaseLandingPage.tsx

import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Purchase } from "../../../../models/Purchase";
import { fetchPurchases } from "../../services/PurchaseService";
import "./PurchaseLandingPage.css";
import { useAppSelector } from "globalRedux/hooks";
import PurchaseReceiveModal from "../PurchaseReceive/PurchaseReceiveModal";

const PurchaseLandingPage: React.FC = () => {
  const [purchaseData, setPurchaseData] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Modal state

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );
  const accountId = profileData.accountId;

  useEffect(() => {
    // Fetch the purchase data when the component loads
    loadPurchases();
  }, [accountId]);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const data = await fetchPurchases(accountId);
      setPurchaseData(data);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open the receive modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Close the receive modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Define columns for the Ant Design table
  const columns: ColumnsType<Purchase> = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1
    },
    {
      title: "Received Date",
      dataIndex: "receivedDateLanding",
      key: "receivedDateLanding"
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName"
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "Total Qty",
      dataIndex: "totalQty",
      key: "totalQty"
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount"
    },
    {
      title: "Created By",
      dataIndex: "actionByName",
      key: "actionByName"
    }
  ];

  return (
    <div className="purchase-landing-page">
      <div className="header">
        <h2>Purchase</h2>
        {/* Receive button to open modal */}
        <Button type="primary" style={{ float: "right" }} onClick={openModal}>
          Receive
        </Button>
      </div>

      {/* Ant Design Table to display purchase data */}
      <Table
        dataSource={purchaseData}
        columns={columns}
        loading={loading}
        className="custom-table"
        rowKey="id"
      />

      {/* New Receive Modal */}
      <PurchaseReceiveModal
        visible={modalVisible}
        onClose={closeModal}
        loadPurchases={loadPurchases}
      />
    </div>
  );
};

export default PurchaseLandingPage;
