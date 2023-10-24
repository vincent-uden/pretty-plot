import { createSignal, For, Setter, Show } from "solid-js";
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
  const [selectedOption, setSelectedOption] = createSignal(
    props.value ?? props?.options?.at(0) ?? "",
  );
  const [selecting, setSelecting] = createSignal(false);

  return (
    <div
      class={twMerge(
        "border-gray-200 border-2 rounded px-1 focus:border-primary outline-none transition-colors bg-transparent pt-1 relative cursor-pointer",
        props.class,
      )}
      id={props.id ?? ""}
    >
      <p
        onClick={() => {
          setSelecting(true);
        }}
      >
        {"" + selectedOption()}
      </p>

      <Show when={selecting()}>
        <div class="absolute z-10 bg-white border-2 border-gray-200 -right-[2px] -left-[2px] -top-[2px] rounded px-1 pt-1 shadow flex flex-col gap-1">
          <For each={props.options}>
            {(opt, i) => (
              <div
                class=""
                onClick={() => {
                  setSelectedOption("" + props?.options?.at(i()) ?? "");
                  setSelecting(false);
                  if (props.onChange != undefined) {
                    props.onChange(props!!.options!![i()]);
                  }
                }}
              >
                {"" + opt}
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
