import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Checkbox, Tree } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  getChartOfAccounts,
  createChartOfAccount,
  fetchTemplateData,
  saveSelectedTemplates,
  saveTemplateData, // New API to save templates
  fetchSelectedTemplates // Fetch previously selected templates
} from "../../service/AccountsService";
import { useAppSelector } from "globalRedux/hooks";
import "./ChartOfAccounts.css";

interface Account {
  accountId: number;
  chartOfAccCode: string;
  chartOfAccName: string;
  chartOfAccCategoryName: string;
}

const ChartOfAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] =
    useState<boolean>(false);
  const [templateData, setTemplateData] = useState<any[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<any[]>([]);
  const [newAccountCode, setNewAccountCode] = useState<string>("");
  const [newAccountName, setNewAccountName] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );
  const accountId = profileData?.accountId;

  useEffect(() => {
    if (accountId) {
      fetchAccounts(accountId, "");
    }
  }, [accountId]);

  const fetchAccounts = async (accountId: number, searchValue?: string) => {
    setLoading(true);
    try {
      const data = await getChartOfAccounts(accountId, searchValue || "");
      setAccounts(data);
    } catch (error) {
      message.error("Failed to load accounts.");
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value === "") {
      fetchAccounts(accountId, "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && accountId) {
      fetchAccounts(accountId, searchValue);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSaveAccount = async () => {
    if (!newAccountCode || !newAccountName) {
      message.error("Please enter both code and name.");
      return;
    }

    const payload = {
      chartOfAccCode: newAccountCode,
      chartOfAccName: newAccountName,
      accountId: profileData.accountId,
      branchId: 0,
      chartOfAccCategoryId: 0,
      chartOfAccCategoryName: "",
      actionById: profileData.userId
    };

    try {
      await createChartOfAccount(payload);
      message.success("Account created successfully.");
      setIsModalVisible(false);
      setNewAccountCode("");
      setNewAccountName("");
      fetchAccounts(accountId, "");
    } catch (error) {
      message.error("Failed to create account.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewAccountCode("");
    setNewAccountName("");
  };

  const showTemplateModal = async () => {
    setIsTemplateModalVisible(true);
    try {
      const data = await fetchTemplateData(accountId);
      setTemplateData(data);
    } catch (error) {
      message.error("Failed to load template data.");
    }
  };

  // Handle saving the selected template data to the backend
  const handleTemplateSave = async () => {
    try {
      // Prepare the payload based on the selected templates
      const templatePayload = selectedTemplates.map((templateId: string) => {
        const template = templateData.find(
          (t) => t.chartOfAccCode === templateId
        );
        return {
          templateId: 0, // As per the payload
          chartOfAccName: template.chartOfAccName,
          chartOfAccCode: template.chartOfAccCode,
          accountId: profileData.accountId,
          chartOfAccCategoryId: 0, // Adjust if you have category ID
          chartOfAccCategoryName: template.chartOfAccCategoryName,
          isPreviouslyChecked: true // Assuming it's the first time
        };
      });

      // Call API to save the templates
      await saveTemplateData(templatePayload);
      message.success("Templates saved successfully.");
      setIsTemplateModalVisible(false);
    } catch (error) {
      message.error("Failed to save templates.");
    }
  };

  const handleCategorySelect = (categoryName: string, isChecked: boolean) => {
    const categoryItems = templateData
      .filter((item) => item.chartOfAccCategoryName === categoryName)
      .map((item) => item.chartOfAccCode);

    if (isChecked) {
      setSelectedTemplates((prev) =>
        Array.from(new Set([...prev, ...categoryItems]))
      );
    } else {
      setSelectedTemplates((prev) =>
        prev.filter((code) => !categoryItems.includes(code))
      );
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const isSelected = selectedTemplates.includes(templateId);
    if (isSelected) {
      setSelectedTemplates(selectedTemplates.filter((id) => id !== templateId));
    } else {
      setSelectedTemplates([...selectedTemplates, templateId]);
    }
  };

  const handleSelectAll = () => {
    const allTemplateIds = templateData.map(
      (template) => template.chartOfAccCode
    );
    if (selectedTemplates.length === allTemplateIds.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(allTemplateIds);
    }
  };

  const groupByCategory = (data: any[]) => {
    const grouped = data.reduce((acc, item) => {
      const category = item.chartOfAccCategoryName;
      if (!acc[category]) {
        acc[category] = [];
      }
      const existingCodes = acc[category].map((i) => i.chartOfAccCode);
      if (!existingCodes.includes(item.chartOfAccCode)) {
        acc[category].push(item);
      }
      return acc;
    }, {} as Record<string, any[]>);

    return Object.keys(grouped).map((category) => ({
      title: (
        <div>
          <Checkbox
            checked={grouped[category].every((item) =>
              selectedTemplates.includes(item.chartOfAccCode)
            )}
            indeterminate={
              grouped[category].some((item) =>
                selectedTemplates.includes(item.chartOfAccCode)
              ) &&
              !grouped[category].every((item) =>
                selectedTemplates.includes(item.chartOfAccCode)
              )
            }
            onChange={(e) => handleCategorySelect(category, e.target.checked)}
          >
            {category}
          </Checkbox>
        </div>
      ),
      key: category,
      children: grouped[category].map((child) => ({
        title: (
          <Checkbox
            checked={selectedTemplates.includes(child.chartOfAccCode)}
            onChange={() => handleTemplateSelect(child.chartOfAccCode)}
          >
            {child.chartOfAccCode} - {child.chartOfAccName}
          </Checkbox>
        ),
        key: child.chartOfAccCode
      }))
    }));
  };

  const treeData = groupByCategory(templateData);

  const columns = [
    {
      title: "SL",
      key: "serialNo",
      render: (_text: any, _record: Account, index: number) => index + 1
    },
    {
      title: "Category",
      dataIndex: "chartOfAccCategoryName",
      key: "chartOfAccCategoryName"
    },
    { title: "Code", dataIndex: "chartOfAccCode", key: "chartOfAccCode" },
    { title: "Name", dataIndex: "chartOfAccName", key: "chartOfAccName" }
  ];

  return (
    <div className="chart-of-accounts-container">
      <div className="header-container">
        <Input
          placeholder="Search by code or name"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="create-button"
          >
            Create
          </Button>
          <Button
            type="default"
            onClick={showTemplateModal}
            className="template-button"
            style={{ marginLeft: "10px" }}
          >
            Template
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="accountId"
        loading={loading}
        className="custom-table"
        pagination={false}
      />

      <Modal
        title="Create Chart of Account"
        visible={isModalVisible}
        onOk={handleSaveAccount}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Account Code"
          value={newAccountCode}
          onChange={(e) => setNewAccountCode(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Account Name"
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
        />
      </Modal>

      <Modal
        visible={isTemplateModalVisible}
        onOk={handleTemplateSave}
        onCancel={() => setIsTemplateModalVisible(false)}
        width={800}
      >
        {/* Adding Save Button */}
        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <Button
            type="primary"
            onClick={handleTemplateSave} // Call the save function on button click
          >
            Save
          </Button>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Button onClick={handleSelectAll}>
            {selectedTemplates.length === templateData.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>

        <Tree
          treeData={treeData}
          selectable={false}
          checkable={false}
          defaultExpandAll={false}
        />
      </Modal>
    </div>
  );
};

export default ChartOfAccounts;
