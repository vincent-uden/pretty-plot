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
  showLegend: boolean;
};

export const defaultOps: UserPlotOptions = {
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
  showLegend: false,
};

export type CsvData = {
  headers: string[];
  rows: Record<string, string|number|undefined>[];
};

export function parseCsv(csvStr: string): CsvData {
  let out: CsvData = {
    headers: [],
    rows: [],
  };

  const testRows = csvStr.split("\n");
  let r = testRows[0];
  const cells = r.split(",");
  for (const c of cells) {
    out.headers.push(c);
  }
  for (let i = 1; i < testRows.length; i++) {
    let r = testRows[i];
    const cells = r.split(",");
    let row = {};

    for (let j = 0; j < out.headers.length; j++) {
      //@ts-ignore
      row[out.headers[j]] = cells[j];
    }

    out.rows.push(row);
  }

  return out;
}

export function csvToPlot(csvStr: string, name: string, color: string): UserPlot {
  let output: UserPlot = {
    name,
    color,
    xKey: "",
    yKey: "",
    columns: [],
    type: "line",
    id: new Date().getMilliseconds(),
    subplot: null,
  };

  const csv = parseCsv(csvStr);

  for (const header of csv.headers) {
    let col: PlotColumn = {
      name: header,
      data: [],
    };

    for (const row of csv.rows) {
      // @ts-ignore
      col.data.push(row[header]);
    }

    output.columns.push(col);
  }

  if (output.columns.length > 0) {
    output.yKey = output.columns[0].name;
  }

  return output;
}

export function userToPlotly(plot: UserPlot) {
  let trace: any = {
    x: [],
    y: [],
    type: plot.type,
    mode: "",
    color: plot.color,
    name: plot.name,
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

export function dimToPixels(x: number, unit: "Inches" | "Pixels" | "Centimeters") {
  if (unit == "Inches") {
    return x * 100;
  }
  if (unit == "Centimeters") {
    return (x / 2.54) * 100;
  }
  return x;
}

export function generateLayout(
  plotOptions: UserPlotOptions,
  subplots: number[],
  spOptions: UserPlotOptions[],
  options: { subplotMargin?: number },
) {
  let output: any = {
    autosize: false,
    title: {
      text: plotOptions.title,
    },
    font: {
      family: "Computer Modern",
    },
    showlegend: plotOptions.showLegend,
  };

  if (subplots.length == 0) {
    output["xaxis"] = {
      title: {
        text: plotOptions.xLabel,
      },
      showgrid: plotOptions.gridX,
    };
    output["yaxis"] = {
      title: {
        text: plotOptions.yLabel,
      },
      showgrid: plotOptions.gridY,
    };

    if (plotOptions.xLim != null) {
      output["xaxis"]["range"] = plotOptions.xLim;
    }
    if (plotOptions.yLim != null) {
      output["yaxis"]["range"] = plotOptions.yLim;
    }
  }

  const margin = options.subplotMargin ?? 0.1;
  const N = subplots.length;
  const width = (1.0 - (N - 1) * margin) / N;

  let j = 0;
  for (const sp of subplots) {
    output["xaxis" + sp] = {
      domain: [
        width * j + (j > 0 ? 1 : 0) * margin * j,
        width * j + (j > 0 ? 1 : 0) * margin * j + width,
      ],
      anchor: "y" + sp,
      range: (spOptions[j] ?? defaultOps).xLim,
      title: {
        text: (spOptions[j] ?? defaultOps).xLabel,
      },
      showgrid: (spOptions[j] ?? defaultOps).gridX,
    };
    output["yaxis" + sp] = {
      domain: [0, 1.0],
      anchor: "x" + sp,
      range: (spOptions[j] ?? defaultOps).yLim,
      title: {
        text: (spOptions[j] ?? defaultOps).yLabel,
      },
      showgrid: (spOptions[j] ?? defaultOps).gridY,
    };
    j++;
  }

  return output;
}
