import React, { useState, useEffect } from "react";
import { Table, Button, Input, DatePicker, Pagination, Modal } from "antd";
import { PlusOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  getJournalVoucherLandingData,
  getJournalVoucherById
} from "../../service/AccountsService"; // Assuming this service exists for fetching voucher details
import moment from "moment";
import "./JournalVoucher.css";

const { RangePicker } = DatePicker;

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
  const pageSize = 15; // Number of records per page

  // View modal states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [voucherDetailsLoading, setVoucherDetailsLoading] =
    useState<boolean>(false);

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
      setTotalCount(data.totalCount); // Set total count for pagination
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
    } catch (error) {
      console.error("Failed to load journal voucher details", error);
    }
    setVoucherDetailsLoading(false);
  };

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
    console.log("Create new Journal Voucher");
  };

  const handleViewClick = (record: any) => {
    setIsModalVisible(true);
    fetchVoucherDetails(record.subLedgerHeaderId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedVoucher(null); // Clear the modal content
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
        pagination={false} // We will manage pagination manually
      />

      {/* Pagination Component */}
      <div className="pagination-container">
        <Pagination
          current={currentPage}
          total={totalCount}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false} // You can enable this if you want to change page size
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
                  {selectedVoucher.header.transactionCode}
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
                <span className="label">Office Name:</span>
                <span className="value">MGM Head Office</span>
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
              <div className="header-row">
                <span className="label">Attachment:</span>
                <span className="value">N/A</span>
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
    </div>
  );
};

export default JournalVoucherLandingPage;
