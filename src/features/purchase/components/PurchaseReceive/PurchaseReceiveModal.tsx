import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Table,
  Tooltip,
  message
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import axios from "axios"; // For API call
import "./PurchaseReceiveModal.css";
import { useAppSelector } from "globalRedux/hooks";

const { Option } = Select;

interface Supplier {
  partnerId: number;
  partnerName: string;
}

interface Item {
  key: number;
  itemName: string;
  uom: string;
  qty: number;
  rate: number;
  total: number;
}

interface ItemData {
  itemId: number;
  itemName: string;
}

const PurchaseReceiveModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [supplier, setSupplier] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [date, setDate] = useState<string | null>(null); // Date state
  const [totalSum, setTotalSum] = useState<number>(0);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // State for supplier dropdown
  const [itemList, setItemList] = useState<ItemData[]>([]); // State for item list

  // Fetch suppliers from API when modal is opened
  useEffect(() => {
    if (visible) {
      fetchSuppliers();
      fetchItems(); // Fetch items when the modal opens
    }
  }, [visible]);

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );
  const accountId = profileData.accountId;

  // API call to fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        `/api/Configuration/GetPartnerList?accountId=${accountId}&partnerTypeId=2`
      );
      setSuppliers(response.data);
    } catch (error) {
      message.error("Failed to fetch suppliers.");
      console.error(error);
    }
  };

  // API call to fetch items for the Item Name dropdown
  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `/api/Configuration/GetItemList?accountId=${accountId}`
      );
      setItemList(response.data);
    } catch (error) {
      message.error("Failed to fetch item list.");
      console.error(error);
    }
  };

  // Add a new item to the table
  const addItem = () => {
    // Prevent adding a new row if the previous row does not have an item selected
    const lastItem = items[items.length - 1];
    if (lastItem && !lastItem.itemName) {
      message.error("Please select an item before adding a new row.");
      return;
    }

    const newItem = {
      key: Date.now(),
      itemName: "",
      uom: "PCS",
      qty: 1,
      rate: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  // Handle item change and prevent duplicate items
  const handleItemChange = (index: number, field: string, value: any) => {
    // Prevent duplicate items
    if (
      field === "itemName" &&
      items.some((item, i) => i !== index && item.itemName === value)
    ) {
      message.error("This item has already been added.");
      return;
    }

    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      total:
        field === "qty" || field === "rate"
          ? updatedItems[index].qty * updatedItems[index].rate
          : updatedItems[index].total
    };
    setItems(updatedItems);
  };

  // Calculate the total sum of all items
  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + item.total, 0);
    setTotalSum(sum);
  }, [items]);

  // Remove an item from the table
  const removeItem = (key: number) => {
    setItems(items.filter((item) => item.key !== key));
  };

  // Submit the form data
  const handleSubmit = () => {
    if (!date) {
      message.error("Please select a received date.");
      return;
    }
    if (!supplier) {
      message.error("Please select a supplier.");
      return;
    }

    console.log({ date, supplier, remarks, items });
    onClose(); // Close the modal after submission
  };

  // Table columns with fixed input field sizes and calculated total
  const columns = [
    {
      title: "SL",
      dataIndex: "key",
      key: "key",
      render: (text: any, record: Item, index: number) => index + 1
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      render: (text: any, record: Item, index: number) => (
        <Select
          value={items[index].itemName}
          onChange={(value) => handleItemChange(index, "itemName", value)}
          placeholder="Select Item"
          style={{ width: "150px" }} // Fixed width for Item Name input
        >
          {itemList.map((item) => (
            <Option key={item.itemId} value={item.itemName}>
              {item.itemName}
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: "UoM", // UoM is now a text input field
      dataIndex: "uom",
      key: "uom",
      render: (text: any, record: Item, index: number) => (
        <Input
          value={items[index].uom}
          onChange={(e) => handleItemChange(index, "uom", e.target.value)}
          placeholder="Enter UoM"
          style={{ width: "100px" }} // Fixed width for UoM input
        />
      )
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
      render: (text: any, record: Item, index: number) => (
        <InputNumber
          min={1}
          value={items[index].qty}
          onChange={(value) => handleItemChange(index, "qty", value)}
          style={{ width: "100px" }} // Fixed width for Quantity input
        />
      )
    },
    {
      title: "Rate (BDT)",
      dataIndex: "rate",
      key: "rate",
      render: (text: any, record: Item, index: number) => (
        <InputNumber
          min={0}
          value={items[index].rate}
          onChange={(value) => handleItemChange(index, "rate", value)}
          style={{ width: "120px" }} // Fixed width for Rate input
        />
      )
    },
    {
      title: "Total", // This is now a calculated field
      dataIndex: "total",
      key: "total",
      render: (text: any, record: Item, index: number) => (
        <span>{items[index].qty * items[index].rate}</span> // Calculated field
      )
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: Item, index: number) => (
        <div>
          <Tooltip title="Delete Item">
            <Button
              icon={<DeleteOutlined />}
              type="danger"
              onClick={() => removeItem(record.key)}
            />
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <Modal
      title="Purchase"
      visible={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          style={{ backgroundColor: "#f5222d", color: "white" }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          style={{ backgroundColor: "#1890ff", color: "white" }}
        >
          Save
        </Button>
      ]}
    >
      <Form layout="vertical">
        {/* Header Section with Save button on top-right of Remarks */}
        <div className="header-container">
          <div className="header-section">
            <div className="header-input">
              <label>
                Received Date <span style={{ color: "red" }}>*</span>
              </label>
              <DatePicker
                style={{ width: "100%" }}
                onChange={(date, dateString) => setDate(dateString)}
              />
            </div>

            <div className="header-input">
              <label>
                Select Supplier <span style={{ color: "red" }}>*</span>
              </label>
              <Select
                value={supplier}
                onChange={(value) => setSupplier(value)}
                placeholder="Select Supplier"
                style={{ width: "100%" }}
              >
                {suppliers.map((supplier) => (
                  <Option key={supplier.partnerId} value={supplier.partnerName}>
                    {supplier.partnerName}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="header-input remarks-with-save">
              <label>Remarks</label>
              <Input.TextArea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks"
              />

              {/* Save button on top-right of Remarks */}
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                className="save-button"
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Total Sum in the top-right corner */}
        <div
          style={{
            textAlign: "left",
            marginBottom: "10px",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Total Amount: {totalSum}
        </div>

        {/* Items Table */}
        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          footer={() => (
            <Button
              type="dashed"
              onClick={addItem}
              block
              icon={<PlusOutlined />}
              style={{ backgroundColor: "#52c41a", color: "white" }}
            >
              Add Item
            </Button>
          )}
        />
      </Form>
    </Modal>
  );
};

export default PurchaseReceiveModal;
