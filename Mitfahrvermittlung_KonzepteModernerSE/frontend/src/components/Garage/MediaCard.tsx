import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { MediaCardProps } from './IMediaCardProps.ts';
import SimpleDialog from './SimpleDialog.tsx';
import { useState } from 'react';

export default function MediaCard(props: MediaCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <Card sx={{ display: 'flex', height: 200, width: 600, mt: '50px' }}>
      <CardMedia
        component="img"
        sx={{ width: 300 }}
        image={props.carImage}
        alt="Image of the car"
      />
      <Box>
        <CardContent>
          <Typography component="div" variant="h5">
            {props.carName}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {props.carSeats} Sitze <br />
            {props.cargoSpaceLitre} liter Stauraum <br />
            {props.cargoSpaceKilogram} kilogram Zuladung
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleClickOpen}>
            Bearbeiten
          </Button>
        </CardActions>
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
        />
      </Box>
    </Card>
  );
}
