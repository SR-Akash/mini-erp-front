interface DummyPermission {
  id: number;
  isView: boolean;
}

let dummyPermission: DummyPermission[] = [
  {
    id: 1,
    isView: true
  }
];

interface Obj {
  id: number;
  key: string;
  permissions?: DummyPermission[];
}

export const canView = (obj: Obj): boolean => {
  let { id, key } = obj;
  let permission = dummyPermission.filter((x) => x.id === id);
  let permissionObj = permission?.[0];
  if (permissionObj?.[key as keyof DummyPermission]) {
    return true;
  }
  return false;
};

export const globalPermissionAPI = (
  accountId: number,
  branchId: number,
  userId: number,
  featureId: number
) => {
  return `/sme/User/GetFeatureConfigByUserandFeaturueId?AccountId=${accountId}&BranchId=${branchId}&UserId=${userId}&FeatureId=${featureId}`;
};
