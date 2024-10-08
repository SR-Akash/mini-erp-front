import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification, Table, message, Form } from "antd";
import { getItems, createItem } from "../../services/ItemService";
import { Item } from "models/Item";
import "./ItemProfile.css"; // Ensure your CSS is linked properly
import { useAppSelector } from "globalRedux/hooks";
import { PlusOutlined } from "@ant-design/icons";

const ItemProfile: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal state
  const [itemName, setItemName] = useState<string>("");
  const [uomName, setUomName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");

  const accountId = parseInt(localStorage.getItem("accountId") || "1", 10); // Example: Fetch from localStorage

  // Fetch items from API when the component is mounted
  useEffect(() => {
    loadItems();
  }, [accountId]);

  const loadItems = async () => {
    try {
      const data = await getItems(accountId); // Existing API call to get items
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
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

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );

  // Handle Form Submission (Saving Item)
  const handleSave = async () => {
    try {
      const values = { itemName, uomName, itemDescription };

      const payload = {
        itemCode: "",
        itemName: values.itemName,
        uomId: 0,
        uomName: values.uomName,
        itemDescription: values.itemDescription,
        isActive: true,
        actionById: profileData.userId,
        accountId: profileData.accountId
      };

      await createItem(payload); // Call API to create the item
      message.success("Item created successfully!");
      setIsModalVisible(false); // Close the modal after submission
      resetFormFields(); // Reset form fields
      loadItems(); // Reload the item list to reflect the new item
    } catch (errorInfo) {
      console.error("Error creating item:", errorInfo);
      notification.error({ message: "Failed to create item." });
    }
  };

  const resetFormFields = () => {
    setItemName("");
    setUomName("");
    setItemDescription("");
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      render: (_: any, __: any, index: number) => index + 1
    },
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "Item Name", dataIndex: "itemName", key: "itemName" },
    { title: "UoM", dataIndex: "uomName", key: "uomName" },
    {
      title: "Item Description",
      dataIndex: "itemDescription",
      key: "itemDescription"
    }
  ];

  return (
    <div className="item-container">
      <div className="header-container">
        <h3>Item List</h3>
        <Button
          type="primary"
          onClick={showModal}
          icon={<PlusOutlined />}
          className="create-button"
        >
          Create Item
        </Button>
      </div>

      {/* Modal for Creating New Item */}
      <Modal
        title="Create New Item"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="create-item-modal"
      >
        <Form
          layout="vertical" // This ensures the form fields are stacked vertically
          onFinish={handleSave} // Handle form submission on save
        >
          {/* Item Name */}
          <Form.Item
            label="Item Name"
            name="itemName"
            rules={[{ required: true, message: "Please enter the item name" }]}
          >
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter Item Name"
            />
          </Form.Item>

          {/* Unit of Measure (UoM) */}
          <Form.Item
            label="Unit of Measure (UoM)"
            name="uomName"
            rules={[
              { required: true, message: "Please enter the unit of measure" }
            ]}
          >
            <Input
              value={uomName}
              onChange={(e) => setUomName(e.target.value)}
              placeholder="Enter Unit of Measure"
            />
          </Form.Item>

          {/* Item Description */}
          <Form.Item label="Item Description" name="itemDescription">
            <Input.TextArea
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Enter Item Description"
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

      {/* Item Table */}
      <Table
        columns={columns}
        dataSource={items}
        rowKey="itemCode"
        className="item-table"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ItemProfile;
