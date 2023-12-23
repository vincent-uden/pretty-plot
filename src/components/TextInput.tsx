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
  let inputRef: HTMLInputElement | undefined;

  return (
    <input
      class={twMerge(
        "border-gray-200 border-2 rounded px-1 focus:border-primary outline-none transition-colors w-0",
        props.class,
      )}
      id={props.id ?? ""}
      ref={inputRef}
      type="text"
      placeholder={props.placeholder ?? ""}
      value={props.value ?? ""}
      onKeyPress={(e) => {
        if (
          ![
            "Enter",
            "Shift",
            "Control",
            "Alt",
            "AltGraph",
            "CapsLock",
            "Fn",
            "FnLock",
            "Hyper",
            "Meta",
            "NumLock",
            "ScrollLock",
            "Super",
            "Symbol",
            "SymbolLock",
            "Dead",
            "Tab",
          ].includes(e.key.toLowerCase())
        ) {
          if (props.onChange) {
            props.onChange((inputRef?.value ?? "") + e.key);
          }
          if (props.out) {
            props.out((inputRef?.value ?? "") + e.key);
          }
        }
      }}
    />
  );
}
