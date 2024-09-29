import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  notification,
  Select,
  Form,
  Table,
  Pagination,
  message
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import "./BankLandingPage.css"; // Ensure your CSS is linked properly
import { useAppSelector } from "globalRedux/hooks";

const { Option } = Select;

const BankLandingPage: React.FC = () => {
  const [banks, setBanks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSize = 15; // Display 15 items per page

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [bankNameOptions, setBankNameOptions] = useState<any[]>([]);
  const [branchNameOptions, setBranchNameOptions] = useState<any[]>([]);
  const [accountTypeOptions, setAccountTypeOptions] = useState<any[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [selectedAccountType, setSelectedAccountType] = useState<any | null>(
    null
  );

  const [form] = Form.useForm();

  const { profileData } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );

  // Fetch banks and set options for Bank Name, Account Type dropdowns
  useEffect(() => {
    loadBankAccounts(currentPage); // Load bank account data for the landing page
    loadDropdownData(); // Load data for the modal dropdowns
  }, [currentPage]);

  // Load Bank Accounts with Pagination
  const loadBankAccounts = async (page: number) => {
    try {
      const response = await axios.get(
        `api/Configuration/GetBankAccountLandingPagination?accountId=${profileData.accountId}&branchId=0`
      );

      // Paginate data based on current page
      const paginatedData = response.data.slice(
        (page - 1) * pageSize,
        page * pageSize
      );
      setBanks(paginatedData);
      setTotalItems(response.data.length);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      notification.error({ message: "Failed to load bank accounts." });
    }
  };

  // Load dropdown data for modal
  const loadDropdownData = async () => {
    try {
      const bankNames = await axios.get("api/Configuration/GetBankName");
      const accountTypes = await axios.get(
        "api/Configuration/GetBankAccountType"
      );

      setBankNameOptions(bankNames.data);
      setAccountTypeOptions(accountTypes.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  // Fetch branches based on selected bank
  const fetchBranchNames = async (bankId: number) => {
    try {
      const branchNames = await axios.get(
        `api/Configuration/GetBankBranch?bankId=${bankId}`
      );
      setBranchNameOptions(branchNames.data);
    } catch (error) {
      console.error("Error fetching branch names:", error);
    }
  };

  // Open Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedBranch(null); // Reset selected branch
    setSelectedAccountType(null); // Reset selected account type
  };

  // Handle Bank selection and fetch branches for the selected bank
  const handleBankChange = (bankId: number) => {
    setSelectedBankId(bankId);
    fetchBranchNames(bankId);
  };

  // Handle Branch Selection
  const handleBranchChange = (branchId: number) => {
    const branch = branchNameOptions.find(
      (branch) => branch.bankBranchId === branchId
    );
    setSelectedBranch(branch);
  };

  // Handle Account Type Selection
  const handleAccountTypeChange = (accountTypeId: number) => {
    const accountType = accountTypeOptions.find(
      (type) => type.bankAccountTypeId === accountTypeId
    );
    setSelectedAccountType(accountType);
  };

  // Handle Form Submission (Saving Bank)
  const handleSave = async (values: any) => {
    try {
      const selectedBank = bankNameOptions.find(
        (bank) => bank.bankId === selectedBankId
      );

      const payload = {
        accountId: profileData.accountId, // Adjust this value based on your context
        branchId: 0, // Branch ID from selection
        chartofAccId: 0, // Adjust this value based on your context
        bankId: selectedBank?.bankId || 0, // Selected Bank ID
        bankShortCode: selectedBank?.shortName || "", // Bank Short Code from the selected bank
        bankName: selectedBank?.bankName || "", // Bank Name from the selected bank
        routingNumber: selectedBranch?.routingNumber || "", // Routing Number from the selected branch
        bankBranchId: selectedBranch?.bankBranchId || 0, // Branch ID
        bankBranchName: selectedBranch?.bankBranchName || "", // Branch Name from the selected branch
        bankAccHolderName: values.accountName, // Account Holder Name from form
        bankAccountNumber: values.accountNumber, // Bank Account Number from form
        bankAccountTypeId: selectedAccountType?.bankAccountTypeId || 0, // Account Type ID from selection
        bankAccountTypeName: selectedAccountType?.bankAccountTypeNmae || "", // Account Type Name from selection
        actionById: profileData.userId,
        bankAccountId: 0 // Adjust this value based on your context
      };

      // Make the API call to create the bank account
      await axios.post("api/Configuration/CreateBankAccount", payload);
      message.success("Bank account created successfully!");

      // Close the modal
      setIsModalVisible(false);
      form.resetFields();

      // Call the API to refresh the bank landing data immediately
      loadBankAccounts(currentPage); // This will reload the bank data after creation
    } catch (errorInfo) {
      console.error("Error creating bank:", errorInfo);
      message.error("Failed to create bank account.");
    }
  };

  // Table columns for bank account data
  const columns = [
    {
      title: "SL",
      dataIndex: "bankAccountId",
      key: "bankAccountId",
      render: (_text: any, _record: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1 // Render the serial number
    },
    {
      title: "Bank Account Number",
      dataIndex: "bankAccountNumber",
      key: "bankAccountNumber"
    },
    {
      title: "Bank Short Code",
      dataIndex: "bankShortCode",
      key: "bankShortCode"
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName"
    },
    {
      title: "Branch Name",
      dataIndex: "bankBranchName",
      key: "bankBranchName"
    },
    {
      title: "Account Type",
      dataIndex: "bankAccountTypeName",
      key: "bankAccountTypeName"
    }
  ];

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bank-container">
      <div className="header-container">
        <h3>Bank List</h3>
        <Button
          type="primary"
          onClick={showModal}
          icon={<PlusOutlined />}
          className="create-button"
        >
          Create Bank
        </Button>
      </div>

      {/* Bank Table */}
      <Table
        dataSource={banks}
        columns={columns}
        rowKey="bankAccountId"
        pagination={false} // Disable built-in pagination
      />

      {/* Custom Pagination */}
      <div className="pagination-container">
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {/* Modal for Creating New Bank */}
      <Modal
        title="Create New Bank Account"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="create-bank-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <div className="bank-form">
            <div className="form-group">
              <Form.Item
                name="accountName"
                label="Account Name"
                rules={[
                  { required: true, message: "Account holder name is required" }
                ]}
              >
                <Input placeholder="Account Name" />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="bankName"
                label="Bank Name"
                rules={[{ required: true, message: "Bank name is required" }]}
              >
                <Select placeholder="Select Bank" onChange={handleBankChange}>
                  {bankNameOptions.map((bank) => (
                    <Option key={bank.bankId} value={bank.bankId}>
                      {bank.bankName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="branchName"
                label="Branch Name"
                rules={[{ required: true, message: "Branch name is required" }]}
              >
                <Select
                  placeholder="Select Branch"
                  onChange={handleBranchChange}
                >
                  {branchNameOptions.map((branch) => (
                    <Option
                      key={branch.bankBranchId}
                      value={branch.bankBranchId}
                    >
                      {branch.bankBranchName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="accountNumber"
                label="Bank Account Number"
                rules={[
                  {
                    required: true,
                    message: "Bank account number is required"
                  }
                ]}
              >
                <Input placeholder="Account Number" />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="bankShortName"
                label="Bank Short Name"
                rules={[
                  { required: true, message: "Bank short name is required" }
                ]}
              >
                <Input placeholder="Bank Short Name" />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="accountType"
                label="Bank Account Type"
                rules={[
                  { required: true, message: "Account type is required" }
                ]}
              >
                <Select
                  placeholder="Select Account Type"
                  onChange={handleAccountTypeChange}
                >
                  {accountTypeOptions.map((type) => (
                    <Option
                      key={type.bankAccountTypeId}
                      value={type.bankAccountTypeId}
                    >
                      {type.bankAccountTypeNmae}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-actions">
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: "10px" }}>
                Cancel
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BankLandingPage;
