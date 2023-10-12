import { createSignal } from "solid-js";

type PlotFormat = "csv" | "json";
type PlotType = "marker" | "line"; // ...

// Each trace can have it's own plot type

export default function Home() {
  const [traces, setTraces] = createSignal([]);
  const [dataInput, setDataInput] = createSignal("");
  const [dataFormat, setDataFormat] = createSignal<PlotFormat|null>("csv");
  const [plotType, setPlotType] = createSignal("");

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-primary font-heading uppercase my-16 font-extrabold">
        Plot
      </h1>
      <div class="flex flex-col items-center">
        <div id="plotDiv" class="w-[600px] h-[400px] bg-white"></div>
      </div>
      <div class="h-8" />
      <div class="flex flex-row gap-8">
        <textarea class="outline-none p-4 rounded grow-0" placeholder="Paste your data (csv, json)" rows="5" spellcheck={false}  />
        <div class="grid grid-cols-2">
          <p class="font-body">Data Format</p>
          <p class="font-mono">{dataFormat() ?? ""}</p>
          <p class="font-body">Plot Type</p>
          <p class="font-mono">{dataFormat() ?? ""}</p>
        </div>
      </div>
    </main>
  );
}
