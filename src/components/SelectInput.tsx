import { For, Setter } from "solid-js";
import { twMerge } from "tailwind-merge";

type SelectProps<T> = {
  id?: string;
  value?: string;
  class?: string;
  options?: T[];
  out?: Setter<T>;
  onChange?: (x: T) => void;
};

export default function TextInput<T>(props: SelectProps<T>) {
  return (
    <select
      class={twMerge(
        "border-gray-200 border-2 rounded px-1 focus:border-primary outline-none transition-colors bg-transparent pt-1",
        props.class,
      )}
      id={props.id ?? ""}
      value={props.value ?? props.options?.at(0) + "" ?? ""}
      onChange={(e) => {
        if (props.out) {
          props.out(e.target.value as any);
        }
        if (props.onChange) {
          props.onChange(e.target.value as any);
        }
      }}
    >
      <For each={props.options}>{(opt) => <option>{"" + opt}</option>}</For>
    </select>
  );
}
