import { Accessor, createSignal, Show } from "solid-js";

import {
  VsGraph,
  VsGraphLine,
  VsGraphScatter,
  VsQuestion,
} from "solid-icons/vs";
import { AiFillPieChart } from "solid-icons/ai";
import { FaSolidChevronDown } from "solid-icons/fa";
import { IoTrashBinOutline } from "solid-icons/io";
import { IconTypes } from "solid-icons";
import { NoHydration } from "solid-js/web";
import { TextInput, SelectInput } from "uden-ui";
import { ColorPicker } from "./ColorPicker";
import { UserPlot, UserPlotType } from "~/plotting";

type PlotSettingsProps = {
  plot: UserPlot;
  index: number;
  updatePlot?: (p: UserPlot, i: keyof UserPlot) => void;
  onClick?: () => void;
  headerClickable: () => boolean;
  forceClose?: Accessor<boolean>;
  deletePlot?: (plotId: number) => void;
};

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

function GraphIcon(type: UserPlotType): IconTypes {
  if (type == "bar") {
    return VsGraph;
  }
  if (type == "line") {
    return VsGraphLine;
  }
  if (type == "scatter") {
    return VsGraphScatter;
  }
  if (type == "pie") {
    return AiFillPieChart;
  }

  return VsQuestion;
}

export default function PlotSettings({
  plot,
  index,
  updatePlot: update,
  onClick,
  headerClickable,
  forceClose,
  deletePlot,
}: PlotSettingsProps) {
  const updatePlot = update ? update : (p: UserPlot, i: keyof UserPlot) => {};
  const HeaderIcon = () => GraphIcon(plot.type);

  const [open, setOpen] = createSignal(false);
  const [deleting, setDeleting] = createSignal(false);

  return (
    <div
      class={`bg-white rounded-xl shadow-lg flex flex-col border-4 ${
        deleting() ? "translate-x-full" : "translate-x-0"
      } transition-transform`}
      onClick={onClick}
      style={{
        "border-color": (subplotColors[plot.subplot ?? -1] ?? "#ffffff") + "55",
      }}
    >
      <div class="p-4 rounded-xl w-64">
        <div
          class="flex flex-row gap-4 items-center select-none cursor-pointer"
          onClick={() => {
            if (headerClickable()) {
              setOpen((x) => !x);
            }
          }}
        >
          {HeaderIcon()({ size: 24, color: plot.color })}
          <h2 class="grow text-xl" style={{ color: plot.color }}>
            {plot.name}
          </h2>
          <NoHydration>
            <FaSolidChevronDown size={24} color={plot.color} />
          </NoHydration>
        </div>
        <Show when={open() && !(forceClose ?? (() => false))()}>
          <div
            class="grid grid-cols-2 gap-x-4"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div class="col-span-2 h-4" />
            <div class="col-span-2">
              <label class="mb-1 font-semibold" for={`plotName-${plot.id}`}>
                Name
              </label>
              <TextInput
                id={`plotName-${plot.id}`}
                class="w-full"
                value={plot.name}
                onChange={(x) => updatePlot({ ...plot, name: x }, "name")}
              />
            </div>
            <div class="col-span-2 h-4" />
            <div class="col-span-2">
              <label class="mb-1 font-semibold" for={`plotName-${plot.id}`}>
                Visible
              </label>
              <SelectInput
                class="text-primary pb-1 outline-none"
                options={["Visible", "Hidden"]}
                value={plot.visible ? "Visible" : "Hidden"}
                onChange={(x) =>
                  updatePlot({ ...plot, visible: x == "Visible" }, "visible")
                }
              />
            </div>
            <div class="col-span-2 h-4" />
            <label class="mb-1 font-semibold" for="exportName">
              Type
            </label>
            <label class="mb-1 font-semibold" for="exportName">
              Format
            </label>
            <SelectInput
              class="text-primary pb-1 outline-none"
              options={["bar", "line", "scatter", "pie"] as UserPlotType[]}
              value={plot.type}
              onChange={(x) => updatePlot({ ...plot, type: x }, "type")}
            />
            <SelectInput
              class="text-primary pb-1 outline-none"
              options={["CSV", "JSON"]}
            />
            <div class="col-span-2 h-2" />
            <label class="mb-1 font-semibold" for="exportName">
              X Key
            </label>
            <label class="mb-1 font-semibold" for="exportName">
              Y Key
            </label>
            <SelectInput
              class="text-primary pb-1 outline-none"
              options={["Range", ...plot.columns.map((x) => x.name)]}
              onChange={(x) => updatePlot({ ...plot, xKey: x }, "xKey")}
            />
            <SelectInput
              class="text-primary pb-1 outline-none"
              options={plot.columns.map((x) => x.name)}
              onChange={(x) => updatePlot({ ...plot, yKey: x }, "yKey")}
            />
            <div class="col-span-2 h-2" />
            <label class="mb-1 font-semibold" for="colorText">
              Color
            </label>
            <div />
            <div class="col-span-2 flex flex-row items-center justify-center">
              {/* TODO: Find some other color picker that doesnt break
              <SketchPicker
                color={plot.color}
                onChange={(c) => {
                  updatePlot({ ...plot, color: c.hex }, "color");
                }}
                presetColors={subplotColors}
                onSwatchHover={() => {}}
              />
              */}
              <ColorPicker
                out={(c: string) => {
                  updatePlot({ ...plot, color: c }, "color");
                }}
                value={plot.color}
              />
            </div>
            <div class="col-span-2 h-2" />
            <div class="col-span-2 h-8" />
            <div class="text-background cursor-pointer col-span-2 flex flex-row items-center gap-2 group">
              <div
                class="w-10 h-10 flex flex-row items-center justify-center rounded-full bg-red-500 grow-0 hover:bg-[#ff4d4d] hover:shadow-md"
                onClick={() => {
                  setDeleting(true);
                  setTimeout(() => {
                    if (deletePlot) {
                      deletePlot(plot.id);
                    }
                  }, 150);
                }}
              >
                <NoHydration>
                  <IoTrashBinOutline size={24} />
                </NoHydration>
              </div>
              <p class="text-red-500 grow font-body font-semibold group-hover:opacity-100 opacity-0 transition-opacity">
                Delete Plot?
              </p>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
