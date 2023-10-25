import { createScriptLoader } from "@solid-primitives/script-loader";
import * as Plotly from "plotly.js-basic-dist";

import { createEffect, onMount } from "solid-js";

export interface PlotProps {
  width?: number;
  height?: number;

  data: any;

  layout?: {
    autosize?: boolean;
    margin?: {
      l?: number;
      r?: number;
      b?: number;
      t?: number;
      pad?: number;
    };
    paper_bgcolor?: string;
    plot_bgcolor?: string;
    font?: {
      color?: string;
    };
  };

  exportFormat?: "svg" | "png";
  exportName?: string;
}

export let defaultLayout = {
  autosize: true,
  margin: {
    l: 50,
    r: 50,
    b: 50,
    t: 50,
    pad: 0,
  },
  paper_bgcolor: "rgba(0, 0, 0, 0)",
  plot_bgcolor: "rgba(0, 0, 0, 0)",
  font: {
    color: "black",
  },
};

export default function Plot(props: PlotProps) {
  let layout = () => {return{ ...defaultLayout, ...props.layout, width: props.width, height: props.height }};

  let plotId = "plot_div_" + Math.random();

  createScriptLoader({
    id: "MathJax-script",
    src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js",
  });

  onMount(() => {
    Plotly.newPlot(plotId, props.data, layout(), {
      responsive: false,
      displaylogo: false,
      displayModeBar: true,
      modeBarButtonsToAdd: [{
        title: "SVG_EXPORT",
        name: 'SVG_EXPORT',
        icon: Plotly.Icons.camera,
        click: function(gd) {
          Plotly.downloadImage(gd, {
            width: props.width ?? 400,
            height: props.height ?? 400,
            filename: props.exportName ?? "plot",
            format: props.exportFormat ?? "svg",
          })
        }
      }]
    });
  });

  createEffect(() => {
    Plotly.newPlot(plotId, props.data, layout(), {
      responsive: false,
      displaylogo: false,
      displayModeBar: true,
      modeBarButtonsToAdd: [{
        title: "SVG_EXPORT",
        name: 'SVG_EXPORT',
        icon: Plotly.Icons.camera,
        click: function(gd) {
          Plotly.downloadImage(gd, {
            width: props.width ?? 400,
            height: props.height ?? 400,
            filename: props.exportName ?? "plot",
            format: props.exportFormat ?? "svg",
          })
        }
      }]
    });
  });

  return <><div id={plotId}></div>
  </>;
}
