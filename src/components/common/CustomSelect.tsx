import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React from "react";

type CustomSelectProps = {
  label: string;

  items: {
    id?: number | string;
    name?: string;
    value?: number | string;
    label?: string;
  }[];
};

const CustomSelect = ({
  label,
  items,
  ...props
}: SelectProps & CustomSelectProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        variant="outlined"
        labelId={label}
        id={label}
        label={label}
        {...props}
      >
        {items.map((item, i) => (
          <MenuItem
            key={item.value || item.id || i}
            value={item.value || item.id}
          >
            {item.label || item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
