import { useEffect, useState } from "react";
import { CoreModule } from "lib/router";
import {
  defaultFilterLimit,
  getBasicExportFilterQuery,
  getBasicFilterQuery,
  getWhereFilterQuery,
  totalCountHeaderName,
} from "lib/query";
import { CsvImport } from "components/spreadsheet-import";
import { Result } from "@wavepoint/react-spreadsheet-import/types/types";
import { CsvExport } from "components/export";
import { DataTableGrid } from "components/data-table";
import { GridColDef, GridColumnVisibilityModel, GridSortDirection } from "@mui/x-data-grid";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { getModelByName } from "lib/network/swagger-models";
import { DataListContainer } from "./index.styled";

type dataListProps = {
  modelName: string;
  columns: GridColDef<any>[];
  gridSettingsStorageKey: string;
  searchText: string;
  defaultFilterOrderColumn: string;
  defaultFilterOrderDirection: string;
  initialGridState: GridInitialStateCommunity | undefined;
  exportFileName: string;
  endRoute: string;
  openImport: boolean;
  openExport: boolean;
  handleExport: () => void;
  handleImport: () => void;
  getModelDataList: (query: string) => any;
  exportAsync: (query: string, accept: string) => Promise<string>;
  dataImportCreate: (data: any) => void;
};

type dataListSettings = {
  searchTerm: string;
  filterLimit: number;
  skipLimit: number;
  sortColumn: string;
  sortOrder: string;
  whereField: string;
  whereFieldValue: string;
  pageNumber: number;
  columnVisibilityModel: GridColumnVisibilityModel;
};

