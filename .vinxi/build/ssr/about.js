import { ssr, ssrHydrationKey, escape, createComponent } from "solid-js/web";
import { createSignal } from "solid-js";
import { A } from "./assets/components-ba74977f.js";
import "./assets/routing-55868e8f.js";
const _tmpl$$1 = ["<button", ' class="w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]">Clicks: <!--$-->', "<!--/--></button>"];
function Counter() {
  const [count, setCount] = createSignal(0);
  return ssr(_tmpl$$1, ssrHydrationKey(), escape(count()));
}
const _tmpl$ = ["<main", ' class="text-center mx-auto text-gray-700 p-4"><h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">About Page</h1><!--$-->', '<!--/--><p class="mt-8">Visit <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">solidjs.com</a> to learn how to build Solid apps.</p><p class="my-4"><!--$-->', "<!--/--> - <span>About Page</span></p></main>"];
function About() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Counter, {})), escape(createComponent(A, {
    href: "/",
    "class": "text-sky-600 hover:underline",
    children: "Home"
  })));
}
export {
  About as default
};
