import { createSignal, Show } from "solid-js";
import { UserPlot, UserPlotType } from "~/routes";

import { VsGraph, VsGraphLine, VsGraphScatter, VsQuestion } from "solid-icons/vs";
import { AiFillPieChart } from 'solid-icons/ai'
import { FaSolidChevronDown } from 'solid-icons/fa'
import { IconTypes } from "solid-icons";
import { NoHydration } from "solid-js/web";
import SelectInput from "./SelectInput";

type PlotSettingsProps = {
  plot: UserPlot;
  index: number;
  updatePlot?: (p: UserPlot, i: keyof UserPlot) => void;
}

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

export default function PlotSettings({plot, index, updatePlot: update}: PlotSettingsProps) {

  const updatePlot = update ? update : (p: UserPlot, i: keyof UserPlot) => {};
  const HeaderIcon = () => GraphIcon(plot.type);

  const [open, setOpen] = createSignal(false);

  return (
    <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col">
      <div class="flex flex-row gap-4 items-center select-none cursor-pointer" onClick={() => setOpen((x) => !x)}>
        {HeaderIcon()({size:24, color:plot.color})}
        <h2 class="grow text-xl" style={{color: plot.color}}>{plot.name}</h2>
        <NoHydration>
          <FaSolidChevronDown size={24} color={plot.color} />
        </NoHydration>
      </div>
      <Show when={open()} >
        <div class="grid grid-cols-2 gap-x-4">
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
              onChange={(x) => updatePlot({...plot, type: x}, "type")}
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
              onChange={(x) => updatePlot({...plot, xKey: x}, "xKey")}
            />
            <SelectInput
              class="text-primary pb-1 outline-none"
              options={plot.columns.map((x) => x.name)}
              onChange={(x) => updatePlot({...plot, yKey: x}, "yKey")}
            />
        </div>
      </Show>
    </div>
  );
}
