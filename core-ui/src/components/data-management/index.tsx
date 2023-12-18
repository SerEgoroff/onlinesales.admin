import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { CardHeaderStyled, DeleteButtonContainer } from "./index.styled";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useCoreModuleNavigation, useNotificationsService } from "@hooks";
import { HttpResponse, ProblemDetails } from "@lib/network/swagger-client";
import { useErrorDetailsModal } from "@providers/error-details-modal-provider";
import { execDeleteWithToast } from "utils/general-helper";
import { useRouteParams } from "typesafe-routes";
import { coreModuleRoute } from "@lib/router";
import { useNavigate } from "react-router-dom";

type DataDeleteProps = {
  header: string;
  description: string;
  itemId: number | string;
  entity: string;
  successNavigationRoute: string;
  handleDeleteAsync: (id: number | string) => Promise<HttpResponse<void, void | ProblemDetails>>;
  showEditButton?: boolean;
};

type DataDeleteConfProps = {
  entity: string;
  setIsConfirmed: (isConfirmed: boolean) => void;
  openConfirmation: boolean;
  setOpenConfirmation: (open: boolean) => void;
};

export const DataDeleteConfirmation = ({
  entity,
  setIsConfirmed,
  openConfirmation,
  setOpenConfirmation,
}: DataDeleteConfProps) => {
  const handleConfirmationClose = () => {
    setOpenConfirmation(false);
  };

  const handleConfirmation = async () => {
    setOpenConfirmation(false);
    setIsConfirmed(true);
  };

  return (
    <>
      <Dialog open={openConfirmation} onClose={handleConfirmationClose}>
        <DialogTitle>{`Deleting ${entity}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{`Are you sure you want to delete this ${entity}?`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} autoFocus variant="outlined">
            No
          </Button>
          <Button onClick={handleConfirmation} autoFocus variant="outlined" color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const DataManagementBlock = ({
  header,
  description,
  itemId,
  entity,
  successNavigationRoute,
  handleDeleteAsync,
  showEditButton = true,
}: DataDeleteProps) => {
  const { notificationsService } = useNotificationsService();
  const { Show: showErrorModal } = useErrorDetailsModal()!;
  const handleNavigation = useCoreModuleNavigation();
  const navigate = useNavigate();
  const { moduleName } = useRouteParams(coreModuleRoute);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isConfirmed) {
      (async () => {
        await execDeleteWithToast(deleteRecord, notificationsService, entity, showErrorModal);
      })();
    }
  }, [isConfirmed]);

  const handleDelete = () => {
    setOpenConfirmation(true);
  };

  const deleteRecord = async () => {
    try {
      setIsDeleting(true);
      await handleDeleteAsync(itemId);
      handleNavigation(successNavigationRoute);
    } catch (error) {
      setIsDeleting(false);
      throw error;
    }
  };

  const editRecord = async () => {
    navigate(`/${moduleName}/${itemId}/edit`);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid>
            <Typography gutterBottom variant="h6" component="div">
              {header}
            </Typography>
          </Grid>
          <Grid>
            <Typography>{description}</Typography>
          </Grid>
        </CardContent>
        <CardActions>
          <DeleteButtonContainer>
            <Button
              disabled={isDeleting}
              startIcon={<DeleteIcon />}
              variant="contained"
              color="error"
              onClick={handleDelete}
              size="small"
            >
              {`Delete ${entity}`}
            </Button>
          </DeleteButtonContainer>
          {showEditButton && (
            <DeleteButtonContainer>
              <Button
                startIcon={<EditIcon />}
                size="small"
                variant="contained"
                onClick={editRecord}
              >
                {`Edit ${entity}`}
              </Button>
            </DeleteButtonContainer>
          )}
        </CardActions>
      </Card>
      <DataDeleteConfirmation
        entity={entity}
        openConfirmation={openConfirmation}
        setIsConfirmed={setIsConfirmed}
        setOpenConfirmation={setOpenConfirmation}
      ></DataDeleteConfirmation>
    </>
  );
};
