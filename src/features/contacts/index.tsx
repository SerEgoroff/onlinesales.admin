import { Avatar, Button, ListItemAvatar } from "@mui/material";
import { ContactDetailsDto, ContactImportDto } from "lib/network/swagger-client";
import { useRequestContext } from "providers/request-provider";
import { ContactNameListItem, ContactNameListItemText } from "./index.styled";
import {
  contactGridSettingsStorageKey,
  contactListPageBreadcrumb,
  defaultFilterOrderColumn,
  defaultFilterOrderDirection,
  modelName,
  searchLabel,
} from "./constants";
import { DataList } from "@components/data-list";
import { GridColDef } from "@mui/x-data-grid";
import { CoreModule, getAddFormRoute } from "lib/router";
import { dataListBreadcrumbLinks } from "utils/constants";
import { ModuleWrapper } from "@components/module-wrapper";
import { SearchBar } from "@components/search-bar";
import { useEffect, useState } from "react";
import { Add, Download, Upload } from "@mui/icons-material";
import { GhostLink } from "@components/ghost-link";

export const Contacts = () => {
  const { client } = useRequestContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);

  useEffect(() => {
    setSearchTerm(getLocalStorageSavedPropertyValue(contactGridSettingsStorageKey, "searchTerm"));
  }, []);

  const getContactList = async (query: string) => {
    try {
      const result = await client.api.contactsList({
        query: query,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const exportContactsAsync = async (query: string) => {
    const response = await client.api.contactsExportList({
      query: query,
    });

    return response.text();
  };

  const handleContactImport = async (data: ContactImportDto[]) => {
    await client.api.contactsImportCreate(data);
  };

  const columns: GridColDef<ContactDetailsDto>[] = [
    {
      field: "firstName",
      headerName: "Name",
      flex: 4,
      renderCell: ({ row }) => (
        <ContactNameListItem>
          <ListItemAvatar>
            <Avatar src={row.avatarUrl!}></Avatar>
          </ListItemAvatar>
          <ContactNameListItemText
            primary={`${row.firstName || ""} ${row.lastName || ""}`}
            secondary={row.email}
          />
        </ContactNameListItem>
      ),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 2,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
    },
    {
      field: "address1",
      headerName: "Address",
      flex: 4,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 3,
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
    {
      field: "language",
      headerName: "Language",
      flex: 1,
    },
  ];

  const getLocalStorageSavedPropertyValue = (storageKey: string, propertyToRetrieve: string) => {
    const settingsState = localStorage.getItem(storageKey);
    if (settingsState) {
      const { [propertyToRetrieve]: value } = JSON.parse(settingsState);
      return value;
    } else return "";
  };

  const handleImport = () => {
    openImport ? setOpenImport(false) : setOpenImport(true);
  };

  const handleExport = () => {
    openExport ? setOpenExport(false) : setOpenExport(true);
  };

  const searchBar = (
    <SearchBar
      setSearchTermOnChange={setSearchTerm}
      searchBoxLabel={searchLabel}
      initialValue={getLocalStorageSavedPropertyValue(contactGridSettingsStorageKey, "searchTerm")}
    ></SearchBar>
  );

  const extraActions = [
    <Button key={"import-btn"} startIcon={<Upload />} onClick={handleImport}>
      Import
    </Button>,
    <Button key={"export-btn"} startIcon={<Download />} onClick={handleExport}>
      Export
    </Button>,
  ];

  const addButton = (
    <Button variant="contained" to={getAddFormRoute()} component={GhostLink} startIcon={<Add />}>
      Add contact
    </Button>
  );

  return (
    <ModuleWrapper
      breadcrumbs={dataListBreadcrumbLinks}
      currentBreadcrumb={contactListPageBreadcrumb}
      leftContainerChildren={searchBar}
      extraActionsContainerChildren={extraActions}
      addButtonContainerChildren={addButton}
    >
      <DataList
        modelName={modelName}
        columns={columns}
        gridSettingsStorageKey={contactGridSettingsStorageKey}
        defaultFilterOrderColumn={defaultFilterOrderColumn}
        defaultFilterOrderDirection={defaultFilterOrderDirection}
        searchText={searchTerm}
        endRoute={CoreModule.contacts}
        openImport={openImport}
        openExport={openExport}
        handleExport={handleExport}
        handleImport={handleImport}
        getModelDataList={getContactList}
        exportAsync={exportContactsAsync}
        exportFileName="contacts"
        dataImportCreate={handleContactImport}
        initialGridState={{
          columns: { columnVisibilityModel: { lastName: false, email: false } },
          sorting: {
            sortModel: [{ field: defaultFilterOrderColumn, sort: defaultFilterOrderDirection }],
          },
        }}
      ></DataList>
    </ModuleWrapper>
  );
};
