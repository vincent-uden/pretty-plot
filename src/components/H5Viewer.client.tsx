// src/components/H5Viewer.jsx
import { createSignal, Show, onMount } from "solid-js";

// Define types for h5wasm
interface H5Module {
  File: any;
  Group: any;
  Dataset: any;
  Datatype: any;
  DatasetRegion: any;
  ready: Promise<{ FS: FileSystemType }>;
  ACCESS_MODES: Record<string, string>;
}

interface FileSystemType {
  writeFile: (path: string, data: Uint8Array) => void;
  readFile: (path: string) => Uint8Array;
}

interface H5File {
  get: (path: string) => any;
  keys: () => string[];
}

export default function H5Viewer() {
  const [h5wasmModule, setH5wasmModule] = createSignal<H5Module | null>(null);
  const [FS, setFS] = createSignal<FileSystemType | null>(null);
  const [file, setFile] = createSignal<string | null>(null);
  const [h5File, setH5File] = createSignal<H5File | null>(null);
  const [datasets, setDatasets] = createSignal<string[]>([]);
  const [selectedDataset, setSelectedDataset] = createSignal<string | null>(null);
  const [datasetContent, setDatasetContent] = createSignal<any>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  // Only load h5wasm on the client
  onMount(async () => {
    try {
      setLoading(true);
      // Dynamic import to ensure this only happens on the client
      const h5wasmImport = await import("h5wasm");
      setH5wasmModule(h5wasmImport.default);
      
      // Initialize h5wasm
      const { FS: fsModule } = await h5wasmImport.default.ready;
      setFS(fsModule);
      setLoading(false);
    } catch (err: any) {
      console.error("Failed to load h5wasm:", err);
      setError(err.message);
      setLoading(false);
    }
  });

  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const uploadedFile = target.files?.[0];
    if (!uploadedFile || !FS()) return;

    try {
      // Read the file as ArrayBuffer
      const buffer = await uploadedFile.arrayBuffer();
      
      // Write to the virtual filesystem
      FS()?.writeFile(uploadedFile.name, new Uint8Array(buffer));
      
      // Set the file signal
      setFile(uploadedFile.name);
      
      // Open the HDF5 file
      const h5Module = h5wasmModule();
      if (!h5Module) return;
      
      const h5 = new h5Module.File(uploadedFile.name, "r");
      setH5File(h5);
      
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
      
      collectDatasets(h5, "");
      setDatasets(allDatasets);
    } catch (err: any) {
      console.error("Error processing file:", err);
      setError(`Error processing file: ${err.message}`);
    }
  }

  function viewDataset(path: string) {
    try {
      const h5 = h5File();
      if (!h5) return;
      
      const dataset = h5.get(path);
      setSelectedDataset(path);
      
      // Get the dataset shape information
      const shape = dataset.shape;
      console.log("Dataset shape:", shape);
      
      // Get the dataset content
      let content: any;
      if (shape.reduce((a: number, b: number) => a * b, 1) > 1000) {
        // For large datasets, just take a slice
        const sliceParams = shape.map(() => [0, 5]);
        content = dataset.slice(sliceParams);
      } else {
        content = dataset.value;
      }
      
      // Convert TypedArrays to regular arrays for better display
      if (ArrayBuffer.isView(content)) {
        content = Array.from(content as any);
      }
      
      console.log("Dataset content:", content);
      
      // Transform the content into UserPlot format
      let userPlotData: any = null;
      
      // Check if the dataset has multiple columns based on its shape
      if (Array.isArray(content) && content.length > 0) {
        // If the shape has more than one dimension, it's likely a multi-column dataset
        if (shape.length > 1) {
          // For datasets with shape [rows, cols], the data is stored as a flat array
          // where every nth entry belongs to the nth column
          const numRows = shape[0];
          const numColumns = shape[1];
          
          // Create columns from the flat array
          const columns = [];
          
          for (let colIndex = 0; colIndex < numColumns; colIndex++) {
            const columnData = [];
            
            // For each column, extract every nth entry starting at colIndex
            for (let i = colIndex; i < content.length; i += numColumns) {
              columnData.push(content[i]);
            }
            
            columns.push({
              name: `Column ${colIndex + 1}`,
              data: columnData
            });
          }
          
          userPlotData = {
            name: path.split('/').pop() || 'Dataset',
            color: '#1f77b4', // Default color
            xKey: 'index',
            yKey: 'value',
            columns: columns,
            type: 'line', // Default type
            id: Date.now(),
            subplot: null,
            visible: true
          };
        } else {
          // For 1D datasets, check if it's a flat array of pairs
          // This is a heuristic for datasets that might be stored as [x1,y1,x2,y2,...]
          if (content.length % 2 === 0) {
            // Split into x and y columns
            const xValues = [];
            const yValues = [];
            
            for (let i = 0; i < content.length; i += 2) {
              xValues.push(content[i]);
              yValues.push(content[i + 1]);
            }
            
            userPlotData = {
              name: path.split('/').pop() || 'Dataset',
              color: '#1f77b4', // Default color
              xKey: 'x',
              yKey: 'y',
              columns: [
                {
                  name: 'x',
                  data: xValues
                },
                {
                  name: 'y',
                  data: yValues
                }
              ],
              type: 'line', // Default type
              id: Date.now(),
              subplot: null,
              visible: true
            };
          } else {
            // If it's a 1D array (single column)
            userPlotData = {
              name: path.split('/').pop() || 'Dataset',
              color: '#1f77b4', // Default color
              xKey: 'index',
              yKey: 'value',
              columns: [{
                name: 'Data',
                data: content
              }],
              type: 'line', // Default type
              id: Date.now(),
              subplot: null,
              visible: true
            };
          }
        }
      }
      
      setDatasetContent(userPlotData || content);
    } catch (err: any) {
      console.error("Error viewing dataset:", err);
      setError(`Error viewing dataset: ${err.message}`);
    }
  }

  return (
    <div>
      <h1>HDF5 File Viewer</h1>
      
      <Show when={error()}>
        <div style={{ color: "red", padding: "10px", border: "1px solid red", margin: "10px 0" }}>
          {error()}
        </div>
      </Show>
      
      <Show when={!loading()} fallback={<p>Loading h5wasm...</p>}>
        <Show when={h5wasmModule() && FS()} fallback={<p>Failed to load h5wasm</p>}>
          <input type="file" onChange={handleFileUpload} accept=".h5,.hdf5" />
          
          <Show when={file()}>
            <h2>File: {file()}</h2>
            
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: "1" }}>
                <h3>Datasets</h3>
                <ul>
                  {datasets().map(path => (
                    <li onClick={() => viewDataset(path)} style={{ cursor: "pointer" }}>
                      {path}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Show when={selectedDataset()}>
                <div style={{ flex: "2" }}>
                  <h3>Dataset: {selectedDataset()}</h3>
                  <pre>
                    {JSON.stringify(datasetContent(), null, 2)}
                  </pre>
                </div>
              </Show>
            </div>
          </Show>
        </Show>
      </Show>
    </div>
  );
}
