import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  FormControlLabel,
  InputLabel,
  FormControl,
  Grid,
  FormHelperText,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { ReactElement, useEffect, useRef, useState } from 'react';
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  RichTextEditorRef,
} from 'mui-tiptap';
import dayjs, { Dayjs } from 'dayjs';
import StarterKit from '@tiptap/starter-kit';
import myCargonaut from '../assets//myCargonaut.png';
import pb from '../components/lib/pocketbase.ts';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export interface VehiclesRecord {
  cargo_height: number;
  cargo_length: number;
  cargo_weight: number;
  cargo_width: number;
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  image: string;
  name: string;
  note: string;
  seats: number;
  updated: string;
}

export interface CreateListingData {
  allow_pets: boolean;
  allow_smoking: boolean;
  cargo_height: number;
  cargo_length: number;
  total_price: number;
  cargo_weight: number;
  cargo_width: number;
  date: string;
  end_location: string;
  is_request: boolean;
  note: string;
  seats: number;
  start_location: string;
  user?: string;
  vehicle: string | null;
}

function CreateListingPage(): ReactElement {
  const rteRef = useRef<RichTextEditorRef>(null);
  const navigate = useNavigate();
  const [isOffer, setIsOffer] = useState<boolean>(true);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs(new Date()));
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [allowSmoke, setAllowSmoke] = useState<boolean>(false);
  const [allowPets, setAllowPets] = useState<boolean>(false);
  const [cargoWeight, setCargoWeight] = useState<number>(0);
  const [cargoHeight, setCargoHeight] = useState<number>(0);
  const [cargoLength, setCargoLength] = useState<number>(0);
  const [cargoWidth, setCargoWidth] = useState<number>(0);
  const [seats, setSeats] = useState<number>(0);
  const [car, setCar] = useState<string>();
  const [selectedCarID, setSelectedCarID] = useState<string>('');
  const [availableCars, SetAvailableCars] = useState<VehiclesRecord[]>();

  const fetchCars = async (): Promise<void> => {
    try {
      const records: VehiclesRecord[] = await pb
        .collection('vehicles')
        .getFullList({
          sort: '-created',
        });

      SetAvailableCars(records);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void fetchCars();
  }, []);

  const createListing = async () => {
    const newListing: CreateListingData = {
      is_request: !isOffer,
      start_location: from,
      end_location: to,
      date: dateTime.toISOString(),
      cargo_weight: cargoWeight,
      cargo_length: cargoLength,
      cargo_width: cargoWidth,
      cargo_height: cargoHeight,
      seats: seats,
      note: rteRef.current?.editor?.getHTML() ?? '',
      total_price: totalPrice,
      allow_smoking: allowSmoke,
      allow_pets: allowPets,
      vehicle: isOffer ? selectedCarID : null,
      user: pb.authStore.model!.id as string,
    };

    try {
      newListing.user = 'eyzbmzk7xwio67i'; // bei login entfernen
      console.log(newListing);
      await pb.collection('listing').create(newListing);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#EEEEEE',
      }}
    >
      <img
        onClick={() => navigate('/')}
        src={myCargonaut}
        width={200}
        style={{ margin: 5 }}
      />
      <Box mx={'auto'} p={5} maxWidth={2 / 3} width={1 / 2}>
        <Grid container>
          <Grid item xs={6}>
            <Button
              sx={{
                backgroundColor: '#686D76',
                width: '100%',
                height: '3rem',
                border: 1,
                borderRadius: '15px 0% 0% 15px',
                '&:disabled': {
                  backgroundColor: '#DC5F00',
                  color: 'white',
                },
                '&:hover': {
                  color: 'black',
                  backgroundColor: 'white',
                },
              }}
              variant="contained"
              disabled={isOffer}
              onClick={() => setIsOffer(true)}
            >
              Angebot
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              sx={{
                backgroundColor: '#686D76',
                width: '100%',
                height: '3rem',
                border: 1,
                borderRadius: '0% 15px 15px 0%',
                '&:disabled': {
                  backgroundColor: '#DC5F00',
                  color: 'white',
                },
                '&:hover': {
                  color: 'black',
                  backgroundColor: 'white',
                },
              }}
              variant="contained"
              disabled={!isOffer}
              onClick={() => setIsOffer(false)}
            >
              Gesuch
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6} mt={3}>
            <TextField
              label="Von"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              sx={{
                width: '100%',
              }}
            />
          </Grid>
          <Grid item xs={6} mt={3}>
            <TextField
              label="Nach"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              sx={{
                width: '100%',
              }}
            />
          </Grid>
          <Grid item xs={9} mt={3}>
            <DateTimePicker
              ampm={false}
              format="HH:mm DD/MM/YYYY"
              disablePast
              value={dateTime}
              onChange={(newDate) => setDateTime(newDate!)}
              sx={{
                width: '100%',
              }}
            />
          </Grid>
          <Grid item xs={1} />

          <Grid item xs={2} mt={3}>
            <TextField
              label="Preis"
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(parseFloat(e.target.value))}
            />
          </Grid>

          <Grid item xs={3} mt={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="SomeName"
                  value="SomeValue"
                  checked={allowSmoke}
                  onChange={(e) => setAllowSmoke(e.target.checked)}
                />
              }
              label="Rauchen erlaubt"
            />
          </Grid>
          <Grid item xs={3} mt={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="SomeName"
                  value="SomeValue"
                  checked={allowPets}
                  onChange={(e) => setAllowPets(e.target.checked)}
                />
              }
              label="Tiere erlaubt"
            />
          </Grid>
          <Grid item xs={1} mt={3}>
            <TextField
              label="Gewicht"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              value={cargoWeight}
              onChange={(e) => setCargoWeight(parseFloat(e.target.value))}
            />
          </Grid>

          <Grid item xs={1} mt={3}>
            <TextField
              label="Höhe"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              value={cargoHeight}
              onChange={(e) => setCargoHeight(parseFloat(e.target.value))}
            />
          </Grid>

          <Grid item xs={1} mt={3}>
            <TextField
              label="Breite"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              value={cargoWidth}
              onChange={(e) => setCargoWidth(parseFloat(e.target.value))}
            />
          </Grid>

          <Grid item xs={1} mt={3}>
            <TextField
              label="Länge"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              value={cargoLength}
              onChange={(e) => setCargoLength(parseFloat(e.target.value))}
            />
          </Grid>

          <Grid item xs={1} />

          <Grid item xs={1} mt={3}>
            <TextField
              label="Sitze"
              type="number"
              InputProps={{
                inputProps: {
                  min: 1,
                  max: 10,
                },
              }}
              value={seats}
              onChange={(e) => setSeats(parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} mt={3}>
            {isOffer && (
              <FormControl
                error={availableCars?.length < 1}
                sx={{ width: '100%' }}
              >
                <InputLabel>KFZ</InputLabel>
                <Select
                  sx={{ width: '100%' }}
                  value={car}
                  onChange={(e) => {
                    setCar(e.target.value);
                    setSelectedCarID(e.target.value);
                  }}
                  label="KFZ"
                >
                  {availableCars?.map((car, i) => (
                    <MenuItem key={i} value={car.id}>
                      {car.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Sie benötigen mindestens ein registrietes Auto um ein Angebot
                  erstellen zu können
                </FormHelperText>
              </FormControl>
            )}
          </Grid>

          <Grid xs={24} mt={3}>
            <label>Bemerkung</label>
            <RichTextEditor
              ref={rteRef}
              extensions={[StarterKit]}
              renderControls={() => (
                <MenuControlsContainer>
                  <MenuSelectHeading />
                  <MenuDivider />
                  <MenuButtonBold />
                  <MenuButtonItalic />
                </MenuControlsContainer>
              )}
            />
          </Grid>

          <Grid item xs={12} mt={3}>
            <Button
              sx={{
                width: '100%',
                color: 'white',
                fontWeight: '10px',
                border: '1px solid #DC5F00',
                backgroundColor: '#DC5F00',
                '&:hover': {
                  color: 'black',
                  backgroundColor: 'white',
                },
              }}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={createListing}
            >
              {isOffer ? 'Angebot erstellen' : 'Gesuch erstellen'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default CreateListingPage;
