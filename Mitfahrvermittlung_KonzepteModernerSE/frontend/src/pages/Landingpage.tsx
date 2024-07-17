import { ReactElement, useState } from 'react';
import Grid from '@mui/material/Grid';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Logo from '../assets/logo/1x/semi_androidMyCargonautmdpi.png';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { OverridableStringUnion } from '@mui/types';
import {
  Alert,
  AlertColor,
  AlertPropsColorOverrides,
  IconButton,
  Snackbar,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AutoCompleteSearchBar from '../components/AutoCompleteSearchBar.tsx';
import pb from '../components/lib/pocketbase.ts';
import { Dayjs } from 'dayjs';

export default function Landingpage(): ReactElement {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] =
    useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>();
  const [date, setDate] = useState<Dayjs | null>(null);
  const [departure, setDeparture] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const authStore = pb.authStore.model;

  const handleLogin = () => {
    navigate('/login');
  };

  const handleAccount = () => {
    navigate('/profile');
  };

  const handleSearch = () => {
    navigate('/listings/');
  };

  const handleSnackbarClose = (
    _: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handlePlaceOffer = () => {
    console.log(authStore);
    if (authStore) {
      if (authStore.avatar && authStore.phone_number !== '') {
        navigate('/createListing');
      } else {
        setAlertMessage(
          'Um eigene Anzeigen erstellen zu können benötigst du einen Avatar und eine hinterlegte Telefonnummer!',
        );
        setAlertSeverity('info');
        setOpenSnackbar(true);
      }
    } else {
      setAlertMessage(
        'Du musst angemeldet sein um eigene Anzeigen zu erstellen!',
      );
      setAlertSeverity('info');
      setOpenSnackbar(true);
    }
  };

  return (
    <div>
      <Container sx={{ padding: '10px', display: 'flex' }}>
        <div>
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src={Logo} alt="MyCargonaut Logo" />
          </Grid>
        </div>
        <div>
          <Button onClick={handlePlaceOffer} variant="contained">
            Anzeige aufgeben
          </Button>
        </div>
        <div>
          {authStore !== null ? (
            <IconButton onClick={handleAccount}>
              <AccountCircleIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleLogin}>
              <LoginIcon />
            </IconButton>
          )}
        </div>
      </Container>
      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '45%',
              margin: '0 auto',
            }}
          >
            <AutoCompleteSearchBar isFromSearch={true} setter={setDeparture} />
            <AutoCompleteSearchBar
              isFromSearch={false}
              setter={setDestination}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <DateTimePicker
              label="Beginn der Fahrt"
              ampmInClock={false}
              ampm={false}
              disablePast
              format="HH:mm DD/MM/YYYY"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <Button
              onClick={handleSearch}
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Suchen
            </Button>
          </div>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
