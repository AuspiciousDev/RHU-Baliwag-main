import React, { useEffect, useState } from "react";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  useTheme,
  ButtonBase,
} from "@mui/material";
import { storage } from "../../public/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useInventoriesContext } from "../../../hooks/useInventoryContext";
import { useUsersContext } from "../../../hooks/useUserContext";
import { ModeEditOutline } from "@mui/icons-material";
const UserRequestCreate = () => {
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { stocks, stockDispatch } = useInventoriesContext();
  const { users, userDispatch } = useUsersContext();

  const [username, setUsername] = useState("");
  const [requestType, setRequestType] = useState("online");
  const [prescriptionIMG_URL, setPrescriptionIMG_URL] = useState();

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [validateDialog, setValidateDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get("/api/inventory");
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          stockDispatch({ type: "SET_STOCKS", payload: json });
        }

        const apiUsers = await axiosPrivate.get("/api/user");
        if (apiUsers.status === 200) {
          const json = await apiUsers.data;
          console.log(json);
          userDispatch({ type: "SET_USERS", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: User.jsx:90 ~ getUsersDetails ~ error", error);
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 500) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
      }
    };
    getUsersDetails();
  }, [stockDispatch]);

  const handleSubmit = async (prescriptionIMG_URL) => {
    setLoadingDialog({ isOpen: true });
    const data = {
      username: auth.username,
      requestType,
      prescriptionIMG_URL,
    };
    console.log(
      "🚀 ~ file: RequestCreate.jsx:157 ~ handleSubmit ~ data:",
      data
    );

    try {
      const response = await axiosPrivate.post(
        "/api/request/create",
        JSON.stringify(data)
      );
      if (response?.status === 201) {
        setSuccessDialog({
          isOpen: true,
          message: `Request ${response.data._id} has been created!`,
        });
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      console.log(error);
      if (!error?.response) {
        setErrorDialog({
          isOpen: true,
          message: `No server response`,
        });
      } else if (error.response.status === 400) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else if (error.response.status === 404) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        console.log(error.response.data.message);
      } else if (error.response.status === 409) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        setDepIDError(true);
        setLevelIDerror(true);
        setSectionIDerror(true);
        console.log(error.response.data.message);
      } else {
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
      }
    }
  };
  const [imageUpload, setImageUpload] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [changeIMG, setChangeIMG] = useState(false);
  const uploadImage = async () => {
    setLoadingDialog({
      isOpen: true,
    });

    if (imageUpload == null) {
      return (
        setLoadingDialog({
          isOpen: false,
        }),
        setErrorDialog({
          isOpen: true,
          message: `Please choose an image.`,
        })
      );
    }
    try {
      const imageRef = ref(storage, `ADP/users/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          console.log("Download link to your file: ", downloadURL);
          handleSubmit(downloadURL);
          await setImageUpload(null);
        });
      });
      setLoadingDialog({
        isOpen: false,
      });
    } catch (error) {
      console.log("🚀 ~ file: Profile.jsx:106 ~ uploadImage ~ error", error);
      setLoadingDialog({
        isOpen: false,
      });
      setErrorDialog({
        isOpen: true,
        message: `${error}`,
      });
    }
  };

  return (
    <Box className="container-layout_body_contents">
      <ConfirmDialogue
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <ValidateDialogue
        validateDialog={validateDialog}
        setValidateDialog={setValidateDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />

      <Paper
        elevation={2}
        sx={{
          width: "100%",
          padding: { xs: "10px", sm: "0 10px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: { sm: "end" },
              justifyContent: { xs: "center", sm: "start" },
              m: { xs: "20px 0" },
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                borderLeft: `5px solid ${colors.secondary[500]}`,
                paddingLeft: 2,
                textTransform: "uppercase",
              }}
            >
              Request &#62; Create
              {/* Create Walk-in Request */}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ height: "100%", p: "20px", mt: 2 }}>
        <Typography
          variant="h5"
          sx={{ margin: "0 0 10px 0", textAlign: "center" }}
        >
          Prescription
        </Typography>
        <Box
          sx={{
            m: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Paper
            sx={{
              width: "400px",
              height: "550px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 1,
            }}
          >
            <img
              src={imgFile ? imgFile : prescriptionIMG_URL}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
            />

            <Paper
              sx={{
                bottom: 0,
                right: 0,
                display: "flex",
                width: "30px",
                height: "30px",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "25px",
              }}
            >
              <ButtonBase
                onClick={() => {
                  setChangeIMG((e) => !e);
                }}
              >
                <ModeEditOutline />
              </ButtonBase>
            </Paper>
          </Paper>
          {changeIMG && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                accept="image/*"
                id="profilePhoto"
                type="file"
                className="hidden"
                onChange={(e) => {
                  setImageUpload(e.target.files[0]);
                  setImgFile(URL.createObjectURL(e.target.files[0]));
                }}
              />
              <Button
                variant="contained"
                type="button"
                size="small"
                onClick={uploadImage}
              >
                Upload
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserRequestCreate;
