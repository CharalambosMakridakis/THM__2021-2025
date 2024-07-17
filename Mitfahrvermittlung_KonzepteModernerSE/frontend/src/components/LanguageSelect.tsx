import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { ReactNode } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const languages = [
  'deutsch',
  'englisch',
  'französisch',
  'spanisch',
  'italienisch',
  'türkisch',
];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface MultiselectProps {
  error: boolean | undefined;
  helperText: ReactNode;
  handleLanguageChange: (newLanguages: string[]) => void;
}

export default function LanguageSelect({
  handleLanguageChange,
}: MultiselectProps) {
  const theme = useTheme();
  const [language, setLanguage] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof language>) => {
    const {
      target: { value },
    } = event;
    const newLanguages = typeof value === 'string' ? value.split(',') : value;

    setLanguage(newLanguages);
    handleLanguageChange(newLanguages);
  };

  return (
    <div>
      <InputLabel id="demo-multiple-chip-label">Sprache</InputLabel>
      <Select
        fullWidth
        name="languages"
        required
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={language}
        onChange={handleChange}
        input={<OutlinedInput label="Sprache" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip color="primary" key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {languages.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, language, theme)}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
