import { useState, useEffect } from 'react';
import CustomNavigation from './_Navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";

const MainPage = (props) => {
  const [isAuth, setIsAuth]           = useState(false);
  const [isInprogress, setInprogress] = useState(true);
  const [isError, setIsError]         = useState("");
  const [response, setResponse]       = useState(null);

  useEffect(() => {
    const authToken = window.localStorage.getItem("authToken");
    if (authToken !== null){
      const authTokenObj = JSON.parse(authToken);
      setIsAuth(authTokenObj);
      setInprogress(false);
    }else{
      setIsError("Unauthorized access. Redirecting to landing page...");
      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    }
  },[]);

  const handleSearchFiles = () => {
    setInprogress(true);
    let data = JSON.stringify({
      "request": {
        "Querytext": "(RelatedHubSites:3ec33b7e-ee1e-40b3-b0d2-16ced59d91a5) (-SiteId:33ec33b7e-ee1e-40b3-b0d2-16ced59d91a5)",
        "SelectProperties": {
          "results": [
            "Title",
            "Path",
            "FileType",
            "SiteName",
            "glBuilding",
            "glBusiness",
            "glDepartmentDMS",
            "glDiscipline",
            "glDocumentType",
            "glFileExtensionDMS",
            "glResort",
            "RoleDMS",
            "RoleType",
            "PictureThumbnailURL",
            "PreviewThumbnail",
            "EncodedAbsThumbnailUrl",
            "CheckoutUser",
            "UIVersionString",
            "CheckInComment",
            "FileLeafRef",
            "ListId",
            "Author",
            "IdentityListItemId",
            "glParkStage",
            "glGate",
            "glVilla"
          ]
        },
        "StartRow": 0,
        "RowLimit": 500,
        "ClientType": "PnPModernSearch",
        "__metadata": {
          "type": "Microsoft.Office.Server.Search.REST.SearchRequest"
        }
      }
    });
    axios.post(`https://${process.env.REACT_APP_TENANT_NAME}.sharepoint.com/sites/${process.env.REACT_APP_HUB_NAME}/_api/search/postquery`, data, { 
      headers: {
        "Accept": "application/json;odata=nometadata",
        "Content-Type": "application/json;odata=verbose;charset=utf-8",
        "Authorization": `Bearer ${isAuth.accessToken}`
      },
      maxBodyLength: Infinity,
    })
    .then((res) => {
      if(res.data.error === true) {
        setIsError(res.data.errorMessage);
      }else{
        if(res.data){
          setIsError('');
          setResponse(res.data.PrimaryQueryResult.RelevantResults.Table.Rows);
        }else{
          setIsError('Search error - unable to fetch files.');
        }
      }
      setInprogress(false);
    })
    .catch((e) => {
      setInprogress(false);
      console.log(e);
    });
  }

  return (
    <div>
      <CustomNavigation/>
      {isAuth !== false ? <Alert severity="info"><strong>Authenticated as: </strong> {isAuth.account.name} - {isAuth.account.username}</Alert> : <></>}
      {isError !== "" ? <Alert severity="error">{isError} <a href="/">go back</a></Alert> : <></>}
      {isInprogress ? <LinearProgress/> :
        response !== null ?
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 840 }}>
              <Table sx={{ minWidth: 650 }} size="small" stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#009688', color: 'white', textTransform: "uppercase", fontWeight: "800", border: '1px solid white'}}>Title</TableCell>
                    <TableCell sx={{ backgroundColor: '#009688', color: 'white', textTransform: "uppercase", fontWeight: "800", border: '1px solid white'}}>Path</TableCell>
                    <TableCell sx={{ backgroundColor: '#009688', color: 'white', textTransform: "uppercase", fontWeight: "800", border: '1px solid white'}}>FileType</TableCell>
                    <TableCell sx={{ backgroundColor: '#009688', color: 'white', textTransform: "uppercase", fontWeight: "800", border: '1px solid white'}}>SiteName</TableCell>
                    <TableCell sx={{ backgroundColor: '#009688', color: 'white', textTransform: "uppercase", fontWeight: "800", border: '1px solid white'}}>Building</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {response.map((row, index) => (
                    <TableRow
                      key={index}
                    >
                      <TableCell sx={{border: '0.8px solid black'}} component="th" scope="row">{row.Cells[0].Value} </TableCell>
                      <TableCell sx={{border: '0.8px solid black'}}>{row.Cells[1].Value}</TableCell>
                      <TableCell sx={{border: '0.8px solid black'}}>{row.Cells[2].Value}</TableCell>
                      <TableCell sx={{border: '0.8px solid black'}}>{row.Cells[3].Value}</TableCell>
                      <TableCell sx={{border: '0.8px solid black'}}>{row.Cells[4].Value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        :
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '70vh' }}>
            <Button onClick={() => handleSearchFiles()} variant="contained" color="primary">
              Search Files
            </Button>
          </Box>
      }
    </div>
  );
}

export default MainPage;