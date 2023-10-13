import { For, Setter } from "solid-js";
import { twMerge } from "tailwind-merge";

type SelectProps<T> = {
  id?: string;
  class?: string;
  options?: T[];
  out?: Setter<T>;
};

export default function TextInput<T>(props: SelectProps<T>) {
  return (
    <select
      class={twMerge(
        "border-gray-200 border-2 rounded px-1 focus:border-primary outline-none transition-colors bg-transparent pt-1",
        props.class,
      )}
      id={props.id ?? ""}
      onChange={(e) => {
        if (props.out) {
          props.out(e.target.value as any)
        }
      }}
    >
    <For each={props.options}>
    {(opt) => (
      <option>
        {"" + opt}
      </option>
    )}
    </For>
    </select>
  );
}
