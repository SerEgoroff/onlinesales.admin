import { CoreModule, getCoreModuleRoute } from "lib/router";
import { dataListBreadcrumbLinks } from "utils/constants";
import { BreadcrumbLink } from "types";

export const defaultFilterOrderColumn = "orderNumber";

export const defaultFilterOrderDirection = "desc";

export const searchLabel = "Search orders";

export const modelName = "order";

export const orderListPageBreadcrumb = "Orders";

export const orderFormBreadcrumbLinks: BreadcrumbLink[] = [
  ...dataListBreadcrumbLinks,
  { linkText: orderListPageBreadcrumb, toRoute: getCoreModuleRoute(CoreModule.orders) },
];

export const orderGridSettingsStorageKey = "orderDataListSettings";

export const orderEditHeader = "Edit Order";

export const orderAddHeader = "Add Order";
