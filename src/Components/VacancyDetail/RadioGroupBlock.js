import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const RadioGroupBlock = ({ title, options, selected }) => {
    console.log("selected", selected)
  return (
    <FormControl
      component="fieldset"
      sx={{
        p: 1,
        pt: 0.5,
        borderRadius: 2,
        width: '100%',
      }}
    >
      <FormLabel
        component="legend"
        sx={{
          fontWeight: 500,
          fontSize: '0.85rem',
          mb: 0,
          color: 'text.primary',
        }}
      >
        {title}
      </FormLabel>
      <RadioGroup row value={selected} sx={{ gap: 1 }}>
        {options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<StyledRadio />}
            label={option}
            disabled // 👉 hiermee wordt alles non-interactief
            sx={{
              m: 0,
              pr: 1.5,
              borderRadius: 1.5,
              px: 0.7,
              py: 0.1,
              fontWeight: selected === option ? 500 : 400,
              fontSize: '0.75rem',
              pointerEvents: 'none', // extra: helemaal niet klikbaar
              '& .MuiFormControlLabel-label': {
                fontSize: '0.96rem',
                color: 'text.primary',
              },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

// Compactere radio knop
const StyledRadio = (props) => (
  <Radio
    {...props}
    size="small"
    sx={{
      p: 0.3,
      '& .MuiSvgIcon-root': {
        fontSize: 16,
      },
    }}
  />
);

export default RadioGroupBlock;
