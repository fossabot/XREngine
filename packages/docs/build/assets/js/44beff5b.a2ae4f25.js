(window.webpackJsonp=window.webpackJsonp||[]).push([[716],{2722:function(e,t,r){"use strict";r.d(t,"a",(function(){return l})),r.d(t,"b",(function(){return b}));var n=r(0),o=r.n(n);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=o.a.createContext({}),p=function(e){var t=o.a.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=p(e.components);return o.a.createElement(u.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),l=p(r),d=n,b=l["".concat(s,".").concat(d)]||l[d]||m[d]||a;return r?o.a.createElement(b,i(i({ref:t},u),{},{components:r})):o.a.createElement(b,i({ref:t},u))}));function b(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,s=new Array(a);s[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:n,s[1]=i;for(var u=2;u<a;u++)s[u]=r[u];return o.a.createElement.apply(null,s)}return o.a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},786:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return s})),r.d(t,"metadata",(function(){return i})),r.d(t,"toc",(function(){return c})),r.d(t,"default",(function(){return p}));var n=r(3),o=r(7),a=(r(0),r(2722)),s={id:"hooks_message_permission_authenticate",title:"Module: hooks/message-permission-authenticate",sidebar_label:"hooks/message-permission-authenticate",custom_edit_url:null,hide_title:!0},i={unversionedId:"docs-server-core/modules/hooks_message_permission_authenticate",id:"docs-server-core/modules/hooks_message_permission_authenticate",isDocsHomePage:!1,title:"Module: hooks/message-permission-authenticate",description:"Module: hooks/message-permission-authenticate",source:"@site/docs/docs-server-core/modules/hooks_message_permission_authenticate.md",slug:"/docs-server-core/modules/hooks_message_permission_authenticate",permalink:"/docs/docs-server-core/modules/hooks_message_permission_authenticate",editUrl:null,version:"current",sidebar_label:"hooks/message-permission-authenticate",sidebar:"sidebar",previous:{title:"Module: hooks/make-s3-files-public",permalink:"/docs/docs-server-core/modules/hooks_make_s3_files_public"},next:{title:"Module: hooks/notifications",permalink:"/docs/docs-server-core/modules/hooks_notifications"}},c=[{value:"Properties",id:"properties",children:[{value:"default",id:"default",children:[]}]}],u={toc:c};function p(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(n.a)({},u,r,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"module-hooksmessage-permission-authenticate"},"Module: hooks/message-permission-authenticate"),Object(a.b)("h2",{id:"properties"},"Properties"),Object(a.b)("h3",{id:"default"},"default"),Object(a.b)("p",null,"\u2022 ",Object(a.b)("strong",{parentName:"p"},"default"),": () => (",Object(a.b)("inlineCode",{parentName:"p"},"context"),": ",Object(a.b)("em",{parentName:"p"},"HookContext"),"<any, Service<any",">",">",") => ",Object(a.b)("em",{parentName:"p"},"Promise"),"<HookContext<any, Service<any",">",">",">"),Object(a.b)("h4",{id:"type-declaration"},"Type declaration:"),Object(a.b)("p",null,"\u25b8 (): ",Object(a.b)("em",{parentName:"p"},"function")),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Returns:")," (",Object(a.b)("inlineCode",{parentName:"p"},"context"),": ",Object(a.b)("em",{parentName:"p"},"HookContext"),"<any, Service<any",">",">",") => ",Object(a.b)("em",{parentName:"p"},"Promise"),"<HookContext<any, Service<any",">",">",">"),Object(a.b)("p",null,"Defined in: ",Object(a.b)("a",{parentName:"p",href:"https://github.com/xr3ngine/xr3ngine/blob/716a06460/packages/server-core/src/hooks/message-permission-authenticate.ts#L3"},"packages/server-core/src/hooks/message-permission-authenticate.ts:3")))}p.isMDXComponent=!0}}]);