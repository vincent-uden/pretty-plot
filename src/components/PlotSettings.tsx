import { PlotType } from "plotly.js-basic-dist";
import { JSX, Signal } from "solid-js";
import { UserPlot } from "~/routes";

import { VsGraph, VsGraphLine, VsGraphScatter, VsQuestion } from "solid-icons/vs";
import { AiFillPieChart } from 'solid-icons/ai'
import { FaSolidChevronDown } from 'solid-icons/fa'
import { IconTypes } from "solid-icons";
import { NoHydration } from "solid-js/web";

type PlotSettingsProps = {
  plot: UserPlot;
}

function GraphIcon(type: PlotType, mode?: "markers" | "lines" | "lines+markers"): IconTypes {
  if (type == "bar") {
    return VsGraph;
  }
  if (type == "scatter" && (mode == "lines" || mode == "lines+markers")) {
    return VsGraphLine;
  }
  if (type == "scatter" && mode == "markers") {
    return VsGraphScatter;
  }
  if (type == "pie") {
    return AiFillPieChart;
  }

  return VsQuestion;
}

export default function PlotSettings({plot}: PlotSettingsProps) {
  const HeaderIcon = GraphIcon(plot.type, "lines");
  return (
    <div class="bg-white rounded-xl shadow-lg p-4 flex flex-col">
    <div class="flex flex-row gap-4 items-center">
      <NoHydration>
        <HeaderIcon size={24} />
      </NoHydration>
      <h2 class="grow text-xl">{plot.name}</h2>
      <NoHydration>
        <FaSolidChevronDown size={24} />
      </NoHydration>
    </div>
    </div>
  );
}
