import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { inputStyle, labelStyle } from './signUp.style.ts';
import { DatePicker } from '@mui/x-date-pickers';
import LanguageSelect from '../../components/LanguageSelect.tsx';
import { FormHelperText, Switch } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { Dayjs } from 'dayjs';
import pb from '../../components/lib/pocketbase.ts';
import { useNavigate } from 'react-router-dom';

export interface IFormState {
  username: string;
  firstName: string;
  lastName: string;
  birthday: Date | null;
  languages: string[] | null;
  email: string;
  emailSec: string;
  password: string;
  errors: {
    username: string;
    firstName: string;
    lastName: string;
    birthday: string;
    languages: string;
    email: string;
    emailSec: string;
    password: string;
  };
}

export default function SignUp() {
  const [avatar, setAvatar] = useState('');
  const [avatarDB, setAvatarDB] = useState<File | null>(null);
  const [languages, setLanguages] = useState<string[] | null>([]);
  const [formState, setFormState] = useState<IFormState>({
    username: '',
    firstName: '',
    lastName: '',
    birthday: null,
    languages: [],
    email: '',
    emailSec: '',
    password: '',
    errors: {
      username: '',
      firstName: '',
      lastName: '',
      birthday: '',
      languages: '',
      email: '',
      emailSec: '',
      password: '',
    },
  });
  const navigate = useNavigate();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const url = URL.createObjectURL(selectedFile);
      setAvatar(url);
      setAvatarDB(selectedFile);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // This is an input event
    const { name, value } = event.target as HTMLInputElement;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: value ? '' : `${name} ist erforderlich`,
      },
    }));
  };

  const handleLanguageChange = (newLanguages: string[]) => {
    // Set languages to null if no language is selected
    setLanguages(newLanguages.length ? newLanguages : null);

    // Set error if no language is selected
    if (!newLanguages.length) {
      setFormState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          languages: 'Mindestens eine Sprache ist erforderlich',
        },
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          languages: '',
        },
      }));
    }
  };

  const handleDateChange = (value: Dayjs | null) => {
    const date = value ? value.toDate() : null;
    if (date) {
      setFormState((prevState) => ({
        ...prevState,
        birthday: date,
        errors: {
          ...prevState.errors,
          birthday: '',
        },
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          birthday: 'Geburtstag ist erforderlich',
        },
      }));
    }
  };

  const validateForm = () => {
    // User muss 18 sein
    //email muss mit zweiter email überprüft werden
    //email und username dürfen nicht schon existieren

    const newErrors: Partial<IFormState['errors']> = {};
    for (const key in formState) {
      if (key !== 'errors' && !formState[key as keyof IFormState]) {
        newErrors[key as keyof IFormState['errors']] =
          `${key} ist erforderlich`;
      }
    }
    if (!languages || languages.length === 0) {
      newErrors.languages = 'Mindestens eine Sprache ist erforderlich';
    }

    // Überprüfen, ob der Benutzer mindestens 18 Jahre alt ist
    if (formState.birthday) {
      const today = new Date();
      const birthDate = new Date(formState.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.birthday = 'Sie müssen mindestens 18 Jahre alt sein';
      }
    }

    // Überprüfen, ob die E-Mails übereinstimmen
    if (formState.email !== formState.emailSec) {
      newErrors.emailSec = 'Die E-Mails stimmen nicht überein';
    }

    setFormState((prevState) => ({
      ...prevState,
      errors: { ...prevState.errors, ...newErrors },
    }));
    return Object.keys(newErrors).length === 0; // Keine Fehler, wenn die Länge 0 ist
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (validateForm() && formState.birthday) {
      const formdata = new FormData();
      const birthday = formState.birthday;
      const birthdayDate = new Date(birthday).toISOString();

      const data = {
        username: formState.username,
        avatar: avatarDB,
        firstname: formState.firstName,
        lastname: formState.lastName,
        birthday: birthdayDate,
        languages: formState.languages,
        email: formState.email,
        phone_number: formdata.get('phonenumber') ?? '',
        password: formState.password,
        passwordConfirm: formState.password,
        is_smoker: formdata.get('isSmoker') ?? false,
      };
      try {
        await pb.collection('users').create(data);
        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#686D76',
        minHeight: '100%', // Ensures the background color covers the entire viewport height
        display: 'flex',
      }}
    >
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 1,
            marginBottom: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            borderRadius: 10,
            backgroundColor: '#EEEEEE',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#373a40' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registrierung
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!formState.errors.username}
                  helperText={formState.errors.username}
                  required
                  fullWidth
                  id="username"
                  label="Benutzername"
                  name="username"
                  onChange={handleChange}
                  autoComplete="username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Avatar src={avatar} sx={{ ml: 2, width: 56, height: 56 }} />
              </Grid>
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                style={inputStyle}
                onChange={handleFileChange}
              />
              <label htmlFor="fileInput" style={{ ...labelStyle }}>
                Datei wählen
              </label>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!formState.errors.firstName}
                  helperText={formState.errors.firstName}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Vorname"
                  onChange={handleChange}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!formState.errors.lastName}
                  helperText={formState.errors.lastName}
                  required
                  fullWidth
                  onChange={handleChange}
                  id="lastName"
                  label="Nachname"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  required
                  error={!!formState.errors.birthday}
                  sx={{ width: '100%' }}
                >
                  <DatePicker
                    label="Geburstag"
                    sx={{ width: '100%' }}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    name="birthday"
                  />
                  <FormHelperText>{formState.errors.birthday}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  required
                  error={!!formState.errors.languages}
                  sx={{ width: '100%' }}
                >
                  <LanguageSelect
                    error={!!formState.errors.languages}
                    helperText={formState.errors.languages}
                    handleLanguageChange={handleLanguageChange}
                  />
                  <FormHelperText>{formState.errors.languages}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!!formState.errors.email}
                  helperText={formState.errors.email}
                  required
                  fullWidth
                  onChange={handleChange}
                  id="email"
                  label="Email Addresse"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!!formState.errors.emailSec}
                  helperText={formState.errors.emailSec}
                  required
                  fullWidth
                  onChange={handleChange}
                  id="emailSec"
                  label="Email Addresse bestätigen"
                  name="emailSec"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phonenumber"
                  label="Telefonnummer"
                  name="phonenumber"
                  autoComplete="phonenumber"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!!formState.errors.password}
                  helperText={formState.errors.password}
                  onChange={handleChange}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Switch />}
                  name="isSmoker"
                  label="Ich bin Raucher"
                />
              </Grid>
            </Grid>
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: (t) =>
                  t.palette.mode === 'dark'
                    ? t.palette.grey[50] // Dark grey color for dark mode
                    : '#DC5F00', // Original grey color for light mode
              }}
            >
              Registrieren
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Du hast bereits einen Account? Dann melde dich hier an
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
