import { Stack, TextFieldProps, TextFieldVariants } from "@mui/material";
import ControlledTextField from "components/ControlledTextArea";
import { Vec } from "custom_modules/GameFormat";
import React from "react";

function OffsetInput({
  setValue,
  valueCheck,
  value,
  label,
  sx,
  ...props
}: {
  variant?: TextFieldVariants;
  setValue: (value: Vec) => void;
  value: Vec;
  valueCheck?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => number | null;
} & Omit<TextFieldProps, "variant">) {
  return (
    <Stack sx={{
      flexDirection: "row",
      gap: 0,
      flexShrink: 1,
      flexWrap: "nowrap"
    }}>
      <ControlledTextField
        {...props}
        sx={{
          ...sx,
          ".MuiOutlinedInput-notchedOutline": {
            borderRadius: "4px 0 0 4px",
            borderRight: "none"
          }
        }}
        label={label}
        value={value[0]}
        setValue={(v) => {
          value[0] = parseInt(v as string);
          setValue(value);
        }}
        valueCheck={valueCheck}
        type="number"
      />
      <ControlledTextField
        {...props}
        sx={{
          ...sx,
          ".MuiOutlinedInput-notchedOutline": {
            borderRadius: 0
          }
        }}
        value={value[1]}
        setValue={(v) => {
          value[1] = parseInt(v as string);
          setValue(value);
        }}
        valueCheck={valueCheck}
        type="number"
      />
      <ControlledTextField
        {...props}
        sx={{
          ...sx,
          ".MuiOutlinedInput-notchedOutline": {
            borderRadius: "0 4px 4px 0",
            borderLeft: "none"
          }
        }}
        value={value[2]}
        setValue={(v) => {
          value[2] = parseInt(v as string);
          setValue(value);
        }}
        valueCheck={valueCheck}
        type="number"
      />
    </Stack>
  );
}

export default OffsetInput;
