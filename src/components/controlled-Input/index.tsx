import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input, InputProps, Text, YStack } from "tamagui";

type Props<T extends FieldValues> = InputProps & {
  name: Path<T>;
  control: Control<T>;
};

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  ...rest
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <YStack>
          <Input
            {...field}
            onChangeText={field.onChange}
            fontSize={14}
            {...rest}
          />
          {fieldState.error && (
            <Text color={"$red10"} fontSize={12}>
              {fieldState.error.message}
            </Text>
          )}
        </YStack>
      )}
    />
  );
};
