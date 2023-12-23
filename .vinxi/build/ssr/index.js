import { isServer, mergeProps, ssrElement, escape, ssr, ssrHydrationKey, ssrAttribute, createComponent, NoHydration } from "solid-js/web";
import { createSignal, splitProps, sharedConfig, onMount, createMemo, untrack, createEffect, onCleanup, Show, For } from "solid-js";
import { twMerge } from "tailwind-merge";
import Papa from "papaparse";
import { createStore, produce } from "solid-js/store";
import "./assets/routes-e443b999.js";
function clientOnly(fn) {
  if (isServer)
    return (props) => props.fallback;
  const [comp, setComp] = createSignal();
  fn().then((m) => setComp(() => m.default));
  return (props) => {
    let Comp;
    let m;
    const [, rest] = splitProps(props, ["fallback"]);
    if ((Comp = comp()) && !sharedConfig.context)
      return Comp(rest);
    const [mounted, setMounted] = createSignal(!sharedConfig.context);
    onMount(() => setMounted(true));
    return createMemo(() => (Comp = comp(), m = mounted(), untrack(() => Comp && m ? Comp(rest) : props.fallback)));
  };
}
function IconTemplate(iconSrc, props) {
  const mergedProps = mergeProps(iconSrc.a, props);
  const [_, svgProps] = splitProps(mergedProps, ["src"]);
  const [content, setContent] = createSignal("");
  const rawContent = createMemo(() => props.title ? `${iconSrc.c}<title>${props.title}</title>` : iconSrc.c);
  createEffect(() => setContent(rawContent()));
  onCleanup(() => {
    setContent("");
  });
  return ssrElement("svg", mergeProps({
    get stroke() {
      return iconSrc.a?.stroke;
    },
    get color() {
      return props.color || "currentColor";
    },
    get fill() {
      return props.color || "currentColor";
    },
    "stroke-width": "0",
    get style() {
      return {
        ...props.style,
        overflow: "visible"
      };
    }
  }, svgProps, {
    get height() {
      return props.size || "1em";
    },
    get width() {
      return props.size || "1em";
    },
    xmlns: "http://www.w3.org/2000/svg",
    get innerHTML() {
      return content();
    }
  }), () => isServer && escape(ssr(rawContent())), true);
}
function TbFileExport(props) {
  return IconTemplate({ a: { "xmlns": "http://www.w3.org/2000/svg", "class": "icon icon-tabler icon-tabler-file-export", "width": "24", "height": "24", "viewBox": "0 0 24 24", "stroke-width": "2", "stroke": "currentColor", "fill": "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, c: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3"/>' }, props);
}
function IoAddCircle(props) {
  return IconTemplate({ a: { "viewBox": "0 0 512 512" }, c: '<path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48Zm80 224h-64v64a16 16 0 0 1-32 0v-64h-64a16 16 0 0 1 0-32h64v-64a16 16 0 0 1 32 0v64h64a16 16 0 0 1 0 32Z"/>' }, props);
}
function IoClose(props) {
  return IconTemplate({ a: { "viewBox": "0 0 512 512" }, c: '<path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34Z"/>' }, props);
}
function IoRemoveCircle(props) {
  return IconTemplate({ a: { "viewBox": "0 0 512 512" }, c: '<path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48Zm80 224H176a16 16 0 0 1 0-32h160a16 16 0 0 1 0 32Z"/>' }, props);
}
function IoTrashBinOutline(props) {
  return IconTemplate({ a: { "viewBox": "0 0 512 512" }, c: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m432 144-28.67 275.74A32 32 0 0 1 371.55 448H140.46a32 32 0 0 1-31.78-28.26L80 144"/><rect width="448" height="80" x="32" y="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="16" ry="16"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M312 240 200 352"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M312 352 200 240"/>' }, props);
}
function ImCross(props) {
  return IconTemplate({
    a: {
      "viewBox": "0 0 16 16"
    },
    c: '<path fill="currentColor" d="M15.854 12.854 11 8l4.854-4.854a.503.503 0 0 0 0-.707L13.561.146a.499.499 0 0 0-.707 0L8 5 3.146.146a.5.5 0 0 0-.707 0L.146 2.439a.499.499 0 0 0 0 .707L5 8 .146 12.854a.5.5 0 0 0 0 .707l2.293 2.293a.499.499 0 0 0 .707 0L8 11l4.854 4.854a.5.5 0 0 0 .707 0l2.293-2.293a.499.499 0 0 0 0-.707z"/>'
  }, props);
}
function FaSolidArrowRightLong(props) {
  return IconTemplate({ a: { "viewBox": "0 0 512 512" }, c: '<path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l73.4 73.4H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h370.7l-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/>' }, props);
}
function FaSolidChevronDown(props) {
  return IconTemplate({ a: { "viewBox": "0 0 512 512" }, c: '<path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>' }, props);
}
function FaSolidQuestion(props) {
  return IconTemplate({ a: { "viewBox": "0 0 320 512" }, c: '<path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1a87.983 87.983 0 0 0-40.4 74v1.5c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128h-32C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/>' }, props);
}
const _tmpl$$5 = ["<button", ' class="bg-accent text-white font-body py-4 px-8 rounded-full shadow-lg hover:bg-accent-active transition-colors">', "</button>"];
function ConfirmButton(props) {
  return ssr(_tmpl$$5, ssrHydrationKey(), escape(props.children));
}
const _tmpl$$4 = ["<input", ' type="text"', ">"];
function TextInput$1(props) {
  return ssr(_tmpl$$4, ssrHydrationKey() + ssrAttribute("class", escape(twMerge("border-gray-200 border-2 rounded px-1 focus:border-primary outline-none transition-colors w-0", props.class), true), false) + ssrAttribute("id", escape(props.id, true) ?? "", false), ssrAttribute("placeholder", escape(props.placeholder, true) ?? "", false) + ssrAttribute("value", escape(props.value, true) ?? "", false));
}
const _tmpl$$3 = ["<div", ' class="absolute z-10 border-2 border-gray-200 -right-[2px] -left-[2px] -top-[2px] rounded px-1 pt-1 shadow flex flex-col gap-1 bg-zinc-50">', "</div>"], _tmpl$2$2 = ["<div", '><p class="grow">', "</p><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$3$2 = ["<div", ' class="">', "</div>"];
function TextInput(props) {
  const [selectedOption, setSelectedOption] = createSignal(props.value ?? props?.options?.at(0) ?? "");
  const [selecting, setSelecting] = createSignal(false);
  createEffect(() => {
    if (props.out) {
      props.out(selectedOption());
    }
  });
  return ssr(_tmpl$2$2, ssrHydrationKey() + ssrAttribute("class", escape(twMerge("border-gray-200 border-2 rounded px-1 focus:border-primary outline-none transition-colors bg-transparent pt-1 relative cursor-pointer flex flex-row", props.class), true), false) + ssrAttribute("id", escape(props.id, true) ?? "", false), "" + escape(selectedOption()), escape(createComponent(NoHydration, {
    get children() {
      return createComponent(FaSolidChevronDown, {});
    }
  })), escape(createComponent(Show, {
    get when() {
      return selecting();
    },
    get children() {
      return ssr(_tmpl$$3, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return props.options;
        },
        children: (opt, i) => ssr(_tmpl$3$2, ssrHydrationKey(), "" + escape(opt))
      })));
    }
  })));
}
const _tmpl$$2 = ["<div", ' class="', '" style="', '">', "</div>"], _tmpl$2$1 = ["<div", ' class="flex flex-col items-center overflow-x-hidden overflow-y-auto custom-scroll py-4 min-h-full"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$3$1 = ["<div", ' class="', '">', "</div>"];
function DraggableList(props) {
  props.dragDelay ?? 100;
  const items = props.items;
  const setItems = props.itemsSetter;
  const [grabbed, setGrabbed] = createSignal(null);
  const [mousePos, setMousePos] = createSignal([0, 0]);
  const [itemYs, setItemYs] = createSignal([]);
  const [transitionsActive, setTransitionsActive] = createSignal(false);
  function move(input, from, to) {
    let numberOfDeletedElm = 1;
    const elm = input.splice(from, numberOfDeletedElm)[0];
    numberOfDeletedElm = 0;
    input.splice(to, numberOfDeletedElm, elm);
  }
  function drop() {
    if (props.onDrop) {
      props.onDrop();
    }
    let y = mousePos()[1];
    let j = 0;
    for (const child of []) {
      if (j < items().length) {
        if (child.getBoundingClientRect().y > y) {
          if (j != grabbed()) {
            setItems((arr) => {
              let out = [...arr];
              if (j > grabbed()) {
                move(out, grabbed(), j - 1);
              } else {
                move(out, grabbed(), j);
              }
              return out;
            });
            return;
          }
        }
      }
      j++;
    }
    setItems((arr) => {
      let out = [...arr];
      move(out, grabbed(), j);
      return out;
    });
  }
  createEffect(() => {
    if (grabbed() != null) {
      setTimeout(() => {
        setTransitionsActive(true);
      }, 5);
    } else {
      setTransitionsActive(false);
    }
  });
  onMount(() => {
    document.body.addEventListener("mouseup", () => {
      if (grabbed() != null) {
        drop();
        setGrabbed(null);
      }
    });
    document.body.addEventListener("mousemove", (e) => {
      setMousePos([e.clientX, e.clientY]);
    });
  });
  return ssr(_tmpl$2$1, ssrHydrationKey(), escape(createComponent(For, {
    get each() {
      return items();
    },
    children: (item, i) => {
      return ssr(_tmpl$3$1, ssrHydrationKey(), `cursor-grab select-none ${i() == grabbed() ? "opacity-0 h-0" : "opacity-100"} ${(itemYs()[i()] ?? -1) < mousePos()[1] || grabbed() == null ? "translate-y-0" : "translate-y-[100%]"} ${transitionsActive() ? "transition-transform" : ""}`, escape(props.renderItem({
        item,
        index: i()
      })));
    }
  })), escape(createComponent(Show, {
    get when() {
      return grabbed() != null;
    },
    get children() {
      return ssr(_tmpl$$2, ssrHydrationKey(), `fixed top-0 left-0`, `transform:translate(${escape(mousePos()[0], true)}px, ${escape(mousePos()[1], true)}px)`, escape(props.renderItem({
        item: items()[grabbed()],
        index: grabbed()
      })));
    }
  })));
}
const _tmpl$$1 = ["<div", ' class="relative select-none"><div class="h-1 bg-gray-200 rounded-full select-none"></div><div class="absolute bg-accent w-4 h-4 top-1/2 rounded-full shadow hover:bg-accent-active select-none" style="', '"></div><div class="absolute w-4 h-4 top-1/2 select-none" style="', '"><p>', "</p></div></div>"];
function SlideInput(props) {
  const [pos, setPos] = createSignal(0);
  let trackRef;
  function nanFallback(x) {
    if (isNaN(x)) {
      return props.from.toFixed(2);
    }
    return x.toFixed(2);
  }
  return ssr(_tmpl$$1, ssrHydrationKey(), `transform:translate(calc(${escape(pos(), true)}px - 0.5rem), -50%)`, `transform:translate(calc(${escape(pos(), true)}px - 0.5rem - 50%), 50%)`, escape(nanFallback(pos() / trackRef.getBoundingClientRect().width * (props.to - props.from) + props.from)));
}
const TestSVG = "/assets/test-bfa23dcf.svg";
const _tmpl$ = ["<div", ' class="w-8 h-8">', "</div>"], _tmpl$2 = ["<div", ' class="h-4"></div>'], _tmpl$3 = ["<p", ' class="text-body text-lg">Margin</p>'], _tmpl$4 = ["<div", ' class="h-2"></div>'], _tmpl$5 = ["<div", ' class="px-4">', "</div>"], _tmpl$6 = ["<div", ' class="h-8"></div>'], _tmpl$7 = ["<main", ' class="mx-auto text-gray-700 p-4"><div class="flex flex-row items-center mb-4"><h1 class="max-6-xs text-2xl font-heading uppercase font-extrabold grow"><span class="bg-gradient-to-r from-primary to-accent-active inline-block text-transparent bg-clip-text text-6xl">Plot</span><span class="text-accent opacity-50">.vincentuden.xyz</span></h1><div class="relative w-12 h-12 text-background cursor-pointer overflow-hidden bg-primary rounded-full"><div class="', '">', '</div><div class="', '">', '</div></div></div><div class="flex flex-row gap-8"><aside class="flex flex-col grow-0 basis-64 relative"><textarea id="csvDropZone" class="bg-white shadow-lg rounded-xl p-4 resize-none outline-none" placeholder="Paste your data here (csv, json)"', '></textarea><div class="', '"><p class="absolute left-16 w-48 font-hand text-red-600 text-center">Enter your data in this box by copy-paste or drag-and-drop an entire file.</p><img class="w-16 h-auto rotate-[-15deg] translate-y-4"', '></div><div class="h-4"></div><!--$-->', '<!--/--><div class="h-8"></div><div class="bg-white rounded-xl shadow-lg p-4 flex flex-col"><div class="flex flex-row gap-4 mb-4"><h2 class="grow text-primary text-xl">Export Options</h2><!--$-->', '<!--/--></div><label class="mb-1 font-semibold" for="exportName">File Name</label><!--$-->', '<!--/--><div class="h-2"></div><label class="mb-1 font-semibold" for="exportFormat">Format</label><!--$-->', '<!--/--></div><div class="h-4"></div><!--$-->', '<!--/--><div class="h-8"></div><div class="bg-white rounded-xl shadow-lg p-4 flex flex-col"><h2 class="grow text-primary text-xl">Plot Options</h2><div class="h-4"></div><label class="mb-1 font-semibold" for="plotTitle">Title</label><!--$-->', '<!--/--><div class="h-2"></div><label class="mb-1 font-semibold">Dimensions</label><div class="flex flex-row items-center gap-2"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div><div class="h-2"></div><!--$-->', '<!--/--><div class="flex flex-row gap-8 mt-2"><label class="grow font-semibold" for="showLegend">Show Legend</label><input type="checkbox" id="showLegend"></div></div></aside><div class="grow"><div class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">', '</div><div class="h-4"></div><div class="flex flex-row rounded-t-xl gap-2">', "</div><!--$-->", '<!--/--><div class="', '"><label class="mb-1 font-semibold">Grid</label><label class="mb-1 font-semibold">Limits</label><div class="flex flex-row items-center gap-2"><label class="font-semibold text-blue-300" for="xGrid">X</label><!--$-->', '<!--/--></div><div class="flex flex-row items-center gap-2"><label class="font-semibold text-blue-300">X</label><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div><div class="flex flex-row items-center gap-2"><label class="font-semibold text-blue-300" for="yGrid">Y</label><!--$-->', '<!--/--></div><div class="flex flex-row items-center gap-2"><label class="font-semibold text-blue-300">Y</label><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div><label class="mb-1 font-semibold col-span-2">Labels</label><!--$-->', "<!--/--><!--$-->", '<!--/--></div></div><aside class="basis-64"><div class="relative bg-white rounded-xl p-4 shadow-lg"><div class="', '"><p class="absolute w-48 font-hand text-red-600 text-center">Create subplots by adding them here. Then select a category (indicated by a color) and "paint" each plot below to group them into the correct subplot.</p><div class="w-16 h-16 translate-x-48 -scale-x-100 rotate-45"><img class="w-16 h-16 "', '></div></div><p class="mb-2 text-primary text-xl">Subplots</p><div class="flex flex-row flex-wrap gap-2"><!--$-->', '<!--/--><div class="', '">', "</div><!--$-->", "<!--/--></div><!--$-->", '<!--/--></div><div class="h-4"></div><div class="h-4 w-full rounded-full bg-accent-active shadow-lg"></div><div class="flex flex-col h-[70vh] overflow-y-hidden"><div class="', `"><p class="absolute w-48 font-hand text-red-600 text-center">Added plots show up here. Drag to change the ordering and click on an entry to edit it's individual settings.</p><img class="w-16 h-auto rotate-[-165deg] translate-y-28 translate-x-32"`, "></div><!--$-->", "<!--/--></div></aside></div></main>"], _tmpl$8 = ["<p", "></p>"], _tmpl$9 = ["<div", ' class="', '"><p class="', '">', '</p><div class="w-8 h-8 rounded-full opacity-70" style="', '"></div></div>'], _tmpl$10 = ["<div", ' class="', '"><label class="mb-1 font-semibold">Grid</label><label class="mb-1 font-semibold">Limits</label><div class="flex flex-row items-center gap-2"><label class="font-semibold text-blue-300" for="xGrid">X</label><!--$-->', '<!--/--></div><div class="flex flex-row items-center gap-2"><label class="font-semibold text-blue-300">X</label><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div><div class="flex flex-row items-center gap-2"><label class="font-semibold text-blue-300" for="yGrid">Y</label><!--$-->', '<!--/--></div><div class="flex flex-row items-center gap-2"><label class="font-semibold text-blue-300">Y</label><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div><div class="cols-2 h-2"></div><label class="mb-1 font-semibold col-span-2">Labels</label><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$11 = ["<div", ' class="', '" style="', '"></div>'];
const Plot = clientOnly(() => import("./assets/Plot-bc29cc8e.js"));
const PlotSettings = clientOnly(() => import("./assets/PlotSettings-721a1c20.js"));
function Home() {
  const standardColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
  const subplotColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
  function userToPlotly(plot) {
    let trace = {
      x: [],
      y: [],
      type: plot.type,
      mode: "",
      color: plot.color,
      name: plot.name,
      xaxis: "x",
      yaxis: "y"
    };
    if (plot.type == "line") {
      trace.type = "scatter";
      trace.mode = "lines";
      trace.line = {
        color: plot.color
      };
    } else if (plot.type == "scatter") {
      trace.type = "scatter";
      trace.mode = "markers";
    }
    if (plot.type != "line") {
      trace.marker = {
        color: plot.color
      };
    }
    let xCol = void 0;
    for (const col of plot.columns) {
      if (col.name == plot.xKey) {
        xCol = col;
      }
    }
    let yCol = void 0;
    for (const col of plot.columns) {
      if (col.name == plot.yKey) {
        yCol = col;
      }
    }
    if (yCol !== void 0 && xCol === void 0) {
      xCol = {
        name: "Range",
        data: []
      };
      for (let i = 0; i < yCol.data.length; i++) {
        xCol.data.push(i);
      }
    }
    if (yCol != void 0 && xCol != void 0) {
      trace.x = xCol.data;
      trace.y = yCol.data;
    }
    if (plot.subplot && plot.subplot > 0) {
      trace.xaxis += plot.subplot;
      trace.yaxis += plot.subplot;
    }
    return trace;
  }
  function csvToPlot(csvStr, name, index2) {
    let output = {
      name,
      color: standardColors[index2 % standardColors.length],
      xKey: "",
      yKey: "",
      columns: [],
      type: "scatter",
      id: (/* @__PURE__ */ new Date()).getMilliseconds(),
      subplot: null
    };
    const csv = Papa.parse(csvStr, {
      header: true
    });
    for (const header of csv.meta.fields ?? []) {
      let col = {
        name: header,
        data: []
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
  function dimToPixels(x, unit) {
    if (unit == "Inches") {
      return x * 100;
    }
    if (unit == "Centimeters") {
      return x / 2.54 * 100;
    }
    return x;
  }
  function maxMargin(n) {
    return 1 / Math.max(n - 1, 1);
  }
  const defaultOps = {
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
    showLegend: false
  };
  function generateLayout(plotOptions2, subplots2, spOptions2, options) {
    let output = {
      autosize: false,
      title: {
        text: plotOptions2.title
      },
      font: {
        family: "Computer Modern"
      },
      showlegend: plotOptions2.showLegend
    };
    if (subplots2.length == 0) {
      output["xaxis"] = {
        title: {
          text: plotOptions2.xLabel
        },
        showgrid: plotOptions2.gridX
      };
      output["yaxis"] = {
        title: {
          text: plotOptions2.yLabel
        },
        showgrid: plotOptions2.gridY
      };
      if (plotOptions2.xLim != null) {
        output["xaxis"]["range"] = plotOptions2.xLim;
      }
      if (plotOptions2.yLim != null) {
        output["yaxis"]["range"] = plotOptions2.yLim;
      }
    }
    const margin = options.subplotMargin ?? 0.1;
    const N = subplots2.length;
    const width = (1 - (N - 1) * margin) / N;
    let j = 0;
    for (const sp of subplots2) {
      output["xaxis" + sp] = {
        domain: [width * j + (j > 0 ? 1 : 0) * margin * j, width * j + (j > 0 ? 1 : 0) * margin * j + width],
        anchor: "y" + sp,
        range: (spOptions2[j] ?? defaultOps).xLim,
        title: {
          text: (spOptions2[j] ?? defaultOps).xLabel
        },
        showgrid: (spOptions2[j] ?? defaultOps).gridX
      };
      output["yaxis" + sp] = {
        domain: [0, 1],
        anchor: "x" + sp,
        range: (spOptions2[j] ?? defaultOps).yLim,
        title: {
          text: (spOptions2[j] ?? defaultOps).yLabel
        },
        showgrid: (spOptions2[j] ?? defaultOps).gridY
      };
      j++;
    }
    return output;
  }
  const [plots, setPlots] = createStore([]);
  const [dataInput, setDataInput] = createSignal("");
  const [plotOptions, setPlotOptions] = createSignal({
    ...defaultOps
  });
  const [outputName, setOutputName] = createSignal("plot");
  const [outputFormat, setOutputFormat] = createSignal("SVG");
  const [subplots, setSubplots] = createSignal([]);
  const [paintingSubplot, setPaintingSubplot] = createSignal(null);
  const [spOptIndex, setSPOptIndex] = createSignal(null);
  const [spOptions, setSpOptions] = createSignal([]);
  const [spMargin, setSPMargin] = createSignal(0.1);
  const [dragging, setDragging] = createSignal(false);
  const [helpVisible, setHelpVisible] = createSignal(false);
  function updatePlot(p, field) {
    setPlots(
      (x) => x.id == p.id,
      // @ts-ignore
      produce((plot) => plot[field] = p[field])
    );
  }
  function deletePlot(plotId) {
    setPlots((list) => list.filter((p) => p.id != plotId));
  }
  function editPlotOption(key, value) {
    if (spOptIndex() == null) {
      setPlotOptions((po) => {
        return {
          ...po,
          [key]: value
        };
      });
    } else {
      setSpOptions((options) => {
        return options.map((po, i) => {
          if (i == spOptIndex()) {
            return {
              ...po,
              [key]: value
            };
          } else {
            return po;
          }
        });
      });
    }
  }
  onMount(() => {
    window["MathJax"] = {
      tex: {
        inlineMath: [["$", "$"]]
      }
    };
  });
  createEffect(() => {
    console.log(plotOptions());
  });
  const subplotColors2 = subplotColors;
  return ssr(_tmpl$7, ssrHydrationKey(), `absolute left-2 top-2 ${helpVisible() ? "-translate-y-48" : "translate-y-0"} transition-transform`, escape(createComponent(NoHydration, {
    get children() {
      return createComponent(FaSolidQuestion, {
        size: 32
      });
    }
  })), `absolute left-[8.5px] top-[8.5px] scale-125 ${helpVisible() ? "translate-x-0" : "translate-x-48"} transition-transform`, escape(createComponent(NoHydration, {
    get children() {
      return createComponent(IoClose, {
        size: 32
      });
    }
  })), ssrAttribute("value", escape(dataInput(), true), false), `absolute left-48 translate-x-10 transition-opacity ${helpVisible() ? "opacity-100" : "opacity-0"}`, ssrAttribute("src", escape(TestSVG, true), false), escape(createComponent(ConfirmButton, {
    onClick: () => {
      setPlots((x) => [...x, csvToPlot(dataInput(), "New Plot", x.length)]);
    },
    children: "Add Plot"
  })), escape(createComponent(NoHydration, {
    get children() {
      return createComponent(TbFileExport, {
        "class": "grow-0 text-primary",
        size: 24
      });
    }
  })), escape(createComponent(TextInput$1, {
    id: "exportName",
    "class": "font-mono text-primary w-full",
    value: "plot",
    out: setOutputName
  })), escape(createComponent(TextInput, {
    id: "exportFormat",
    "class": "font-mono text-primary",
    out: setOutputFormat,
    options: ["SVG", "PNG"]
  })), escape(createComponent(ConfirmButton, {
    onClick: () => {
      let allBtns = document.getElementsByClassName("modebar-btn");
      for (const btn of allBtns) {
        if (btn.getAttribute("data-title")?.startsWith("SVG_EXPORT")) {
          btn.click();
        }
      }
    },
    children: "Download"
  })), escape(createComponent(TextInput$1, {
    id: "plotTitle",
    "class": "text-primary pb-1 outline-none w-full",
    placeholder: "My Plot",
    value: "",
    onChange: (x) => {
      console.log(x);
      setPlotOptions((po) => {
        return {
          ...po,
          title: x
        };
      });
    }
  })), escape(createComponent(TextInput$1, {
    "class": "text-primary pb-1 outline-none grow",
    value: "6",
    onChange: (x) => {
      setPlotOptions((po) => {
        return {
          ...po,
          width: parseInt(x, 0)
        };
      });
    }
  })), escape(createComponent(NoHydration, {
    get children() {
      return createComponent(ImCross, {
        "class": "text-accent"
      });
    }
  })), escape(createComponent(TextInput$1, {
    "class": "text-primary pb-1 outline-none grow",
    value: "4",
    onChange: (x) => {
      setPlotOptions((po) => {
        return {
          ...po,
          height: parseInt(x, 0)
        };
      });
    }
  })), escape(createComponent(TextInput, {
    "class": "text-primary pb-1 outline-none",
    options: ["Inches", "Pixels", "Centimeters"],
    onChange: (x) => (
      //@ts-ignore
      setPlotOptions((po) => {
        return {
          ...po,
          dimUnit: x
        };
      })
    )
  })), escape(createComponent(Plot, {
    get data() {
      return plots.map(userToPlotly);
    },
    get fallback() {
      return ssr(_tmpl$8, ssrHydrationKey());
    },
    get width() {
      return dimToPixels(plotOptions().width, plotOptions().dimUnit);
    },
    get height() {
      return dimToPixels(plotOptions().height, plotOptions().dimUnit);
    },
    get layout() {
      return generateLayout(plotOptions(), subplots(), spOptions(), {
        subplotMargin: spMargin()
      });
    },
    get exportName() {
      return outputName();
    },
    get exportFormat() {
      return outputFormat().toLowerCase();
    }
  })), escape(createComponent(For, {
    get each() {
      return subplots();
    },
    children: (sp, i) => {
      return ssr(_tmpl$9, ssrHydrationKey(), `grow flex flex-row rounded-t-xl bg-white items-center px-4 cursor-pointer select-none ${i() == spOptIndex() ? "opacity-100" : "opacity-50"}`, `grow py-4 px-2`, subplots().length > 6 ? escape(i()) : "Subplot " + escape(i()), "background-color:" + escape(subplotColors2[sp], true));
    }
  })), escape(createComponent(For, {
    get each() {
      return subplots();
    },
    children: (x, i) => ssr(_tmpl$10, ssrHydrationKey(), `bg-white rounded-b-xl shadow-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 ${i() == spOptIndex() ? "" : "hidden"}`, escape(createComponent(TextInput, {
      id: "xGrid",
      "class": "text-primary pb-1 outline-none grow",
      options: ["Yes", "No"],
      onChange: (x2) => {
        editPlotOption("gridX", x2 == "Yes");
      }
    })), escape(createComponent(TextInput$1, {
      "class": "text-primary pb-1 outline-none grow",
      placeholder: "Auto",
      onChange: (x2) => {
        if (spOptIndex() == null) {
          setPlotOptions((po) => {
            let obj = {
              ...po
            };
            if (obj.xLim) {
              obj.xLim[0] = parseInt(x2, 0);
            } else {
              obj.xLim = [parseInt(x2, 0), null];
            }
            if (x2 == "") {
              obj.xLim = null;
            }
            return obj;
          });
        } else {
          setSpOptions((options) => {
            return options.map((po, i2) => {
              if (i2 == spOptIndex()) {
                let obj = {
                  ...po
                };
                if (obj.xLim) {
                  obj.xLim[0] = parseInt(x2, 0);
                } else {
                  obj.xLim = [parseInt(x2, 0), null];
                }
                if (x2 == "") {
                  obj.xLim = null;
                }
                return obj;
              } else {
                return po;
              }
            });
          });
        }
      }
    })), escape(createComponent(NoHydration, {
      get children() {
        return createComponent(FaSolidArrowRightLong, {
          "class": "text-accent"
        });
      }
    })), escape(createComponent(TextInput$1, {
      "class": "text-primary pb-1 outline-none grow",
      placeholder: "Auto",
      onChange: (x2) => {
        if (spOptIndex() == null) {
          setPlotOptions((po) => {
            let obj = {
              ...po
            };
            if (obj.xLim) {
              obj.xLim[1] = parseInt(x2, 0);
            } else {
              obj.xLim = [null, parseInt(x2, 0)];
            }
            if (x2 == "") {
              obj.xLim = null;
            }
            return obj;
          });
        } else {
          setSpOptions((options) => {
            return options.map((po, i2) => {
              if (i2 == spOptIndex()) {
                let obj = {
                  ...po
                };
                if (obj.xLim) {
                  obj.xLim[1] = parseInt(x2, 0);
                } else {
                  obj.xLim = [null, parseInt(x2, 0)];
                }
                if (x2 == "") {
                  obj.xLim = null;
                }
                return obj;
              } else {
                return po;
              }
            });
          });
        }
      }
    })), escape(createComponent(TextInput, {
      id: "yGrid",
      "class": "text-primary pb-1 outline-none grow",
      options: ["Yes", "No"],
      onChange: (x2) => {
        editPlotOption("gridY", x2 == "Yes");
      }
    })), escape(createComponent(TextInput$1, {
      "class": "text-primary pb-1 outline-none grow",
      placeholder: "Auto",
      onChange: (x2) => {
        if (spOptIndex() == null) {
          setPlotOptions((po) => {
            let obj = {
              ...po
            };
            if (obj.yLim) {
              obj.yLim[0] = parseInt(x2, 0);
            } else {
              obj.yLim = [parseInt(x2, 0), null];
            }
            if (x2 == "") {
              obj.yLim = null;
            }
            return obj;
          });
        } else {
          setSpOptions((options) => {
            return options.map((po, i2) => {
              if (i2 == spOptIndex()) {
                let obj = {
                  ...po
                };
                if (obj.yLim) {
                  obj.yLim[0] = parseInt(x2, 0);
                } else {
                  obj.yLim = [parseInt(x2, 0), null];
                }
                if (x2 == "") {
                  obj.yLim = null;
                }
                return obj;
              } else {
                return po;
              }
            });
          });
        }
      }
    })), escape(createComponent(NoHydration, {
      get children() {
        return createComponent(FaSolidArrowRightLong, {
          "class": "text-accent"
        });
      }
    })), escape(createComponent(TextInput$1, {
      "class": "text-primary pb-1 outline-none grow",
      placeholder: "Auto",
      onChange: (x2) => {
        if (spOptIndex() == null) {
          setPlotOptions((po) => {
            let obj = {
              ...po
            };
            if (obj.yLim) {
              obj.yLim[1] = parseInt(x2, 0);
            } else {
              obj.yLim = [null, parseInt(x2, 0)];
            }
            if (x2 == "") {
              obj.yLim = null;
            }
            return obj;
          });
        } else {
          setSpOptions((options) => {
            return options.map((po, i2) => {
              if (i2 == spOptIndex()) {
                let obj = {
                  ...po
                };
                if (obj.yLim) {
                  obj.yLim[1] = parseInt(x2, 0);
                } else {
                  obj.yLim = [null, parseInt(x2, 0)];
                }
                if (x2 == "") {
                  obj.yLim = null;
                }
                return obj;
              } else {
                return po;
              }
            });
          });
        }
      }
    })), escape(createComponent(TextInput$1, {
      "class": "text-primary pb-1 outline-none w-full",
      placeholder: "X Label",
      onChange: (x2) => editPlotOption("xLabel", x2)
    })), escape(createComponent(TextInput$1, {
      "class": "text-primary pb-1 outline-none w-full",
      placeholder: "Y Label",
      onChange: (x2) => editPlotOption("yLabel", x2)
    })))
  })), `bg-white rounded-b-xl shadow-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 ${spOptIndex() == null ? "" : "hidden"}`, escape(createComponent(TextInput, {
    id: "xGrid",
    "class": "text-primary pb-1 outline-none grow",
    options: ["Yes", "No"],
    onChange: (x) => {
      editPlotOption("gridX", x == "Yes");
    }
  })), escape(createComponent(TextInput$1, {
    "class": "text-primary pb-1 outline-none grow",
    placeholder: "Auto",
    onChange: (x) => {
      if (spOptIndex() == null) {
        setPlotOptions((po) => {
          let obj = {
            ...po
          };
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
              let obj = {
                ...po
              };
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
    }
  })), escape(createComponent(NoHydration, {
    get children() {
      return createComponent(FaSolidArrowRightLong, {
        "class": "text-accent"
      });
    }
  })), escape(createComponent(TextInput$1, {
    "class": "text-primary pb-1 outline-none grow",
    placeholder: "Auto",
    onChange: (x) => {
      if (spOptIndex() == null) {
        setPlotOptions((po) => {
          let obj = {
            ...po
          };
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
              let obj = {
                ...po
              };
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
    }
  })), escape(createComponent(TextInput, {
    id: "yGrid",
    "class": "text-primary pb-1 outline-none grow",
    options: ["Yes", "No"],
    onChange: (x) => {
      editPlotOption("gridY", x == "Yes");
    }
  })), escape(createComponent(TextInput$1, {
    "class": "text-primary pb-1 outline-none grow",
    placeholder: "Auto",
    onChange: (x) => {
      if (spOptIndex() == null) {
        setPlotOptions((po) => {
          let obj = {
            ...po
          };
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
              let obj = {
                ...po
              };
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
    }
  })), escape(createComponent(NoHydration, {
    get children() {
      return createComponent(FaSolidArrowRightLong, {
        "class": "text-accent"
      });
    }
  })), escape(createComponent(TextInput$1, {
    "class": "text-primary pb-1 outline-none grow",
    placeholder: "Auto",
    onChange: (x) => {
      if (spOptIndex() == null) {
        setPlotOptions((po) => {
          let obj = {
            ...po
          };
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
              let obj = {
                ...po
              };
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
    }
  })), escape(createComponent(TextInput$1, {
    "class": "text-primary pb-1 outline-none w-full",
    placeholder: "X Label",
    onChange: (x) => editPlotOption("xLabel", x)
  })), escape(createComponent(TextInput$1, {
    "class": "text-primary pb-1 outline-none w-full",
    placeholder: "Y Label",
    onChange: (x) => editPlotOption("yLabel", x)
  })), `absolute right-96 transition-opacity -translate-y-16 ${helpVisible() ? "opacity-100" : "opacity-0"}`, ssrAttribute("src", escape(TestSVG, true), false), escape(createComponent(For, {
    get each() {
      return subplots();
    },
    children: (sp) => ssr(_tmpl$11, ssrHydrationKey(), `rounded-full  w-8 h-8 hover:opacity-50 transition-opacity cursor-pointer ${paintingSubplot() == sp ? "border-2 border-green-500 opacity-50" : "opacity-20"}`, "background-color:" + escape(standardColors[sp], true))
  })), `w-8 h-8 ${paintingSubplot() != null ? "rotate-[45deg]" : ""} transition-transform`, escape(createComponent(NoHydration, {
    get children() {
      return createComponent(IoAddCircle, {
        "class": "text-primary cursor-pointer opacity-50 hover:opacity-100 transition-opacity w-8 h-8 scale-[1.2]",
        size: 48
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return subplots().length > 0;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(NoHydration, {
        get children() {
          return createComponent(IoRemoveCircle, {
            "class": "text-red-400 cursor-pointer opacity-50 hover:opacity-100 transition-opacity w-8 h-8 scale-[1.2]",
            size: 48
          });
        }
      })));
    }
  })), escape(createComponent(Show, {
    get when() {
      return subplots().length > 0;
    },
    get children() {
      return [ssr(_tmpl$2, ssrHydrationKey()), ssr(_tmpl$3, ssrHydrationKey()), ssr(_tmpl$4, ssrHydrationKey()), ssr(_tmpl$5, ssrHydrationKey(), escape(createComponent(SlideInput, {
        from: 0,
        get to() {
          return maxMargin(subplots().length);
        },
        out: setSPMargin,
        value: 0
      }))), ssr(_tmpl$6, ssrHydrationKey())];
    }
  })), `absolute right-96 transition-opacity z-10 ${helpVisible() ? "opacity-100" : "opacity-0"}`, ssrAttribute("src", escape(TestSVG, true), false), escape(createComponent(DraggableList, {
    items: () => plots,
    itemsSetter: setPlots,
    dragDelay: 200,
    onDrag: () => {
      setDragging(true);
    },
    onDrop: () => {
      setDragging(false);
    },
    renderItem: ({
      item: plot,
      index: i
    }) => [createComponent(PlotSettings, {
      plot,
      updatePlot,
      index: i,
      headerClickable: () => paintingSubplot() == null,
      forceClose: dragging,
      deletePlot,
      onClick: () => {
        if (paintingSubplot() != null) {
          updatePlot({
            ...plot,
            subplot: paintingSubplot()
          }, "subplot");
        }
      }
    }), ssr(_tmpl$2, ssrHydrationKey())]
  })));
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home
}, Symbol.toStringTag, { value: "Module" }));
export {
  FaSolidChevronDown as F,
  IconTemplate as I,
  TextInput$1 as T,
  TextInput as a,
  IoTrashBinOutline as b,
  Home as default,
  index as i
};
