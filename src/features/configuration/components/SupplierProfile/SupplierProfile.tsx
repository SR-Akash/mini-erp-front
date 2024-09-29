import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./SupplierProfile.css"; // Ensure your CSS is linked properly
import { Supplier } from "models/Supplier";
import { getSuppliers, createSupplier } from "../../services/SupplierService";
import { useAppSelector } from "globalRedux/hooks";

const SupplierProfile: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [supplierName, setSupplierName] = useState<string>("");
  const [supplierContact, setSupplierContact] = useState<string>("");
  const [supplierAddress, setSupplierAddress] = useState<string>("");

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );
  const accountId = profileData.accountId;

  // Fetch suppliers from API when the component is mounted
  useEffect(() => {
    loadSuppliers();
  }, [accountId]);

  const loadSuppliers = async () => {
    try {
      const data = await getSuppliers(accountId); // Existing API call to get suppliers
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // Open Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    resetFormFields();
  };

  // Handle Form Submission (Saving Supplier)
  const handleSave = async () => {
    try {
      const values = { supplierName, supplierContact, supplierAddress };

      const payload = {
        partnerName: values.supplierName,
        accountId: profileData.accountId,
        partnerTypeId: 2,
        partnerTypeName: "Supplier",
        partnerCode: "",
        address: values.supplierAddress,
        mobile: values.supplierContact,
        actionById: profileData.userId,
        isActive: true
      };

      await createSupplier(payload);
      notification.success({ message: "Supplier created successfully!" });
      setIsModalVisible(false);
      resetFormFields();
      loadSuppliers();
    } catch (errorInfo) {
      console.error("Error creating supplier:", errorInfo);
      notification.error({ message: "Failed to create supplier." });
    }
  };

  const resetFormFields = () => {
    setSupplierName("");
    setSupplierContact("");
    setSupplierAddress("");
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      render: (_: any, __: any, index: number) => index + 1
    },
    { title: "Supplier Code", dataIndex: "partnerCode", key: "partnerCode" },
    { title: "Supplier Name", dataIndex: "partnerName", key: "partnerName" },
    { title: "Contact", dataIndex: "mobile", key: "mobile" },
    { title: "Address", dataIndex: "address", key: "address" }
  ];

  return (
    <div className="supplier-container">
      <div className="header-container">
        <h3>Supplier List</h3>
        <Button
          type="primary"
          onClick={showModal}
          icon={<PlusOutlined />}
          className="create-button"
        >
          Create Supplier
        </Button>
      </div>

      {/* Modal for Creating New Supplier */}
      <Modal
        title="Create New Supplier"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="create-supplier-modal"
      >
        <form>
          {/* Supplier Name */}
          <div className="form-group">
            <label htmlFor="supplierName">Supplier Name</label>
            <Input
              id="supplierName"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Enter Supplier Name"
              required
            />
          </div>

          {/* Supplier Contact */}
          <div className="form-group">
            <label htmlFor="supplierContact">Supplier Mobile</label>
            <Input
              id="supplierContact"
              value={supplierContact}
              onChange={(e) => setSupplierContact(e.target.value)}
              placeholder="Enter Supplier Mobile"
              required
            />
          </div>

          {/* Supplier Address */}
          <div className="form-group">
            <label htmlFor="supplierAddress">Supplier Address</label>
            <Input.TextArea
              id="supplierAddress"
              value={supplierAddress}
              onChange={(e) => setSupplierAddress(e.target.value)}
              placeholder="Enter Supplier Address"
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

      {/* Supplier Table */}
      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="partnerCode"
        className="supplier-table"
        pagination={{ pageSize: 5 }} // Add pagination like in Bank design
      />
    </div>
  );
};

export default SupplierProfile;
