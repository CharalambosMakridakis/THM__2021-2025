import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import Logo from '../assets/semi_androidMyCargonautmdpi.png';
import Picture from '../assets/Awkward-smiling-old-man-meme-1lbeyi.jpg';
import { Simulate } from 'react-dom/test-utils';
import reset = Simulate.reset;
import pb from '../components/lib/pocketbase.ts';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router-dom';

export interface Profile {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar: string;
  birthday: string;
  phone_number: string;
  credits: number;
  is_smoker: boolean;
  note: string;
  languages: string[];
}

export interface Ride {
  id: string;
  driverLocation: string;
  driver: string;
  passenger: string[];
  listing: string;
  is_canceled: boolean;
}

export interface Listing {
  allow_pets: boolean;
  allow_smoking: boolean;
  cargo_height: number;
  cargo_length: number;
  cargo_weight: number;
  cargo_width: number;
  collectionId: string;
  collectionName: string;
  created: string;
  date: string;
  end_location: string;
  id: string;
  is_request: boolean;
  note: string;
  seats: number;
  total_price: number;
  start_location: string;
  updated: string;
  user: string;
  vehicle: string;
}

const defaultProfile: Profile = {
  id: '0',
  username: '0',
  email: '0',
  firstname: '0',
  lastname: '0',
  avatar: Picture,
  birthday: '0',
  phone_number: '0',
  credits: 0,
  is_smoker: false,
  note: '0',
  languages: ['0'],
};

const Profile = () => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [driverRides, setDriverRides] = useState<Ride[]>([]);
  const [passengerRides, setPassengerRides] = useState<Ride[]>([]);
  const [numOfPassenger, setNumOfPassenger] = useState<number>(0);
  const [smoker, setSmoker] = useState<string>('Nein');
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const navigate = useNavigate();

  const handleVehicle = () => {
    navigate('/garage');
  };

  // Fetch user data for currently logged-in user
  const getUserData = async () => {
    try {
      // @ts-ignore
      const userID = pb.authStore.model.id;

      const currentUserProfile: Profile = await pb
        .collection('users')
        .getOne(userID, {});
      setProfile(currentUserProfile);
      if (currentUserProfile.is_smoker) {
        setSmoker('Ja');
      }
    } catch (error) {
      console.error('Error while searching profile:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [reset]);

  // Fetch ride data for currently logged-in user
  const getRideData = async () => {
    try {
      // @ts-ignore
      const userID = pb.authStore.model.id;

      // fetch a list with rides where the user is the driver
      const driverRides: Ride[] = await pb
        .collection('rides')
        .getFullList({ filter: `driver.id = "${userID}"` });
      setDriverRides(driverRides);
      let numOfPassenger = 0;
      // calculate total passengers
      for (let i = 0; i < driverRides.length; i++) {
        numOfPassenger += driverRides[i].passenger.length;
      }
      setNumOfPassenger(numOfPassenger);

      let weight = 0;
      for (let i = 0; i < driverRides.length; i++) {
        const listingID = driverRides[i].listing;
        const listingAsDriver: Listing = await pb
          .collection('listing')
          .getOne(`${listingID}`);
        weight += listingAsDriver.cargo_weight;
      }
      setTotalWeight(weight);

      // fetch a list with rides where the user is the passenger
      const passengerRides: Ride[] = await pb
        .collection('rides')
        .getFullList({ filter: `passenger.id = "${userID}"` });
      setPassengerRides(passengerRides);
    } catch (error) {
      console.error('Error while searching rides:', error);
    }
  };

  useEffect(() => {
    getRideData();
  }, [reset]);
  console.log(pb.files.getUrl(profile, String(profile.avatar)));
  return (
    <>
      <div>
        <img src={Logo} width={250} alt="Cargonaut Logo" />

        <Stack
          direction="row"
          spacing={2}
          style={{
            display: 'flex',
            justifyContent: 'right',
            alignItems: 'right',
          }}
        >
          <Button onClick={handleVehicle} variant="outlined">
            Fahrzeugverwaltung
          </Button>
          <Button variant="outlined">Eigene Angebote/Gesuche</Button>
          <Button variant="contained">Abmelden</Button>
        </Stack>
      </div>
      <div style={{ height: '800px', overflow: 'auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box>
            {profile.avatar === '' ? (
              <AccountBoxIcon sx={{ width: 350 }}></AccountBoxIcon>
            ) : (
              <img
                src={pb.files.getUrl(profile, String(profile.avatar))}
                width={350}
              />
            )}
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 1 / 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1,
              m: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#101010' : '#fff',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            {profile.firstname} {profile.lastname}
          </Box>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 1 / 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1,
              m: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#101010' : '#fff',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            {new Date(profile.birthday).toLocaleDateString()}
          </Box>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 1 / 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1,
              m: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#101010' : '#fff',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            {profile.note}
          </Box>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 1 / 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1,
              m: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#101010' : '#fff',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            Fahrten als Fahrer: {driverRides.length} <br />
            Fahrten als Passagier: {passengerRides.length}
          </Box>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 1 / 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1,
              m: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#101010' : '#fff',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            Erfahrung: <br />
            Anzahl Mitfahrer: {numOfPassenger} <br />
            Anzahl Gewicht: {totalWeight} <br />
            Strecken: {passengerRides.length} <br />
            Sprachen: {profile.languages} <br />
            Raucher: {smoker} <br />
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              '& > legend': { mt: 2 },
            }}
          >
            <Typography component="legend">Rating</Typography>
            <Rating name="read-only" value={69} readOnly />
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 1 / 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1,
              m: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#101010' : '#fff',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            <div>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Avatar alt="Dude" src={Picture} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Review 1"
                    secondary="Auto macht komische Geräusche"
                  />
                </ListItem>

                <Box sx={{ m: 2 }}>
                  <Typography component="legend"></Typography>
                  <Rating name="read-only" value={1} readOnly />
                </Box>
                <Divider component="li" />

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Avatar alt="Dude" src={Picture} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Review 2"
                    secondary="War ne nette Fahrt!"
                  />
                </ListItem>

                <Box sx={{ m: 2 }}>
                  <Typography component="legend"></Typography>
                  <Rating name="read-only" value={4} readOnly />
                </Box>
                <Divider component="li" />

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Avatar alt="Dude" src={Picture} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Review 3" secondary="Unfall gebaut!" />
                </ListItem>

                <Box sx={{ m: 2 }}>
                  <Typography component="legend"></Typography>
                  <Rating name="read-only" value={0} readOnly />
                </Box>
              </List>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Profile;
