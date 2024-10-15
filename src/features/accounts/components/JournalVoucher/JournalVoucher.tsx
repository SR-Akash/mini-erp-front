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
  message,
  Row,
  Col
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
  getChartOfAccounts,
  getPartners,
  getBankAccounts
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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const pageSize = 15;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [voucherDetailsLoading, setVoucherDetailsLoading] =
    useState<boolean>(false);

  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [form] = Form.useForm();

  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [showPartnerField, setShowPartnerField] = useState<boolean>(false);

  useEffect(() => {
    fetchJournalVouchers();
  }, [searchValue, dateRange, currentPage]);

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

  const fetchVoucherDetails = async (voucherId: number) => {
    setVoucherDetailsLoading(true);
    try {
      const data = await getJournalVoucherById(voucherId);
      setSelectedVoucher(data);
      setVoucherDetailsLoading(false);
      setIsModalVisible(true); // Show the modal after data is fetched
    } catch (error) {
      console.error("Failed to load journal voucher details", error);
      setVoucherDetailsLoading(false);
    }
  };

  const fetchChartOfAccounts = async () => {
    try {
      const data = await getChartOfAccounts(1);
      setChartOfAccounts(data);
    } catch (error) {
      message.error("Failed to load Chart of Accounts");
    }
  };

  const fetchPartners = async (partnerTypeId: number) => {
    try {
      const data = await getPartners(1, partnerTypeId);
      setPartners(data);
    } catch (error) {
      message.error("Failed to load partners");
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const data = await getBankAccounts(1, 0);
      setBanks(data);
    } catch (error) {
      message.error("Failed to load bank accounts");
    }
  };

  const handleChartOfAccountChange = (chartofAccId: number, index: number) => {
    const selectedAccount = chartOfAccounts.find(
      (account) => account.chartofAccId === chartofAccId
    );

    if (selectedAccount && selectedAccount.templateId !== undefined) {
      const selectedTemplateId = selectedAccount.templateId;
      setTemplateId(selectedTemplateId);

      if (selectedTemplateId === 3) {
        fetchPartners(1);
        setShowPartnerField(true);
      } else if (selectedTemplateId === 8) {
        fetchPartners(2);
        setShowPartnerField(true);
      } else if (selectedTemplateId === 2) {
        fetchBankAccounts();
        setShowPartnerField(true);
      } else {
        setShowPartnerField(false);
        setPartners([]);
        setBanks([]);
      }

      // Clear the partner field when changing the chart of account
      const currentItems = form.getFieldValue("items") || [];
      currentItems[index].partner = undefined;
      form.setFieldsValue({ items: currentItems });
    } else {
      message.error(
        "Invalid chart of account selection or missing templateId."
      );
      setTemplateId(null);
      setShowPartnerField(false);
      setPartners([]);
    }
  };

  const handleSave = async (values: any) => {
    const payload = {
      header: {
        accountId: 1,
        branchId: 0,
        narration: values.narration,
        amount: values.items.reduce(
          (sum: number, item: any) => sum + item.debit - item.credit,
          0
        ),
        actionById: 1,
        transactionDate: values.date.format("YYYY-MM-DD")
      },
      rows: values.items.map((item: any) => ({
        partnerId: item.partner || null,
        partnerName: item.partnerName || "",
        chartOfAccId: item.chartOfAccount,
        chartOfAccName:
          chartOfAccounts.find(
            (acc) => acc.chartofAccId === item.chartOfAccount
          )?.chartOfAccName || "",
        chartOfAccCode:
          chartOfAccounts.find(
            (acc) => acc.chartofAccId === item.chartOfAccount
          )?.chartOfAccCode || "",
        amount: item.debit || item.credit
      }))
    };

    try {
      await saveJournalVoucher(payload);
      message.success("Journal voucher saved successfully");
      setIsCreateModalVisible(false);
      form.resetFields();
      fetchJournalVouchers();
    } catch (error) {
      console.error("Failed to save journal voucher", error);
    }
  };

  const handleCreateClick = () => {
    setIsCreateModalVisible(true);
    fetchChartOfAccounts();
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
        <Button
          icon={<EyeOutlined />}
          onClick={() => fetchVoucherDetails(record.subLedgerHeaderId)}
        >
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
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJournalVouchers()}
              className="search-input"
            />
          </div>
          <div className="col-lg-5">
            <RangePicker value={dateRange} onChange={setDateRange} />
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
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>

      {/* View Journal Voucher Modal */}
      <Modal
        title="Account Journal Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setIsModalVisible(false)}
          >
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
        onCancel={() => setIsCreateModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setIsCreateModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => form.submit()}
            form="journal-voucher-form"
          >
            Save
          </Button>
        ]}
      >
        <Form
          form={form}
          id="journal-voucher-form"
          onFinish={handleSave}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: "Date is required" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="narration"
                label="Narration"
                rules={[{ required: true, message: "Narration is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Table
            dataSource={form.getFieldValue("items") || [{}]}
            pagination={false}
            bordered
            rowKey="id"
            footer={() => (
              <Button
                type="dashed"
                onClick={() => {
                  const items = form.getFieldValue("items") || [];
                  form.setFieldsValue({
                    items: [...items, {}]
                  });
                }}
                block
                icon={<PlusOutlined />}
              >
                Add Row
              </Button>
            )}
          >
            <Table.Column
              title="Chart Of Account"
              dataIndex="chartOfAccount"
              render={(_, record, index) => (
                <Form.Item
                  name={["items", index, "chartOfAccount"]}
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select
                    placeholder="Select Account"
                    onChange={(value) =>
                      handleChartOfAccountChange(value, index)
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
              )}
            />
            <Table.Column
              title="Customer/Supplier/Bank Account"
              dataIndex="partner"
              render={(_, record, index) =>
                showPartnerField ? (
                  <Form.Item name={["items", index, "partner"]}>
                    <Select placeholder="Select Name">
                      {(templateId === 2 ? banks : partners).map(
                        (partner: any) => (
                          <Option
                            key={partner.partnerId || partner.chartofAccId}
                            value={
                              partner.partnerName || partner.chartofAccName
                            }
                          >
                            {partner.partnerName || partner.chartofAccName}
                          </Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                ) : null
              }
            />
            <Table.Column
              title="Debit"
              dataIndex="debit"
              render={(_, record, index) => (
                <Form.Item
                  name={["items", index, "debit"]}
                  rules={[{ required: true, message: "Required" }]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              )}
            />
            <Table.Column
              title="Credit"
              dataIndex="credit"
              render={(_, record, index) => (
                <Form.Item
                  name={["items", index, "credit"]}
                  rules={[{ required: true, message: "Required" }]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              )}
            />
            <Table.Column
              title="Action"
              render={(_, record, index) => (
                <MinusCircleOutlined
                  onClick={() => {
                    const items = form.getFieldValue("items") || [];
                    items.splice(index, 1);
                    form.setFieldsValue({
                      items
                    });
                  }}
                />
              )}
            />
          </Table>
        </Form>
      </Modal>
    </div>
  );
};

export default JournalVoucherLandingPage;
