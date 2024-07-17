import { useEffect, useState } from 'react';
import myCargonaut from '../assets/myCargonaut.png';
import Grid from '@mui/material/Grid';
import {
  Alert,
  AlertColor,
  AlertPropsColorOverrides,
  Button,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  IconButton,
  Rating,
  Slider,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ListingItem from '../components/ListingItem';
import Pocketbase from 'pocketbase';
import AutoCompleteSearchBar from '../components/AutoCompleteSearchBar';
import { useLocation, Location, useNavigate } from 'react-router-dom';
import pb from '../components/lib/pocketbase.ts';
import { OverridableStringUnion } from '@mui/types';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { RichTextEditor } from 'mui-tiptap';

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
  distance: number;
  expand: { user: any, vehicle: any };
  is_request: boolean;
  note: string;
  seats: number;
  total_price: number;
  start_location: string;
  updated: string;
  user: string;
  vehicle: string;
}


interface ILocation {
  departureSearch: string;
  destinationSearch: string;
  dateSearch: Date;
}
const Homepage = () => {
  const location: Location<ILocation> = useLocation();
  let departureSearch = '';
  let destinationSearch = '';
  let dateSearch: Date | null = null;

  if (location.state) {
    departureSearch = location.state.departureSearch;
    destinationSearch = location.state.destinationSearch;
    dateSearch = location.state.dateSearch;
    console.log('fewnoooooooowefonewin');
  }

  const [bookedAnListing, setBookedAnListing] = useState<boolean>(false);
  const departureDefault = departureSearch ?? '';
  const destinationDefault = destinationSearch ?? '';
  const dateDefault = dateSearch ? dayjs(dateSearch) : dayjs(new Date());
  const [departureDate, setDepartureDate] = useState<Dayjs>(dateDefault);
  const [departure, setDeparture] = useState<string>(departureDefault);
  const [destination, setDestination] = useState<string>(destinationDefault);
  const [cargoWeight, setCargoWeight] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [seats, setSeats] = useState<number>(0);
  const [cargoHeight, setCargoHeight] = useState<number>(0);
  const [cargoWidth, setCargoWidth] = useState<number>(0);
  const [cargoLength, setCargoLength] = useState<number>(0);
  const [reset, setReset] = useState<boolean>(false);
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>();
  const authStore = pb.authStore.model;
  // Base URL for Pocketbase API
  const POCKETBASE_URL = 'http://195.90.222.132:8090/';

  // Fetch all listings
  const fetchListings = async () => {
    try {
      const pb = new Pocketbase(POCKETBASE_URL);

      const rides = await pb.collection('rides').getFullList({ sort: '-created' , expand: "listing, listing.user, listing.vehicle"});
      const filteredListings = rides
        .filter((ride) => !ride.passenger.includes(authStore?.id))
        .filter((ride) => ride.passenger.length < ride.expand?.listing.seats)
        .filter((ride) => ride.driver !== authStore?.id)
        .map((ride) => ride.expand?.listing);
      
      setListing(filteredListings);


    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleAccount = () => {
    navigate('/profile');
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
      navigate('/login');
    }
  };

  useEffect(() => {
    void fetchListings();
  }, [reset, bookedAnListing]);

  // Search for listings based on query
  const querySearch = async () => {
    try {
      const pb = new Pocketbase(POCKETBASE_URL);

      const dateString: string = departureDate.format('YYYY-MM-DD');

      const searchedListings = await pb
        .collection('rides')
        .getFullList({
          sort: '-created',
          expand: 'listing, listing.user, listing.vehicle',
          filter: `listing.start_location = "${departure}" && listing.end_location = "${destination}" && listing.date >= "${dateString} 00:00:00" && listing.date < "${dateString} 23:59:59"`,
        });

        let filteredListings;
        if(authStore) {
          filteredListings = searchedListings
            .filter((ride) => !ride.passenger.includes(authStore?.id))
            .filter((ride) => ride.passenger.length < ride.expand?.listing.seats)
            .filter((ride) => ride.driver !== authStore?.id)
            .map((ride) => ride.expand?.listing);
        } else {
          filteredListings = searchedListings
          .filter((ride) => ride.passenger.length < ride.expand?.listing.seats)
          .map((ride) => ride.expand?.listing);
        }

      setListing(filteredListings);
    } catch (error) {
      console.error('Error querying search:', error);
    }
  };

  // Reset filters
  const resetFilter = () => {
    setReset(!reset);
    setSeats(0);
    setCargoWeight(0);
    setCargoWidth(0);
    setCargoLength(0);
    setCargoHeight(0);
    setRating(0);
  };

  // Apply filters
  const filter = () => {
    const filteredListings: Listing[] = listing.filter(
      (listing) =>
        (seats ? listing.seats >= seats : true) &&
        (cargoHeight ? listing.cargo_height >= cargoHeight : true) &&
        (cargoWeight ? listing.cargo_weight >= cargoWeight : true) &&
        (cargoLength ? listing.cargo_length >= cargoLength : true) &&
        (cargoWidth ? listing.cargo_width >= cargoWidth : true),
    );
    setListing(filteredListings);
  };

  const handleLogin = () => {
    navigate('/login');
  };


  const bookOffer = async (id: string) => {
    if (authStore) {
      const rideArray = await pb.collection('rides').getFullList({
        sort: '-created',
        filter: `listing = "${id}"`,
      });

      if (rideArray.length !== 1) {
        console.error("mehr als 1 ride gefunden");
        return;
      }

      let ride = rideArray.pop()!;

      if (ride.passenger.includes(authStore.id)) {
        setAlertMessage('Du hast diese Fahrt bereits gebucht!');
        setAlertSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (ride.driver === authStore.id) {
        setAlertMessage('Du bist bereits Fahrer dieser Fahrt!');
        setAlertSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if(ride.driver === "") {
        ride.driver = authStore.id;
      } else {
        ride.passenger.push(authStore.id);
      }

      await pb.collection('rides').update(ride.id, ride);
      setBookedAnListing(!bookedAnListing);
      setAlertMessage('Viel Spaß mit der Fahrt!');
      setAlertSeverity('success');
      setOpenSnackbar(true);
      // TODO: Navigate to "My Rides" Page
    } else {
      navigate('/login');
    }
  };

  return (
    <Stack>
      <div style={{ backgroundColor: '#EEEEEE' }}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={2}
            style={{ marginLeft: 20, marginRight: -20, marginTop: 20 }}
          >
            <img src={myCargonaut} width={150} alt="Cargonaut Logo" />
          </Grid>
          <Grid item style={{ marginTop: 20 }}>
            <AutoCompleteSearchBar isFromSearch={true} setter={setDeparture} />
          </Grid>
          <Grid item style={{ marginTop: 20 }}>
            <AutoCompleteSearchBar
              isFromSearch={false}
              setter={setDestination}
            />
          </Grid>
          <Grid item xs={2} style={{ marginTop: 20 }}>
            <DateTimePicker
              value={departureDate} // Pass Dayjs object directly
              onChange={(newDate) => setDepartureDate(dayjs(newDate))}
              format="DD/MM/YYYY HH:mm"
              label="Beginn der Fahrt"
              ampm={false}
              disablePast={true}
            />
          </Grid>
          <Grid item xs={1} style={{ marginTop: 24 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{
                backgroundColor: '#373A40',
                '&:hover': { backgroundColor: '#373840' },
              }}
              onClick={querySearch}
            >
              FINDEN
            </Button>
          </Grid>
          <Grid
            item
            xs={3}
            style={{ marginTop: 24, marginLeft: 56, marginRight: -56 }}
          >
            <Button
              variant="contained"
              onClick={handlePlaceOffer}
              startIcon={<ArrowUpwardIcon />}
              sx={{
                backgroundColor: '#373A40',
                '&:hover': { backgroundColor: '#373840' },
              }}
            >
              Anzeige aufgeben
            </Button>
          </Grid>
          <Grid item style={{ marginTop: 24 }}>
            {authStore !== null ? (
              <IconButton onClick={handleAccount}>
                <AccountCircleIcon />
              </IconButton>
            ) : (
              <IconButton onClick={handleLogin}>
                <LoginIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </div>

      <div style={{ backgroundColor: '#686D76' }}>
        <Grid container spacing={33}>
          <Grid item style={{ marginLeft: 32, marginTop: 88 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <FormControl>
                    <FormLabel id="cargo-slider-weight">
                      Gewicht der Fracht in Kilo ab
                    </FormLabel>
                    <Slider
                      size="small"
                      defaultValue={0}
                      value={cargoWeight}
                      onChange={(_, value) =>
                        setCargoWeight(value as number)
                      }
                      aria-label="Small"
                      valueLabelDisplay="auto"
                    />
                    <TextField
                      type="number"
                      label="Frachthöhe in Meter"
                      variant="standard"
                      inputProps={{ min: 1 }}
                      value={cargoHeight}
                      onChange={(event) =>
                        setCargoHeight(parseInt(event.target.value))
                      }
                    />
                    <TextField
                      type="number"
                      label="Frachtbreite in Meter"
                      variant="standard"
                      inputProps={{ min: 1 }}
                      value={cargoWidth}
                      onChange={(event) =>
                        setCargoWidth(parseInt(event.target.value))
                      }
                    />
                    <TextField
                      type="number"
                      label="Frachtlänge in Meter"
                      variant="standard"
                      inputProps={{ min: 1 }}
                      value={cargoLength}
                      onChange={(event) =>
                        setCargoLength(parseInt(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel id="cargo-slider-weight">Bewertung</FormLabel>
                    <Rating
                      name="simple-controlled"
                      value={rating}
                      onChange={(_, value) => setRating(value as number)}
                    />
                  </FormControl>
                  <TextField
                    type="number"
                    label="Sitzplätze"
                    variant="standard"
                    inputProps={{ min: 1 }}
                    value={seats}
                    onChange={(event) => setSeats(parseInt(event.target.value))}
                  />
                  <Button
                    variant="contained"
                    startIcon={<FilterAltIcon />}
                    sx={{
                      backgroundColor: '#DC5F00',
                      '&:hover': { backgroundColor: '#DC3F00' },
                    }}
                    onClick={filter}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<FilterAltOffIcon />}
                    sx={{
                      backgroundColor: '#DC5F00',
                      '&:hover': { backgroundColor: '#DC3F00' },
                    }}
                    onClick={resetFilter}
                  >
                    Zurücksetzen
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item style={{ marginTop: 80 }}>
            {listing.map((item, key) => (
              <div style={{ marginTop: 10 }} key={key}>
                <ListingItem item={item} bookOffer={bookOffer} />
              </div>
            ))}
          </Grid>
        </Grid>
      </div>
      <div style={{ backgroundColor: '#373A40', textAlign: 'center' }}>
        <img src={myCargonaut} width={200} alt="Cargonaut Logo" />
      </div>
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
    </Stack>
  );
};

export default Homepage;
