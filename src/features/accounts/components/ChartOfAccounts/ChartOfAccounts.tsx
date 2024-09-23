import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  message,
  Checkbox,
  Tree,
  Select
} from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import {
  getChartOfAccounts,
  createChartOfAccount,
  fetchTemplateData,
  saveTemplateData,
  fetchCategoryList,
  updateChartOfAccount
} from "../../service/AccountsService";
import { useAppSelector } from "globalRedux/hooks";
import "./ChartOfAccounts.css";

const { Option } = Select;

interface Account {
  accountId: number;
  chartofAccId: number;
  chartOfAccCode: string;
  chartOfAccName: string;
  chartOfAccCategoryName: string;
  chartOfAccCategoryId: number;
}

const ChartOfAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState({
    isVisible: false,
    chatOfAccountId: 0
  });
  const [isTemplateModalVisible, setIsTemplateModalVisible] =
    useState<boolean>(false);
  const [templateData, setTemplateData] = useState<any[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<any[]>([]);
  const [newAccountCode, setNewAccountCode] = useState<string>("");
  const [newAccountName, setNewAccountName] = useState<string>("");
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const [searchValue, setSearchValue] = useState<string>("");

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );
  const accountId = profileData?.accountId;

  useEffect(() => {
    if (accountId) {
      fetchAccounts(accountId, "");
      fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const data = await fetchCategoryList(accountId);
      setCategories(data);
    } catch (error) {
      message.error("Failed to load categories.");
    }
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
    setIsModalVisible((prev) => ({
      ...prev,
      isVisible: true
    }));
    setEditAccount(null); // Reset the edit account when opening create modal
  };

  const handleSaveAccount = async () => {
    if (!newAccountCode || !newAccountName || !selectedCategory) {
      message.error("Please enter both code, name, and select a category.");
      return;
    }

    const payload = {
      chartOfAccCode: newAccountCode,
      chartOfAccName: newAccountName,
      accountId: profileData.accountId,
      branchId: 0,
      chartofAccId: isModalVisible.chatOfAccountId, // Pass chartOfAccId when editing
      chartOfAccCategoryId: selectedCategory,
      chartOfAccCategoryName:
        categories.find((c) => c.chartOfAccCategoryId === selectedCategory)
          ?.chartOfAccCategoryName || "",
      actionById: profileData.userId
    };

    try {
      if (editAccount) {
        // Update existing account
        await updateChartOfAccount(payload);
        message.success("Account updated successfully.");
      } else {
        // Create new account
        await createChartOfAccount(payload);
        message.success("Account created successfully.");
      }

      setIsModalVisible((prev) => ({
        ...prev,
        isVisible: false
      }));
      setNewAccountCode("");
      setNewAccountName("");
      fetchAccounts(accountId, ""); // Reload the accounts
    } catch (error) {
      message.error("Failed to save account.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible((prev) => ({
      ...prev,
      isVisible: false
    }));
    setNewAccountCode("");
    setNewAccountName("");
  };

  const showTemplateModal = async () => {
    setIsTemplateModalVisible(true);
    try {
      const data = await fetchTemplateData(accountId);
      setTemplateData(data);

      // Automatically select templates that are already checked (isPreviouslyChecked === true)
      const preSelectedTemplates = data
        .filter((item: any) => item.isPreviouslyChecked)
        .map((item: any) => item.chartOfAccCode);

      setSelectedTemplates(preSelectedTemplates); // Set initially selected templates
    } catch (error) {
      message.error("Failed to load template data.");
    }
  };

  const handleTemplateSave = async () => {
    try {
      const templatePayload = selectedTemplates.map((templateId: string) => {
        const template = templateData.find(
          (t) => t.chartOfAccCode === templateId
        );

        return {
          templateId: template.templateId || 0,
          chartOfAccName: template.chartOfAccName,
          chartOfAccCode: template.chartOfAccCode,
          accountId: profileData.accountId,
          chartOfAccCategoryId: template.chartOfAccCategoryId || 0,
          chartOfAccCategoryName: template.chartOfAccCategoryName,
          isPreviouslyChecked: true,
          actionById: profileData.userId
        };
      });

      await saveTemplateData(templatePayload);
      message.success("Templates saved successfully.");
      await fetchAccounts(accountId, ""); // Refresh the accounts list after saving
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

  const handleEdit = (account: Account) => {
    console.log(account);
    setEditAccount({
      ...account, // Spread the account object to include all its properties
      chartofAccId: account.chartofAccId // Ensure chartOfAccId is part of this object
    });
    setNewAccountCode(account.chartOfAccCode);
    setNewAccountName(account.chartOfAccName);
    setSelectedCategory(account.chartOfAccCategoryId);
    setIsModalVisible({
      isVisible: true,
      chatOfAccountId: account?.chartofAccId ?? 0
    });
  };

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
    { title: "Name", dataIndex: "chartOfAccName", key: "chartOfAccName" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_text: any, record: Account) => (
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Edit
        </Button>
      )
    }
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
        title={editAccount ? "Edit Account" : "Create Account"}
        visible={isModalVisible?.isVisible}
        onCancel={handleCancel}
      >
        <label>Chart of Acc Code</label>
        <Input
          value={newAccountCode}
          placeholder="Chart of Acc Code"
          onChange={(e) => setNewAccountCode(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <label>Chart of Acc Name</label>
        <Input
          value={newAccountName}
          placeholder="Chart of Acc Name"
          onChange={(e) => setNewAccountName(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <label>Chart of Acc Category</label>
        <Select
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          style={{ width: "100%" }}
          placeholder="Select Category"
        >
          {categories.map((category) => (
            <Option
              key={category.chartOfAccCategoryId}
              value={category.chartOfAccCategoryId}
            >
              {category.chartOfAccCategoryName}
            </Option>
          ))}
        </Select>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginTop: "10px",
            gap: "10px"
          }}
        >
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>
          <Button key="save" type="primary" onClick={handleSaveAccount}>
            {editAccount ? "Update" : "Save"}
          </Button>
        </div>
      </Modal>

      <Modal
        visible={isTemplateModalVisible}
        onOk={handleTemplateSave}
        onCancel={() => setIsTemplateModalVisible(false)}
        width={800}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px"
          }}
        >
          <div>
            <Button onClick={handleSelectAll}>
              {selectedTemplates.length === templateData.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>
          <div>
            <Button type="primary" onClick={handleTemplateSave}>
              Save
            </Button>
          </div>
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
