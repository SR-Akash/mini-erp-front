import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification, Table, message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./OtherPartnerProfile.css"; // Ensure your CSS is linked properly
import {
  getOtherPartners,
  createOtherPartner
} from "../../services/OtherPartnerService";
import { OtherPartner } from "models/OtherPartner";
import { useAppSelector } from "globalRedux/hooks";

const OtherPartnerProfile: React.FC = () => {
  const [otherPartners, setOtherPartners] = useState<OtherPartner[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [partnerName, setPartnerName] = useState<string>("");
  const [partnerContact, setPartnerContact] = useState<string>("");
  const [partnerAddress, setPartnerAddress] = useState<string>("");

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );
  const accountId = profileData.accountId;

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetFormFields(); // Reset form fields on close
  };

  const handleSave = async () => {
    try {
      const values = { partnerName, partnerContact, partnerAddress };

      const payload = {
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

      await createOtherPartner(payload);
      message.success("Other Partner created successfully!");
      setIsModalVisible(false);
      resetFormFields();
      loadOtherPartners();
    } catch (errorInfo) {
      console.error("Error creating other partner:", errorInfo);
      message.error("Failed to create other partner.");
    }
  };

  const resetFormFields = () => {
    setPartnerName("");
    setPartnerContact("");
    setPartnerAddress("");
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      width: "5%", // Adjust width
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: "Partner Code",
      dataIndex: "partnerCode",
      key: "partnerCode",
      width: "20%" // Adjust width
    },
    {
      title: "Partner Name",
      dataIndex: "partnerName",
      key: "partnerName",
      width: "25%" // Adjust width
    },
    {
      title: "Contact",
      dataIndex: "mobile",
      key: "mobile",
      width: "20%" // Adjust width
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "25%" // Adjust width
    }
  ];

  return (
    <div className="other-partner-container">
      <div className="header-container">
        <h3>Other Partner List</h3>
        <Button
          type="primary"
          onClick={showModal}
          icon={<PlusOutlined />}
          className="create-button"
        >
          Create Other Partner
        </Button>
      </div>

      {/* Modal for Creating New Other Partner */}
      <Modal
        title="Create New Other Partner"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="create-other-partner-modal"
      >
        <Form
          layout="vertical" // This ensures the form is in a vertical layout with proper alignment
          onFinish={handleSave} // Handle form submission
        >
          {/* Partner Name */}
          <Form.Item
            label="Partner Name"
            name="partnerName"
            rules={[
              { required: true, message: "Please enter the partner name" }
            ]}
          >
            <Input
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Enter Partner Name"
            />
          </Form.Item>

          {/* Partner Mobile */}
          <Form.Item
            label="Partner Mobile"
            name="partnerContact"
            rules={[
              { required: true, message: "Please enter the partner mobile" }
            ]}
          >
            <Input
              value={partnerContact}
              onChange={(e) => setPartnerContact(e.target.value)}
              placeholder="Enter Partner Mobile"
            />
          </Form.Item>

          {/* Partner Address */}
          <Form.Item label="Partner Address" name="partnerAddress">
            <Input.TextArea
              value={partnerAddress}
              onChange={(e) => setPartnerAddress(e.target.value)}
              placeholder="Enter Partner Address"
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

      {/* Other Partner Table */}
      <Table
        columns={columns}
        dataSource={otherPartners}
        rowKey="partnerCode"
        className="other-partner-table"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default OtherPartnerProfile;
