(window.webpackJsonp=window.webpackJsonp||[]).push([[496],{2722:function(e,r,t){"use strict";t.d(r,"a",(function(){return p})),t.d(r,"b",(function(){return m}));var o=t(0),n=t.n(o);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function c(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?c(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,o,n=function(e,r){if(null==e)return{};var t,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)t=a[o],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)t=a[o],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var i=n.a.createContext({}),u=function(e){var r=n.a.useContext(i),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},p=function(e){var r=u(e.components);return n.a.createElement(i.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.a.createElement(n.a.Fragment,{},r)}},b=n.a.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,i=l(e,["components","mdxType","originalType","parentName"]),p=u(t),b=o,m=p["".concat(c,".").concat(b)]||p[b]||d[b]||a;return t?n.a.createElement(m,s(s({ref:r},i),{},{components:t})):n.a.createElement(m,s({ref:r},i))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,c=new Array(a);c[0]=b;var s={};for(var l in r)hasOwnProperty.call(r,l)&&(s[l]=r[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,c[1]=s;for(var i=2;i<a;i++)c[i]=t[i];return n.a.createElement.apply(null,c)}return n.a.createElement.apply(null,t)}b.displayName="MDXCreateElement"},566:function(e,r,t){"use strict";t.r(r),t.d(r,"frontMatter",(function(){return c})),t.d(r,"metadata",(function(){return s})),t.d(r,"toc",(function(){return l})),t.d(r,"default",(function(){return u}));var o=t(3),n=t(7),a=(t(0),t(2722)),c={id:"hooks_remove_related_resources",title:"Module: hooks/remove-related-resources",sidebar_label:"hooks/remove-related-resources",custom_edit_url:null,hide_title:!0},s={unversionedId:"docs-server-core/modules/hooks_remove_related_resources",id:"docs-server-core/modules/hooks_remove_related_resources",isDocsHomePage:!1,title:"Module: hooks/remove-related-resources",description:"Module: hooks/remove-related-resources",source:"@site/docs/docs-server-core/modules/hooks_remove_related_resources.md",slug:"/docs-server-core/modules/hooks_remove_related_resources",permalink:"/docs/docs-server-core/modules/hooks_remove_related_resources",editUrl:null,version:"current",sidebar_label:"hooks/remove-related-resources",sidebar:"sidebar",previous:{title:"Module: hooks/remove-previous-thumbnail",permalink:"/docs/docs-server-core/modules/hooks_remove_previous_thumbnail"},next:{title:"Module: hooks/replace-thumbnail-link",permalink:"/docs/docs-server-core/modules/hooks_replace_thumbnail_link"}},l=[{value:"Properties",id:"properties",children:[{value:"default",id:"default",children:[]}]}],i={toc:l};function u(e){var r=e.components,t=Object(n.a)(e,["components"]);return Object(a.b)("wrapper",Object(o.a)({},i,t,{components:r,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"module-hooksremove-related-resources"},"Module: hooks/remove-related-resources"),Object(a.b)("h2",{id:"properties"},"Properties"),Object(a.b)("h3",{id:"default"},"default"),Object(a.b)("p",null,"\u2022 ",Object(a.b)("strong",{parentName:"p"},"default"),": (",Object(a.b)("inlineCode",{parentName:"p"},"options"),": {}) => ",Object(a.b)("em",{parentName:"p"},"Hook"),"<any, Service<any",">",">"),Object(a.b)("h4",{id:"type-declaration"},"Type declaration:"),Object(a.b)("p",null,"\u25b8 (",Object(a.b)("inlineCode",{parentName:"p"},"options?"),": {}): ",Object(a.b)("em",{parentName:"p"},"Hook"),"<any, Service<any",">",">"),Object(a.b)("h4",{id:"parameters"},"Parameters:"),Object(a.b)("table",null,Object(a.b)("thead",{parentName:"table"},Object(a.b)("tr",{parentName:"thead"},Object(a.b)("th",{parentName:"tr",align:"left"},"Name"),Object(a.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(a.b)("tbody",{parentName:"table"},Object(a.b)("tr",{parentName:"tbody"},Object(a.b)("td",{parentName:"tr",align:"left"},Object(a.b)("inlineCode",{parentName:"td"},"options")),Object(a.b)("td",{parentName:"tr",align:"left"},Object(a.b)("em",{parentName:"td"},"object"))))),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Returns:")," ",Object(a.b)("em",{parentName:"p"},"Hook"),"<any, Service<any",">",">"),Object(a.b)("p",null,"Defined in: ",Object(a.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/server-core/src/hooks/remove-related-resources.ts#L26"},"packages/server-core/src/hooks/remove-related-resources.ts:26")))}u.isMDXComponent=!0}}]);