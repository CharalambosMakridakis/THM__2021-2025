import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import EuroIcon from '@mui/icons-material/Euro';
import PetsIcon from '@mui/icons-material/Pets';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StraightenIcon from '@mui/icons-material/Straighten';
import WidthWideIcon from '@mui/icons-material/WidthWide';
import HeightIcon from '@mui/icons-material/Height';
import { Listing } from '../pages/Homepage';
import { useEffect, useState } from 'react';
import pb from './lib/pocketbase';

interface Props {
  item: Listing;
  bookOffer: (id: string) => void;
}

interface User {
  firstname: string;
  lastname: string;
}

interface Vehicle {
  name: string;
}

function ListingItem({ item, bookOffer }: Props) {
  const [user, setUser] = useState<User>();
  const [vehicle, setVehicle] = useState<Vehicle>();
  useEffect(() => {
    setVehicle(item.expand.vehicle);
    setUser(item.expand.user);
  }, []);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel3-content"
        id="panel3-header"
      >
        {item.is_request ? 'Suche' : 'Angebot'} von {item.start_location} nach{' '}
        {item.end_location} am {new Date(item.date).toLocaleDateString()} um{' '}
        {new Date(item.date).toLocaleTimeString()}
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2} width={800}>
          <Grid item>
            <Chip
              label={`${user?.firstname} ${user?.lastname}`}
              variant="outlined"
              icon={<PersonIcon />}
            />
          </Grid>
          {!item.is_request && item.vehicle && (
            <>
              <Grid item>
                <Chip
                  label={vehicle?.name}
                  variant="outlined"
                  icon={<DirectionsCarIcon />}
                />
              </Grid>
              <Grid item>
                <Chip
                  label={`${item.total_price}`}
                  variant="outlined"
                  icon={<EuroIcon />}
                />
              </Grid>
            </>
          )}
          <Grid item>
            <Chip
              label={`${item.seats} ${item.seats === 1 ? 'Sitzplatz' : 'Sitzplätze'}`}
              variant="outlined"
              icon={<AirlineSeatReclineNormalIcon />}
            />
          </Grid>
          <Grid item>
            <Chip
              label={`${item.cargo_weight} Kg Schwer`}
              variant="outlined"
              icon={<FitnessCenterIcon />}
            />
          </Grid>
          <Grid item>
            <Chip
              label={`${item.cargo_length} M Länge`}
              variant="outlined"
              icon={<StraightenIcon />}
            />
          </Grid>
          <Grid item>
            <Chip
              label={`${item.cargo_width} M Breite`}
              variant="outlined"
              icon={<WidthWideIcon />}
            />
          </Grid>
          <Grid item>
            <Chip
              label={`${item.cargo_height} M Höhe`}
              variant="outlined"
              icon={<HeightIcon />}
            />
          </Grid>
          <Grid item>
            <Chip
              label="Haustiere"
              color={item.allow_pets ? 'success' : 'error'}
              variant="outlined"
              icon={<PetsIcon />}
            />
          </Grid>
          <Grid item>
            <Chip
              label="Rauchen"
              color={item.allow_smoking ? 'success' : 'error'}
              variant="outlined"
              icon={<SmokingRoomsIcon />}
            />
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Notiz" />
              <CardContent dangerouslySetInnerHTML={{ __html: item.note }} />
            </Card>
          </Grid>
        </Grid>
      </AccordionDetails>
      <AccordionActions>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2e7d32',
            '&:hover': { backgroundColor: '#2e6d32' },
          }}
          onClick={() => bookOffer(item.id)}
          startIcon={<ShoppingCartIcon />}
        >
          {item.is_request ? 'FAHRT ÜBERNEHMEN' : 'BUCHEN'}
        </Button>
      </AccordionActions>
    </Accordion>
  );
}

export default ListingItem;
