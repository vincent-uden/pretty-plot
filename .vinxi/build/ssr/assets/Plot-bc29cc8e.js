import { ssr, ssrHydrationKey, ssrAttribute, escape } from "solid-js/web";
import { createScriptLoader } from "@solid-primitives/script-loader";
import * as Plotly from "plotly.js-basic-dist";
import { onMount, createEffect } from "solid-js";
const _tmpl$ = ["<div", "></div>"];
let defaultLayout = {
  autosize: true,
  margin: {
    l: 50,
    r: 50,
    b: 50,
    t: 50,
    pad: 0
  },
  paper_bgcolor: "rgba(0, 0, 0, 0)",
  plot_bgcolor: "rgba(0, 0, 0, 0)",
  font: {
    color: "black"
  }
};
function Plot(props) {
  let plotId = "plot_div_" + Math.random();
  const delay = 50;
  let updateTimer = null;
  createScriptLoader({
    id: "MathJax-script",
    src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js"
  });
  onMount(() => {
    let layout = {
      ...defaultLayout,
      ...props.layout,
      width: props.width,
      height: props.height
    };
    Plotly.newPlot(plotId, props.data, layout, {
      responsive: false,
      displaylogo: false,
      displayModeBar: true,
      modeBarButtonsToAdd: [{
        title: "SVG_EXPORT",
        name: "SVG_EXPORT",
        icon: Plotly.Icons.camera,
        click: function(gd) {
          Plotly.downloadImage(gd, {
            width: props.width ?? 400,
            height: props.height ?? 400,
            filename: props.exportName ?? "plot",
            format: props.exportFormat ?? "svg"
          });
        }
      }]
    });
  });
  createEffect(() => {
    props.data;
    let layout = {
      ...defaultLayout,
      ...props.layout,
      width: props.width,
      height: props.height
    };
    if (updateTimer != null) {
      clearTimeout(updateTimer);
    }
    updateTimer = setTimeout(() => {
      Plotly.newPlot(plotId, props.data, layout, {
        responsive: false,
        displaylogo: false,
        displayModeBar: true,
        modeBarButtonsToAdd: [{
          title: "SVG_EXPORT",
          name: "SVG_EXPORT",
          icon: Plotly.Icons.camera,
          click: function(gd) {
            Plotly.downloadImage(gd, {
              width: props.width ?? 400,
              height: props.height ?? 400,
              filename: props.exportName ?? "plot",
              format: props.exportFormat ?? "svg"
            });
          }
        }]
      });
    }, delay);
  });
  return ssr(_tmpl$, ssrHydrationKey() + ssrAttribute("id", escape(plotId, true), false));
}
export {
  Plot as default,
  defaultLayout
};
