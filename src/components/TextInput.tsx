import { Setter } from "solid-js";
import { twMerge } from "tailwind-merge";

type TextInputProps = {
  id?: string;
  class?: string;
  value?: string;
  placeholder?: string;
  out?: Setter<string>;
  onChange?: (x: string) => void;
};

export default function TextInput(props: TextInputProps) {
  return (
    <input
      class={twMerge(
        "border-gray-200 border-2 rounded px-1 focus:border-primary outline-none transition-colors w-0",
        props.class,
      )}
      id={props.id ?? ""}
      type="text"
      placeholder={props.placeholder ?? ""}
      value={props.value ?? ""}
      onChange={(e) => {
        if (props.onChange) {
          props.onChange(e.target.value);
        }
        if (props.out) {
          props.out(e.target.value);
        }
      }}
    />
  );
}
