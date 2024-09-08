import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification } from "antd";

import "./OtherPartnerProfile.css"; // Ensure your CSS is linked properly

import {
  getOtherPartners,
  createOtherPartner
} from "../../services/OtherPartnerService";

import { OtherPartner } from "models/OtherPartner";
import { useAppSelector } from "globalRedux/hooks";

const OtherPartnerProfile: React.FC = () => {
  const [otherPartners, setOtherPartners] = useState<OtherPartner[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal state
  const [partnerCode, setPartnerCode] = useState<string>("");
  const [partnerName, setPartnerName] = useState<string>("");
  const [partnerContact, setPartnerContact] = useState<string>("");
  const [partnerAddress, setPartnerAddress] = useState<string>("");

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );

  const accountId = profileData.accountId;
  // Fetch other partners from API when the component is mounted
  useEffect(() => {
    loadOtherPartners();
  }, [accountId]);

  const loadOtherPartners = async () => {
    try {
      const data = await getOtherPartners(accountId); // API call to get other partners
      setOtherPartners(data);
    } catch (error) {
      console.error("Error fetching other partners:", error);
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

  // Handle Form Submission (Saving Other Partner)
  const handleSave = async () => {
    try {
      const values = {
        partnerCode,
        partnerName,
        partnerContact,
        partnerAddress
      };

      var payload = {
        partnerName: values.partnerName,
        accountId: profileData.accountId,
        partnerTypeId: 3,
        partnerTypeName: "Other Partner",
        partnerCode: "",
        address: values.partnerAddress,
        mobile: values.partnerContact,
        actionById: profileData.userId,
        isActive: true
      };

      await createOtherPartner(payload); // Call API to create the other partner
      notification.success({ message: "Other Partner created successfully!" }); // Show success notification
      setIsModalVisible(false); // Close the modal after submission
      resetFormFields(); // Reset form fields
      loadOtherPartners(); // Reload the other partner list to reflect the new entry
    } catch (errorInfo) {
      console.error("Error creating other partner:", errorInfo);
      notification.error({ message: "Failed to create other partner." }); // Show error notification
    }
  };

  const resetFormFields = () => {
    setPartnerCode("");
    setPartnerName("");
    setPartnerContact("");
    setPartnerAddress("");
  };

  return (
    <div>
      <div className="other-partner-profile-header">
        <h2>Other Partner Profile</h2>

        {/* Button to open the modal */}
        <Button
          type="primary"
          onClick={showModal}
          className="create-other-partner-btn"
          style={{ float: "right", marginBottom: "20px" }}
        >
          Create Other Partner
        </Button>
      </div>

      {/* Ant Design Modal for Create Other Partner */}
      <Modal
        title="Create New Other Partner"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="create-other-partner-modal"
      >
        <form>
          {/* Partner Name */}
          <div className="form-group">
            <label htmlFor="partnerName">Partner Name</label>
            <Input
              id="partnerName"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Enter Partner Name"
              required
            />
          </div>

          {/* Partner Contact */}
          <div className="form-group">
            <label htmlFor="partnerContact">Partner Mobile</label>
            <Input
              id="partnerContact"
              value={partnerContact}
              onChange={(e) => setPartnerContact(e.target.value)}
              placeholder="Enter Partner Mobile"
              required
            />
          </div>

          {/* Partner Address */}
          <div className="form-group">
            <label htmlFor="partnerAddress">Partner Address</label>
            <Input.TextArea
              id="partnerAddress"
              value={partnerAddress}
              onChange={(e) => setPartnerAddress(e.target.value)}
              placeholder="Enter Partner Address"
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

      {/* Other Partner Table */}
      <table>
        <thead>
          <tr>
            <th>SL</th>
            <th>Partner Code</th>
            <th>Partner Name</th>
            <th>Contact</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {otherPartners.map((partner, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* SL - Serial Number */}
              <td>{partner.partnerCode}</td>
              <td>{partner.partnerName}</td>
              <td>{partner.mobile}</td>
              <td>{partner.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OtherPartnerProfile;
