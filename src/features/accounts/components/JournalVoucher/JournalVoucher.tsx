import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  DatePicker,
  Pagination,
  Modal,
  Form,
  Select,
  InputNumber,
  message
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";
import {
  getJournalVoucherLandingData,
  getJournalVoucherById,
  saveJournalVoucher,
  getChartOfAccounts, // Call to fetch chart of accounts
  getPartners // Call to fetch partners based on templateId
} from "../../service/AccountsService";
import moment from "moment";
import "./JournalVoucher.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

const JournalVoucherLandingPage: React.FC = () => {
  const [journalVouchers, setJournalVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const [dateRange, setDateRange] = useState<
    [moment.Moment | null, moment.Moment | null]
  >([null, null]);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const pageSize = 15;

  // Modal states for viewing journal voucher
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [voucherDetailsLoading, setVoucherDetailsLoading] =
    useState<boolean>(false);

  // Modal states for creating journal voucher
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [form] = Form.useForm();

  // Create modal state variables
  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState<number | null>(null);

  useEffect(() => {
    fetchJournalVouchers();
  }, [searchValue, dateRange, currentPage]);

  // Fetch the journal vouchers for the landing page
  const fetchJournalVouchers = async () => {
    setLoading(true);
    const fromDate = dateRange[0]
      ? dateRange[0].format("YYYY-MM-DD")
      : undefined;
    const toDate = dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : undefined;

    try {
      const data = await getJournalVoucherLandingData(
        1,
        fromDate,
        toDate,
        searchValue,
        "desc",
        currentPage,
        pageSize
      );
      setJournalVouchers(data.data);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Failed to load journal vouchers", error);
    }
    setLoading(false);
  };

  // Fetch details for the view modal
  const fetchVoucherDetails = async (voucherId: number) => {
    setVoucherDetailsLoading(true);
    try {
      const data = await getJournalVoucherById(voucherId);
      setSelectedVoucher(data);
    } catch (error) {
      console.error("Failed to load journal voucher details", error);
    }
    setVoucherDetailsLoading(false);
  };

  // Fetch Chart of Accounts when the create modal is opened
  const fetchChartOfAccounts = async () => {
    try {
      const data = await getChartOfAccounts(1);
      setChartOfAccounts(data);
    } catch (error) {
      message.error("Failed to load Chart of Accounts");
    }
  };

  // Fetch Partners (Customer/Supplier) based on templateId
  const fetchPartners = async (partnerTypeId: number) => {
    try {
      const data = await getPartners(1, partnerTypeId);
      setPartners(data);
    } catch (error) {
      message.error("Failed to load partners");
    }
  };

  // Handle Chart Of Account change and fetch partners if templateId is 3 or 8
  const handleChartOfAccountChange = (chartofAccId: number) => {
    const selectedAccount = chartOfAccounts.find(
      (account) => account.chartofAccId === chartofAccId
    ); // Use chartofAccId

    if (selectedAccount && selectedAccount.templateId !== undefined) {
      const selectedTemplateId = selectedAccount.templateId;
      setTemplateId(selectedTemplateId);

      // Fetch partners based on the templateId
      if (selectedTemplateId === 3) {
        fetchPartners(1); // Load customers (partnerTypeId = 1)
      } else if (selectedTemplateId === 8) {
        fetchPartners(2); // Load suppliers (partnerTypeId = 2)
      }
    } else {
      message.error(
        "Invalid chart of account selection or missing templateId."
      );
      setTemplateId(null);
      setPartners([]); // Clear any previously loaded partners
    }
  };

  // Handle form submission (save API call)
  const handleSave = async (values: any) => {
    try {
      await saveJournalVoucher(values); // Call the save API with form values
      setIsCreateModalVisible(false);
      form.resetFields(); // Reset the form after save
      fetchJournalVouchers(); // Refresh the voucher list
    } catch (error) {
      console.error("Failed to save journal voucher", error);
    }
  };

  // Handle Search and Date changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchJournalVouchers();
    }
  };

  const handleDateChange = (
    dates: [moment.Moment | null, moment.Moment | null]
  ) => {
    setDateRange(dates || []);
  };

  const handleCreateClick = () => {
    setIsCreateModalVisible(true);
    fetchChartOfAccounts(); // Fetch chart of accounts when modal is opened
  };

  // View Journal Voucher (open modal)
  const handleViewClick = (record: any) => {
    setIsModalVisible(true);
    fetchVoucherDetails(record.subLedgerHeaderId); // Load voucher details for the view modal
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedVoucher(null); // Clear modal data when closed
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
    form.resetFields(); // Reset the form when closing
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD")
    },
    {
      title: "Transaction No",
      dataIndex: "subLedgerCode",
      key: "subLedgerCode"
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionTypeName",
      key: "transactionTypeName"
    },
    {
      title: "Narration",
      dataIndex: "narration",
      key: "narration"
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount"
    },
    {
      title: "Action",
      key: "action",
      render: (_text: any, record: any) => (
        <Button icon={<EyeOutlined />} onClick={() => handleViewClick(record)}>
          View
        </Button>
      )
    }
  ];

  return (
    <div className="journal-voucher-container row">
      <div className="header-container col-lg-24 d-flex align-items-center justify-content-between">
        <div className="d-flex" style={{ gap: "10px" }}>
          <div className="col-lg-5">
            <Input
              placeholder="Search by transaction no."
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="search-input"
            />
          </div>
          <div className="col-lg-5">
            <RangePicker value={dateRange} onChange={handleDateChange} />
          </div>
        </div>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            style={{ marginLeft: "10px" }}
          >
            Create
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={journalVouchers}
        rowKey="transactionCode"
        loading={loading}
        className="custom-table"
        pagination={false}
      />

      <div className="pagination-container">
        <Pagination
          current={currentPage}
          total={totalCount}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {/* View Journal Voucher Modal */}
      <Modal
        title="Account Journal Details"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
        width={800}
      >
        {voucherDetailsLoading ? (
          <p>Loading...</p>
        ) : selectedVoucher ? (
          <div className="voucher-details">
            <div className="header-info">
              <div className="header-row">
                <span className="label">Transaction No:</span>
                <span className="value">
                  {selectedVoucher.header.subLedgerCode}
                </span>
              </div>
              <div className="header-row">
                <span className="label">Transaction Date:</span>
                <span className="value">
                  {new Date(
                    selectedVoucher.header.transactionDate
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="header-row">
                <span className="label">Transaction Type:</span>
                <span className="value">
                  {selectedVoucher.header.transactionTypeName}
                </span>
              </div>

              <div className="header-row">
                <span className="label">Action By:</span>
                <span className="value">
                  {selectedVoucher.header.actionByName}
                </span>
              </div>
              <div className="header-row">
                <span className="label">Remarks:</span>
                <span className="value">
                  {selectedVoucher.header.narration}
                </span>
              </div>
            </div>

            <Table
              columns={[
                { title: "SL", dataIndex: "rowId", key: "rowId" },
                {
                  title: "Chart Of Account No",
                  dataIndex: "chartOfAccCode",
                  key: "chartOfAccCode"
                },
                {
                  title: "Chart Of Account Name",
                  dataIndex: "chartOfAccName",
                  key: "chartOfAccName"
                },
                {
                  title: "Debit",
                  dataIndex: "amount",
                  key: "debit",
                  render: (amount: number) =>
                    amount > 0 ? amount.toFixed(2) : ""
                },
                {
                  title: "Credit",
                  dataIndex: "amount",
                  key: "credit",
                  render: (amount: number) =>
                    amount < 0 ? Math.abs(amount).toFixed(2) : ""
                }
              ]}
              dataSource={selectedVoucher.rows}
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={3}>Total</Table.Summary.Cell>
                  <Table.Summary.Cell>
                    {selectedVoucher.rows
                      .filter((row: any) => row.amount > 0)
                      .reduce((acc: number, row: any) => acc + row.amount, 0)
                      .toFixed(2)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    {selectedVoucher.rows
                      .filter((row: any) => row.amount < 0)
                      .reduce(
                        (acc: number, row: any) => acc + Math.abs(row.amount),
                        0
                      )
                      .toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </div>
        ) : (
          <p>No data available</p>
        )}
      </Modal>

      {/* Create Journal Voucher Modal */}
      <Modal
        title="Create Journal Voucher"
        visible={isCreateModalVisible}
        onCancel={handleCloseCreateModal}
        footer={[
          <Button key="cancel" onClick={handleCloseCreateModal}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={() => form.submit()}>
            Save
          </Button>
        ]}
        width={1000}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          {/* Date Picker */}
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Date is required" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Narration Field */}
          <Form.Item
            name="narration"
            label="Narration"
            rules={[{ required: true, message: "Narration is required" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          {/* Dynamic Row List */}
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "10px"
                    }}
                  >
                    {/* Chart Of Account Dropdown */}
                    <Form.Item
                      {...field}
                      name={[field.name, "chartOfAccount"]}
                      fieldKey={[field.fieldKey, "chartOfAccount"]}
                      label="Chart Of Account"
                      rules={[
                        {
                          required: true,
                          message: "Chart Of Account is required"
                        }
                      ]}
                      style={{ flex: 2 }}
                    >
                      <Select
                        placeholder="Select Account"
                        onChange={(chartofAccId) =>
                          handleChartOfAccountChange(chartofAccId)
                        }
                      >
                        {chartOfAccounts.map((account: any) => (
                          <Option
                            key={account.chartofAccId}
                            value={account.chartofAccId}
                          >
                            {account.chartOfAccName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Partner Input Field */}
                    <Form.Item
                      {...field}
                      name={[field.name, "partner"]}
                      fieldKey={[field.fieldKey, "partner"]}
                      label="Customer/Supplier/Employee"
                      style={{ flex: 2 }}
                    >
                      <Select placeholder="Select Name">
                        {partners.map((partner: any) => (
                          <Option
                            key={partner.partnerId}
                            value={partner.partnerName}
                          >
                            {partner.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Debit Input Field */}
                    <Form.Item
                      {...field}
                      name={[field.name, "debit"]}
                      fieldKey={[field.fieldKey, "debit"]}
                      label="Debit"
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        placeholder="Debit"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>

                    {/* Credit Input Field */}
                    <Form.Item
                      {...field}
                      name={[field.name, "credit"]}
                      fieldKey={[field.fieldKey, "credit"]}
                      label="Credit"
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        placeholder="Credit"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>

                    {/* Remove Row Button */}
                    <Button
                      type="danger"
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(field.name)}
                      style={{ marginTop: 30 }}
                    />
                  </div>
                ))}

                {/* Add Row Button */}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginTop: "20px" }}
                >
                  Add Row
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default JournalVoucherLandingPage;
