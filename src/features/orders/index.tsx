import { Fragment, useRef, useState } from "react";
import { OrderDetailsDto, OrderImportDto } from "lib/network/swagger-client";
import { useRequestContext } from "providers/request-provider";
import {
  defaultFilterOrderColumn,
  defaultFilterOrderDirection,
  orderGridSettingsStorageKey,
  modelName,
  orderListPageBreadcrumb,
  searchLabel,
} from "./constants";
import { DataList } from "@components/data-list";
import { GridColDef } from "@mui/x-data-grid";
import { CoreModule, getAddFormRoute } from "lib/router";
import { dataListBreadcrumbLinks } from "utils/constants";
import useLocalStorage from "use-local-storage";
import { dataListSettings } from "utils/types";
import { getModelByName } from "@lib/network/swagger-models";
import { Result } from "@wavepoint/react-spreadsheet-import/types/types";
import { SearchBar } from "@components/search-bar";
import { Button } from "@mui/material";
import { Add, Download, Upload } from "@mui/icons-material";
import { CsvImport } from "@components/spreadsheet-import";
import { CsvExport } from "@components/export";
import { GhostLink } from "@components/ghost-link";
import { ModuleWrapper } from "@components/module-wrapper";

export const Orders = () => {
  const { client } = useRequestContext();
  const [gridSettings, setGridSettings] = useLocalStorage<dataListSettings | undefined>(
    orderGridSettingsStorageKey,
    undefined
  );

  const [searchTerm, setSearchTerm] = useState(gridSettings?.searchTerm ?? "");
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [importFieldsObject, setImportFieldsObject] = useState<any>();
  const dataExportQuery = useRef("");

  const getOrderList = async (mainQuery: string, exportQuery?: string) => {
    try {
      dataExportQuery.current = exportQuery || "";
      const result = await client.api.ordersList({
        query: mainQuery,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const exportOrdersAsync = async () => {
    const response = await client.api.ordersExportList({
      query: dataExportQuery.current,
    });

    return response.text();
  };

  const handleImportOpen = () => {
    !importFieldsObject && setImportFieldsObject(getModelByName(modelName));
    setOpenImport(true);
  };

  const handleImportClose = () => {
    setOpenImport(false);
  };

  const handleExportOpen = () => {
    openExport ? setOpenExport(false) : setOpenExport(true);
  };

  const handleFileUpload = async (data: Result<string>) => {
    const importDtoCollection: any[] = data.validData;
    await client.api.ordersImportCreate(importDtoCollection);
  };

  const columns: GridColDef<OrderDetailsDto>[] = [
    {
      field: "orderNumber",
      headerName: "Order Number",
      flex: 2,
    },
    {
      field: "refNo",
      headerName: "Reference Number",
      flex: 2,
    },
    {
      field: "affiliateName",
      headerName: "Affiliate",
      flex: 2,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 2,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 2,
    },
    {
      field: "exchangeRate",
      headerName: "Exchange Rate",
      flex: 2,
    },
    {
      field: "currency",
      headerName: "Currency",
      flex: 2,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 2,
      valueGetter: (params) => {
        const createdAt = params.value as string;
        const formattedDate = new Date(createdAt).toLocaleDateString();
        return formattedDate;
      },
    },
  ];

  const searchBar = (
    <SearchBar
      setSearchTermOnChange={setSearchTerm}
      searchBoxLabel={searchLabel}
      initialValue={gridSettings?.searchTerm ?? ""}
    ></SearchBar>
  );

  const extraActions = [
    <Fragment key={"import-action"}>
      <Button key={"import-btn"} startIcon={<Upload />} onClick={handleImportOpen}>
        Import
      </Button>
      {importFieldsObject && (
        <CsvImport
          isOpen={openImport}
          onClose={handleImportClose}
          onUpload={handleFileUpload}
          object={importFieldsObject}
          endRoute={CoreModule.orders}
        ></CsvImport>
      )}
    </Fragment>,
    <Fragment key={"export-action"}>
      <Button key={"export-btn"} startIcon={<Download />} onClick={handleExportOpen}>
        Export
      </Button>
      {openExport && (
        <CsvExport
          exportAsync={exportOrdersAsync}
          closeExport={handleExportOpen}
          fileName={"orders"}
        ></CsvExport>
      )}
    </Fragment>,
  ];

  const addButton = (
    <Button variant="contained" to={getAddFormRoute()} component={GhostLink} startIcon={<Add />}>
      Add order
    </Button>
  );

  return (
    <ModuleWrapper
      breadcrumbs={dataListBreadcrumbLinks}
      currentBreadcrumb={orderListPageBreadcrumb}
      leftContainerChildren={searchBar}
      extraActionsContainerChildren={extraActions}
      addButtonContainerChildren={addButton}
    >
      <DataList
        columns={columns}
        gridSettingsStorageKey={orderGridSettingsStorageKey}
        defaultFilterOrderColumn={defaultFilterOrderColumn}
        defaultFilterOrderDirection={defaultFilterOrderDirection}
        searchText={searchTerm}
        getModelDataList={getOrderList}
        initialGridState={{
          columns: { columnVisibilityModel: { currency: false, exchangeRate: false } },
          sorting: {
            sortModel: [{ field: defaultFilterOrderColumn, sort: defaultFilterOrderDirection }],
          },
        }}
      ></DataList>
    </ModuleWrapper>
  );
};
