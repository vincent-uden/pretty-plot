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
  visible: boolean;
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
  rows: Record<string, string | number | undefined>[];
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

export function csvToPlot(
  csvStr: string,
  name: string,
  color: string,
): UserPlot {
  let output: UserPlot = {
    name,
    color,
    xKey: "",
    yKey: "",
    columns: [],
    type: "line",
    id: new Date().getMilliseconds(),
    subplot: null,
    visible: true,
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

  if (output.columns.length == 1) {
    output.yKey = output.columns[0].name;
  } else if (output.columns.length >= 2) {
    output.xKey = output.columns[0].name;
    output.yKey = output.columns[1].name;
  }

  return output;
}

export interface H5Module {
  File: any;
  Group: any;
  Dataset: any;
  Datatype: any;
  DatasetRegion: any;
  ready: Promise<{ FS: FileSystemType }>;
  ACCESS_MODES: Record<string, string>;
}

export interface FileSystemType {
  writeFile: (path: string, data: Uint8Array) => void;
  readFile: (path: string) => Uint8Array;
}

interface H5File {
  get: (path: string) => any;
  keys: () => string[];
}

export async function handleHd5f(
  file: File,
  FS: FileSystemType,
  h5Module: H5Module,
): Promise<UserPlot[]> {
  try {
    const buffer = await file.arrayBuffer();
    FS.writeFile(file.name, new Uint8Array(buffer));
    const h5File = new h5Module.File(file.name, "r");
    // Recursively collect all datasets
    const allDatasets: string[] = [];
    function collectDatasets(group: any, path: string) {
      for (const key of group.keys()) {
        const childPath = path ? `${path}/${key}` : key;
        const child = group.get(childPath);

        if (child.constructor.name === "Dataset") {
          allDatasets.push(childPath);
        } else if (child.constructor.name === "Group") {
          collectDatasets(child, childPath);
        }
      }
    }
    collectDatasets(h5File, "");
    //@ts-expect-error
    const plots: UserPlot[] = allDatasets
      .map((name, i) =>
        extractDataset(h5File, name, new Date().getMilliseconds() + i),
      )
      .filter((p) => p !== undefined);

    return plots;
  } catch (err: any) {
    console.error("Error processing file:", err);
  }
  return [];
}

function extractDataset(
  h5File: H5File,
  datasetName: string,
  plotId: number,
): UserPlot | undefined {
  try {
    const dataset = h5File.get(datasetName);
    const shape = dataset.shape;
    console.log("Dataset shape:", shape);

    let content: any;
    content = dataset.value;
    // Convert TypedArrays to regular arrays for better display
    if (ArrayBuffer.isView(content)) {
      content = Array.from(content as any);
    }
    console.log("Dataset content:", content);
    let userPlotData: UserPlot | undefined = undefined;
    if (Array.isArray(content) && content.length > 0) {
      // If the shape has more than one dimension, it's likely a multi-column dataset
      if (shape.length > 1) {
        // For datasets with shape [rows, cols], the data is stored as a flat array
        // where every nth entry belongs to the nth column
        const numColumns = shape[1];
        const columns = [];

        for (let colIndex = 0; colIndex < numColumns; colIndex++) {
          const columnData = [];
          for (let i = colIndex; i < content.length; i += numColumns) {
            columnData.push(content[i]);
          }
          columns.push({
            name: `Column ${colIndex + 1}`,
            data: columnData,
          });
        }

        userPlotData = {
          name: datasetName,
          color: "#1f77b4", // Default color
          xKey: "Column 1",
          yKey: "Column 2",
          columns: columns,
          type: "line",
          id: plotId,
          subplot: null,
          visible: true,
        };
      } else {
        // If it's a 1D array (single column)
        userPlotData = {
          name: datasetName,
          color: "#1f77b4", // Default color
          xKey: "index",
          yKey: "value",
          columns: [
            {
              name: "Data",
              data: content,
            },
          ],
          type: "line", // Default type
          id: plotId,
          subplot: null,
          visible: true,
        };
      }
    }
    return userPlotData;
  } catch (err: any) {
    console.error("Error viewing dataset:", err);
  }
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
    visible: plot.visible,
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

export function dimToPixels(
  x: number,
  unit: "Inches" | "Pixels" | "Centimeters",
) {
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
        text: "$" + plotOptions.xLabel + "$",
      },
      showgrid: plotOptions.gridX,
    };
    output["yaxis"] = {
      title: {
        text: "$" + plotOptions.yLabel + "$",
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
