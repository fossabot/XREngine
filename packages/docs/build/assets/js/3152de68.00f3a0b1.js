(window.webpackJsonp=window.webpackJsonp||[]).push([[540],{2722:function(e,n,t){"use strict";t.d(n,"a",(function(){return m})),t.d(n,"b",(function(){return d}));var r=t(0),o=t.n(r);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function c(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?c(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=o.a.createContext({}),u=function(e){var n=o.a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},m=function(e){var n=u(e.components);return o.a.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return o.a.createElement(o.a.Fragment,{},n)}},b=o.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=u(t),b=r,d=m["".concat(c,".").concat(b)]||m[b]||p[b]||i;return t?o.a.createElement(d,a(a({ref:n},s),{},{components:t})):o.a.createElement(d,a({ref:n},s))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,c=new Array(i);c[0]=b;var a={};for(var l in n)hasOwnProperty.call(n,l)&&(a[l]=n[l]);a.originalType=e,a.mdxType="string"==typeof e?e:r,c[1]=a;for(var s=2;s<i;s++)c[s]=t[s];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,t)}b.displayName="MDXCreateElement"},610:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return c})),t.d(n,"metadata",(function(){return a})),t.d(n,"toc",(function(){return l})),t.d(n,"default",(function(){return u}));var r=t(3),o=t(7),i=(t(0),t(2722)),c={id:"common_functions_isplayerinvehicle",title:"Module: common/functions/isPlayerInVehicle",sidebar_label:"common/functions/isPlayerInVehicle",custom_edit_url:null,hide_title:!0},a={unversionedId:"docs-engine/modules/common_functions_isplayerinvehicle",id:"docs-engine/modules/common_functions_isplayerinvehicle",isDocsHomePage:!1,title:"Module: common/functions/isPlayerInVehicle",description:"Module: common/functions/isPlayerInVehicle",source:"@site/docs/docs-engine/modules/common_functions_isplayerinvehicle.md",slug:"/docs-engine/modules/common_functions_isplayerinvehicle",permalink:"/docs/docs-engine/modules/common_functions_isplayerinvehicle",editUrl:null,version:"current",sidebar_label:"common/functions/isPlayerInVehicle",sidebar:"sidebar",previous:{title:"Module: common/functions/isOtherPlayer",permalink:"/docs/docs-engine/modules/common_functions_isotherplayer"},next:{title:"Module: common/functions/isServer",permalink:"/docs/docs-engine/modules/common_functions_isserver"}},l=[{value:"Functions",id:"functions",children:[{value:"isPlayerInVehicle",id:"isplayerinvehicle",children:[]}]}],s={toc:l};function u(e){var n=e.components,t=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},s,t,{components:n,mdxType:"MDXLayout"}),Object(i.b)("h1",{id:"module-commonfunctionsisplayerinvehicle"},"Module: common/functions/isPlayerInVehicle"),Object(i.b)("h2",{id:"functions"},"Functions"),Object(i.b)("h3",{id:"isplayerinvehicle"},"isPlayerInVehicle"),Object(i.b)("p",null,"\u25b8 ",Object(i.b)("inlineCode",{parentName:"p"},"Const"),Object(i.b)("strong",{parentName:"p"},"isPlayerInVehicle"),"(",Object(i.b)("inlineCode",{parentName:"p"},"entity"),": ",Object(i.b)("em",{parentName:"p"},"any"),"): ",Object(i.b)("em",{parentName:"p"},"boolean")),Object(i.b)("h4",{id:"parameters"},"Parameters:"),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:"left"},"Name"),Object(i.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"entity")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"any"))))),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Returns:")," ",Object(i.b)("em",{parentName:"p"},"boolean")),Object(i.b)("p",null,"Whether is MyPlayer or not."),Object(i.b)("p",null,"Defined in: ",Object(i.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/engine/src/common/functions/isPlayerInVehicle.ts#L6"},"packages/engine/src/common/functions/isPlayerInVehicle.ts:6")))}u.isMDXComponent=!0}}]);