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
import "./PurchaseReceiveModal.css"; // Importing CSS
import { useAppSelector } from "globalRedux/hooks";
import moment from "moment";
import { Item } from "models/Item";
import { Supplier } from "models/Supplier";
import { ItemFormData } from "models/ItemFormData";
import axios from "axios";
import {
  fetchPurchases,
  createPurchaseReceive
} from "../../services/PurchaseService";

const { Option } = Select;

const PurchaseReceiveModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  loadPurchases: () => void;
}> = ({ visible, onClose, loadPurchases }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [supplier, setSupplier] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [date, setDate] = useState<string | null>(null);
  const [totalSum, setTotalSum] = useState<number>(0);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [itemList, setItemList] = useState<ItemFormData[]>([]);

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );
  const accountId = profileData.accountId;

  useEffect(() => {
    if (visible) {
      fetchSuppliers();
      fetchItems();
    }
  }, [visible]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        `/api/Configuration/GetPartnerList?accountId=${accountId}&partnerTypeId=2`
      );
      setSuppliers(response.data);
    } catch (error) {
      message.error("Failed to fetch suppliers.");
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `/api/Configuration/GetItemList?accountId=${accountId}`
      );
      setItemList(response.data);
    } catch (error) {
      message.error("Failed to fetch items.");
    }
  };

  const addItem = () => {
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

  const handleItemChange = (index: number, field: string, value: any) => {
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
          ? updatedItems?.[index]?.qty * updatedItems?.[index]?.rate
          : updatedItems[index].total
    };
    setItems(updatedItems);
  };

  useEffect(() => {
    const sum = items.reduce((acc, item: any) => acc + item.total, 0);
    setTotalSum(sum);
  }, [items]);

  const removeItem = (key: number) => {
    setItems(items.filter((item) => item.key !== key));
  };

  const handleSubmit = async () => {
    if (!date) {
      message.error("Please select a received date.");
      return;
    }
    if (!supplier) {
      message.error("Please select a supplier.");
      return;
    }

    // Construct the payload
    const payload = {
      header: {
        receiveCode: "",
        receivedDate: moment(date).toISOString(),
        receivedDateLanding: moment(date).format("YYYY-MM-DD"),
        accountId,
        supplierId: suppliers.find((sup) => sup.partnerName === supplier)
          ?.partnerId,
        supplierName: supplier,
        remarks,
        actionById: profileData.userId, // Assuming actionById is current user's ID
        actionByName: profileData.userName, // Assuming actionByName is current user's name
        isActive: true
      },
      rows: items.map((item: any) => ({
        rowId: 0,
        headerId: 0, // Will be populated on the server-side
        itemId: itemList.find((i) => i.itemName === item.itemName)?.itemId,
        itemName: item.itemName,
        uomName: item.uom,
        quantity: item.qty,
        rate: item.rate,
        totalAmount: item.qty * item.rate,
        isActive: true
      }))
    };

    try {
      // Call the API to save the data
      await createPurchaseReceive(payload);
      message.success("Purchase receive saved successfully.");
      loadPurchases();
      onClose(); // Close modal on success
    } catch (error) {
      message.error("Failed to save purchase receive.");
    }
  };

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
          style={{ width: "150px" }}
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
      title: "UoM",
      dataIndex: "uom",
      key: "uom",
      render: (text: any, record: Item, index: number) => (
        <Input
          value={items[index].uom}
          onChange={(e) => handleItemChange(index, "uom", e.target.value)}
          placeholder="Enter UoM"
          style={{ width: "100px" }}
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
          style={{ width: "100px" }}
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
          style={{ width: "120px" }}
        />
      )
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text: any, record: Item, index: number) => (
        <span>{items[index].qty * items[index].rate}</span>
      )
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: Item, index: number) => (
        <Button
          icon={<DeleteOutlined />}
          type="default"
          onClick={() => removeItem(record.key)}
        />
      )
    }
  ];

  return (
    <Modal
      title="Purchase Receive"
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
        <div className="header-container">
          <div className="header-section">
            <div className="header-input">
              <label>
                Received Date <span style={{ color: "red" }}>*</span>
              </label>
              <DatePicker
                style={{ width: "100%" }}
                onChange={(date, dateString) => setDate(dateString?.toString())}
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
