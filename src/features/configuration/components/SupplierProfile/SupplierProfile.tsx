import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification } from "antd";

import "./SupplierProfile.css"; // Ensure your CSS is linked properly
import { Supplier } from "models/Supplier";
import { getSuppliers, createSupplier } from "../../services/SupplierService";
import { useAppSelector } from "globalRedux/hooks";

const SupplierProfile: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal state
  const [supplierCode, setSupplierCode] = useState<string>("");
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
    resetFormFields(); // Reset form fields on close
  };

  // Handle Form Submission (Saving Supplier)
  const handleSave = async () => {
    try {
      const values = {
        supplierCode,
        supplierName,
        supplierContact,
        supplierAddress
      };

      var payload = {
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

      await createSupplier(payload); // Call API to create the supplier
      notification.success({ message: "Supplier created successfully!" }); // Show success notification
      setIsModalVisible(false); // Close the modal after submission
      resetFormFields(); // Reset form fields
      loadSuppliers(); // Reload the supplier list to reflect the new supplier
    } catch (errorInfo) {
      console.error("Error creating supplier:", errorInfo);
      notification.error({ message: "Failed to create supplier." }); // Show error notification
    }
  };

  const resetFormFields = () => {
    setSupplierCode("");
    setSupplierName("");
    setSupplierContact("");
    setSupplierAddress("");
  };

  return (
    <div>
      <div className="supplier-profile-header">
        <h2>Supplier Profile</h2>

        {/* Button to open the modal */}
        <Button
          type="primary"
          onClick={showModal}
          className="create-supplier-btn"
          style={{ float: "right", marginBottom: "20px" }}
        >
          Create Supplier
        </Button>
      </div>

      {/* Ant Design Modal for Create Supplier */}
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

          {/* Supplier Description */}
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
      <table>
        <thead>
          <tr>
            <th>SL</th>
            <th>Supplier Code</th>
            <th>Supplier Name</th>
            <th>Contact</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* SL - Serial Number */}
              <td>{supplier.partnerCode}</td>
              <td>{supplier.partnerName}</td>
              <td>{supplier.mobile}</td>
              <td>{supplier.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierProfile;
