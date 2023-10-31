import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { TbFileExport } from "solid-icons/tb";
import { IoAddCircle, IoRemoveCircle } from "solid-icons/io";
import { ImCross } from "solid-icons/im";
import { FaSolidArrowRightLong } from "solid-icons/fa";

import ConfirmButton from "~/components/ConfirmButton";
import { NoHydration } from "solid-js/web";
import TextInput from "~/components/TextInput";
import SelectInput from "~/components/SelectInput";
import PlotSettings from "~/components/PlotSettings";
import { unstable_clientOnly } from "solid-start";

import Papa from "papaparse";
import { createStore, produce } from "solid-js/store";
import { DraggableList } from "~/components/DraggableList";

import mathJaxConfUrl from "../MathJaxConf.js";
import { createScriptLoader } from "@solid-primitives/script-loader";
import { SlideInput } from "~/components/SlideInput.jsx";

const Plot = unstable_clientOnly(() => import("../components/Plot"));

type OutputFormat = "SVG" | "PNG";

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

export type UserPlotOptions = {
  title: string;
  gridX: boolean;
  gridY: boolean;
  width: number;
  height: number;
  dimUnit: "Inches" | "Pixels" | "Centimeters";
  xLim: Array<number | null> | null;
  yLim: Array<number | null> | null;
  xLabel: string;
  yLabel: string;
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

function dimToPixels(x: number, unit: "Inches" | "Pixels" | "Centimeters") {
  if (unit == "Inches") {
    return x * 100;
  }
  if (unit == "Centimeters") {
    return (x / 2.54) * 100;
  }
  return x;
}

function maxMargin(n: number) {
  return 1 / (Math.max(n-1, 1));
}

const defaultOps: UserPlotOptions= {
    title: "",
    gridX: true,
    gridY: true,
    width: 6,
    height: 4,
    dimUnit: "Inches",
    xLim: null,
    yLim: null,
    xLabel: "",
    yLabel: "",
};

export default function Home() {
  const [plots, setPlots] = createStore<UserPlot[]>([]);
  const [dataInput, setDataInput] = createSignal("");
  const [plotOptions, setPlotOptions] = createSignal<UserPlotOptions>({...defaultOps});

  const [outputName, setOutputName] = createSignal<string>("plot");
  const [outputFormat, setOutputFormat] = createSignal<OutputFormat>("SVG");

  const [subplots, setSubplots] = createSignal<number[]>([]);
  const [paintingSubplot, setPaintingSubplot] = createSignal<number | null>(
    null
  );
  const [spOptIndex, setSPOptIndex] = createSignal<number | null>(null);
  const [spOptions, setSpOptions] = createSignal<UserPlotOptions[]>([]);

  const [spMargin, setSPMargin] = createSignal<number>(0.1);

  const [dragging, setDragging] = createSignal<boolean>(false);

  function updatePlot(p: UserPlot, field: keyof UserPlot) {
    setPlots(
      (x) => x.id == p.id,
      // @ts-ignore
      produce((plot) => (plot[field] = p[field]))
    );
  }

  function generateLayout(options: { subplotMargin?: number }) {
    let output: any = {
      autosize: false,
      title: {
        text: plotOptions().title,
      },
      font: {
        family: "Computer Modern",
      },
    };

    if (subplots().length == 0) {
      output["xaxis"] = {
        title: {
          text: plotOptions().xLabel,
        },
        showgrid: plotOptions().gridX,
      };
      output["yaxis"] = {
        title: {
          text: plotOptions().yLabel,
        },
        showgrid: plotOptions().gridY,
      };

      if (plotOptions().xLim != null) {
        output["xaxis"]["range"] = plotOptions().xLim;
      }
      if (plotOptions().yLim != null) {
        output["yaxis"]["range"] = plotOptions().yLim;
      }
    }

    const margin = options.subplotMargin ?? 0.1;
    const N = subplots().length;
    const width = (1.0 - (N - 1) * margin) / N;

    let j = 0;
    for (const sp of subplots()) {
      output["xaxis" + sp] = {
        domain: [
          width * j + (j > 0 ? 1 : 0) * margin * j,
          width * j + (j > 0 ? 1 : 0) * margin * j + width,
        ],
        anchor: "y" + sp,
        range: (spOptions()[j] ?? defaultOps).xLim,
        title: {
          text: (spOptions()[j] ?? defaultOps).xLabel,
        },
        showgrid: (spOptions()[j] ?? defaultOps).gridX,
      };
      output["yaxis" + sp] = {
        domain: [0, 1.0],
        anchor: "x" + sp,
        range: (spOptions()[j] ?? defaultOps).yLim,
        title: {
          text: (spOptions()[j] ?? defaultOps).yLabel,
        },
        showgrid: (spOptions()[j] ?? defaultOps).gridY,
      };
      j++;
    }

    return output;
  }

  function editPlotOption(key: keyof UserPlotOptions, value: any) {
    if (spOptIndex() == null) {
      setPlotOptions((po) => {
        return { ...po, [key]: value };
      });
    } else {
      setSpOptions((options) => {
        return options.map((po, i) => {
          if (i == spOptIndex()) {
            return { ...po, [key]: value };
          } else {
            return po;
          }
        });
      });
    }
  }

  onMount(() => {
    // @ts-ignore
    window["MathJax"] = {
      tex: {
        inlineMath: [["$", "$"]],
      },
    };
  });

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
              class="font-mono text-primary w-full"
              value="plot"
              out={setOutputName}
            />
            <div class="h-2" />
            <label class="mb-1 font-semibold" for="exportFormat">
              Format
            </label>
            <SelectInput
              id="exportFormat"
              class="font-mono text-primary"
              out={setOutputFormat}
              options={["SVG", "PNG"] as OutputFormat[]}
            />
          </div>
          <div class="h-4" />
          <ConfirmButton
            onClick={() => {
              let allBtns = document.getElementsByClassName("modebar-btn");
              for (const btn of allBtns) {
                if (btn.getAttribute("data-title")?.startsWith("SVG_EXPORT")) {
                  // @ts-ignore
                  btn.click();
                }
              }
            }}
          >
            Download
          </ConfirmButton>
        </aside>
        <div class="grow">
          <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
            <Plot
              data={plots.map(userToPlotly)}
              fallback={<p></p>}
              width={dimToPixels(plotOptions().width, plotOptions().dimUnit)}
              height={dimToPixels(plotOptions().height, plotOptions().dimUnit)}
              layout={generateLayout({ subplotMargin: spMargin() })}
              exportName={outputName()}
              exportFormat={outputFormat().toLowerCase() as any}
            />
          </div>
          <div class="h-4" />
          {/* Subplot tab picker */}
          <div class="flex flex-row rounded-t-xl gap-2">
            <For each={subplots()}>
              {(sp, i) => {
                return (
                  <div
                    class={`grow flex flex-row rounded-t-xl bg-white items-center px-4 cursor-pointer select-none ${
                      i() == spOptIndex() ? "opacity-100" : "opacity-50"
                    }`}
                    onClick={() => {
                      setSPOptIndex(i());
                    }}
                  >
                    <p class={`grow py-4 px-2`}>
                      {subplots().length > 6 ? i() : "Subplot " + i()}
                    </p>
                    <div
                      class="w-8 h-8 rounded-full opacity-70"
                      style={{ "background-color": subplotColors[sp] }}
                    />
                  </div>
                );
              }}
            </For>
          </div>
          {/* Plot options / Subplot options if there are multiple subplots */}
          <For each={subplots()}>
          {(x, i) => (
          <div class={`bg-white rounded-b-xl shadow-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 ${i() == spOptIndex() ? "" : "hidden"}`}>
            <label class="mb-1 font-semibold" for="plotTitle">
              Title
            </label>
            <label class="mb-1 font-semibold">Grid</label>
            <TextInput
              id="plotTitle"
              class="text-primary pb-1 outline-none w-full"
              placeholder={"My Plot"}
              value={""}
              onChange={(x) => {
                editPlotOption("title", x);
              }}
            />
            <div class="flex flex-row items-center gap-2">
              <label class="font-semibold text-blue-300" for="xGrid">
                X
              </label>
              <SelectInput
                id="xGrid"
                class="text-primary pb-1 outline-none grow"
                options={["Yes", "No"]}
                onChange={(x) => {
                  editPlotOption("gridX", x == "Yes");
                }}
              />
            </div>
            <div />
            <div class="flex flex-row items-center gap-2">
              <label class="font-semibold text-blue-300" for="yGrid">
                Y
              </label>
              <SelectInput
                id="yGrid"
                class="text-primary pb-1 outline-none grow"
                options={["Yes", "No"]}
                onChange={(x) => {
                  editPlotOption("gridY", x == "Yes");
                }}
              />
            </div>
            <label class="mb-1 font-semibold">Dimensions</label>
            <label class="mb-1 font-semibold">Limits</label>
            <div class="flex flex-row items-center gap-2">
              <TextInput
                class="text-primary pb-1 outline-none grow"
                value={"6"}
                onChange={(x) => {
                  editPlotOption("width", parseInt(x, 0));
                }}
              />
              <NoHydration>
                <ImCross class="text-accent" />
              </NoHydration>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                value={"4"}
                onChange={(x) => {
                  editPlotOption("height", parseInt(x, 0));
                }}
              />
            </div>
            <div class="flex flex-row items-center gap-2">
              <label class="font-semibold text-blue-300">X</label>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                placeholder={"Auto"}
                onChange={(x) => {
                  if (spOptIndex() == null) {
                    setPlotOptions((po) => {
                      let obj = { ...po };
                      if (obj.xLim) {
                        obj.xLim[0] = parseInt(x, 0);
                      } else {
                        obj.xLim = [parseInt(x, 0), null];
                      }
                      if (x == "") {
                        obj.xLim = null;
                      }
                      return obj;
                    });
                  } else {
                    setSpOptions((options) => {
                      return options.map((po, i) => {
                        if (i == spOptIndex()) {
                          let obj = { ...po };
                          if (obj.xLim) {
                            obj.xLim[0] = parseInt(x, 0);
                          } else {
                            obj.xLim = [parseInt(x, 0), null];
                          }
                          if (x == "") {
                            obj.xLim = null;
                          }
                          return obj;
                        } else {
                          return po;
                        }
                      });
                    });
                  }
                }}
              />
              <NoHydration>
                <FaSolidArrowRightLong class="text-accent" />
              </NoHydration>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                placeholder={"Auto"}
                onChange={(x) => {
                  if (spOptIndex() == null) {
                    setPlotOptions((po) => {
                      let obj = { ...po };
                      if (obj.xLim) {
                        obj.xLim[1] = parseInt(x, 0);
                      } else {
                        obj.xLim = [null, parseInt(x, 0)];
                      }
                      if (x == "") {
                        obj.xLim = null;
                      }
                      return obj;
                    });
                  } else {
                    setSpOptions((options) => {
                      return options.map((po, i) => {
                        if (i == spOptIndex()) {
                          let obj = { ...po };
                          if (obj.xLim) {
                            obj.xLim[1] = parseInt(x, 0);
                          } else {
                            obj.xLim = [null, parseInt(x, 0)];
                          }
                          if (x == "") {
                            obj.xLim = null;
                          }
                          return obj;
                        } else {
                          return po;
                        }
                      });
                    });
                  }
                }}
              />
            </div>
            <SelectInput
              class="text-primary pb-1 outline-none"
              options={["Inches", "Pixels", "Centimeters"]}
              onChange={(x) =>
                //@ts-ignore
                setPlotOptions((po) => {
                  return { ...po, dimUnit: x };
                })
              }
            />
            <div class="flex flex-row items-center gap-2">
              <label class="font-semibold text-blue-300">Y</label>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                placeholder={"Auto"}
                onChange={(x) => {
                  if (spOptIndex() == null) {
                    setPlotOptions((po) => {
                      let obj = { ...po };
                      if (obj.yLim) {
                        obj.yLim[0] = parseInt(x, 0);
                      } else {
                        obj.yLim = [parseInt(x, 0), null];
                      }
                      if (x == "") {
                        obj.yLim = null;
                      }
                      return obj;
                    });
                  } else {
                    setSpOptions((options) => {
                      return options.map((po, i) => {
                        if (i == spOptIndex()) {
                          let obj = { ...po };
                          if (obj.yLim) {
                            obj.yLim[0] = parseInt(x, 0);
                          } else {
                            obj.yLim = [parseInt(x, 0), null];
                          }
                          if (x == "") {
                            obj.yLim = null;
                          }
                          return obj;
                        } else {
                          return po;
                        }
                      });
                    });
                  }
                }}
              />
              <NoHydration>
                <FaSolidArrowRightLong class="text-accent" />
              </NoHydration>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                placeholder={"Auto"}
                onChange={(x) => {
                  if (spOptIndex() == null) {
                    setPlotOptions((po) => {
                      let obj = { ...po };
                      if (obj.yLim) {
                        obj.yLim[1] = parseInt(x, 0);
                      } else {
                        obj.yLim = [null, parseInt(x, 0)];
                      }
                      if (x == "") {
                        obj.yLim = null;
                      }
                      return obj;
                    });
                  } else {
                    setSpOptions((options) => {
                      return options.map((po, i) => {
                        if (i == spOptIndex()) {
                          let obj = { ...po };
                          if (obj.yLim) {
                            obj.yLim[1] = parseInt(x, 0);
                          } else {
                            obj.yLim = [null, parseInt(x, 0)];
                          }
                          if (x == "") {
                            obj.yLim = null;
                          }
                          return obj;
                        } else {
                          return po;
                        }
                      });
                    });
                  }
                }}
              />
            </div>
            <label class="mb-1 font-semibold col-span-2">Labels</label>
            <TextInput
              class="text-primary pb-1 outline-none w-full"
              placeholder={"X Label"}
              onChange={(x) => editPlotOption("xLabel", x)}
            />
            <TextInput
              class="text-primary pb-1 outline-none w-full"
              placeholder={"Y Label"}
              onChange={(x) => editPlotOption("yLabel", x)}
            />
          </div>
          )}
          </For>
          <div class={`bg-white rounded-b-xl shadow-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 ${spOptIndex() == null ? "" : "hidden"}`}>
            <label class="mb-1 font-semibold" for="plotTitle">
              Title
            </label>
            <label class="mb-1 font-semibold">Grid</label>
            <TextInput
              id="plotTitle"
              class="text-primary pb-1 outline-none w-full"
              placeholder={"My Plot"}
              value={""}
              onChange={(x) => {
                editPlotOption("title", x);
              }}
            />
            <div class="flex flex-row items-center gap-2">
              <label class="font-semibold text-blue-300" for="xGrid">
                X
              </label>
              <SelectInput
                id="xGrid"
                class="text-primary pb-1 outline-none grow"
                options={["Yes", "No"]}
                onChange={(x) => {
                  editPlotOption("gridX", x == "Yes");
                }}
              />
            </div>
            <div />
            <div class="flex flex-row items-center gap-2">
              <label class="font-semibold text-blue-300" for="yGrid">
                Y
              </label>
              <SelectInput
                id="yGrid"
                class="text-primary pb-1 outline-none grow"
                options={["Yes", "No"]}
                onChange={(x) => {
                  editPlotOption("gridY", x == "Yes");
                }}
              />
            </div>
            <label class="mb-1 font-semibold">Dimensions</label>
            <label class="mb-1 font-semibold">Limits</label>
            <div class="flex flex-row items-center gap-2">
              <TextInput
                class="text-primary pb-1 outline-none grow"
                value={"6"}
                onChange={(x) => {
                  editPlotOption("width", parseInt(x, 0));
                }}
              />
              <NoHydration>
                <ImCross class="text-accent" />
              </NoHydration>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                value={"4"}
                onChange={(x) => {
                  editPlotOption("height", parseInt(x, 0));
                }}
              />
            </div>
            <div class="flex flex-row items-center gap-2">
              <label class="font-semibold text-blue-300">X</label>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                placeholder={"Auto"}
                onChange={(x) => {
                  if (spOptIndex() == null) {
                    setPlotOptions((po) => {
                      let obj = { ...po };
                      if (obj.xLim) {
                        obj.xLim[0] = parseInt(x, 0);
                      } else {
                        obj.xLim = [parseInt(x, 0), null];
                      }
                      if (x == "") {
                        obj.xLim = null;
                      }
                      return obj;
                    });
                  } else {
                    setSpOptions((options) => {
                      return options.map((po, i) => {
                        if (i == spOptIndex()) {
                          let obj = { ...po };
                          if (obj.xLim) {
                            obj.xLim[0] = parseInt(x, 0);
                          } else {
                            obj.xLim = [parseInt(x, 0), null];
                          }
                          if (x == "") {
                            obj.xLim = null;
                          }
                          return obj;
                        } else {
                          return po;
                        }
                      });
                    });
                  }
                }}
              />
              <NoHydration>
                <FaSolidArrowRightLong class="text-accent" />
              </NoHydration>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                placeholder={"Auto"}
                onChange={(x) => {
                  if (spOptIndex() == null) {
                    setPlotOptions((po) => {
                      let obj = { ...po };
                      if (obj.xLim) {
                        obj.xLim[1] = parseInt(x, 0);
                      } else {
                        obj.xLim = [null, parseInt(x, 0)];
                      }
                      if (x == "") {
                        obj.xLim = null;
                      }
                      return obj;
                    });
                  } else {
                    setSpOptions((options) => {
                      return options.map((po, i) => {
                        if (i == spOptIndex()) {
                          let obj = { ...po };
                          if (obj.xLim) {
                            obj.xLim[1] = parseInt(x, 0);
                          } else {
                            obj.xLim = [null, parseInt(x, 0)];
                          }
                          if (x == "") {
                            obj.xLim = null;
                          }
                          return obj;
                        } else {
                          return po;
                        }
                      });
                    });
                  }
                }}
              />
            </div>
            <SelectInput
              class="text-primary pb-1 outline-none"
              options={["Inches", "Pixels", "Centimeters"]}
              onChange={(x) =>
                //@ts-ignore
                setPlotOptions((po) => {
                  return { ...po, dimUnit: x };
                })
              }
            />
            <div class="flex flex-row items-center gap-2">
              <label class="font-semibold text-blue-300">Y</label>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                placeholder={"Auto"}
                onChange={(x) => {
                  if (spOptIndex() == null) {
                    setPlotOptions((po) => {
                      let obj = { ...po };
                      if (obj.yLim) {
                        obj.yLim[0] = parseInt(x, 0);
                      } else {
                        obj.yLim = [parseInt(x, 0), null];
                      }
                      if (x == "") {
                        obj.yLim = null;
                      }
                      return obj;
                    });
                  } else {
                    setSpOptions((options) => {
                      return options.map((po, i) => {
                        if (i == spOptIndex()) {
                          let obj = { ...po };
                          if (obj.yLim) {
                            obj.yLim[0] = parseInt(x, 0);
                          } else {
                            obj.yLim = [parseInt(x, 0), null];
                          }
                          if (x == "") {
                            obj.yLim = null;
                          }
                          return obj;
                        } else {
                          return po;
                        }
                      });
                    });
                  }
                }}
              />
              <NoHydration>
                <FaSolidArrowRightLong class="text-accent" />
              </NoHydration>
              <TextInput
                class="text-primary pb-1 outline-none grow"
                placeholder={"Auto"}
                onChange={(x) => {
                  if (spOptIndex() == null) {
                    setPlotOptions((po) => {
                      let obj = { ...po };
                      if (obj.yLim) {
                        obj.yLim[1] = parseInt(x, 0);
                      } else {
                        obj.yLim = [null, parseInt(x, 0)];
                      }
                      if (x == "") {
                        obj.yLim = null;
                      }
                      return obj;
                    });
                  } else {
                    setSpOptions((options) => {
                      return options.map((po, i) => {
                        if (i == spOptIndex()) {
                          let obj = { ...po };
                          if (obj.yLim) {
                            obj.yLim[1] = parseInt(x, 0);
                          } else {
                            obj.yLim = [null, parseInt(x, 0)];
                          }
                          if (x == "") {
                            obj.yLim = null;
                          }
                          return obj;
                        } else {
                          return po;
                        }
                      });
                    });
                  }
                }}
              />
            </div>
            <label class="mb-1 font-semibold col-span-2">Labels</label>
            <TextInput
              class="text-primary pb-1 outline-none w-full"
              placeholder={"X Label"}
              onChange={(x) => editPlotOption("xLabel", x)}
            />
            <TextInput
              class="text-primary pb-1 outline-none w-full"
              placeholder={"Y Label"}
              onChange={(x) => editPlotOption("yLabel", x)}
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
                    setSpOptions((x) => [...x, {...defaultOps}]);
                    if (spOptIndex() == null) {
                      setSPOptIndex(0);
                    }
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
                    setSpOptions((x) => x.slice(0, x.length - 1));
                    setSPOptIndex((x) => Math.min(x!!, len - 2));
                    setPlots(
                      (x) => (x.subplot != null && x.subplot >= len) ?? false,
                      produce((x) => {
                        if (len == 1) {
                          x.subplot = null;
                        } else {
                          x.subplot = len - 1;
                        }
                        return x;
                      })
                    );
                    if (len - 1 == 0) {
                      setSPOptIndex(null);
                    }
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
            <Show when={subplots().length > 0}>
              <div class="h-4" />
              <p class="text-body text-lg">Margin</p>
              <div class="h-2" />
              <div class="px-4">
                <SlideInput from={0.0} to={maxMargin(subplots().length)} out={setSPMargin} value={0.0} />
              </div>
              <div class="h-8" />
            </Show>
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
                          "subplot"
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
