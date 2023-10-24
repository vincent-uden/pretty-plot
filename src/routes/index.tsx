import { createEffect, createSignal, For, Show } from "solid-js";
import { TbFileExport } from "solid-icons/tb";
import { IoAddCircle, IoRemoveCircle } from "solid-icons/io";

import ConfirmButton from "~/components/ConfirmButton";
import { NoHydration } from "solid-js/web";
import TextInput from "~/components/TextInput";
import SelectInput from "~/components/SelectInput";
import PlotSettings from "~/components/PlotSettings";
import { unstable_clientOnly } from "solid-start";

import Papa from "papaparse";
import { createStore, produce } from "solid-js/store";
import { DraggableList } from "~/components/DraggableList";

const Plot = unstable_clientOnly(() => import("../components/Plot"));

type OutputFormat = "PDF" | "PNG";

const standardColors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

export const subplotColors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

export type PlotColumn = {
  name: string;
  data: number[];
};

export type UserPlotType = "bar" | "scatter" | "line" | "pie";

export type UserPlot = {
  name: string;
  color: string;
  xKey: string;
  yKey: string;
  columns: PlotColumn[];
  type: UserPlotType;
  id: number;
  subplot: number | null;
};

function userToPlotly(plot: UserPlot) {
  let trace: any = {
    x: [],
    y: [],
    type: plot.type,
    mode: "",
    color: plot.color,
    xaxis: "x",
    yaxis: "y",
  };
  if (plot.type == "line") {
    trace.type = "scatter";
    trace.mode = "lines";
    trace.line = {
      color: plot.color,
    };
  } else if (plot.type == "scatter") {
    trace.type = "scatter";
    trace.mode = "markers";
  }
  if (plot.type != "line") {
    trace.marker = {
      color: plot.color,
    };
  }

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

  if (plot.subplot && plot.subplot > 0) {
    trace.xaxis += plot.subplot;
    trace.yaxis += plot.subplot;
  }

  // @ts-ignore
  return trace;
}

