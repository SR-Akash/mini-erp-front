import React, { useEffect, useState } from "react";
import { Button, Modal, Input, notification } from "antd";
import { getItems, createItem } from "../../services/ItemService";
import { Item } from "models/Item";
import "./ItemProfile.css"; // Ensure your CSS is linked properly
import { useAppSelector } from "globalRedux/hooks";

const ItemProfile: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal state
  const [itemCode, setItemCode] = useState<string>("");
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
      const values = { itemCode, itemName, uomName, itemDescription };

      var payload = {
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
      notification.success({ message: "Item created successfully!" }); // Show success notification
      setIsModalVisible(false); // Close the modal after submission
      resetFormFields(); // Reset form fields
      loadItems(); // Reload the item list to reflect the new item
    } catch (errorInfo) {
      console.error("Error creating item:", errorInfo);
      notification.error({ message: "Failed to create item." }); // Show error notification
    }
  };

  const resetFormFields = () => {
    setItemCode("");
    setItemName("");
    setUomName("");
    setItemDescription("");
  };

  return (
    <div>
      <div className="item-profile-header">
        <h2>Item Profile</h2>

        {/* Button to open the modal */}
        <Button
          type="primary"
          onClick={showModal}
          className="create-item-btn"
          style={{ float: "right", marginBottom: "20px" }}
        >
          Create Item
        </Button>
      </div>

      {/* Ant Design Modal for Create Item */}
      <Modal
        title="Create New Item"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="create-item-modal"
      >
        <form>
          {/* Item Name */}
          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter Item Name"
              required
            />
          </div>

          {/* Unit of Measure */}
          <div className="form-group">
            <label htmlFor="uomName">Uom</label>
            <Input
              id="uomName"
              value={uomName}
              onChange={(e) => setUomName(e.target.value)}
              placeholder="Enter Unit of Measure"
              required
            />
          </div>

          {/* Item Description */}
          <div className="form-group">
            <label htmlFor="itemDescription">Item Description</label>
            <Input.TextArea
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Enter Item Description"
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

      {/* Item Table */}
      <table>
        <thead>
          <tr>
            <th>SL</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>UoM</th>
            <th>Item Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* SL - Serial Number */}
              <td>{item.itemCode}</td>
              <td>{item.itemName}</td>
              <td>{item.uomName}</td>
              <td>{item.itemDescription}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemProfile;
