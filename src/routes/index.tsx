import {
  For,
  Setter,
  Show,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { SetStoreFunction, produce } from "solid-js/store";

import { TbFileExport } from "solid-icons/tb";
import { IoAddCircle, IoRemoveCircle } from "solid-icons/io";
import { ImCross } from "solid-icons/im";
import { FaSolidArrowRightLong } from "solid-icons/fa";
import { FaSolidQuestion } from "solid-icons/fa";
import { IoClose } from "solid-icons/io";

import TestSvg from "../test.svg";
import ConfirmButton from "~/components/ConfirmButton";
import {
  UserPlot,
  UserPlotOptions,
  csvToPlot,
  defaultOps,
  dimToPixels,
  generateLayout,
  userToPlotly,
} from "~/plotting";
import { createStore } from "solid-js/store";
import { DraggableList } from "~/components/DraggableList";
import { clientOnly } from "@solidjs/start";
import { TextInput, SelectInput, SlideInput } from "uden-ui";

const Plot = clientOnly(() => import("../components/Plot"));
const PlotSettings = clientOnly(() => import("../components/PlotSettings"));

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

const subplotColors = [
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

type OutputFormat = "SVG" | "PNG";

function maxMargin(n: number) {
  return 1 / Math.max(n - 1, 1);
}

export default function Home() {
  const [plots, setPlots] = createStore<UserPlot[]>([]);
  const [helpVisible, setHelpVisible] = createSignal(false);
  const [dataInput, setDataInput] = createSignal("");
  const [inputType, setInputType] = createSignal<InputType>("text");

  const [outputName, setOutputName] = createSignal<string>("plot");
  const [outputFormat, setOutputFormat] = createSignal<OutputFormat>("SVG");
  const [plotOptions, setPlotOptions] = createSignal<UserPlotOptions>({
    ...defaultOps,
  });

  const [subplots, setSubplots] = createSignal<number[]>([]);
  const [paintingSubplot, setPaintingSubplot] = createSignal<number | null>(
    null,
  );
  const [spOptIndex, setSPOptIndex] = createSignal<number | null>(null);
  const [spOptions, setSpOptions] = createSignal<UserPlotOptions[]>([]);
  const [spMargin, setSPMargin] = createSignal<number>(0.1);

  const [dragging, setDragging] = createSignal<boolean>(false);

  createEffect(() => {
    let xLabel = document.getElementById("xLabel");
    let yLabel = document.getElementById("yLabel");
    if (xLabel != null) {
      xLabel!!.innerHTML = plotOptions().xLabel;
    }
    if (yLabel != null) {
      yLabel!!.innerHTML = plotOptions().yLabel;
    }
    plotOptions();
  });

  async function loadDroppedFile(e: DragEvent) {
    const file = e.dataTransfer?.files[0];
    e.preventDefault();
    const contents = await file?.text();
    if (contents != null) {
      setInputType("file");
      setDataInput(contents);
    }
  }

  function updatePlot(p: UserPlot, field: keyof UserPlot) {
    setPlots(
      (x) => x.id == p.id,
      // @ts-ignore
      produce((plot) => (plot[field] = p[field])),
    );
  }

  function deletePlot(plotId: number) {
    setPlots((list) => list.filter((p) => p.id != plotId));
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

  function onAddingPlot(plot: UserPlot) {
    if (plotOptions().xLabel == "") {
      if (plot.columns.length >= 2) {
        setPlotOptions({
          ...plotOptions(),
          xLabel: plot.columns[0].name,
        });
      }
    }
    if (plotOptions().yLabel == "") {
      if (plot.columns.length >= 2) {
        setPlotOptions({
          ...plotOptions(),
          yLabel: plot.columns[1].name,
        });
      } else if (plot.columns.length >= 1) {
        setPlotOptions({
          ...plotOptions(),
          yLabel: plot.columns[0].name,
        });
      }
    }
  }

  return (
    <main class="mx-auto text-gray-700 p-4">
      <div class="flex flex-row items-center mb-4">
        <h1 class="max-6-xs text-2xl font-heading uppercase font-extrabold grow select-none">
          <span class="bg-gradient-to-r from-primary to-accent-active inline-block text-transparent bg-clip-text text-6xl">
            Plot
          </span>
          <span class="text-accent opacity-50">.vincentuden.xyz</span>
        </h1>
        <div
          class="relative w-12 h-12 text-background cursor-pointer overflow-hidden bg-primary rounded-full"
          onClick={() => setHelpVisible((x) => !x)}
        >
          <div
            class={`absolute left-2 top-2 ${
              helpVisible() ? "-translate-y-48" : "translate-y-0"
            } transition-transform`}
          >
            <FaSolidQuestion size={32} />
          </div>
          <div
            class={`absolute left-[8.5px] top-[8.5px] scale-125 ${
              helpVisible() ? "translate-x-0" : "translate-x-48"
            } transition-transform`}
          >
            <IoClose size={32} />
          </div>
        </div>
      </div>
      <div class="flex flex-row gap-8">
        {/* Left Panel */}
        <aside class="flex flex-col grow-0 basis-64 relative">
          <FileDropper
            onDrop={loadDroppedFile}
            helpVisible={helpVisible()}
            dataInput={dataInput()}
            setDataInput={setDataInput}
            setPlots={setPlots}
            inputType={inputType()}
            setInputType={setInputType}
            onAddingPlot={onAddingPlot}
          />
          <div class="h-8" />
          <ExportOptions
            setOutputName={setOutputName}
            setOutputFormat={setOutputFormat}
          />
          <div class="h-4" />
          <ConfirmButton
            onClick={() => {
              let allBtns = document.getElementsByClassName("modebar-btn");
              for (const btn of allBtns) {
                if (btn.getAttribute("data-title")?.startsWith("SVG_EXPORT")) {
                  (btn as HTMLButtonElement).click();
                }
              }
            }}
          >
            Download
          </ConfirmButton>
          <div class="h-8" />
          <GlobalPlotOptions setPlotOptions={setPlotOptions} />
        </aside>

        {/* Central Panel */}
        <div class="grow">
          <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
            <Plot
              data={plots.map(userToPlotly)}
              fallback={<p></p>}
              width={dimToPixels(plotOptions().width, plotOptions().dimUnit)}
              height={dimToPixels(plotOptions().height, plotOptions().dimUnit)}
              layout={generateLayout(plotOptions(), subplots(), spOptions(), {
                subplotMargin: spMargin(),
              })}
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
            {(_, i) => (
              <div
                class={`bg-white rounded-b-xl shadow-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 ${
                  i() == spOptIndex() ? "" : "hidden"
                }`}
              >
                <label class="mb-1 font-semibold">Grid</label>
                <label class="mb-1 font-semibold">Limits</label>
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
                  <FaSolidArrowRightLong class="text-accent" />
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
                  <FaSolidArrowRightLong class="text-accent" />
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
                <div class="cols-2 h-2" />
                <label class="mb-1 font-semibold col-span-2">Labels</label>
                <TextInput
                  class="text-primary pb-1 outline-none w-full"
                  placeholder={"X Label"}
                  onChange={(x) => editPlotOption("xLabel", x)}
                  id="xLabel"
                />
                <TextInput
                  class="text-primary pb-1 outline-none w-full"
                  placeholder={"Y Label"}
                  onChange={(x) => editPlotOption("yLabel", x)}
                  id="yLabel"
                />
              </div>
            )}
          </For>
          <div
            class={`bg-white rounded-b-xl shadow-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 ${
              spOptIndex() == null ? "" : "hidden"
            }`}
          >
            <label class="mb-1 font-semibold">Grid</label>
            <label class="mb-1 font-semibold">Limits</label>
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
              <FaSolidArrowRightLong class="text-accent" />
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
              <FaSolidArrowRightLong class="text-accent" />
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
              value={plotOptions().xLabel}
            />
            <TextInput
              class="text-primary pb-1 outline-none w-full"
              placeholder={"Y Label"}
              onChange={(x) => editPlotOption("yLabel", x)}
              value={plotOptions().yLabel}
            />
          </div>
        </div>

        {/* Right Panel */}
        <aside class="basis-64">
          <div class="h-4" />
          <GlobalSubPlotOptions
            helpVisible={helpVisible()}
            paintingSubplot={paintingSubplot()}
            setPaintingSubplot={setPaintingSubplot}
            subplots={subplots()}
            setSubplots={setSubplots}
            setSpOptions={setSpOptions}
            spOptIndex={spOptIndex()}
            setSPOptIndex={setSPOptIndex}
            setPlots={setPlots}
            setSPMargin={setSPMargin}
          />
          <div class="h-4 w-full rounded-full bg-accent-active shadow-lg"></div>
          <div class="flex flex-col h-[70vh] overflow-y-hidden">
            <div
              class={`absolute right-96 transition-opacity z-10 ${
                helpVisible() ? "opacity-100" : "opacity-0"
              }`}
            >
              <p class="absolute w-48 font-hand text-red-600 text-center">
                Added plots show up here. Drag to change the ordering and click
                on an entry to edit it's individual settings.
              </p>
              <img
                class="w-16 h-auto rotate-[-165deg] translate-y-28 translate-x-32"
                src={TestSvg}
              />
            </div>
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
                    deletePlot={deletePlot}
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
        </aside>
      </div>
    </main>
  );
}

type InputType = "file" | "text";

type FileDropperProps = {
  onDrop: (e: DragEvent) => Promise<void>;
  helpVisible: boolean;
  setPlots: Setter<UserPlot[]>;
  dataInput: string;
  setDataInput: Setter<string>;
  inputType: InputType;
  setInputType: Setter<InputType>;
  onAddingPlot: (plt: UserPlot) => void;
};

function FileDropper(props: FileDropperProps) {
  return (
    <>
      <Show when={props.inputType == "text"}>
        <textarea
          id="csvDropZone"
          onDrop={props.onDrop} // TODO: fileDropHandler
          class="bg-white shadow-lg rounded-xl p-4 resize-none outline-none min-w-64 h-24"
          placeholder="Paste your data here (csv, json)"
          value={props.dataInput}
          onChange={(e) => props.setDataInput(e.target.value)}
        >
          {""}
        </textarea>
        <div
          class={`absolute left-48 translate-x-10 transition-opacity ${
            props.helpVisible ? "opacity-100" : "opacity-0"
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
      <Show when={props.inputType == "file"}>
        <div class="bg-white shadow-lg rounded-xl p-4 resize-none outline-none flex flex-row min-w-64 h-24 items-center">
          <p class="grow text-primary opacity-50">File added</p>
          <ImCross
            class="text-red-500 grow-0 hover:scale-125 transition-transform"
            onClick={() => {
              props.setDataInput("");
              props.setInputType("text");
            }}
          />
        </div>
      </Show>
      <div class="h-4" />
      <ConfirmButton
        onClick={() => {
          props.setPlots((x) => {
            let plt = csvToPlot(
              props.dataInput,
              "New Plot",
              standardColors[x.length % standardColors.length],
            );
            props.onAddingPlot(plt);
            return [...x, plt];
          });
        }}
      >
        Add Plot
      </ConfirmButton>
    </>
  );
}

type ExportOptionsProps = {
  setOutputName: Setter<string>;
  setOutputFormat: Setter<OutputFormat>;
};

function ExportOptions(props: ExportOptionsProps) {
  return (
    <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col">
      <div class="flex flex-row gap-4 mb-4">
        <h2 class="grow text-primary text-xl">Export Options</h2>
        <TbFileExport class="grow-0 text-primary" size={24} />
      </div>
      <label class="mb-1 font-semibold" for="exportName">
        File Name
      </label>
      <TextInput
        id="exportName"
        class="font-mono text-primary w-full"
        value="plot"
        out={props.setOutputName}
      />
      <div class="h-2" />
      <label class="mb-1 font-semibold" for="exportFormat">
        Format
      </label>
      <SelectInput
        id="exportFormat"
        class="font-mono text-primary"
        out={props.setOutputFormat}
        options={["SVG", "PNG"] as OutputFormat[]}
      />
    </div>
  );
}

type GlobalPlotOptionsProps = {
  setPlotOptions: Setter<UserPlotOptions>;
};

function GlobalPlotOptions(props: GlobalPlotOptionsProps) {
  return (
    <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col">
      <h2 class="grow text-primary text-xl">Plot Options</h2>
      <div class="h-4" />
      <label class="mb-1 font-semibold" for="plotTitle">
        Title
      </label>
      <TextInput
        id="plotTitle"
        class="text-primary pb-1 outline-none w-full"
        placeholder={"My Plot"}
        value={""}
        onChange={(x) => {
          props.setPlotOptions((po) => {
            return { ...po, title: x };
          });
        }}
      />
      <div class="h-2" />
      <label class="mb-1 font-semibold">Dimensions</label>
      <div class="flex flex-row items-center gap-2">
        <TextInput
          class="text-primary pb-1 outline-none grow w-0"
          value={"6"}
          onChange={(x) => {
            props.setPlotOptions((po) => {
              return { ...po, width: parseInt(x, 0) };
            });
          }}
        />
        <ImCross class="text-accent" />
        <TextInput
          class="text-primary pb-1 outline-none grow w-0"
          value={"4"}
          onChange={(x) => {
            props.setPlotOptions((po) => {
              return { ...po, height: parseInt(x, 0) };
            });
          }}
        />
      </div>
      <div class="h-2" />
      <SelectInput
        class="text-primary pb-1 outline-none"
        options={["Inches", "Pixels", "Centimeters"]}
        onChange={(x) =>
          //@ts-ignore
          props.setPlotOptions((po) => {
            return { ...po, dimUnit: x };
          })
        }
      />
      <div class="flex flex-row gap-8 mt-2">
        <label class="grow font-semibold" for="showLegend">
          Show Legend
        </label>
        <input
          type="checkbox"
          id="showLegend"
          onChange={(_) =>
            props.setPlotOptions((po) => {
              return { ...po, showLegend: !po.showLegend };
            })
          }
        />
      </div>
    </div>
  );
}

type GlobalSubPlotOptionsProps = {
  helpVisible: boolean;
  paintingSubplot: number | null;
  setPaintingSubplot: Setter<number | null>;
  subplots: number[];
  setSubplots: Setter<number[]>;
  setSpOptions: Setter<UserPlotOptions[]>;
  spOptIndex: number | null;
  setSPOptIndex: Setter<number | null>;
  setPlots: SetStoreFunction<UserPlot[]>;
  setSPMargin: Setter<number>;
};

function GlobalSubPlotOptions(props: GlobalSubPlotOptionsProps) {
  return (
    <div class="relative bg-white rounded-xl p-4 shadow-lg">
      <div
        class={`absolute right-96 transition-opacity -translate-y-16 ${
          props.helpVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p class="absolute w-48 font-hand text-red-600 text-center">
          Create subplots by adding them here. Then select a category (indicated
          by a color) and "paint" each plot below to group them into the correct
          subplot.
        </p>
        <div class="w-16 h-16 translate-x-48 -scale-x-100 rotate-45">
          <img class="w-16 h-16 " src={TestSvg} />
        </div>
      </div>
      <p class="mb-2 text-primary text-xl">Subplots</p>
      <div class="flex flex-row flex-wrap gap-2">
        <For each={props.subplots}>
          {(sp) => (
            <div
              class={`rounded-full  w-8 h-8 hover:opacity-50 transition-opacity cursor-pointer ${
                props.paintingSubplot == sp
                  ? "border-2 border-green-500 opacity-50"
                  : "opacity-20"
              }`}
              style={{ "background-color": standardColors[sp] }}
              onClick={() => {
                if (props.paintingSubplot == sp) {
                  props.setPaintingSubplot(null);
                } else {
                  props.setPaintingSubplot(sp);
                }
              }}
            />
          )}
        </For>
        <div
          class={`w-8 h-8 ${
            props.paintingSubplot != null ? "rotate-[45deg]" : ""
          } transition-transform`}
          onClick={() => {
            if (props.paintingSubplot == null) {
              props.setSubplots((x) => [...x, x.length + 1]);
              props.setSpOptions((x) => [...x, { ...defaultOps }]);
              if (props.spOptIndex == null) {
                props.setSPOptIndex(0);
              }
            } else {
              props.setPaintingSubplot(null);
            }
          }}
        >
          <IoAddCircle
            class="text-primary cursor-pointer opacity-50 hover:opacity-100 transition-opacity w-8 h-8 scale-[1.2]"
            size={48}
          />
        </div>
        <Show when={props.subplots.length > 0}>
          <div
            class="w-8 h-8"
            onClick={() => {
              const len = props.subplots.length;
              props.setSubplots((x) => x.slice(0, x.length - 1));
              props.setSpOptions((x) => x.slice(0, x.length - 1));
              props.setSPOptIndex((x) => Math.min(x!!, len - 2));
              props.setPlots(
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
              if (len - 1 == 0) {
                props.setSPOptIndex(null);
              }
              props.setPaintingSubplot(null);
            }}
          >
            <IoRemoveCircle
              class="text-red-400 cursor-pointer opacity-50 hover:opacity-100 transition-opacity w-8 h-8 scale-[1.2]"
              size={48}
            />
          </div>
        </Show>
      </div>
      <Show when={props.subplots.length > 0}>
        <div class="h-4" />
        <p class="text-body text-lg">Margin</p>
        <div class="h-2" />
        <div class="px-4">
          <SlideInput
            from={0.0}
            to={maxMargin(props.subplots.length)}
            out={props.setSPMargin}
            value={0.0}
            trackClass="bg-gray-200"
          />
        </div>
        <div class="h-8" />
      </Show>
    </div>
  );
}
