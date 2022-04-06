import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';


export default function MyDatePicker(props:{event:any}) {

  const [value, setValue] = React.useState<Date | null>(null);

  const changeHandler =(newValue: React.SetStateAction<Date | null>) => {
    props.event(newValue);
    setValue(newValue);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} >
      <div>
        <DatePicker
          label="Date"
          value={value}
          onChange={changeHandler}
          renderInput={(params) => <TextField {...params} style={{width:'100%'}}/>}
        />
      </div>

    </LocalizationProvider>
  );
}