export const DataList = ({
  modelName,
  columns,
  gridSettingsStorageKey,
  searchText,
  defaultFilterOrderColumn,
  defaultFilterOrderDirection,
  initialGridState,
  endRoute,
  openImport,
  openExport,
  handleImport,
  handleExport,
  getModelDataList,
  exportAsync: exportAsync,
  exportFileName,
  dataImportCreate,
}: dataListProps) => {
  const [modelData, setModelData] = useState<any[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLimit, setFilterLimit] = useState(defaultFilterLimit);
  const [sortColumn, setSortColumn] = useState(defaultFilterOrderColumn);
  const [sortOrder, setSortOrder] = useState(defaultFilterOrderDirection);
  const [whereField, setWhereField] = useState("");
  const [whereFieldValue, setWhereFieldValue] = useState("");
  const [skipLimit, setSkipLimit] = useState(0);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [isImportWindowOpen, setIsImportWindowOpen] = useState(false);
  const [openExportFile, setOpenExportFile] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(
    initialGridState?.columns?.columnVisibilityModel
  );
  const [gridSettingsLoaded, setGridSettingsLoaded] = useState(false);
  const [gridState, setGridState] = useState(initialGridState);

  const whereFilterQuery = getWhereFilterQuery(whereField, whereFieldValue);
  const basicFilterQuery = getBasicFilterQuery(filterLimit, sortColumn, sortOrder, skipLimit);
  const basicExportFilterQuery = getBasicExportFilterQuery(sortColumn, sortOrder);

  useEffect(() => {
    setSearchTerm(searchText);
  }, [searchText]);

  useEffect(() => {
    setIsImportWindowOpen(openImport);
  }, [openImport]);

  useEffect(() => {
    setOpenExportFile(openExport);
  }, [openExport]);

  useEffect(() => {
    if (gridSettingsLoaded) {
      saveGridStateInLocalStorage();
      getDataListAsync();
    }
  }, [
    searchTerm,
    filterLimit,
    skipLimit,
    sortColumn,
    sortOrder,
    whereFieldValue,
    columnVisibilityModel,
    gridSettingsLoaded,
  ]);

  useEffect(() => {
    const settingsState = localStorage.getItem(gridSettingsStorageKey);
    if (settingsState) {
      const settings = JSON.parse(settingsState) as dataListSettings;
      const {
        searchTerm: searchTerm,
        filterLimit: filterLimit,
        skipLimit: skipLimit,
        sortColumn: sortColumn,
        sortOrder: sortOrder,
        whereField: whereField,
        whereFieldValue: whereFieldValue,
        pageNumber: pageNumber,
        columnVisibilityModel: columnVisibilityModel,
      } = settings;
      setSearchTerm(searchTerm);
      setFilterLimit(filterLimit);
      setSkipLimit(skipLimit);
      setSortColumn(sortColumn);
      setSortOrder(sortOrder);
      setWhereField(whereField);
      setWhereFieldValue(whereFieldValue);
      setPageNumber(pageNumber);
      setColumnVisibilityModel(columnVisibilityModel);
      updateGridSettings(settings);
    }
    setGridSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (totalRowCount === -1) {
      throw new Error("Server error: x-total-count header is not provided.");
    }
  }, [totalRowCount]);

  useEffect(() => {
    if (!modelData) {
      throw new Error("Server error: Data cannot be retrieved from server.");
    }
  }, [modelData]);

  const saveGridStateInLocalStorage = () => {
    localStorage.setItem(
      gridSettingsStorageKey,
      JSON.stringify({
        searchTerm,
        filterLimit,
        skipLimit,
        sortColumn,
        sortOrder,
        whereField,
        whereFieldValue,
        pageNumber,
        columnVisibilityModel,
      } as dataListSettings)
    );
  };

  const getDataListAsync = () => {
    (async () => {
      const result = await getModelDataList(`${searchTerm}&${basicFilterQuery}${whereFilterQuery}`);
      if (result) {
        const { data, headers } = result;
        setTotalResultsCount(headers.get(totalCountHeaderName));
        setModelData(data);
      } else {
        setModelData(undefined);
      }
    })();
  };

  const updateGridSettings = (gridSettings: dataListSettings) => {
    initialGridState!.filter = {
      filterModel: {
        items: [
          {
            columnField: gridSettings.whereField,
            operatorValue: "contains",
            value: gridSettings.whereFieldValue,
          },
        ],
      },
    };
    initialGridState!.sorting = {
      sortModel: [
        { field: gridSettings.sortColumn, sort: gridSettings.sortOrder as GridSortDirection },
      ],
    };
    initialGridState!.pagination = {
      page: gridSettings.pageNumber,
      pageSize: gridSettings.filterLimit,
    };
    initialGridState!.columns = { columnVisibilityModel: gridSettings.columnVisibilityModel };
    setGridState(initialGridState);
  };

  const setTotalResultsCount = (headerCount: string | null) => {
    if (headerCount) setTotalRowCount(parseInt(headerCount, 10));
    else setTotalRowCount(-1);
  };

  const exportWithParamsAsync = async (accept: string) => {
    return await exportAsync(`${searchTerm}&${basicExportFilterQuery}${whereFilterQuery}`, accept);
  };

  const closeExport = () => {
    setOpenExportFile(false);
    handleExport();
  };

  const onImportWindowClose = () => {
    setIsImportWindowOpen(false);
    handleImport();
  };

  const handleFileUpload = async (data: Result<string>) => {
    const importDtoCollection: any[] = data.validData;
    await dataImportCreate(importDtoCollection);
  };

  const importFieldsObject = getModelByName(modelName);

  return gridSettingsLoaded ? (
    <DataListContainer>
      <DataTableGrid
        columns={columns}
        data={modelData}
        autoHeight={false}
        pageSize={filterLimit}
        totalRowCount={totalRowCount}
        rowsPerPageOptions={[10, 30, 50, 100]}
        pageNumber={pageNumber}
        dataViewMode="server"
        setSortColumn={setSortColumn}
        setSortOrder={setSortOrder}
        setPageSize={setFilterLimit}
        setSkipLimit={setSkipLimit}
        setFilterField={setWhereField}
        setFilterFieldValue={setWhereFieldValue}
        setPageNumber={setPageNumber}
        handleColumnVisibilityModel={setColumnVisibilityModel}
        initialState={gridState}
        disableColumnFilter={false}
        disablePagination={false}
        showActionsColumn={true}
        disableEditRoute={false}
        disableViewRoute={false}
      />
      {importFieldsObject && (
        <CsvImport
          isOpen={isImportWindowOpen}
          onClose={onImportWindowClose}
          onUpload={handleFileUpload}
          object={importFieldsObject}
          endRoute={endRoute as CoreModule}
        ></CsvImport>
      )}
      {openExportFile && (
        <CsvExport
          exportAsync={exportWithParamsAsync}
          closeExport={closeExport}
          fileName={exportFileName}
        ></CsvExport>
      )}
    </DataListContainer>
  ) : null;
};
