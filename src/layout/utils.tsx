import { PlusCircleFilled } from "@ant-design/icons";
import { Dropdown } from "antd";
import { setDataAction } from "globalRedux/localStorage/actions";
import React from "react";
import { DummyArr } from "./interface";
import { _zx123_Zx001_45___45_9999_xcdffgggggg_fffff_458955 } from "common/utils/en/scz";
import { setCookie } from "common/utils/_cookie";

export const dummyArr: DummyArr[] = [
  {
    label: "Example",
    icon: "scheduleOutlined",
    menus: [
      { label: "Home", path: "/" },
      { label: "Typography", path: "/example/typography" },
      { label: "Inputs", path: "/example/inputs" },
      { label: "Redux", path: "/example/redux" },
      { label: "Buttons", path: "/example/buttons" },
      { label: "Landing Table", path: "/example/table" },
      { label: "Landing Topbar", path: "/example/landing-topbar" },
      { label: "Components", path: "/example/components" }
    ]
  },
  {
    label: "Purchase",
    icon: "purchaseIcon",
    menus: [
      { label: "Purchase 1", path: "/" },
      { label: "Purchase 2", path: "/" },
      { label: "Purchase 3", path: "/" },
      { label: "Purchase 4", path: "/" }
    ]
  },
  {
    label: "Sales",
    icon: "salesIcon",
    menus: [
      { label: "Quotation", path: "/sales/quotation" },
      { label: "Order", path: "/sales/order" },
      { label: "Delivery", path: "/sales/delivery" },
      { label: "Due Collection", path: "/" },
      { label: "Return", path: "/" },
      { label: "Report", path: "/" }
    ]
  },
  {
    label: "Account",
    icon: "accountIcon",
    menus: [
      { label: "Account 1", path: "/" },
      { label: "Account 2", path: "/" },
      { label: "Account 3", path: "/" },
      { label: "Account 4", path: "/" }
    ]
  },
  {
    label: "Inventory",
    icon: "inventoryIcon",
    menus: [
      { label: "Inventory 1", path: "/" },
      { label: "Inventory 2", path: "/" },
      { label: "Inventory 3", path: "/" },
      { label: "Inventory 4", path: "/" }
    ]
  },
  {
    label: "HR",
    icon: "hrIcon",
    menus: [
      { label: "HR 1", path: "/" },
      { label: "HR 2", path: "/" },
      { label: "HR 3", path: "/" },
      { label: "HR 4", path: "/" }
    ]
  },
  {
    label: "Asset",
    icon: "assetIcon",
    menus: [
      { label: "Asset 1", path: "/" },
      { label: "Asset 2", path: "/" },
      { label: "Asset 3", path: "/" },
      { label: "Asset 4", path: "/" }
    ]
  },
  {
    label: "Production",
    icon: "productionIcon",
    menus: [
      { label: "Production 1", path: "/" },
      { label: "Production 2", path: "/" },
      { label: "Production 3", path: "/" },
      { label: "Production 4", path: "/" }
    ]
  }
];

export const getTitleAndSubtitle = (str: string) => {
  let mainTitle: string = "";
  let subTitle: string = "";

  if (str === "/") {
    return { mainTitle, subTitle };
  }

  let split = str.split("/");

  if (split?.length < 2) return { mainTitle, subTitle };

  mainTitle = split[1];
  subTitle = split[2];

  const mainTitleCapitalized = mainTitle
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return { main: mainTitleCapitalized, sub: subTitle };
};

export const matchStrings = (str1: string, str2: string) => {
  if (!str1 || !str2) return false;
  const words1 = str1.toLowerCase().split(" ");
  const words2 = str2.toLowerCase().split("-");
  return words1.some((word) => words2.includes(word));
};

export const isShowTopbar = () => {
  if (window.location.pathname.includes("t-hide")) {
    return false;
  } else {
    return true;
  }
};

export const setDefaultMenu = (
  dispatch: any,
  childMenus: any,
  title: string,
  subTitle: string,
  isShow: boolean | undefined,
  res: any
) => {
  dispatch(setDataAction("menus", "childMenus", res?.[0]?.secondLabelMenuList));
};

export const renderPlusIcon = (
  item: any,
  navigate: any,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: any
) => {
  if (item?.label === "Order") {
    return (
      <Dropdown
        overlayClassName="m-dropdown-overlay-main"
        trigger={["click"]}
        placement="bottom"
        open={open}
        onOpenChange={(open: boolean) => {
          !open && setOpen(false);
        }}
        menu={{
          items: [
            {
              key: 1,
              label: (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setDataAction("menus", "subTitle", item?.label));
                    setOpen(false);
                    const url = `/sales/order/create/t-hide`;
                    navigate(url, {
                      state: { type: "quotationOrder" }
                    });
                  }}
                >
                  Quotation Order
                </span>
              )
            },
            {
              key: 2,
              label: (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setDataAction("menus", "subTitle", item?.label));
                    setOpen(false);
                    const url = `v2/sales/order/create/t-hide`;
                    navigate(url, {
                      state: { type: "salesOrder" }
                    });
                  }}
                >
                  Sales Order
                </span>
              )
            }
          ]
        }}
      >
        <PlusCircleFilled
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="icon sidemenu-plus"
        />
      </Dropdown>
    );
  }
};

let menusToHide = [
  "Campaign",
  "Complain Management",
  "Service Agreement",
  "Warranty Fulfillment",
  "Ticket"
];

