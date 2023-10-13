import { ParentProps } from "solid-js";

export default function ConfirmButton(props: ParentProps) {
  return (
    <button class="bg-accent text-white font-body py-4 px-8 rounded-full shadow-lg hover:bg-accent-active transition-colors">
      {props.children}
    </button>
  );
}
