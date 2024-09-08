import MainBody from "common/components/mainBody";
import React, { useState } from "react";
import LandingPurchaseTable from "./components/landingPurchaseTable";
import LandingTopbar from "common/components/landingTopbar";
import ViewModal from "common/components/modal";
import PurchaseForm from "./components/PurchaseForm";
import { Popconfirm } from "antd";
import MButton from "common/components/button/MButton";
import { todayDate } from "common/utils/date";
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
const Purchase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchase, setPurchase] = useState<Purchase>({
    createDate: todayDate(),
    supplier: "",
    remarks: "",
    items: [
      {
        itemName: "",
        uom: "",
        quantity: 0,
        rate: 0,
        total: 0
      }
    ],
    totalAmount: 0
  });

  return (
    <div>
      <LandingTopbar
        title="Purchase"
        createLabel="Receive"
        createClick={() => {
          setIsModalOpen(true);
        }}
        starMarkClick={() => {
          alert("Akash");
        }}
      />
      <LandingPurchaseTable />
      <ViewModal
        renderBtn={() => {
          return (
            <Popconfirm
              title="Change Stage"
              description="Are you sure to change the stage?"
              onConfirm={() => {
                alert("Save successfully");
                // updateStageAction({
                //   updateStage, viewData, profileData, selectedBranch, value: stageInfo?.value, label: stageInfo?.label, setCurrentCurrentStageId, closedTypeVal, remarks, startDate, setStageInfo, id, getLeadLogs, loadView, monthlyCharge, projectValue, goLiveDate, setGoLiveDate,
                //   setProjectValue,
                //   setMonthlyCharge,
                //   deliveryID,
                //   customerId,
                //   orderId
                // })
              }}
              okText="Yes"
              cancelText="No"
            >
              {<MButton type="primary" htmlType="button" label="Save" />}
            </Popconfirm>
          );
        }}
        width={1200}
        height={600}
        open={isModalOpen}
        title="Create Purchase"
        onClose={() => setIsModalOpen(false)}
      >
        {" "}
        <PurchaseForm purchase={purchase} setPurchase={setPurchase} />
      </ViewModal>
    </div>
  );
};

export default Purchase;
