export interface IconOutline {
  scheduleOutlined: JSX.Element;
  purchaseIcon: JSX.Element;
  salesIcon: JSX.Element;
  accountIcon: JSX.Element;
  inventoryIcon: JSX.Element;
  hrIcon: JSX.Element;
  assetIcon: JSX.Element;
  productionIcon: JSX.Element;
  crmIcon: JSX.Element;
  home : JSX.Element;
}

interface Menus{
  label : string;
  path: string;
}
export interface DummyArr {
  label: string;
  icon: string;
  menus : Menus[]
}
