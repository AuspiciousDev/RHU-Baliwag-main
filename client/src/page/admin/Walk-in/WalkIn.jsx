import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import QRCode from "react-qr-code";
import {
  useTheme,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

const WalkIn = (props) => {
  const [data, setData] = useState("No results");
  const [value, setValue] = useState("No resasdasdsault");

  return (
    <Box>
      <Box sx={{ width: "400px" }}>
        <QrReader
          ViewFinder="true"
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.text);
            }

            if (!!error) {
              console.info(error);
            }
          }}
          style={{ width: "100%" }}
        />
        <p>{data}</p>
      </Box>
      <Box
        style={{
          height: "auto",
          margin: "0 auto",
          maxWidth: 512,
          width: "100%",
        }}
      >
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={value}
          viewBox={`0 0 256 256`}
        />
      </Box>
    </Box>
  );
};

export default WalkIn;
