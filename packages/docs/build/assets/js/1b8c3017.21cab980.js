(window.webpackJsonp=window.webpackJsonp||[]).push([[277],{2722:function(e,t,r){"use strict";r.d(t,"a",(function(){return o})),r.d(t,"b",(function(){return O}));var a=r(0),c=r.n(a);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function b(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?b(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):b(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,a,c=function(e,t){if(null==e)return{};var r,a,c={},n=Object.keys(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||(c[r]=e[r]);return c}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(c[r]=e[r])}return c}var s=c.a.createContext({}),p=function(e){var t=c.a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},o=function(e){var t=p(e.components);return c.a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return c.a.createElement(c.a.Fragment,{},t)}},d=c.a.forwardRef((function(e,t){var r=e.components,a=e.mdxType,n=e.originalType,b=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),o=p(r),d=a,O=o["".concat(b,".").concat(d)]||o[d]||m[d]||n;return r?c.a.createElement(O,l(l({ref:t},s),{},{components:r})):c.a.createElement(O,l({ref:t},s))}));function O(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var n=r.length,b=new Array(n);b[0]=d;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:a,b[1]=l;for(var s=2;s<n;s++)b[s]=r[s];return c.a.createElement.apply(null,b)}return c.a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},343:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return b})),r.d(t,"metadata",(function(){return l})),r.d(t,"toc",(function(){return i})),r.d(t,"default",(function(){return p}));var a=r(3),c=r(7),n=(r(0),r(2722)),b={id:"src_common_reducers_alert_service",title:"Module: src/common/reducers/alert/service",sidebar_label:"src/common/reducers/alert/service",custom_edit_url:null,hide_title:!0},l={unversionedId:"docs-client-core/modules/src_common_reducers_alert_service",id:"docs-client-core/modules/src_common_reducers_alert_service",isDocsHomePage:!1,title:"Module: src/common/reducers/alert/service",description:"Module: src/common/reducers/alert/service",source:"@site/docs/docs-client-core/modules/src_common_reducers_alert_service.md",slug:"/docs-client-core/modules/src_common_reducers_alert_service",permalink:"/docs/docs-client-core/modules/src_common_reducers_alert_service",editUrl:null,version:"current",sidebar_label:"src/common/reducers/alert/service",sidebar:"sidebar",previous:{title:"Module: src/common/reducers/alert/selector",permalink:"/docs/docs-client-core/modules/src_common_reducers_alert_selector"},next:{title:"Module: src/common/reducers/app/actions",permalink:"/docs/docs-client-core/modules/src_common_reducers_app_actions"}},i=[{value:"Functions",id:"functions",children:[{value:"alertCancel",id:"alertcancel",children:[]},{value:"alertError",id:"alerterror",children:[]},{value:"alertSuccess",id:"alertsuccess",children:[]},{value:"alertWarning",id:"alertwarning",children:[]},{value:"dispatchAlertCancel",id:"dispatchalertcancel",children:[]},{value:"dispatchAlertError",id:"dispatchalerterror",children:[]},{value:"dispatchAlertSuccess",id:"dispatchalertsuccess",children:[]},{value:"dispatchAlertWarning",id:"dispatchalertwarning",children:[]}]}],s={toc:i};function p(e){var t=e.components,r=Object(c.a)(e,["components"]);return Object(n.b)("wrapper",Object(a.a)({},s,r,{components:t,mdxType:"MDXLayout"}),Object(n.b)("h1",{id:"module-srccommonreducersalertservice"},"Module: src/common/reducers/alert/service"),Object(n.b)("h2",{id:"functions"},"Functions"),Object(n.b)("h3",{id:"alertcancel"},"alertCancel"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"alertCancel"),"(): ",Object(n.b)("em",{parentName:"p"},"function")),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," (",Object(n.b)("inlineCode",{parentName:"p"},"dispatch"),": ",Object(n.b)("em",{parentName:"p"},"Dispatch"),"<AnyAction",">",") => ",Object(n.b)("em",{parentName:"p"},"any")),Object(n.b)("p",null,"Defined in: ",Object(n.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/client-core/src/common/reducers/alert/service.ts#L23"},"packages/client-core/src/common/reducers/alert/service.ts:23")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"alerterror"},"alertError"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"alertError"),"(",Object(n.b)("inlineCode",{parentName:"p"},"message"),": ",Object(n.b)("em",{parentName:"p"},"string"),"): ",Object(n.b)("em",{parentName:"p"},"function")),Object(n.b)("h4",{id:"parameters"},"Parameters:"),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",{parentName:"tr",align:"left"},"Name"),Object(n.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"message")),Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("em",{parentName:"td"},"string"))))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," (",Object(n.b)("inlineCode",{parentName:"p"},"dispatch"),": ",Object(n.b)("em",{parentName:"p"},"Dispatch"),"<AnyAction",">",") => ",Object(n.b)("em",{parentName:"p"},"any")),Object(n.b)("p",null,"Defined in: ",Object(n.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/client-core/src/common/reducers/alert/service.ts#L18"},"packages/client-core/src/common/reducers/alert/service.ts:18")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"alertsuccess"},"alertSuccess"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"alertSuccess"),"(",Object(n.b)("inlineCode",{parentName:"p"},"message"),": ",Object(n.b)("em",{parentName:"p"},"string"),"): ",Object(n.b)("em",{parentName:"p"},"function")),Object(n.b)("h4",{id:"parameters-1"},"Parameters:"),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",{parentName:"tr",align:"left"},"Name"),Object(n.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"message")),Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("em",{parentName:"td"},"string"))))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," (",Object(n.b)("inlineCode",{parentName:"p"},"dispatch"),": ",Object(n.b)("em",{parentName:"p"},"Dispatch"),"<AnyAction",">",") => ",Object(n.b)("em",{parentName:"p"},"any")),Object(n.b)("p",null,"Defined in: ",Object(n.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/client-core/src/common/reducers/alert/service.ts#L8"},"packages/client-core/src/common/reducers/alert/service.ts:8")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"alertwarning"},"alertWarning"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"alertWarning"),"(",Object(n.b)("inlineCode",{parentName:"p"},"message"),": ",Object(n.b)("em",{parentName:"p"},"string"),"): ",Object(n.b)("em",{parentName:"p"},"function")),Object(n.b)("h4",{id:"parameters-2"},"Parameters:"),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",{parentName:"tr",align:"left"},"Name"),Object(n.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"message")),Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("em",{parentName:"td"},"string"))))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," (",Object(n.b)("inlineCode",{parentName:"p"},"dispatch"),": ",Object(n.b)("em",{parentName:"p"},"Dispatch"),"<AnyAction",">",") => ",Object(n.b)("em",{parentName:"p"},"any")),Object(n.b)("p",null,"Defined in: ",Object(n.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/client-core/src/common/reducers/alert/service.ts#L13"},"packages/client-core/src/common/reducers/alert/service.ts:13")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"dispatchalertcancel"},"dispatchAlertCancel"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"dispatchAlertCancel"),"(",Object(n.b)("inlineCode",{parentName:"p"},"dispatch"),": Dispatch): ",Object(n.b)("a",{parentName:"p",href:"/docs/docs-client-core/interfaces/src_common_reducers_alert_actions.alertaction"},Object(n.b)("em",{parentName:"a"},"AlertAction"))),Object(n.b)("h4",{id:"parameters-3"},"Parameters:"),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",{parentName:"tr",align:"left"},"Name"),Object(n.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"dispatch")),Object(n.b)("td",{parentName:"tr",align:"left"},"Dispatch")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("a",{parentName:"p",href:"/docs/docs-client-core/interfaces/src_common_reducers_alert_actions.alertaction"},Object(n.b)("em",{parentName:"a"},"AlertAction"))),Object(n.b)("p",null,"Defined in: ",Object(n.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/client-core/src/common/reducers/alert/service.ts#L54"},"packages/client-core/src/common/reducers/alert/service.ts:54")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"dispatchalerterror"},"dispatchAlertError"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"dispatchAlertError"),"(",Object(n.b)("inlineCode",{parentName:"p"},"dispatch"),": Dispatch, ",Object(n.b)("inlineCode",{parentName:"p"},"message"),": ",Object(n.b)("em",{parentName:"p"},"string"),"): ",Object(n.b)("a",{parentName:"p",href:"/docs/docs-client-core/interfaces/src_common_reducers_alert_actions.alertaction"},Object(n.b)("em",{parentName:"a"},"AlertAction"))),Object(n.b)("h4",{id:"parameters-4"},"Parameters:"),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",{parentName:"tr",align:"left"},"Name"),Object(n.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"dispatch")),Object(n.b)("td",{parentName:"tr",align:"left"},"Dispatch")),Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"message")),Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("em",{parentName:"td"},"string"))))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("a",{parentName:"p",href:"/docs/docs-client-core/interfaces/src_common_reducers_alert_actions.alertaction"},Object(n.b)("em",{parentName:"a"},"AlertAction"))),Object(n.b)("p",null,"Defined in: ",Object(n.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/client-core/src/common/reducers/alert/service.ts#L50"},"packages/client-core/src/common/reducers/alert/service.ts:50")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"dispatchalertsuccess"},"dispatchAlertSuccess"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"dispatchAlertSuccess"),"(",Object(n.b)("inlineCode",{parentName:"p"},"dispatch"),": Dispatch, ",Object(n.b)("inlineCode",{parentName:"p"},"message"),": ",Object(n.b)("em",{parentName:"p"},"string"),"): ",Object(n.b)("a",{parentName:"p",href:"/docs/docs-client-core/interfaces/src_common_reducers_alert_actions.alertaction"},Object(n.b)("em",{parentName:"a"},"AlertAction"))),Object(n.b)("h4",{id:"parameters-5"},"Parameters:"),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",{parentName:"tr",align:"left"},"Name"),Object(n.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"dispatch")),Object(n.b)("td",{parentName:"tr",align:"left"},"Dispatch")),Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"message")),Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("em",{parentName:"td"},"string"))))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("a",{parentName:"p",href:"/docs/docs-client-core/interfaces/src_common_reducers_alert_actions.alertaction"},Object(n.b)("em",{parentName:"a"},"AlertAction"))),Object(n.b)("p",null,"Defined in: ",Object(n.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/client-core/src/common/reducers/alert/service.ts#L42"},"packages/client-core/src/common/reducers/alert/service.ts:42")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"dispatchalertwarning"},"dispatchAlertWarning"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"dispatchAlertWarning"),"(",Object(n.b)("inlineCode",{parentName:"p"},"dispatch"),": Dispatch, ",Object(n.b)("inlineCode",{parentName:"p"},"message"),": ",Object(n.b)("em",{parentName:"p"},"string"),"): ",Object(n.b)("a",{parentName:"p",href:"/docs/docs-client-core/interfaces/src_common_reducers_alert_actions.alertaction"},Object(n.b)("em",{parentName:"a"},"AlertAction"))),Object(n.b)("h4",{id:"parameters-6"},"Parameters:"),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",{parentName:"tr",align:"left"},"Name"),Object(n.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"dispatch")),Object(n.b)("td",{parentName:"tr",align:"left"},"Dispatch")),Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("inlineCode",{parentName:"td"},"message")),Object(n.b)("td",{parentName:"tr",align:"left"},Object(n.b)("em",{parentName:"td"},"string"))))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("a",{parentName:"p",href:"/docs/docs-client-core/interfaces/src_common_reducers_alert_actions.alertaction"},Object(n.b)("em",{parentName:"a"},"AlertAction"))),Object(n.b)("p",null,"Defined in: ",Object(n.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/client-core/src/common/reducers/alert/service.ts#L46"},"packages/client-core/src/common/reducers/alert/service.ts:46")))}p.isMDXComponent=!0}}]);