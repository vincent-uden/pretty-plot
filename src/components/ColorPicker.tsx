import { ColorTranslator } from "colortranslator";
import { Setter, createEffect, createSignal, onMount } from "solid-js";
import TextInput from "./TextInput";

type ColorPickerProps = {
  out: Setter<string>;
  value?: string;
  width?: number;
  height?: number;
};

function fullySaturated(hue: number, w: number) {
  return `hsl(${(hue / w) * 360},100%,50%)`;
}

function color(
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D | undefined,
): string {
  const pixel = ctx?.getImageData(x, y, 1, 1).data;
  if (pixel == null) {
    return "#00000000";
  }
  const color = new ColorTranslator(
    `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`,
  );

  return color.HEX;
}

export function ColorPicker(props: ColorPickerProps) {
  // all of these are pixel values
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [hue, setHue] = createSignal(0);
  const [selecting, setSelecting] = createSignal(false);

  let width = props.width ?? 200;
  let height = props.height ?? 200;

  let canvasRef: HTMLCanvasElement;
  let hueRef: HTMLCanvasElement;
  let colorCtx: CanvasRenderingContext2D;

  if (props.value != undefined) {
    const color = new ColorTranslator(props.value);
    const hsl = color.HSLObject;
    setHue(hsl.H/360*width);
    hsl.S /= 100;
    hsl.L /= 100;
    const V = hsl.L + hsl.S * Math.min(hsl.L, 1 - hsl.L);
    let Sv = 0;
    if (V !== 0) {
      Sv = 2*(1 - hsl.L / V);
    }
    setX(Sv*width);
    setY((1-V)*height);
  }

  onMount(() => {
    colorCtx = canvasRef.getContext("2d")!!;
    let gradientH = colorCtx.createLinearGradient(
      0,
      0,
      colorCtx.canvas.width,
      0,
    );
    gradientH.addColorStop(0, "#fff");
    gradientH.addColorStop(1, fullySaturated(hue(), width));
    colorCtx.fillStyle = gradientH;
    colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);

    let gradientV = colorCtx.createLinearGradient(
      0,
      0,
      0,
      colorCtx.canvas.height,
    );
    gradientV.addColorStop(0, "rgba(0,0,0,0)");
    gradientV.addColorStop(1, "#000");
    colorCtx.fillStyle = gradientV;
    colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);

    document.addEventListener("mouseup", () => {
      setSelecting(false);
    });
  });

  createEffect(() => {
    let gradientH = colorCtx.createLinearGradient(
      0,
      0,
      colorCtx.canvas.width,
      0,
    );
    gradientH.addColorStop(0, "#fff");
    gradientH.addColorStop(1, fullySaturated(hue(), width));
    colorCtx.fillStyle = gradientH;
    colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);

    let gradientV = colorCtx.createLinearGradient(
      0,
      0,
      0,
      colorCtx.canvas.height,
    );
    gradientV.addColorStop(0, "rgba(0,0,0,0)");
    gradientV.addColorStop(1, "#000");
    colorCtx.fillStyle = gradientV;
    colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);
  });

  createEffect(() => {
    if (props.out != undefined) {
      hue();
      props.out(color(x(), y(), colorCtx));
    }
  });

  return (
    <div class="relative">
      <canvas
        class="rounded border border-zinc-400"
        width={width}
        height={height}
        /*@ts-ignore*/
        ref={canvasRef}
        onMouseDown={(e) => {
          setSelecting(true);
          const rect = canvasRef.getBoundingClientRect();
          setX(e.x - rect.left);
          setY(e.y - rect.top);
        }}
        onMouseMove={(e) => {
          if (selecting()) {
            const rect = canvasRef.getBoundingClientRect();
            setX(e.x - rect.left);
            setY(e.y - rect.top);
          }
        }}
      />
      <div
        class="w-4 h-4 absolute rounded-full border-2 border-white pointer-events-none drop-shadow-lg"
        style={{
          left: `${x()}px`,
          top: `${y()}px`,
          //@ts-ignore
          "background-color": color(x(), y(), colorCtx),
          transform: `translate(-4px, -4px)`,
        }}
      />
      <div class="h-2" />
      {/*@ts-ignore*/}
      <div class="relative">
        <div
          class="h-4 rounded border border-zinc-400"
          style={{
            background:
              "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
            width: `${width}`,
          }}
          //@ts-ignore
          ref={hueRef}
          onMouseDown={(e) => {
            setSelecting(true);
            const rect = hueRef.getBoundingClientRect();
            setHue(e.x - rect.left);
          }}
          onMouseMove={(e) => {
            if (selecting()) {
              const rect = hueRef.getBoundingClientRect();
              setHue(e.x - rect.left);
            }
          }}
        />
        <div
          class="w-2 h-full absolute rounded-full border-2 border-white pointer-events-none drop-shadow-lg top-0"
          style={{
            left: `${hue()}px`,
            "background-color": fullySaturated(hue(), width),
            transform: `translate(-4px)`,
          }}
        />
      </div>
    </div>
  );
}
