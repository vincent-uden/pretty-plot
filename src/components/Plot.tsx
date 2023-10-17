import * as Plotly from "plotly.js-basic-dist";

import { createEffect, onMount } from "solid-js";

interface PlotProps {
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
    }
  };
}

let defaultLayout = {
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
  }
};

export default function Plot(props: PlotProps) {
  let layout = { ...defaultLayout, ...props.layout };

  let plotId = "plot_div_" + Math.random();

  onMount(() => {
    console.log(props.data);
    Plotly.newPlot(plotId, props.data, layout, {
      responsive: true,
      displaylogo: false,
      displayModeBar: false,
    });
  });

  createEffect(() => {
    layout = { ...defaultLayout, ...props.layout };
    Plotly.newPlot(plotId, props.data, layout, {
      responsive: true,
      displaylogo: false,
      displayModeBar: false,
    });
  });

  return <div id={plotId}></div>;
}
