import React, { useEffect } from "react";
import { Row, Col, Button, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import MSelect from "common/components/input/MSelect";
import MInputField from "common/components/input/InputField";
import ScrollableTable from "common/components/table/ScrollableTable";
import { toast } from "react-toastify";
import useAxios from "common/hooks/useAxios";

type Item = {
  itemName: string;
  uom: string;
  quantity: number;
  rate: number;
  total: number;
};

type Purchase = {
  supplier: string;
  createDate: any;
  remarks: string;
  items: Item[];
  totalAmount: number;
};

type PurchaseFormProps = {
  purchase: Purchase;
  setPurchase: React.Dispatch<React.SetStateAction<Purchase>>;
};

const PurchaseForm: React.FC<PurchaseFormProps> = ({
  purchase,
  setPurchase
}) => {
  // Dropdown options for suppliers and items
  //   const supplierOptions = [
  //     { value: "supplier1", label: "Supplier 1" },
  //     { value: "supplier2", label: "Supplier 2" }
  //   ];
  const {
    res: supplierOptions,
    postData: getSupplierOptions,
    loading: supplierOptionsLoading
  } = useAxios();

  useEffect(() => {
    getSupplierOptions({
      url: `/sme/SMEDDL/PartnerDDLSearch?AccountId=20218&BranchId=40326&PartnerTypeId=2`,
      method: "get"
    });
  }, []);

  const itemOptions = [
    { value: "item1", label: "Hp Pro Book" },
    { value: "item2", label: "Dell XPS" }
  ];

  // Handle change for fields
  const handleFieldChange = (field: string, value: string) => {
    setPurchase((prev) => ({ ...prev, [field]: value }));
  };

  // Handle change for items
  const handleItemChange = (index: number, field: string, value: any) => {
    const exist = purchase.items.filter(
      (x: any) => x.itemName?.value === value.value
    );

    if (exist.length > 0) {
      toast.warning("Item already added.");
      return;
    }
    const items = [...purchase.items];

    // Update the item's field (itemName, uom, quantity, rate)
    items[index] = {
      ...items[index],
      [field]: value,
      // Recalculate the total whenever quantity or rate changes
      total:
        field === "quantity" || field === "rate"
          ? (field === "quantity" ? +value : items[index].quantity) *
            (field === "rate" ? +value : items[index].rate)
          : items[index].total
    };

    // Calculate total amount for all items
    setPurchase({
      ...purchase,
      items,
      totalAmount: items.reduce((acc, curr) => acc + curr.total, 0)
    });
  };

  // Add a new item row
  const addItem = () => {
    setPurchase((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { itemName: "", uom: "", quantity: 0, rate: 0, total: 0 }
      ]
    }));
  };

  // Remove an item row
  const removeItem = (index: number) => {
    const items = [...purchase.items];
    items.splice(index, 1);
    setPurchase((prev) => ({
      ...prev,
      items,
      totalAmount: items.reduce((acc, curr) => acc + curr.total, 0)
    }));
  };

  // Check if the item at the current index is valid
  const isItemValid = (item: Item) => {
    return !item.itemName || !item.quantity || !item.rate;
  };

  // Check if the previous item is valid
  const isPreviousItemValid = (index: number) => {
    if (index === 0) return true; // No previous item for the first row
    const previousItem = purchase.items[index - 1];
    return isItemValid(previousItem);
  };

  // Check if the current item (last item) is valid
  const isCurrentItemValid = (item: any) => {
    // const lastItem = purchase.items[purchase.items.length - 1];
    return isItemValid(item);
  };

  // Disable add button if the current item is not valid
  const isAddButtonDisabled = (item: any) => {
    const lastIndex = purchase.items.length - 1;
    return isCurrentItemValid(item);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Purchase Data Submitted:", purchase);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Purchase Order</h2>

      <Row gutter={16}>
        <Col span={8}>
          <MInputField
            label="Create Date"
            name="createDate"
            type="date"
            placeholder="Create Date"
            onChange={(value: string) => handleFieldChange("createDate", value)}
            value={purchase.createDate}
            allowClear
          />
        </Col>
        {/* Supplier Dropdown */}
        <Col span={8}>
          <MSelect
            label="Supplier"
            name="supplier"
            options={supplierOptions}
            placeholder="Select Supplier"
            onChange={(value: string) => handleFieldChange("supplier", value)}
            value={purchase.supplier}
            allowClear
          />
        </Col>

        {/* Remarks Input */}
        <Col span={8}>
          <MInputField
            name="remarks"
            label="Remarks"
            type="text"
            placeholder="Enter remarks"
            value={purchase.remarks}
            onChange={(value: string) => handleFieldChange("remarks", value)}
          />
        </Col>
      </Row>

      <Divider />

      <h3>Item Details</h3>
      <ScrollableTable>
        <>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Uom</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {purchase.items.map((item, index) => (
              <tr key={index}>
                <td style={{ width: "200px" }}>
                  <MSelect
                    placeholder="Select Item"
                    name={`itemName_${index}`}
                    options={itemOptions}
                    onChange={(value: string) =>
                      handleItemChange(index, "itemName", value)
                    }
                    value={item.itemName}
                    allowClear
                  />
                </td>
                <td>
                  <MInputField
                    name={`uom_${index}`}
                    label=""
                    type="text"
                    placeholder="Unit of Measure"
                    value={item.uom}
                    onChange={(value: string) =>
                      handleItemChange(index, "uom", value)
                    }
                  />
                </td>
                <td>
                  <MInputField
                    name={`quantity_${index}`}
                    label=""
                    type="number"
                    placeholder="Enter Quantity"
                    value={item.quantity}
                    onChange={(value: string) =>
                      handleItemChange(index, "quantity", value)
                    }
                  />
                </td>
                <td>
                  <MInputField
                    name={`rate_${index}`}
                    label=""
                    type="number"
                    placeholder="Enter Rate"
                    value={item.rate}
                    onChange={(value: string) =>
                      handleItemChange(index, "rate", value)
                    }
                  />
                </td>
                <td align="right">{item.total}</td>
                <td>
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={addItem}
                    disabled={isAddButtonDisabled(item)} // Disable add button based on validation
                    style={{ marginRight: 8 }}
                  />

                  {/* Remove Item Icon */}
                  {purchase.items.length > 1 && (
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => removeItem(index)}
                    />
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} align="right">
                Total
              </td>
              <td align="right">
                {purchase.items.reduce((a: any, c: any) => a + +c.quantity, 0)}
              </td>
              <td></td>
              <td align="right">
                {purchase.items.reduce(
                  (a: any, c: any) => a + +c.quantity * c.rate,
                  0
                )}
              </td>
            </tr>
          </tbody>
        </>
      </ScrollableTable>
    </form>
  );
};

export default PurchaseForm;
