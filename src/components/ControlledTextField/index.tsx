import { TextField, TextFieldProps, TextFieldVariants } from '@mui/material';
import React, { useEffect, useState } from 'react'

function ControlledTextField(props: {
  variant?: TextFieldVariants,
  setValue: (value: TextFieldProps['value']) => void,
  valueCheck: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => TextFieldProps['value'] | null
} & Omit<TextFieldProps, 'variant'>) {
  const [value, setValue] = useState<TextFieldProps['value']>(props.value);
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  return (
    <TextField
      {...props}
      value={value}
      onChange={(event) => {
        const checkedValue = props.valueCheck(event);
        if (checkedValue !== null)
          setValue(checkedValue);
      }}
      onBlur={() => {
        props.setValue(value);
      }}
    />
  )
}
export default ControlledTextField