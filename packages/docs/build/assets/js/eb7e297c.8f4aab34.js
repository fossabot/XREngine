(window.webpackJsonp=window.webpackJsonp||[]).push([[1177],{1246:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return a})),r.d(t,"metadata",(function(){return i})),r.d(t,"toc",(function(){return u})),r.d(t,"default",(function(){return s}));var n=r(3),o=r(7),c=(r(0),r(1348)),a={id:"redux_store",title:"Module: redux/store",sidebar_label:"redux/store",custom_edit_url:null,hide_title:!0},i={unversionedId:"docs-client/modules/redux_store",id:"docs-client/modules/redux_store",isDocsHomePage:!1,title:"Module: redux/store",description:"Module: redux/store",source:"@site/docs/docs-client/modules/redux_store.md",slug:"/docs-client/modules/redux_store",permalink:"/build/docs/docs-client/modules/redux_store",editUrl:null,version:"current",sidebar_label:"redux/store",sidebar:"sidebar",previous:{title:"Module: redux/service.common",permalink:"/build/docs/docs-client/modules/redux_service_common"},next:{title:"Module: redux/transport/actions",permalink:"/build/docs/docs-client/modules/redux_transport_actions"}},u=[{value:"Variables",id:"variables",children:[{value:"default",id:"default",children:[]}]},{value:"Functions",id:"functions",children:[{value:"configureStore",id:"configurestore",children:[]}]}],l={toc:u};function s(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(c.b)("h1",{id:"module-reduxstore"},"Module: redux/store"),Object(c.b)("h2",{id:"variables"},"Variables"),Object(c.b)("h3",{id:"default"},"default"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("inlineCode",{parentName:"p"},"Const")," ",Object(c.b)("strong",{parentName:"p"},"default"),": ",Object(c.b)("em",{parentName:"p"},"Store"),"<Object, Action<any",">",">"," & { ",Object(c.b)("inlineCode",{parentName:"p"},"dispatch"),": ",Object(c.b)("em",{parentName:"p"},"unknown"),"  }"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/store.ts#L10"},"packages/client-core/redux/store.ts:10")),Object(c.b)("h2",{id:"functions"},"Functions"),Object(c.b)("h3",{id:"configurestore"},"configureStore"),Object(c.b)("p",null,"\u25b8 ",Object(c.b)("strong",{parentName:"p"},"configureStore"),"(): ",Object(c.b)("em",{parentName:"p"},"Store"),"<Object, Action<any",">",">"," & { ",Object(c.b)("inlineCode",{parentName:"p"},"dispatch"),": ",Object(c.b)("em",{parentName:"p"},"unknown"),"  }"),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Returns:")," ",Object(c.b)("em",{parentName:"p"},"Store"),"<Object, Action<any",">",">"," & { ",Object(c.b)("inlineCode",{parentName:"p"},"dispatch"),": ",Object(c.b)("em",{parentName:"p"},"unknown"),"  }"),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/66a84a950/packages/client-core/redux/store.ts#L17"},"packages/client-core/redux/store.ts:17")))}s.isMDXComponent=!0},1348:function(e,t,r){"use strict";r.d(t,"a",(function(){return d})),r.d(t,"b",(function(){return m}));var n=r(0),o=r.n(n);function c(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){c(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=o.a.createContext({}),s=function(e){var t=o.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},d=function(e){var t=s(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,c=e.originalType,a=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),d=s(r),b=n,m=d["".concat(a,".").concat(b)]||d[b]||p[b]||c;return r?o.a.createElement(m,i(i({ref:t},l),{},{components:r})):o.a.createElement(m,i({ref:t},l))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=r.length,a=new Array(c);a[0]=b;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:n,a[1]=i;for(var l=2;l<c;l++)a[l]=r[l];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,r)}b.displayName="MDXCreateElement"}}]);