export const isNoNeedMenu = (nestedItem: any) => {
  const { strLabel } = nestedItem;
  if (menusToHide?.includes(strLabel)) return true;
  return false;
};

type User = {
  username: string;
  password: string;
};

export const loginAction = (
  postData: any,
  userName: any,
  password: any,
  dispatch: any
) => {
  const payload: User = {
    username: userName,
    password: password
  };
  postData({
    url: "/api/Auth/UserLogIn",
    method: "post",
    isToast: true,
    isHiddenSuccessToast: true,
    payload,
    cb: (data: any) => {
      let encryptedU = _zx123_Zx001_45___45_9999_xcdffgggggg_fffff_458955(
        JSON.stringify(userName)
      );
      let encryptedP = _zx123_Zx001_45___45_9999_xcdffgggggg_fffff_458955(
        JSON.stringify(password)
      );
      setCookie("mgmU", encryptedU, 7);
      setCookie("mgmP", encryptedP, 7);

      const { branch } = data;
      const { token, refreshToken } = data?.auth;
      delete data.branch;
      delete data?.auth;

      const newBranches =
        branch?.length > 0
          ? branch.map((item: any) => ({
              ...item,
              value: item?.branchId,
              label: item?.branchName
            }))
          : [];

      dispatch(setDataAction<boolean>("auth", "isAuth", true));
      dispatch(setDataAction<boolean>("auth", "isExpiredToken", false));
      dispatch(setDataAction("auth", "selectedBranch", newBranches?.[0]));
      dispatch(setDataAction("auth", "branchList", newBranches));
      dispatch(
        setDataAction("auth", "profileData", {
          ...data,
          token,
          refreshToken
        })
      );
    }
  });
};

export const loginActionWithGoogle = (
  postData: any,
  email: any,
  userName: any,
  dispatch: any
) => {
  postData({
    url: `/identity/LogIn/UserLogInWithGmail?email=${email}&userName=${userName}`,
    method: "post",
    isToast: true,
    isHiddenSuccessToast: true,
    payload: null,
    cb: (data: any) => {
      let encryptedU = _zx123_Zx001_45___45_9999_xcdffgggggg_fffff_458955(
        JSON.stringify(data?.userName)
      );
      let encryptedP = _zx123_Zx001_45___45_9999_xcdffgggggg_fffff_458955(
        JSON.stringify(data?.password)
      );
      setCookie("mgmU", encryptedU, 7);
      setCookie("mgmP", encryptedP, 7);

      const { branch } = data;
      const { token, refreshToken } = data?.auth;
      delete data.branch;
      delete data?.auth;

      const newBranches =
        branch?.length > 0
          ? branch.map((item: any) => ({
              ...item,
              value: item?.branchId,
              label: item?.branchName
            }))
          : [];

      dispatch(setDataAction<boolean>("auth", "isAuth", true));
      dispatch(setDataAction<boolean>("auth", "isExpiredToken", false));
      dispatch(setDataAction("auth", "selectedBranch", newBranches?.[0]));
      dispatch(setDataAction("auth", "branchList", newBranches));
      dispatch(
        setDataAction("auth", "profileData", {
          ...data,
          token,
          refreshToken
        })
      );
    }
  });
};
const MenuList = [
  {
    firstLabelId: 1,
    icon: null,
    iconV2: "mgmIcon",
    iconName: null,
    label: "Mgm",
    banglaLabel: null,
    isModuleMaster: false,
    firstLabelSl: 1,
    strTo: "",
    secondLabelMenuList: [
      {
        intSecondLabelId: 1,
        intFirstLabelId: 1,
        strFirstLabelName: "MGM",
        strIcon: null,
        strLabel: "Dashboard",
        strBanglaLabel: "",
        intSecondLabelSl: 1,
        strTo: "/dashboard",
        isActive: true,
        secondLabelName: "MGM"
      },
      {
        intSecondLabelId: 2,
        intFirstLabelId: 1,
        strFirstLabelName: "MGM",
        strIcon: null,
        strLabel: "Sales",
        strBanglaLabel: "",
        intSecondLabelSl: 2,
        strTo: "/sales",
        isActive: true,
        secondLabelName: "MGM"
      },
      ,
      {
        intSecondLabelId: 3,
        intFirstLabelId: 1,
        strFirstLabelName: "MGM",
        strIcon: null,
        strLabel: "Purchase",
        strBanglaLabel: "",
        intSecondLabelSl: 3,
        strTo: "/purchase",
        isActive: true,
        secondLabelName: "MGM"
      },
      ,
      {
        intSecondLabelId: 4,
        intFirstLabelId: 1,
        strFirstLabelName: "MGM",
        strIcon: null,
        strLabel: "Accounts",
        strBanglaLabel: "",
        intSecondLabelSl: 4,
        strTo: "/accounts",
        isActive: true,
        secondLabelName: "MGM"
      },
      {
        intSecondLabelId: 5,
        intFirstLabelId: 1,
        strFirstLabelName: "MGM",
        strIcon: null,
        strLabel: "Configuration",
        strBanglaLabel: "",
        intSecondLabelSl: 5,
        strTo: "/configuration",
        isActive: true,
        secondLabelName: "MGM"
      },
      {
        intSecondLabelId: 6,
        intFirstLabelId: 1,
        strFirstLabelName: "MGM",
        strIcon: null,
        strLabel: "Reports",
        strBanglaLabel: "",
        intSecondLabelSl: 6,
        strTo: "/reports",
        isActive: true,
        secondLabelName: "MGM"
      }
    ]
  }
];

export { MenuList };
