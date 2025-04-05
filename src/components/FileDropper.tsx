import { createDropzone } from "@soorria/solid-dropzone";
import { Accessor, For, Setter, Show, createSignal, onMount } from "solid-js";
import { FileSystemType, H5Module, UserPlot, csvToPlot, handleHd5f } from "~/plotting";
import TestSvg from "../test.svg";
import { ImCross } from "solid-icons/im";
import ConfirmButton from "./ConfirmButton";
import { standardColors } from "~/routes";


type InputType = "csv" | "text" | "hd5f";

type FileDropperProps = {
  helpVisible: boolean;
  plots: UserPlot[];
  setPlots: Setter<UserPlot[]>;
  onAddingPlot: (plt: UserPlot) => void;
};

export function FileDropper(props: FileDropperProps) {
  const [textInputData, setTextInputData] = createSignal<string>("");
  const [inputType, setInputType] = createSignal<InputType>("text");
  // Adding a file can give multiple possible traces
  const [traces, setTraces] = createSignal<UserPlot[]>([]);
  const [selectedTraces, setSelectedTraces] = createSignal<number[]>([]);

  /* --- h5wasm stuff --- */
  const [h5wasmModule, setH5wasmModule] = createSignal<H5Module | null>(null);
  const [FS, setFS] = createSignal<FileSystemType | null>(null);
  const [loadedWasm, setLoadedWasm] = createSignal<boolean>(false);

  onMount(async () => {
    try {
      const h5wasmImport = await import("h5wasm");
      setH5wasmModule(h5wasmImport.default);
      const { FS: fsModule } = await h5wasmImport.default.ready;
      setFS(fsModule);
      setLoadedWasm(true);
    } catch (err: any) {
      console.error("Failed to load h5wasm:", err);
    }
  });
  /* --- end of h5wasm stuff --- */

  async function loadDroppedFile(files: File[]) {
    const file = files[0]!;
    if (file.name.endsWith("csv")) {
      const contents = await files[0]?.text();
      if (contents != null) {
        setInputType("csv");
        setTraces([csvToPlot(
          contents,
          fileNameNoExt(file.name),
          standardColors[props.plots.length % standardColors.length],
        )]);
      }
    } else if (file.name.endsWith("h5")) {
      setInputType("hd5f");
      if (FS() !== null && h5wasmModule() !== null) {
        setTraces(await handleHd5f(file, FS()!, h5wasmModule()!));
      }
    }
  }

  const dropzone = createDropzone({ onDrop: loadDroppedFile });

  return (
    <>
      <Show when={inputType() == "text"}>
        <div class="bg-white shadow-lg rounded-xl p-4 resize-none outline-none min-w-64 h-24 flex flex-col items-center justify-center" {...dropzone.getRootProps()}>
          <input {...dropzone.getInputProps()} />
          <p class="text-primary opacity-50 text-center">
            {dropzone.isDragActive ? ("Drop the files here") : ("Drop a file here, or click to select one")}
          </p>
        </div>
        <div
          class={`absolute left-48 translate-x-10 transition-opacity ${props.helpVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <p class="absolute left-16 w-48 font-hand text-red-600 text-center">
            Enter your data in this box by copy-paste or drag-and-drop an entire
            file.
          </p>
          <img
            class="w-16 h-auto rotate-[-15deg] translate-y-4"
            src={TestSvg}
          />
        </div>
      </Show>
      <Show when={inputType() == "csv"}>
        <div class="bg-white shadow-lg rounded-xl p-4 resize-none outline-none flex flex-row min-w-64 h-24 items-center">
          <p class="grow text-primary opacity-50">Csv ready to be added</p>
          <ImCross
            class="text-red-500 grow-0 hover:scale-125 transition-transform"
            onClick={() => {
              setTextInputData("");
              setInputType("text");
            }}
          />
        </div>
      </Show>
      <Show when={inputType() == "hd5f"}>
        <div class="bg-white shadow-lg rounded-xl p-4 resize-none outline-none flex flex-row min-w-64 h-24 items-center">
          <p class="grow text-primary opacity-50">Hd5f ready to be added</p>
          <ImCross
            class="text-red-500 grow-0 hover:scale-125 transition-transform"
            onClick={() => {
              setTextInputData("");
              setInputType("text");
            }}
          />
        </div>
      </Show>
      <div class="h-4" />
      <Show when={traces().length > 1}>
        <p class="text-primary opacity-60 px-4 text-center italic text-md">Which datasets should be added?</p>
        <div class="h-2" />
        <For each={traces()}>
          {(tr, i) => (
            <div class="flex flex-row px-4">
              <label class="grow font-semibold font-mono" for={`import-${i()}`}>
                {tr.name}
              </label>
              <input
                type="checkbox"
                id={`import-${i()}`}
                onChange={(_) => {
                  if (selectedTraces().includes(i())) {
                    setSelectedTraces((x) => [...x.filter((y) => y !== i())]);
                  } else {
                    setSelectedTraces((x) => [...x, i()]);
                  }
                }}
              />
            </div>
          )}
        </For>
        <div class="h-4" />
      </Show>
      <ConfirmButton
        onClick={() => {
          if (inputType() == "text") {
            props.setPlots((x) => {
              let plt = csvToPlot(
                textInputData(),
                "New Plot",
                standardColors[x.length % standardColors.length],
              );
              props.onAddingPlot(plt);
              return [...x, plt];
            });
          } else {
            props.setPlots((x) => {
              return [...x, ...(traces().filter((_, i) => selectedTraces().includes(i)).map((p, i) => {
                return { ...p, color: standardColors[(x.length + i) % standardColors.length], id: new Date().getMilliseconds() + i }
              }))];
            });
          }
        }}
      >
        Add Plot
      </ConfirmButton >
    </>
  );
}

function fileNameNoExt(filename: string) {
  const parts = filename.split(".");
  if (parts.length === 1) return filename;
  parts.pop();
  return parts.join(".");
}

