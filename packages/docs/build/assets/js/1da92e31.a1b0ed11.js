(window.webpackJsonp=window.webpackJsonp||[]).push([[165],{1348:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return m}));var a=n(0),r=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var d=r.a.createContext({}),s=function(e){var t=r.a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},b=function(e){var t=s(e.components);return r.a.createElement(d.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},p=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),b=s(n),p=a,m=b["".concat(c,".").concat(p)]||b[p]||u[p]||o;return n?r.a.createElement(m,i(i({ref:t},d),{},{components:n})):r.a.createElement(m,i({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,c=new Array(o);c[0]=p;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var d=2;d<o;d++)c[d]=n[d];return r.a.createElement.apply(null,c)}return r.a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},235:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return s}));var a=n(3),r=n(7),o=(n(0),n(1348)),c={id:"redux_dialog_actions",title:"Module: redux/dialog/actions",sidebar_label:"redux/dialog/actions",custom_edit_url:null,hide_title:!0},i={unversionedId:"docs-client/modules/redux_dialog_actions",id:"docs-client/modules/redux_dialog_actions",isDocsHomePage:!1,title:"Module: redux/dialog/actions",description:"Module: redux/dialog/actions",source:"@site/docs/docs-client/modules/redux_dialog_actions.md",slug:"/docs-client/modules/redux_dialog_actions",permalink:"/docs/docs-client/modules/redux_dialog_actions",editUrl:null,version:"current",sidebar_label:"redux/dialog/actions",sidebar:"sidebar",previous:{title:"Module: redux/devicedetect/service",permalink:"/docs/docs-client/modules/redux_devicedetect_service"},next:{title:"Module: redux/dialog/reducers",permalink:"/docs/docs-client/modules/redux_dialog_reducers"}},l=[{value:"Table of contents",id:"table-of-contents",children:[{value:"Interfaces",id:"interfaces",children:[]}]},{value:"Functions",id:"functions",children:[{value:"dialogClose",id:"dialogclose",children:[]},{value:"dialogShow",id:"dialogshow",children:[]}]}],d={toc:l};function s(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},d,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h1",{id:"module-reduxdialogactions"},"Module: redux/dialog/actions"),Object(o.b)("h2",{id:"table-of-contents"},"Table of contents"),Object(o.b)("h3",{id:"interfaces"},"Interfaces"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",{parentName:"li",href:"/docs/docs-client/interfaces/redux_dialog_actions.dialogaction"},"DialogAction")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",{parentName:"li",href:"/docs/docs-client/interfaces/redux_dialog_actions.dialogstate"},"DialogState"))),Object(o.b)("h2",{id:"functions"},"Functions"),Object(o.b)("h3",{id:"dialogclose"},"dialogClose"),Object(o.b)("p",null,"\u25b8 ",Object(o.b)("strong",{parentName:"p"},"dialogClose"),"(): ",Object(o.b)("a",{parentName:"p",href:"/docs/docs-client/interfaces/redux_dialog_actions.dialogaction"},Object(o.b)("em",{parentName:"a"},"DialogAction"))),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Returns:")," ",Object(o.b)("a",{parentName:"p",href:"/docs/docs-client/interfaces/redux_dialog_actions.dialogaction"},Object(o.b)("em",{parentName:"a"},"DialogAction"))),Object(o.b)("p",null,"Defined in: ",Object(o.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/dialog/actions.ts#L20"},"packages/client-core/redux/dialog/actions.ts:20")),Object(o.b)("hr",null),Object(o.b)("h3",{id:"dialogshow"},"dialogShow"),Object(o.b)("p",null,"\u25b8 ",Object(o.b)("strong",{parentName:"p"},"dialogShow"),"(",Object(o.b)("inlineCode",{parentName:"p"},"content"),": ",Object(o.b)("em",{parentName:"p"},"any"),"): ",Object(o.b)("a",{parentName:"p",href:"/docs/docs-client/interfaces/redux_dialog_actions.dialogaction"},Object(o.b)("em",{parentName:"a"},"DialogAction"))),Object(o.b)("h4",{id:"parameters"},"Parameters:"),Object(o.b)("table",null,Object(o.b)("thead",{parentName:"table"},Object(o.b)("tr",{parentName:"thead"},Object(o.b)("th",{parentName:"tr",align:"left"},"Name"),Object(o.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(o.b)("tbody",{parentName:"table"},Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"content")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"any"))))),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Returns:")," ",Object(o.b)("a",{parentName:"p",href:"/docs/docs-client/interfaces/redux_dialog_actions.dialogaction"},Object(o.b)("em",{parentName:"a"},"DialogAction"))),Object(o.b)("p",null,"Defined in: ",Object(o.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/dialog/actions.ts#L14"},"packages/client-core/redux/dialog/actions.ts:14")))}s.isMDXComponent=!0}}]);