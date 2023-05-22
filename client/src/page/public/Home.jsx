import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import Navbar from "./components/Navbar";
import welcome2 from "../../assets/welcome2.svg";
import { Link } from "react-router-dom";
const Home = () => {
  const BoxLinks = (props) => {
    const { title, to } = props;
    return (
      <Box>
        <Link to={to} style={{ textDecoration: "none" }}>
          <Typography variant="h3" color="black">
            {title}
          </Typography>
        </Link>
      </Box>
    );
  };
  return (
    <Box
      className="container-page"
      sx={{
        flexDirection: "column",
        paddingLeft: 5,
        paddingRight: 5,
        background:
          "linear-gradient(180deg, rgba(124,223,184,0.5) 0%, rgba(255,255,255,1) 25%)",
      }}
    >
      <Navbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          height: "100%",
        }}
      >
        <Box sx={{ width: "700px" }}>
          <Typography
            sx={{ fontSize: "45pt" }}
            textTransform="uppercase"
            fontWeight="600"
          >
            Baliwag RHU
          </Typography>
          <br />
          <Typography variant="h3">
      Medicine cure diseases but only doctors can cure patients
          </Typography>
          <Divider
            sx={{
              m: "2em 0",
              borderBottomWidth: 5,
              width: "200px",
              backgroundColor: "#016171",
            }}
          />
          <Box
            sx={{
              width: "700px",
              display: "flex",
              gap: 5,
              "&.MuiBox-root > div": {
                width: "15em",
                p: 2,
                border: "1px solid black",
                borderRadius: 3,
              },
            }}
          >
            <BoxLinks title="Request now!" to="/register" />
          </Box>
        </Box>
        <img src={welcome2} alt="" style={{ width: "700px" }} />
      </Box>
    </Box>
  );
};

export default Home;
