import { Table } from "antd";
import React from "react";
export const pageSize = 100;

interface LandingTableProps {
  columns: any[];
  rowKey: string | ((record: any) => any);
  dataSource: any;
  pagination?: any;
  loading?: boolean;
  onChange?: (
    pagination: any,
    setPagination: any,
    filters: any,
    sorter: any
  ) => void;
  rowSelection?: any;
  expandable?: any;
  className?: string;
  x?: number;
  y?: number;
  defaultExpandAllRows?: boolean;
  tableKey?: number;
  summary?: any;
  isHiddenPagination?: boolean;
  onRow?: any;
  totalCount?: number;
}

const MTable = ({
  columns,
  rowKey,
  dataSource,
  loading,
  onChange,
  rowSelection,
  expandable,
  className,
  x,
  y,
  defaultExpandAllRows,
  tableKey = 0,
  summary,
  isHiddenPagination,
  onRow,
  pagination,
  totalCount,
}: LandingTableProps) => {
  return (
    <Table
      columns={columns}
      rowKey={rowKey}
      dataSource={Array.isArray(dataSource) ? dataSource : []}
      pagination={
        isHiddenPagination
          ? false
          : {
              ...pagination,
              total: totalCount,
              showTotal: (total: any, range: any) => `Total ${total} items`,
              totalBoundaryShowSizeChanger: 51,
            }
      }
      bordered={true}
      loading={loading}
      onChange={onChange}
      rowSelection={rowSelection}
      scroll={{
        y: y || 500,
        x: x || 1000,
      }}
      className={`m-table ${className && className}`}
      expandable={expandable}
      showSorterTooltip={false}
      defaultExpandAllRows={defaultExpandAllRows}
      key={tableKey}
      summary={summary}
      onRow={onRow}
    />
  );
};

export default MTable;
