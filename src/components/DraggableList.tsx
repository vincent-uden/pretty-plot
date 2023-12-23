import {
  Component,
  For,
  Show,
  createEffect,
  createSignal,
  onMount,
  Accessor,
  Setter,
} from "solid-js";
import { SetStoreFunction } from "solid-js/store";

interface DraggableListProps<T> {
  itemsSetter: Setter<T[]> | SetStoreFunction<T[]>;
  items: () => T[] | Accessor<T[]>;
  renderItem: Component<{ item: T; index: number }>;
  dragDelay?: number;
  onDrag?: () => void;
  onDrop?: () => void;
}

export function DraggableList<T>(props: DraggableListProps<T>) {
  const delay = props.dragDelay ?? 100;
  const items = props.items;
  const setItems = props.itemsSetter;

  const [grabbed, setGrabbed] = createSignal<number | null>(null);
  const [mousePos, setMousePos] = createSignal([0, 0]);
  const [itemYs, setItemYs] = createSignal<number[]>([]);
  const [transitionsActive, setTransitionsActive] = createSignal(false);

  let dragTimer: any = null;

  let listRef: HTMLDivElement | undefined;

  function grab(i: number) {
    if (props.onDrag != undefined) {
      props.onDrag();
    }

    let yValues = [];
    let j = 0;
    for (const child of listRef?.children ?? []) {
      if (j < props.items().length) {
        yValues.push(child.getBoundingClientRect().y);
      }
      j++;
    }

    setItemYs(yValues);
    setGrabbed(i);
  }

  function move(input: any[], from: number, to: number) {
    let numberOfDeletedElm = 1;
    const elm = input.splice(from, numberOfDeletedElm)[0];
    numberOfDeletedElm = 0;
    input.splice(to, numberOfDeletedElm, elm);
  }

  function drop() {
    if (props.onDrop) {
      props.onDrop();
    }
    let y = mousePos()[1];
    let j = 0;
    for (const child of listRef?.children ?? []) {
      if (j < items().length) {
        if (child.getBoundingClientRect().y > y) {
          if (j != grabbed()) {
            setItems((arr) => {
              let out = [...arr];
              if (j > grabbed()!!) {
                move(out, grabbed()!!, j - 1);
              } else {
                move(out, grabbed()!!, j);
              }

              return out;
            });
            return;
          }
        }
      }
      j++;
    }
    setItems((arr) => {
      let out = [...arr];
      move(out, grabbed()!!, j);

      return out;
    });
  }

  createEffect(() => {
    if (grabbed() != null) {
      setTimeout(() => {
        setTransitionsActive(true);
      }, 5);
    } else {
      setTransitionsActive(false);
    }
  });

  onMount(() => {
    document.body.addEventListener("mouseup", () => {
      if (dragTimer != null) {
        clearTimeout(dragTimer);
        dragTimer = null;
      }
      if (grabbed() != null) {
        drop();
        setGrabbed(null);
      }
    });

    document.body.addEventListener("mousemove", (e) => {
      setMousePos([e.clientX, e.clientY]);
    });
  });

  return (
    <div
      class="flex flex-col items-center overflow-x-hidden overflow-y-auto custom-scroll py-4 min-h-full"
      ref={listRef}
    >
      <For each={items()}>
        {(item, i) => {
          return (
            <div
              class={`cursor-grab select-none ${
                i() == grabbed() ? "opacity-0 h-0" : "opacity-100"
              } ${
                (itemYs()[i()] ?? -1) < mousePos()[1] || grabbed() == null
                  ? "translate-y-0"
                  : "translate-y-[100%]"
              } ${transitionsActive() ? "transition-transform" : ""}`}
              onMouseDown={() => {
                dragTimer = setTimeout(() => grab(i()), delay);
              }}
            >
              {props.renderItem({ item: item, index: i() })}
            </div>
          );
        }}
      </For>
      <Show when={grabbed() != null}>
        <div
          class={`fixed top-0 left-0`}
          style={{
            transform: `translate(${mousePos()[0]}px, ${mousePos()[1]}px)`,
          }}
        >
          {props.renderItem({ item: items()[grabbed()!!], index: grabbed()!! })}
        </div>
      </Show>
    </div>
  );
}
