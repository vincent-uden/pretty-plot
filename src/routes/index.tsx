import { createSignal, For, Show } from "solid-js";
import { TbFileExport } from "solid-icons/tb";

import ConfirmButton from "~/components/ConfirmButton";
import { isServer, NoHydration } from "solid-js/web";
import TextInput from "~/components/TextInput";
import SelectInput from "~/components/SelectInput";
import { Data, PlotType } from "plotly.js-basic-dist";
import PlotSettings from "~/components/PlotSettings";
import { unstable_clientOnly } from "solid-start";

import Papa from "papaparse";

const Plot = unstable_clientOnly(() => import("../components/Plot"));

type OutputFormat = "PDF" | "PNG";

export type PlotColumn = {
  name: string;
  data: number[];
};

export type UserPlot = {
  name: string;
  color: string;
  xKey: string;
  yKey: string;
  columns: PlotColumn[];
  type: PlotType;
};

function userToPlotly(plot: UserPlot): Data {
  let trace = {
    x: [],
    y: [],
    type: plot.type,
  };

  let xCol: PlotColumn | undefined = undefined;
  for (const col of plot.columns) {
    if (col.name == plot.xKey) {
      xCol = col;
    }
  }

  let yCol: PlotColumn | undefined = undefined;
  for (const col of plot.columns) {
    if (col.name == plot.yKey) {
      yCol = col;
    }
  }

  if (yCol !== undefined && xCol === undefined) {
    xCol = {
      name: "Range",
      data: [] as number[],
    };
    for (let i = 0; i < yCol.data.length; i++) {
      xCol.data.push(i);
    }
  }

  if (yCol != undefined && xCol != undefined) {
    trace.x = xCol.data as never[];
    trace.y = yCol.data as never[];
  }

  return trace;
}

function csvToPlot(csvStr: string, name: string): UserPlot {
  let output: UserPlot = {
    name,
    color: "#aa0000",
    xKey: "",
    yKey: "",
    columns: [],
    type: "scatter",
  };

  const csv = Papa.parse(csvStr, {
    header: true,
  });

  for (const header of csv.meta.fields) {
    let col: PlotColumn = {
      name: header,
      data: [],
    };

    for (const row of csv.data) {
      col.data.push(row[header]);
    }

    output.columns.push(col);
  }

  if (output.columns.length > 0) {
    output.yKey = output.columns[0].name;
  }

  return output;
}

const testPlots: UserPlot[] = [];

export default function Home() {
  const [plots, setPlots] = createSignal<UserPlot[]>(testPlots);
  const [dataInput, setDataInput] = createSignal("");

  const [outputName, setOutputName] = createSignal<string>("plot");
  const [outputFormat, setOutputFormat] = createSignal<OutputFormat>("PDF");

  const plotlyPlots = () => plots().map(userToPlotly);

  return (
    <main class="mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-2xl font-heading uppercase font-extrabold mb-4">
        <span class="bg-gradient-to-r from-primary to-accent-active inline-block text-transparent bg-clip-text text-6xl">
          Plot
        </span>
        <span class="text-accent opacity-50">.vincentuden.xyz</span>
      </h1>
      <div class="flex flex-row gap-8">
        <aside class="flex flex-col grow-0 basis-64">
          <textarea
            class="bg-white shadow-lg rounded-xl p-4 resize-none outline-none"
            placeholder="Paste your data here (csv, json)"
            onChange={(e) => setDataInput(e.target.value)}
          >
            {""}
          </textarea>
          <div class="h-4" />
          <ConfirmButton onClick={() => {
            setPlots((x) => [...x, csvToPlot(dataInput(), "New Plot")]);
          }} >Add Plot</ConfirmButton>
          <div class="h-8" />
          <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col">
            <div class="flex flex-row gap-4 mb-4">
              <h2 class="grow text-primary text-xl">Export Options</h2>
              <NoHydration>
                <TbFileExport class="grow-0 text-primary" size={24} />
              </NoHydration>
            </div>
            <label class="mb-1 font-semibold" for="exportName">
              File Name
            </label>
            <TextInput
              id="exportName"
              class="font-mono"
              value="plot"
              out={setOutputName}
            />
            <div class="h-2" />
            <label class="mb-1 font-semibold" for="exportName">
              Format
            </label>
            <SelectInput
              id="exportName"
              class="font-mono"
              out={setOutputFormat}
              options={["PDF", "PNG"] as OutputFormat[]}
            />
          </div>
          <div class="h-4" />
          <ConfirmButton>Download</ConfirmButton>
        </aside>
        <div class="grow">
          <div class="bg-white rounded-xl shadow-lg p-4">
            <Plot data={plotlyPlots()} fallback={<p></p>} />
          </div>
        </div>
        <aside class="basis-64">
          <div class="h-4 w-full rounded-full bg-primary scale-x-110 shadow-lg"></div>
          <div class="flex flex-col gap-4 h-[70vh] overflow-y-scroll py-4">
            <For each={plots()}>{(p) => <PlotSettings plot={p} />}</For>
          </div>
          <div class="h-4 w-full rounded-full bg-primary scale-x-110 shadow-lg"></div>
        </aside>
      </div>
    </main>
  );
}
