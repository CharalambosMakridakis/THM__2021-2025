import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import Pocketbase from 'pocketbase';

interface AutoCompleteSearchBarProps {
  isFromSearch: boolean;
  setter: (value: string) => void;
}

interface Location {
  start_location?: string;
  end_location?: string;
}

const isStartLocation = (
  location: Location,
): location is { start_location: string } => {
  return location.start_location !== undefined;
};

const isEndLocation = (
  location: Location,
): location is { end_location: string } => {
  return location.end_location !== undefined;
};

export default function AutoCompleteSearchBar({
  isFromSearch,
  setter,
}: AutoCompleteSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Location[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let isActive = true;

    if (!loading) {
      return undefined;
    }

    const fetchData = async () => {
      try {
        const pb = new Pocketbase('http://195.90.222.132:8090/');

        const fields = isFromSearch ? 'start_location' : 'end_location';
        const data: Location[] = await pb
          .collection('listing')
          .getFullList({ fields });

        if (isActive) {
          setOptions(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [loading, isFromSearch]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const isOptionEqualToValue = (option: Location, value: Location): boolean => {
    if (isFromSearch) {
      return (
        isStartLocation(option) &&
        isStartLocation(value) &&
        option.start_location === value.start_location
      );
    }
    return (
      isEndLocation(option) &&
      isEndLocation(value) &&
      option.end_location === value.end_location
    );
  };

  const getOptionLabel = (option: Location): string => {
    return isStartLocation(option)
      ? option.start_location!
      : option.end_location!;
  };

  const handleInputChange = (event: React.SyntheticEvent, newValue: string) => {
    setter(newValue);
  };

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: Location | null,
  ) => {
    if (!newValue) {
      setter('');
    } else if (isFromSearch && isStartLocation(newValue)) {
      setter(newValue.start_location!);
    } else if (!isFromSearch && isEndLocation(newValue)) {
      setter(newValue.end_location!);
    }
  };

  return (
    <Autocomplete
      sx={{ width: 250 }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      onInputChange={handleInputChange}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={isFromSearch ? 'Von' : 'Nach'}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
