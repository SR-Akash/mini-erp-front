import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./CustomerProfile.css"; // Ensure your CSS is linked properly
import { Customer } from "models/Customer";
import { getCustomers, createCustomer } from "../../services/CustomerService";
import { useAppSelector } from "globalRedux/hooks";

const CustomerProfile: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal state
  const [customerName, setCustomerName] = useState<string>("");
  const [customerContact, setCustomerContact] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );
  const accountId = profileData.accountId;

  // Fetch customers from API when the component is mounted
  useEffect(() => {
    loadCustomers();
  }, [accountId]);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers(accountId); // API call to get customers
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Open Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    resetFormFields(); // Reset form fields on close
  };

  // Handle Form Submission (Saving Customer)
  const handleSave = async () => {
    try {
      const values = {
        customerName,
        customerContact,
        customerAddress
      };

      const payload = {
        partnerName: values.customerName,
        accountId: profileData.accountId,
        partnerTypeId: 1,
        partnerTypeName: "Customer",
        partnerCode: "",
        address: values.customerAddress,
        mobile: values.customerContact,
        actionById: profileData.userId,
        isActive: true
      };

      await createCustomer(payload); // Call API to create the customer
      notification.success({ message: "Customer created successfully!" }); // Show success notification
      setIsModalVisible(false); // Close the modal after submission
      resetFormFields(); // Reset form fields
      loadCustomers(); // Reload the customer list to reflect the new customer
    } catch (errorInfo) {
      console.error("Error creating customer:", errorInfo);
      notification.error({ message: "Failed to create customer." }); // Show error notification
    }
  };

  const resetFormFields = () => {
    setCustomerName("");
    setCustomerContact("");
    setCustomerAddress("");
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      render: (_: any, __: any, index: number) => index + 1
    },
    { title: "Customer Code", dataIndex: "partnerCode", key: "partnerCode" },
    { title: "Customer Name", dataIndex: "partnerName", key: "partnerName" },
    { title: "Contact", dataIndex: "mobile", key: "mobile" },
    { title: "Address", dataIndex: "address", key: "address" }
  ];

  return (
    <div className="customer-container">
      <div className="header-container">
        <h3>Customer List</h3>
        <Button
          type="primary"
          onClick={showModal}
          icon={<PlusOutlined />}
          className="create-button"
        >
          Create Customer
        </Button>
      </div>

      {/* Ant Design Modal for Create Customer */}
      <Modal
        title="Create New Customer"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="create-customer-modal"
      >
        <form>
          {/* Customer Name */}
          <div className="form-group">
            <label htmlFor="customerName">Customer Name</label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter Customer Name"
              required
            />
          </div>

          {/* Customer Contact */}
          <div className="form-group">
            <label htmlFor="customerContact">Customer Mobile</label>
            <Input
              id="customerContact"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              placeholder="Enter Customer Mobile"
              required
            />
          </div>

          {/* Customer Address */}
          <div className="form-group">
            <label htmlFor="customerAddress">Customer Address</label>
            <Input.TextArea
              id="customerAddress"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Enter Customer Address"
            />
          </div>

          {/* Save and Cancel buttons */}
          <div className="form-actions">
            <Button
              type="primary"
              onClick={handleSave}
              style={{ marginRight: "10px" }}
            >
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Customer Table using Ant Design */}
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="partnerCode"
        className="customer-table"
      />
    </div>
  );
};

export default CustomerProfile;
