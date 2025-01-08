import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import Alert from '@mui/material/Alert';
import * as Msal from "@azure/msal-browser";

const LandingPage = (props) => {
  const [isError, setIsError] = useState("");

  const handleAccessPortalClick = async () => {
    try {
      setIsError("");
      const msalConfig = {
        auth: {
          clientId: process.env.REACT_APP_TOKEN_CLIENT_ID,
          authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
          knownAuthorities: [],
          redirectUri: `${process.env.REACT_APP_TOKEN_REDIRECT}`,
          postLogoutRedirectUri: `${process.env.REACT_APP_TOKEN_REDIRECT}`,
          navigateToLoginRequestUrl: true,
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: false,
        }
      };
    
      const msalInstance = new Msal.PublicClientApplication(msalConfig);
      const msalInit     = await msalInstance.initialize();
      const response     = await msalInstance.loginPopup();

      const request = {
        scopes: [process.env.REACT_APP_TOKEN_SCOPE], 
        account: response.account,
      };

      const token = await msalInstance.acquireTokenSilent(request);
      localStorage.setItem('authToken', JSON.stringify(token));
      window.location.href = "/main";
    } catch (error) {
      if (error.name === "BrowserAuthError" && error.errorCode === "user_cancelled") {
        setIsError("User canceled the authentication flow");
      } else {
        setIsError("Login failed");
      }
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }} justifyContent="center" alignItems="center">
      <Box sx={{justifyContent: "center", alignItems: "center"}}>
        {isError !== "" ? <Alert sx={{margin: '0px 0px 10px 0px'}} severity="error">{isError}</Alert> : <></>}
        <Typography sx={{maxWidth: '900px'}} variant="body1" gutterBottom>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
          neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
          quasi quidem quibusdam.
        </Typography>
        <Button onClick={()=> handleAccessPortalClick()} sx={{float: "right", margin: '20px 0px 0px 0px'}} variant="outlined">Access Portal</Button>
      </Box>
    </Grid>
  );
}

export default LandingPage;