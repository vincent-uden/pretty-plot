import { ssr, ssrHydrationKey, escape, createComponent } from "solid-js/web";
import { A } from "./assets/components-ba74977f.js";
import "solid-js";
import "./assets/routing-55868e8f.js";
const _tmpl$ = ["<main", ' class="text-center mx-auto text-gray-700 p-4"><h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Not Found</h1><p class="mt-8">Visit <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">solidjs.com</a> to learn how to build Solid apps.</p><p class="my-4"><!--$-->', "<!--/--> - <!--$-->", "<!--/--></p></main>"];
function NotFound() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    "class": "text-sky-600 hover:underline",
    children: "Home"
  })), escape(createComponent(A, {
    href: "/about",
    "class": "text-sky-600 hover:underline",
    children: "About Page"
  })));
}
export {
  NotFound as default
};
