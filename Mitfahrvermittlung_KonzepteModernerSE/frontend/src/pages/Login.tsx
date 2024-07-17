import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../components/lib/auth.ts';
import {
  Alert,
  AlertColor,
  AlertPropsColorOverrides,
  Snackbar,
} from '@mui/material';
import Logo from '../assets/logo/1x/semi_androidMyCargonautmdpi.png';
import { useNavigate } from 'react-router-dom';
import { OverridableStringUnion } from '@mui/types';

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 8, mb: 4 }}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://thm.de/">
        MyCargonaut
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const [errorUser, setUserError] = useState(false);
  const [errorPassword, setPasswordError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] =
    useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>();
  const navigate = useNavigate();

  const handleSnackbarClose = (
    _: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(false);
    setUserError(false);

    const data = new FormData(event.currentTarget);

    login({
      email: (data.get('email') as string) + '',
      password: data.get('password') as string,
    })
      .then((isLoggedIn): void => {
        if (isLoggedIn) {
          console.log('Logged in');
          setAlertMessage('Erfolgreich angemeldet! Leite weiter...');
          setAlertSeverity('success');
          setOpenSnackbar(true);
          setTimeout(() => {
            navigate('/');
          }, 5000);
        } else {
          console.log('Login failed');
          setPasswordError(true);
          setUserError(true);
          setAlertMessage('Benutzername oder Passwort falsch!');
          setAlertSeverity('error');
          setOpenSnackbar(true);
        }
      })
      .catch((error): void => {
        console.error('Error occured while logging in: ', error);
        setPasswordError(true);
        setUserError(true);
        setAlertMessage('Benutzername oder Passwort falsch!');
        setAlertSeverity('error');
        setOpenSnackbar(true);
      });
  };

  //TODO: Fix the image; Make the component be in center; Handle register and forgot pw
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container sx={{ padding: '10px' }}>
        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
          <img src={Logo} alt="MyCargonaut Logo" />
        </Grid>
        <Grid
          container
          maxWidth="xs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Anmeldung
          </Typography>
          <Grid
            container
            direction="column"
            alignItems="center"
            sx={{ alignSelf: 'center' }}
          >
            <Grid item>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  error={errorUser}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email-Addresse"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  error={errorPassword}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Passwort"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Anmelden
                </Button>
                <Grid container justifyContent="flex-end">
                  {/*                  <Grid item xs>
                    <Link href="/forgotpw" variant="body2">
                      Passwort vergessen?
                    </Link>
                  </Grid>*/}
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      Noch kein Konto? Registrieren
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Copyright />
        </Grid>
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
    </ThemeProvider>
  );
}