function csvToPlot(csvStr: string, name: string, index: number): UserPlot {
  let output: UserPlot = {
    name,
    color: standardColors[index % standardColors.length],
    xKey: "",
    yKey: "",
    columns: [],
    type: "scatter",
    id: new Date().getMilliseconds(),
    subplot: null,
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

export default function Home() {
  const [plots, setPlots] = createStore<UserPlot[]>([]);
  const [dataInput, setDataInput] = createSignal("");

  const [outputName, setOutputName] = createSignal<string>("plot");
  const [outputFormat, setOutputFormat] = createSignal<OutputFormat>("PDF");

  const [subplots, setSubplots] = createSignal<number[]>([]);
  const [paintingSubplot, setPaintingSubplot] = createSignal<number | null>(
    null,
  );

  const [dragging, setDragging] = createSignal<boolean>(false);

  function updatePlot(p: UserPlot, field: keyof UserPlot) {
    setPlots(
      (x) => x.id == p.id,
      // @ts-ignore
      produce((plot) => (plot[field] = p[field])),
    );
  }

  function generateLayout() {
    let output: any = {
      autosize: false,
    };

    const spacing = 1.0 / subplots().length;

    for (const sp of subplots()) {
      output["xaxis" + sp] = {
        domain: [(sp - 1) * spacing, sp * spacing],
        anchor: "y" + sp,
      };
      output["yaxis" + sp] = {
        domain: [0, 1.0],
        anchor: "x" + sp,
      };
    }

    return output;
  }

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
          <ConfirmButton
            onClick={() => {
              setPlots((x) => [
                ...x,
                csvToPlot(dataInput(), "New Plot", x.length),
              ]);
            }}
          >
            Add Plot
          </ConfirmButton>
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
              class="font-mono text-primary"
              value="plot"
              out={setOutputName}
            />
            <div class="h-2" />
            <label class="mb-1 font-semibold" for="exportName">
              Format
            </label>
            <SelectInput
              id="exportName"
              class="font-mono text-primary"
              out={setOutputFormat}
              options={["PDF", "PNG"] as OutputFormat[]}
            />
          </div>
          <div class="h-4" />
          <ConfirmButton>Download</ConfirmButton>
        </aside>
        <div class="grow">
          <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
            <Plot
              data={plots.map(userToPlotly)}
              fallback={<p></p>}
              width={400}
              height={300}
              layout={generateLayout()}
            />
          </div>
        </div>
        <aside class="basis-64">
          <div class="bg-white rounded-xl p-4 shadow-lg">
            <p class="mb-2 text-primary text-xl">Subplots</p>
            <div class="flex flex-row flex-wrap gap-2">
              <For each={subplots()}>
                {(sp) => (
                  <div
                    class={`rounded-full  w-8 h-8 hover:opacity-50 transition-opacity cursor-pointer ${
                      paintingSubplot() == sp
                        ? "border-2 border-green-500 opacity-50"
                        : "opacity-20"
                    }`}
                    style={{ "background-color": standardColors[sp] }}
                    onClick={() => {
                      if (paintingSubplot() == sp) {
                        setPaintingSubplot(null);
                      } else {
                        setPaintingSubplot(sp);
                      }
                    }}
                  />
                )}
              </For>
              <div
                class={`w-8 h-8 ${
                  paintingSubplot() != null ? "rotate-[45deg]" : ""
                } transition-transform`}
                onClick={() => {
                  if (paintingSubplot() == null) {
                    setSubplots((x) => [...x, x.length + 1]);
                  } else {
                    setPaintingSubplot(null);
                  }
                }}
              >
                <NoHydration>
                  <IoAddCircle
                    class="text-primary cursor-pointer opacity-50 hover:opacity-100 transition-opacity w-8 h-8 scale-[1.2]"
                    size={48}
                  />
                </NoHydration>
              </div>
              <Show when={subplots().length > 0}>
                <div
                  class="w-8 h-8"
                  onClick={() => {
                    const len = subplots().length;
                    setSubplots((x) => x.slice(0, x.length - 1));
                    setPlots(
                      (x) => (x.subplot != null && x.subplot >= len) ?? false,
                      produce((x) => {
                        if (len == 1) {
                          x.subplot = null;
                        } else {
                          x.subplot = len - 1;
                        }
                        return x;
                      }),
                    );
                    setPaintingSubplot(null);
                  }}
                >
                  <NoHydration>
                    <IoRemoveCircle
                      class="text-red-400 cursor-pointer opacity-50 hover:opacity-100 transition-opacity w-8 h-8 scale-[1.2]"
                      size={48}
                    />
                  </NoHydration>
                </div>
              </Show>
            </div>
          </div>
          <div class="h-4" />
          <div class="h-4 w-full rounded-full bg-primary scale-x-110 shadow-lg"></div>
          <div class="flex flex-col gap-4 h-[70vh] overflow-y-scroll py-4">
            <DraggableList
              items={() => plots}
              itemsSetter={setPlots}
              dragDelay={200}
              onDrag={() => {
                setDragging(true);
              }}
              onDrop={() => {
                setDragging(false);
              }}
              renderItem={({ item: plot, index: i }) => (
                <>
                  <PlotSettings
                    plot={plot}
                    updatePlot={updatePlot}
                    index={i}
                    headerClickable={() => paintingSubplot() == null}
                    forceClose={dragging}
                    onClick={() => {
                      if (paintingSubplot() != null) {
                        updatePlot(
                          { ...plot, subplot: paintingSubplot() },
                          "subplot",
                        );
                      }
                    }}
                  />
                  <div class="h-4"></div>
                </>
              )}
            />
          </div>
          <div class="h-4 w-full rounded-full bg-primary scale-x-110 shadow-lg" />
        </aside>
      </div>
    </main>
  );
}
