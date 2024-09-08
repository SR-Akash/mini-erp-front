import React from "react";
import { canView } from "common/utils/permission";
import NoPermission from "common/components/noPermission";

function usePermission() {
  const Permission = (
    id: number,
    key: string,
    Component: React.ComponentType,
  ) => <>{canView({ id, key }) ? <Component /> : <NoPermission />}</>;

  return Permission;
}
export default usePermission;
