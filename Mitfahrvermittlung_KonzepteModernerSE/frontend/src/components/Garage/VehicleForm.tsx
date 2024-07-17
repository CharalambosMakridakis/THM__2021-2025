import { Box, TextField } from '@mui/material';

function VehicleForm() {
  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '1rem',
        gap: '1rem',
      }}
      component="form"
      autoComplete="off"
    >
      <TextField required id="Autoname" label="Autoname" variant="filled" />
      <TextField required id="Sitze" label="Sitze" variant="filled" />
      <TextField id="Stauraum" label="Stauraum" variant="filled" />
      <TextField id="Zuladung" label="Zuladung" variant="filled" />
    </Box>
  );
}

export default VehicleForm;
