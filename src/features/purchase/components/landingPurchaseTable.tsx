import ScrollableTable from "common/components/table/ScrollableTable";
import React from "react";

const LandingPurchaseTable = () => {
  return (
    <html>
      <head></head>
      <body>
        <ScrollableTable>
          <>
            <tr>
              <th>SL</th>
              <th>Date</th>
              <th>Name</th>
              <th>Created By</th>
            </tr>
            <tr>
              <td>1</td>
              <td>2024-08-31</td>
              <td>Saidur Rahman Akash</td>
              <td>Polash</td>
            </tr>
            <tr>
              <td>2</td>
              <td>2024-09-01</td>
              <td>Saidur Rahman Akash</td>
              <td>Polash</td>
            </tr>
          </>
        </ScrollableTable>
      </body>
    </html>
  );
};

export default LandingPurchaseTable;
