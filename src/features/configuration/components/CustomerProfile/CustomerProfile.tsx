import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification, Table, message, Form } from "antd";
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
      message.success("Customer created successfully!"); // Show success notification
      setIsModalVisible(false); // Close the modal after submission
      resetFormFields(); // Reset form fields
      loadCustomers(); // Reload the customer list to reflect the new customer
    } catch (errorInfo) {
      console.error("Error creating customer:", errorInfo);
      message.error("Failed to create customer."); // Show error notification
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
        <Form
          layout="vertical" // Ensures the form is in a vertical layout with proper spacing
          onFinish={handleSave} // This will call handleSave on form submission
        >
          {/* Customer Name */}
          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[
              { required: true, message: "Please enter the customer name" }
            ]}
          >
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter Customer Name"
            />
          </Form.Item>

          {/* Customer Mobile */}
          <Form.Item
            label="Customer Mobile"
            name="customerContact"
            rules={[
              { required: true, message: "Please enter the customer mobile" }
            ]}
          >
            <Input
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              placeholder="Enter Customer Mobile"
            />
          </Form.Item>

          {/* Customer Address */}
          <Form.Item label="Customer Address" name="customerAddress">
            <Input.TextArea
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Enter Customer Address"
            />
          </Form.Item>

          {/* Save and Cancel buttons */}
          <Form.Item>
            <div className="form-actions">
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
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
