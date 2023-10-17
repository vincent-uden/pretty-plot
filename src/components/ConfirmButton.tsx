import { ParentProps } from "solid-js";

interface ConfirmProps extends ParentProps {
  onClick?: () => void;
}

export default function ConfirmButton(props: ConfirmProps) {
  return (
    <button class="bg-accent text-white font-body py-4 px-8 rounded-full shadow-lg hover:bg-accent-active transition-colors" onClick={props.onClick}>
      {props.children}
    </button>
  );
}
