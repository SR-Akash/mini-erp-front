type InitialState = {
  appName: string;
  testInitData: any;
};

interface profileType {
  isAuth: any;
  isLoggedInWithOtp: any;
  isOtpAuth: any;
  loginPin: any;
  userName: any;
  fullname: any;
  buId: any;
  buName: any;
  intLogoUrlId: any;
  vesselName: any;
  vesselId: any;
  strProfileImageUrl: any;
  intUserId: number;
  token: string;
  isRecruiter: boolean;
  intProfileImageUrl: number;
  [K: string]: any;
}

interface MenuList {
  icon: any;
  id: number;
  isFirstLabel: boolean | any;
  isSecondLabel: boolean | any;
  isThirdLabel: boolean | any;
  label: string;
  parentId: number;
  thirdLabelSl: number;
  to: string;
  childList: any[];
  [K: string]: any;
}

interface PermissionList {
  moduleId: number;
  moduleName: string;
  menuReferenceId: number;
  menuReferenceName: string;
  isCreate: boolean;
  isEdit: boolean;
  isView: boolean;
  isClose: boolean;
}

export type { InitialState, profileType, MenuList, PermissionList };
