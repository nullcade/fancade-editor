import { TextField, TextFieldProps, TextFieldVariants } from '@mui/material';
import React, { useEffect, useState } from 'react'

function ControlledTextField({setValue, valueCheck, ...props}: {
  variant?: TextFieldVariants,
  setValue: (value: TextFieldProps['value']) => void,
  valueCheck: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => TextFieldProps['value'] | null
} & Omit<TextFieldProps, 'variant'>) {
  const [value, setLocalValue] = useState<TextFieldProps['value']>(props.value);
  useEffect(() => {
    setLocalValue(props.value);
  }, [props.value]);
  return (
    <TextField
      {...props}
      value={value}
      onChange={(event) => {
        const checkedValue = valueCheck(event);
        if (checkedValue !== null)
          setLocalValue(checkedValue);
      }}
      onBlur={() => {
        setValue(value);
      }}
    />
  )
}
export default ControlledTextField