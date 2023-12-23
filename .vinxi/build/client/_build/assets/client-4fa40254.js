import{_ as I,p as F}from"./routes-91775363.js";import{c as M,a as k,b as m,o as z,S as N,d as V,e as W,f as j,g as B,h as v,s as R,m as S,i as x,r as _,t as $,l as K,j as H,E as Z,k as G,n as J,p as X,q as Q}from"./web-b1c3e1d3.js";import{c as Y,a as ee,R as te,g as ne,b as re,d as D,e as oe}from"./routing-53104a05.js";const A="Invariant Violation",{setPrototypeOf:se=function(e,t){return e.__proto__=t,e}}=Object;class P extends Error{framesToPop=1;name=A;constructor(t=A){super(typeof t=="number"?`${A}: ${t} (see https://github.com/apollographql/invariant-packages)`:t),se(this,P.prototype)}}function L(e,t){if(!e)throw new P(t)}function ae(e=""){return!e||!e.includes("\\")?e:e.replace(/\\/g,"/")}const ie=/^[/\\]{2}/,le=/^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/,ue=/^[A-Za-z]:$/,ce=function(e){if(e.length===0)return".";e=ae(e);const t=e.match(ie),n=O(e),r=e[e.length-1]==="/";return e=fe(e,!n),e.length===0?n?"/":r?"./":".":(r&&(e+="/"),ue.test(e)&&(e+="/"),t?n?`//${e}`:`//./${e}`:n&&!O(e)?`/${e}`:e)},de=function(...e){if(e.length===0)return".";let t;for(const n of e)n&&n.length>0&&(t===void 0?t=n:t+=`/${n}`);return t===void 0?".":ce(t.replace(/\/\/+/g,"/"))};function fe(e,t){let n="",r=0,o=-1,l=0,i=null;for(let u=0;u<=e.length;++u){if(u<e.length)i=e[u];else{if(i==="/")break;i="/"}if(i==="/"){if(!(o===u-1||l===1))if(l===2){if(n.length<2||r!==2||n[n.length-1]!=="."||n[n.length-2]!=="."){if(n.length>2){const h=n.lastIndexOf("/");h===-1?(n="",r=0):(n=n.slice(0,h),r=n.length-1-n.lastIndexOf("/")),o=u,l=0;continue}else if(n.length>0){n="",r=0,o=u,l=0;continue}}t&&(n+=n.length>0?"/..":"..",r=2)}else n.length>0?n+=`/${e.slice(o+1,u)}`:n=e.slice(o+1,u),r=u-o-1;o=u,l=0}else i==="."&&l!==-1?++l:l=-1}return n}const O=function(e){return le.test(e)};function he(e){return`virtual:${e}`}function me(e){return e.handler?.endsWith(".html")?e.handler:`#vinxi/handler/${e.name}`}const ge=new Proxy({},{get(e,t){return L(typeof t=="string","Bundler name should be a string"),{handler:he(me({name:t})),chunks:new Proxy({},{get(n,r){L(typeof r=="string","Chunk expected");let o=de("/_build",r+".js");return{import(){return I(()=>import(o),[])},output:{path:o}}}}),inputs:new Proxy({},{get(n,r){L(typeof r=="string","Input must be string");let o=window.manifest[r].output;return{async import(){return I(()=>import(o),[])},async assets(){return window.manifest[r].assets},output:{path:o}}}})}}});globalThis.MANIFEST=ge;const pe=e=>t=>{const{base:n}=t,r=M(()=>t.children),o=k(()=>Y(t.root?{component:t.root,children:r()}:r(),t.base||"")),l=ee(e,o,{base:n});return e.create&&e.create(l),m(te.Provider,{value:l,get children(){return m(be,{routerState:l,get branches(){return o()}})}})};function be(e){const t=k(()=>ne(e.branches,e.routerState.location.pathname)),n=re(()=>{const i=t(),u={};for(let h=0;h<i.length;h++)Object.assign(u,i[h].params);return u}),r=[];let o;const l=k(z(t,(i,u,h)=>{let p=u&&i.length===u.length;const g=[];for(let d=0,y=i.length;d<y;d++){const b=u&&u[d],a=i[d];h&&b&&a.route.key===b.route.key?g[d]=h[d]:(p=!1,r[d]&&r[d](),V(s=>{r[d]=s,g[d]=oe(e.routerState,g[d-1]||e.routerState.base,we(()=>l()[d+1]),()=>t()[d],n)}))}return r.splice(i.length).forEach(d=>d()),h&&p?h:(o=g[0],g)}));return m(N,{get when(){return l()&&o},keyed:!0,children:i=>m(D.Provider,{value:i,get children(){return i.outlet()}})})}const we=e=>()=>m(N,{get when(){return e()},keyed:!0,children:t=>m(D.Provider,{value:t,get children(){return t.outlet()}})});function ye([e,t],n,r){return[n?()=>n(e()):e,r?o=>t(r(o)):t]}function Ee(e){if(e==="#")return null;try{return document.querySelector(e)}catch{return null}}function ve(e){let t=!1;const n=o=>typeof o=="string"?{value:o}:o,r=ye(W(n(e.get()),{equals:(o,l)=>o.value===l.value}),void 0,o=>(!t&&e.set(o),o));return e.init&&j(e.init((o=e.get())=>{t=!0,r[1](n(o)),t=!1})),pe({signal:r,create:e.create,utils:e.utils})}function _e(e,t,n){return e.addEventListener(t,n),()=>e.removeEventListener(t,n)}function $e(e,t){const n=Ee(`#${e}`);n?n.scrollIntoView():t&&window.scrollTo(0,0)}const Re=new Map;function Se(e=!0,t=!1,n="/_server"){return r=>{const o=r.base.path(),l=r.navigatorFactory(r.base);let i={};function u(a){return a.namespaceURI==="http://www.w3.org/2000/svg"}function h(a){if(a.defaultPrevented||a.button!==0||a.metaKey||a.altKey||a.ctrlKey||a.shiftKey)return;const s=a.composedPath().find(T=>T instanceof Node&&T.nodeName.toUpperCase()==="A");if(!s||t&&!s.getAttribute("link"))return;const f=u(s),c=f?s.href.baseVal:s.href;if((f?s.target.baseVal:s.target)||!c&&!s.hasAttribute("state"))return;const w=(s.getAttribute("rel")||"").split(/\s+/);if(s.hasAttribute("download")||w&&w.includes("external"))return;const E=f?new URL(c,document.baseURI):new URL(c);if(!(E.origin!==window.location.origin||o&&E.pathname&&!E.pathname.toLowerCase().startsWith(o.toLowerCase())))return[s,E]}function p(a){const s=h(a);if(!s)return;const[f,c]=s,C=r.parsePath(c.pathname+c.search+c.hash),w=f.getAttribute("state");a.preventDefault(),l(C,{resolve:!1,replace:f.hasAttribute("replace"),scroll:!f.hasAttribute("noscroll"),state:w&&JSON.parse(w)})}function g(a){const s=h(a);if(!s)return;const[f,c]=s;i[c.pathname]||r.preloadRoute(c,f.getAttribute("preload")!=="false")}function d(a){const s=h(a);if(!s)return;const[f,c]=s;i[c.pathname]||(i[c.pathname]=setTimeout(()=>{r.preloadRoute(c,f.getAttribute("preload")!=="false"),delete i[c.pathname]},200))}function y(a){const s=h(a);if(!s)return;const[,f]=s;i[f.pathname]&&(clearTimeout(i[f.pathname]),delete i[f.pathname])}function b(a){let s=a.submitter&&a.submitter.hasAttribute("formaction")?a.submitter.formAction:a.target.action;if(!s)return;if(!s.startsWith("action:")){const c=new URL(s);if(s=r.parsePath(c.pathname+c.search),!s.startsWith(n))return}if(a.target.method.toUpperCase()!=="POST")throw new Error("Only POST forms are supported for Actions");const f=Re.get(s);if(f){a.preventDefault();const c=new FormData(a.target);f.call(r,c)}}B(["click","submit"]),document.addEventListener("click",p),e&&(document.addEventListener("mouseover",d),document.addEventListener("mouseout",y),document.addEventListener("focusin",g),document.addEventListener("touchstart",g)),document.addEventListener("submit",b),j(()=>{document.removeEventListener("click",p),e&&(document.removeEventListener("mouseover",d),document.removeEventListener("mouseout",y),document.removeEventListener("focusin",g),document.removeEventListener("touchstart",g)),document.removeEventListener("submit",b)})}}function Ae(e){return ve({get:()=>({value:window.location.pathname+window.location.search+window.location.hash,state:history.state}),set({value:t,replace:n,scroll:r,state:o}){n?window.history.replaceState(o,"",t):window.history.pushState(o,"",t),$e(window.location.hash.slice(1),r)},init:t=>_e(window,"popstate",()=>t()),create:Se(e.preload,e.explicitLinks,e.actionBase),utils:{go:t=>window.history.go(t)}})(e)}const Le=$("<style>"),ke=$("<link>"),xe=$("<script> "),Pe={style:e=>(()=>{const t=v(Le);return R(t,S(()=>e.attrs),!1,!0),x(t,()=>e.children),_(),t})(),link:e=>(()=>{const t=v(ke);return R(t,S(()=>e.attrs),!1,!1),_(),t})(),script:e=>e.attrs.src?(()=>{const t=v(xe);return R(t,S(()=>e.attrs,{get id(){return e.key}}),!1,!0),_(),t})():null};function Ce(e){let{tag:t,attrs:{key:n,...r}={key:void 0},children:o}=e;return Pe[t]({attrs:r,key:n,children:o})}function Te(e,t,n,r="default"){return K(async()=>{{const l=(await e.import())[r],u=(await t.inputs?.[e.src].assets()).filter(p=>p.tag==="style"||p.attrs.rel==="stylesheet");return{default:p=>[...u.map(g=>Ce(g)),m(l,p)]}}})}function Ie(){function e(n){return{...n,...n.$$route?n.$$route.require().route:void 0,metadata:{...n.$$route?n.$$route.require().route.metadata:{},filesystem:!0},component:Te(n.$component,globalThis.MANIFEST.client,globalThis.MANIFEST.ssr),children:n.children?n.children.map(e):void 0}}return F.map(e)}let U;const Oe=()=>U||(U=Ie());function Ue(){return m(Ae,{root:e=>m(H,{get children(){return e.children}}),get children(){return m(Oe,{})}})}const qe=$('<div style=padding:16px><div style="background-color:rgba(252, 165, 165);color:rgb(153, 27, 27);border-radius&quot;:5px;overflow:scroll;padding:16px;margin-bottom:8px;"><p style=font-weight:bold id=error-message></p><button id=reset-errors style="color:rgba(252, 165, 165);background-color:rgb(153, 27, 27);border-radius:5px;padding:4px 8px">Clear errors and retry</button><pre style=margin-top:8px;width:100%>');function Ne(e){return m(Z,{fallback:t=>m(je,{error:t}),get children(){return e.children}})}function je(e){return G(()=>console.error(e.error)),(()=>{const t=v(qe),n=t.firstChild,r=n.firstChild,o=r.nextSibling,l=o.nextSibling;return x(r,()=>e.error.message),J(o,"click",X,!0),x(l,()=>e.error.stack),_(),t})()}B(["click"]);function Be(e,t){return Q(e,t)}function q(e){return e.children}function De(){return m(q,{get children(){return m(q,{get children(){return m(Ne,{get children(){return m(Ue,{})}})}})}})}Be(()=>m(De,{}),document.getElementById("app"));
