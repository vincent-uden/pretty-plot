import { ssr, ssrHydrationKey, escape, createComponent, NoHydration } from "solid-js/web";
import { createSignal, Show } from "solid-js";
import { I as IconTemplate, F as FaSolidChevronDown, T as TextInput, a as TextInput$1, b as IoTrashBinOutline } from "../index.js";
import "tailwind-merge";
import "papaparse";
import "solid-js/store";
import "./routes-e443b999.js";
function VsGraphLine(props) {
  return IconTemplate({
    a: {
      "fill": "currentColor",
      "viewBox": "0 0 16 16"
    },
    c: '<path d="M15 13v1H1.5l-.5-.5V0h1v13h13Z"/><path d="M13 3.207 7.854 8.354h-.708L5.5 6.707l-3.646 3.647-.708-.708 4-4h.708L7.5 7.293l5.146-5.147h.707l2 2-.707.708L13 3.207Z"/>'
  }, props);
}
function VsGraphScatter(props) {
  return IconTemplate({
    a: {
      "fill": "currentColor",
      "viewBox": "0 0 16 16"
    },
    c: '<path d="M15 13v1H1.5l-.5-.5V0h1v13h13Z"/><path d="M5 2H7V4H5z"/><path d="M12 1H14V3H12z"/><path d="M8 5H10V7H8z"/><path d="M5 9H7V11H5z"/><path d="M12 8H14V10H12z"/>'
  }, props);
}
function VsGraph(props) {
  return IconTemplate({
    a: {
      "fill": "currentColor",
      "viewBox": "0 0 16 16"
    },
    c: '<path fill-rule="evenodd" d="M1.5 14H15v-1H2V0H1v13.5l.5.5zM3 11.5v-8l.5-.5h2l.5.5v8l-.5.5h-2l-.5-.5zm2-.5V4H4v7h1zm6-9.5v10l.5.5h2l.5-.5v-10l-.5-.5h-2l-.5.5zm2 .5v9h-1V2h1zm-6 9.5v-6l.5-.5h2l.5.5v6l-.5.5h-2l-.5-.5zm2-.5V6H8v5h1z" clip-rule="evenodd"/>'
  }, props);
}
function VsQuestion(props) {
  return IconTemplate({
    a: {
      "fill": "currentColor",
      "viewBox": "0 0 16 16"
    },
    c: '<path fill-rule="evenodd" d="M7.5 1a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm1.55-8.42a1.84 1.84 0 0 0-.61-.42A2.25 2.25 0 0 0 7.53 4a2.16 2.16 0 0 0-.88.17c-.239.1-.45.254-.62.45a1.89 1.89 0 0 0-.38.62 3 3 0 0 0-.15.72h1.23a.84.84 0 0 1 .506-.741.72.72 0 0 1 .304-.049.86.86 0 0 1 .27 0 .64.64 0 0 1 .22.14.6.6 0 0 1 .16.22.73.73 0 0 1 .06.3c0 .173-.037.343-.11.5a2.4 2.4 0 0 1-.27.46l-.35.42c-.12.13-.24.27-.35.41a2.33 2.33 0 0 0-.27.45 1.18 1.18 0 0 0-.1.5v.66H8v-.49a.94.94 0 0 1 .11-.42 3.09 3.09 0 0 1 .28-.41l.36-.44a4.29 4.29 0 0 0 .36-.48 2.59 2.59 0 0 0 .28-.55 1.91 1.91 0 0 0 .11-.64 2.18 2.18 0 0 0-.1-.67 1.52 1.52 0 0 0-.35-.55zM6.8 9.83h1.17V11H6.8V9.83z" clip-rule="evenodd"/>'
  }, props);
}
function AiFillPieChart(props) {
  return IconTemplate({ a: { "viewBox": "0 0 1024 1024" }, c: '<path d="M863.1 518.5H505.5V160.9c0-4.4-3.6-8-8-8h-26a398.57 398.57 0 0 0-282.5 117 397.47 397.47 0 0 0-85.6 127C82.6 446.2 72 498.5 72 552.5S82.6 658.7 103.4 708c20.1 47.5 48.9 90.3 85.6 127 36.7 36.7 79.4 65.5 127 85.6a396.64 396.64 0 0 0 155.6 31.5 398.57 398.57 0 0 0 282.5-117c36.7-36.7 65.5-79.4 85.6-127a396.64 396.64 0 0 0 31.5-155.6v-26c-.1-4.4-3.7-8-8.1-8zM951 463l-2.6-28.2c-8.5-92-49.3-178.8-115.1-244.3A398.5 398.5 0 0 0 588.4 75.6L560.1 73c-4.7-.4-8.7 3.2-8.7 7.9v383.7c0 4.4 3.6 8 8 8l383.6-1c4.7-.1 8.4-4 8-8.6z"/>' }, props);
}
const _tmpl$ = ["<div", ' class="grid grid-cols-2 gap-x-4"><div class="col-span-2 h-4"></div><div class="col-span-2"><label class="mb-1 font-semibold" for="', '">Type</label><!--$-->', '<!--/--></div><div class="col-span-2 h-4"></div><label class="mb-1 font-semibold" for="exportName">Type</label><label class="mb-1 font-semibold" for="exportName">Format</label><!--$-->', "<!--/--><!--$-->", '<!--/--><div class="col-span-2 h-2"></div><label class="mb-1 font-semibold" for="exportName">X Key</label><label class="mb-1 font-semibold" for="exportName">Y Key</label><!--$-->', "<!--/--><!--$-->", '<!--/--><div class="col-span-2 h-2"></div><label class="mb-1 font-semibold" for="colorText">Color</label><div></div><div class="col-span-2 flex flex-row items-center justify-center"></div><div class="col-span-2 h-2"></div><div class="col-span-2 h-8"></div><div class="text-background cursor-pointer col-span-2 flex flex-row items-center gap-2 group"><div class="w-10 h-10 flex flex-row items-center justify-center rounded-full bg-red-500 grow-0 hover:bg-[#ff4d4d] hover:shadow-md">', '</div><p class="text-red-500 grow font-body font-semibold group-hover:opacity-100 opacity-0 transition-opacity">Delete Plot?</p></div></div>'], _tmpl$2 = ["<div", ' class="', '" style="', '"><div class="p-4 rounded-xl w-64"><div class="flex flex-row gap-4 items-center select-none cursor-pointer"><!--$-->', '<!--/--><h2 class="grow text-xl" style="', '">', "</h2><!--$-->", "<!--/--></div><!--$-->", "<!--/--></div></div>"];
const subplotColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
function GraphIcon(type) {
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
function PlotSettings({
  plot,
  index,
  updatePlot: update,
  onClick,
  headerClickable,
  forceClose,
  deletePlot
}) {
  const updatePlot = update ? update : (p, i) => {
  };
  const HeaderIcon = () => GraphIcon(plot.type);
  const [open, setOpen] = createSignal(false);
  const [deleting, setDeleting] = createSignal(false);
  return ssr(_tmpl$2, ssrHydrationKey(), `bg-white rounded-xl shadow-lg flex flex-col border-4 ${deleting() ? "translate-x-full" : "translate-x-0"} transition-transform`, "border-color:" + ((escape(subplotColors[plot.subplot ?? -1], true) ?? "#ffffff") + "55"), escape(HeaderIcon()({
    size: 24,
    color: plot.color
  })), "color:" + escape(plot.color, true), escape(plot.name), escape(createComponent(NoHydration, {
    get children() {
      return createComponent(FaSolidChevronDown, {
        size: 24,
        get color() {
          return plot.color;
        }
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return open() && !(forceClose ?? (() => false))();
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), `plotName-${escape(plot.id, true)}`, escape(createComponent(TextInput, {
        get id() {
          return `plotName-${plot.id}`;
        },
        "class": "w-full",
        get placeholder() {
          return plot.name;
        },
        onChange: (x) => updatePlot({
          ...plot,
          name: x
        }, "name")
      })), escape(createComponent(TextInput$1, {
        "class": "text-primary pb-1 outline-none",
        options: ["bar", "line", "scatter", "pie"],
        get value() {
          return plot.type;
        },
        onChange: (x) => updatePlot({
          ...plot,
          type: x
        }, "type")
      })), escape(createComponent(TextInput$1, {
        "class": "text-primary pb-1 outline-none",
        options: ["CSV", "JSON"]
      })), escape(createComponent(TextInput$1, {
        "class": "text-primary pb-1 outline-none",
        get options() {
          return ["Range", ...plot.columns.map((x) => x.name)];
        },
        onChange: (x) => updatePlot({
          ...plot,
          xKey: x
        }, "xKey")
      })), escape(createComponent(TextInput$1, {
        "class": "text-primary pb-1 outline-none",
        get options() {
          return plot.columns.map((x) => x.name);
        },
        onChange: (x) => updatePlot({
          ...plot,
          yKey: x
        }, "yKey")
      })), escape(createComponent(NoHydration, {
        get children() {
          return createComponent(IoTrashBinOutline, {
            size: 24
          });
        }
      })));
    }
  })));
}
export {
  PlotSettings as default
};
