import { createSignal, Setter } from "solid-js";

type SlideProps = {
  from: number;
  to: number;
  out: Setter<number>;
  value: number;
};

export function SlideInput(props: SlideProps) {
  const [pos, setPos] = createSignal<number>(0);

  let trackRef: HTMLDivElement;

  function moveSlider(e) {
    const clientRect = trackRef.getBoundingClientRect();
    setPos(Math.max(Math.min(e.clientX - clientRect.x, clientRect.width), 0));
  }

  function release() {
    document.removeEventListener("mousemove", moveSlider);
    document.removeEventListener("mouseup", release);

    const clientRect = trackRef.getBoundingClientRect();
    props.out(pos() / clientRect.width * (props.to - props.from) + props.from);
  }

  function nanFallback(x: number) {
    if (isNaN(x)) {
      return props.from.toFixed(2);
    }
    return x.toFixed(2);
  }

  return (
    <div
      class="relative select-none"
      onMouseDown={() => {
        document.addEventListener("mousemove", moveSlider);
        document.addEventListener("mouseup", release);
      }}
      onMouseUp={() => {}}
    >
      <div class="h-1 bg-gray-200 rounded-full select-none" ref={trackRef} />
      <div
        class="absolute bg-accent w-4 h-4 top-1/2 rounded-full shadow hover:bg-accent-active select-none"
        style={{ transform: `translate(calc(${pos()}px - 0.5rem), -50%)` }}
      />
      <div
        class="absolute w-4 h-4 top-1/2 select-none"
        style={{ transform: `translate(calc(${pos()}px - 0.5rem - 50%), 50%)` }}
      >
      <p>{nanFallback((pos() / trackRef.getBoundingClientRect().width) * (props.to - props.from) + props.from)}</p>
      </div>
    </div>
  );
}
