(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9679],{20193:function(e,n,t){"use strict";function r(){return(r=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}t.d(n,{Z:function(){return r}})},44807:function(e,n,t){"use strict";function r(e,n){return n||(n=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}t.d(n,{Z:function(){return r}})},66742:function(e,n,t){var r;"undefined"!=typeof self&&self,e.exports=(r=t(27878),function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=11)}([function(e,n){e.exports=r},function(e,n,t){"use strict";function r(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:window,r=void 0;"function"==typeof window.CustomEvent?r=new window.CustomEvent(e,{detail:n}):(r=document.createEvent("CustomEvent")).initCustomEvent(e,!1,!0,n),t&&(t.dispatchEvent(r),a()(c.e,n))}function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];r(s,a()({},e,{type:s}),n)}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];r(l,a()({},e,{type:l}),n)}t.d(n,"b",(function(){return s})),t.d(n,"a",(function(){return l})),n.d=o,n.c=i;var u=t(4),a=t.n(u),c=t(2),s="REACT_CONTEXTMENU_SHOW",l="REACT_CONTEXTMENU_HIDE"},function(e,n,t){"use strict";function r(e){for(var n=arguments.length,t=Array(n>1?n-1:0),r=1;r<n;r++)t[r-1]=arguments[r];return"function"==typeof e&&e.apply(void 0,t)}function o(e,n){return Object.prototype.hasOwnProperty.call(e,n)}function i(){return Math.random().toString(36).substring(7)}n.a=r,n.d=o,n.f=i,t.d(n,"c",(function(){return u})),t.d(n,"e",(function(){return a})),t.d(n,"b",(function(){return c}));var u={menu:"react-contextmenu",menuVisible:"react-contextmenu--visible",menuWrapper:"react-contextmenu-wrapper",menuItem:"react-contextmenu-item",menuItemActive:"react-contextmenu-item--active",menuItemDisabled:"react-contextmenu-item--disabled",menuItemDivider:"react-contextmenu-item--divider",menuItemSelected:"react-contextmenu-item--selected",subMenu:"react-contextmenu-submenu"},a={},c=Boolean("undefined"!=typeof window&&window.document&&window.document.createElement)},function(e,n,t){e.exports=t(13)()},function(e,n,t){"use strict";function r(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}var o=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var n={},t=0;t<10;t++)n["_"+String.fromCharCode(t)]=t;if("0123456789"!==Object.getOwnPropertyNames(n).map((function(e){return n[e]})).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach((function(e){r[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,n){for(var t,a,c=r(e),s=1;s<arguments.length;s++){for(var l in t=Object(arguments[s]))i.call(t,l)&&(c[l]=t[l]);if(o){a=o(t);for(var d=0;d<a.length;d++)u.call(t,a[d])&&(c[a[d]]=t[a[d]])}}return c}},function(e,n,t){var r;!function(){"use strict";function t(){for(var e=[],n=0;n<arguments.length;n++){var r=arguments[n];if(r){var i=typeof r;if("string"===i||"number"===i)e.push(r);else if(Array.isArray(r)&&r.length){var u=t.apply(null,r);u&&e.push(u)}else if("object"===i)for(var a in r)o.call(r,a)&&r[a]&&e.push(a)}}return e.join(" ")}var o={}.hasOwnProperty;void 0!==e&&e.exports?(t.default=t,e.exports=t):void 0!==(r=function(){return t}.apply(n,[]))&&(e.exports=r)}()},function(e,n,t){"use strict";function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var o=t(1),i=t(2),u=function e(){var n=this;r(this,e),this.handleShowEvent=function(e){for(var t in n.callbacks)Object(i.d)(n.callbacks,t)&&n.callbacks[t].show(e)},this.handleHideEvent=function(e){for(var t in n.callbacks)Object(i.d)(n.callbacks,t)&&n.callbacks[t].hide(e)},this.register=function(e,t){var r=Object(i.f)();return n.callbacks[r]={show:e,hide:t},r},this.unregister=function(e){e&&n.callbacks[e]&&delete n.callbacks[e]},this.callbacks={},i.b&&(window.addEventListener(o.b,this.handleShowEvent),window.addEventListener(o.a,this.handleHideEvent))};n.a=new u},function(e,n,t){"use strict";function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function o(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=t(0),a=t.n(u),c=t(3),s=t.n(c),l=t(8),d=function(e){function n(e){r(this,n);var t=o(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return f.call(t),t.seletedItemRef=null,t.state={selectedItem:null,forceSubMenuOpen:!1},t}return i(n,e),n}(u.Component);d.propTypes={children:s.a.node.isRequired};var f=function(){var e=this;this.handleKeyNavigation=function(n){if(!1!==e.state.isVisible)switch(n.keyCode){case 37:case 27:n.preventDefault(),e.hideMenu(n);break;case 38:n.preventDefault(),e.selectChildren(!0);break;case 40:n.preventDefault(),e.selectChildren(!1);break;case 39:e.tryToOpenSubMenu(n);break;case 13:n.preventDefault(),e.tryToOpenSubMenu(n);var t=e.seletedItemRef&&e.seletedItemRef.props&&e.seletedItemRef.props.disabled;e.seletedItemRef&&e.seletedItemRef.ref instanceof HTMLElement&&!t?e.seletedItemRef.ref.click():e.hideMenu(n)}},this.handleForceClose=function(){e.setState({forceSubMenuOpen:!1})},this.tryToOpenSubMenu=function(n){e.state.selectedItem&&e.state.selectedItem.type===e.getSubMenuType()&&(n.preventDefault(),e.setState({forceSubMenuOpen:!0}))},this.selectChildren=function(n){var t=e.state.selectedItem,r=[],o=0,i={},u=function n(t,u){t&&([l.a,e.getSubMenuType()].indexOf(t.type)<0?a.a.Children.forEach(t.props.children,n):t.props.divider||(t.props.disabled&&(++o,i[u]=!0),r.push(t)))};if(a.a.Children.forEach(e.props.children,u),o!==r.length){var c=function(e){var t=e;do{n?--t:++t,t<0?t=r.length-1:t>=r.length&&(t=0)}while(t!==e&&i[t]);return t===e?null:t}(r.indexOf(t));null!==c&&e.setState({selectedItem:r[c],forceSubMenuOpen:!1})}},this.onChildMouseMove=function(n){e.state.selectedItem!==n&&e.setState({selectedItem:n,forceSubMenuOpen:!1})},this.onChildMouseLeave=function(){e.setState({selectedItem:null,forceSubMenuOpen:!1})},this.renderChildren=function(n){return a.a.Children.map(n,(function(n){var t={};return a.a.isValidElement(n)?[l.a,e.getSubMenuType()].indexOf(n.type)<0?(t.children=e.renderChildren(n.props.children),a.a.cloneElement(n,t)):(t.onMouseLeave=e.onChildMouseLeave.bind(e),n.type===e.getSubMenuType()&&(t.forceOpen=e.state.forceSubMenuOpen&&e.state.selectedItem===n,t.forceClose=e.handleForceClose,t.parentKeyNavigationHandler=e.handleKeyNavigation),n.props.divider||e.state.selectedItem!==n?(t.onMouseMove=function(){return e.onChildMouseMove(n)},a.a.cloneElement(n,t)):(t.selected=!0,t.ref=function(n){e.seletedItemRef=n},a.a.cloneElement(n,t))):n}))}};n.a=d},function(e,n,t){"use strict";function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function i(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function u(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var a=t(0),c=t.n(a),s=t(3),l=t.n(s),d=t(5),f=t.n(d),p=t(4),h=t.n(p),b=t(1),m=t(2),v=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},y=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),g=function(e){function n(){var e,t,r;o(this,n);for(var u=arguments.length,a=Array(u),c=0;c<u;c++)a[c]=arguments[c];return t=r=i(this,(e=n.__proto__||Object.getPrototypeOf(n)).call.apply(e,[this].concat(a))),r.handleClick=function(e){0!==e.button&&1!==e.button&&e.preventDefault(),r.props.disabled||r.props.divider||(Object(m.a)(r.props.onClick,e,h()({},r.props.data,m.e.data),m.e.target),r.props.preventClose||Object(b.c)())},i(r,t)}return u(n,e),y(n,[{key:"render",value:function(){var e,n=this,t=this.props,o=t.attributes,i=t.children,u=t.className,a=t.disabled,s=t.divider,l=t.selected,d=f()(u,m.c.menuItem,o.className,(r(e={},f()(m.c.menuItemDisabled,o.disabledClassName),a),r(e,f()(m.c.menuItemDivider,o.dividerClassName),s),r(e,f()(m.c.menuItemSelected,o.selectedClassName),l),e));return c.a.createElement("div",v({},o,{className:d,role:"menuitem",tabIndex:"-1","aria-disabled":a?"true":"false","aria-orientation":s?"horizontal":null,ref:function(e){n.ref=e},onMouseMove:this.props.onMouseMove,onMouseLeave:this.props.onMouseLeave,onTouchEnd:this.handleClick,onClick:this.handleClick}),s?null:i)}}]),n}(a.Component);g.propTypes={attributes:l.a.object,children:l.a.node,className:l.a.string,data:l.a.object,disabled:l.a.bool,divider:l.a.bool,onClick:l.a.func,onMouseLeave:l.a.func,onMouseMove:l.a.func,preventClose:l.a.bool,selected:l.a.bool},g.defaultProps={attributes:{},children:null,className:"",data:{},disabled:!1,divider:!1,onClick:function(){return null},onMouseMove:function(){return null},onMouseLeave:function(){return null},preventClose:!1,selected:!1},n.a=g},function(e,n,t){"use strict";function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function i(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function u(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var a=t(0),c=t.n(a),s=t(3),l=t.n(s),d=t(5),f=t.n(d),p=t(4),h=t.n(p),b=t(1),m=t(7),v=t(2),y=t(6),g=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},O=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),w=function(e){function n(e){o(this,n);var t=i(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return t.getMenuPosition=function(){var e=window,n=e.innerWidth,r=e.innerHeight,o=t.subMenu.getBoundingClientRect(),i={};return o.bottom>r?i.bottom=0:i.top=0,o.right<n?i.left="100%":i.right="100%",i},t.getRTLMenuPosition=function(){var e=window.innerHeight,n=t.subMenu.getBoundingClientRect(),r={};return n.bottom>e?r.bottom=0:r.top=0,n.left<0?r.left="100%":r.right="100%",r},t.hideSubMenu=function(e){e.detail&&e.detail.id&&t.menu&&e.detail.id!==t.menu.id||(t.props.forceOpen&&t.props.forceClose(),t.setState({visible:!1,selectedItem:null}),t.unregisterHandlers())},t.handleClick=function(e){e.preventDefault(),t.props.disabled||(Object(v.a)(t.props.onClick,e,h()({},t.props.data,v.e.data),v.e.target),t.props.onClick&&!t.props.preventCloseOnClick&&Object(b.c)())},t.handleMouseEnter=function(){t.closetimer&&clearTimeout(t.closetimer),t.props.disabled||t.state.visible||(t.opentimer=setTimeout((function(){return t.setState({visible:!0,selectedItem:null})}),t.props.hoverDelay))},t.handleMouseLeave=function(){t.opentimer&&clearTimeout(t.opentimer),t.state.visible&&(t.closetimer=setTimeout((function(){return t.setState({visible:!1,selectedItem:null})}),t.props.hoverDelay))},t.menuRef=function(e){t.menu=e},t.subMenuRef=function(e){t.subMenu=e},t.registerHandlers=function(){document.removeEventListener("keydown",t.props.parentKeyNavigationHandler),document.addEventListener("keydown",t.handleKeyNavigation)},t.unregisterHandlers=function(e){document.removeEventListener("keydown",t.handleKeyNavigation),e||document.addEventListener("keydown",t.props.parentKeyNavigationHandler)},t.state=h()({},t.state,{visible:!1}),t}return u(n,e),O(n,[{key:"componentDidMount",value:function(){this.listenId=y.a.register((function(){}),this.hideSubMenu)}},{key:"getSubMenuType",value:function(){return n}},{key:"shouldComponentUpdate",value:function(e,n){return this.isVisibilityChange=!(this.state.visible===n.visible&&this.props.forceOpen===e.forceOpen||this.state.visible&&e.forceOpen||this.props.forceOpen&&n.visible),!0}},{key:"componentDidUpdate",value:function(){var e=this;if(this.isVisibilityChange)if(this.props.forceOpen||this.state.visible)(window.requestAnimationFrame||setTimeout)((function(){var n=e.props.rtl?e.getRTLMenuPosition():e.getMenuPosition();e.subMenu.style.removeProperty("top"),e.subMenu.style.removeProperty("bottom"),e.subMenu.style.removeProperty("left"),e.subMenu.style.removeProperty("right"),Object(v.d)(n,"top")&&(e.subMenu.style.top=n.top),Object(v.d)(n,"left")&&(e.subMenu.style.left=n.left),Object(v.d)(n,"bottom")&&(e.subMenu.style.bottom=n.bottom),Object(v.d)(n,"right")&&(e.subMenu.style.right=n.right),e.subMenu.classList.add(v.c.menuVisible),e.registerHandlers(),e.setState({selectedItem:null})}));else{var n=function n(){e.subMenu.removeEventListener("transitionend",n),e.subMenu.style.removeProperty("bottom"),e.subMenu.style.removeProperty("right"),e.subMenu.style.top=0,e.subMenu.style.left="100%",e.unregisterHandlers()};this.subMenu.addEventListener("transitionend",n),this.subMenu.classList.remove(v.c.menuVisible)}}},{key:"componentWillUnmount",value:function(){this.listenId&&y.a.unregister(this.listenId),this.opentimer&&clearTimeout(this.opentimer),this.closetimer&&clearTimeout(this.closetimer),this.unregisterHandlers(!0)}},{key:"render",value:function(){var e,n=this.props,t=n.children,o=n.attributes,i=n.disabled,u=n.title,a=n.selected,s=this.state.visible,l={ref:this.menuRef,onMouseEnter:this.handleMouseEnter,onMouseLeave:this.handleMouseLeave,className:f()(v.c.menuItem,v.c.subMenu,o.listClassName),style:{position:"relative"}},d={className:f()(v.c.menuItem,o.className,(e={},r(e,f()(v.c.menuItemDisabled,o.disabledClassName),i),r(e,f()(v.c.menuItemActive,o.visibleClassName),s),r(e,f()(v.c.menuItemSelected,o.selectedClassName),a),e)),onMouseMove:this.props.onMouseMove,onMouseOut:this.props.onMouseOut,onClick:this.handleClick},p={ref:this.subMenuRef,style:{position:"absolute",transition:"opacity 1ms",top:0,left:"100%"},className:f()(v.c.menu,this.props.className)};return c.a.createElement("nav",g({},l,{role:"menuitem",tabIndex:"-1","aria-haspopup":"true"}),c.a.createElement("div",g({},o,d),u),c.a.createElement("nav",g({},p,{role:"menu",tabIndex:"-1"}),this.renderChildren(t)))}}]),n}(m.a);w.propTypes={children:l.a.node.isRequired,attributes:l.a.object,title:l.a.node.isRequired,className:l.a.string,disabled:l.a.bool,hoverDelay:l.a.number,rtl:l.a.bool,selected:l.a.bool,onMouseMove:l.a.func,onMouseOut:l.a.func,forceOpen:l.a.bool,forceClose:l.a.func,parentKeyNavigationHandler:l.a.func},w.defaultProps={disabled:!1,hoverDelay:500,attributes:{},className:"",rtl:!1,selected:!1,onMouseMove:function(){return null},onMouseOut:function(){return null},forceOpen:!1,forceClose:function(){return null},parentKeyNavigationHandler:function(){return null}},n.a=w},function(e,n,t){"use strict";function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function o(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=t(0),a=t.n(u),c=t(3),s=t.n(c),l=t(5),d=t.n(l),f=t(4),p=t.n(f),h=t(1),b=t(2),m=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),v=function(e){function n(){var e,t,i;r(this,n);for(var u=arguments.length,a=Array(u),c=0;c<u;c++)a[c]=arguments[c];return t=i=o(this,(e=n.__proto__||Object.getPrototypeOf(n)).call.apply(e,[this].concat(a))),i.touchHandled=!1,i.handleMouseDown=function(e){i.props.holdToDisplay>=0&&0===e.button&&(e.persist(),e.stopPropagation(),i.mouseDownTimeoutId=setTimeout((function(){return i.handleContextClick(e)}),i.props.holdToDisplay)),Object(b.a)(i.props.attributes.onMouseDown,e)},i.handleMouseUp=function(e){0===e.button&&clearTimeout(i.mouseDownTimeoutId),Object(b.a)(i.props.attributes.onMouseUp,e)},i.handleMouseOut=function(e){0===e.button&&clearTimeout(i.mouseDownTimeoutId),Object(b.a)(i.props.attributes.onMouseOut,e)},i.handleTouchstart=function(e){i.touchHandled=!1,i.props.holdToDisplay>=0&&(e.persist(),e.stopPropagation(),i.touchstartTimeoutId=setTimeout((function(){i.handleContextClick(e),i.touchHandled=!0}),i.props.holdToDisplay)),Object(b.a)(i.props.attributes.onTouchStart,e)},i.handleTouchEnd=function(e){i.touchHandled&&e.preventDefault(),clearTimeout(i.touchstartTimeoutId),Object(b.a)(i.props.attributes.onTouchEnd,e)},i.handleContextMenu=function(e){e.button===i.props.mouseButton&&i.handleContextClick(e),Object(b.a)(i.props.attributes.onContextMenu,e)},i.handleMouseClick=function(e){e.button===i.props.mouseButton&&i.handleContextClick(e),Object(b.a)(i.props.attributes.onClick,e)},i.handleContextClick=function(e){if(!(i.props.disable||i.props.disableIfShiftIsPressed&&e.shiftKey)){e.preventDefault(),e.stopPropagation();var n=e.clientX||e.touches&&e.touches[0].pageX,t=e.clientY||e.touches&&e.touches[0].pageY;i.props.posX&&(n-=i.props.posX),i.props.posY&&(t-=i.props.posY),Object(h.c)();var r=Object(b.a)(i.props.collect,i.props),o={position:{x:n,y:t},target:i.elem,id:i.props.id};r&&"function"==typeof r.then?r.then((function(n){o.data=p()({},n,{target:e.target}),Object(h.d)(o)})):(o.data=p()({},r,{target:e.target}),Object(h.d)(o))}},i.elemRef=function(e){i.elem=e},o(i,t)}return i(n,e),m(n,[{key:"render",value:function(){var e=this.props,n=e.renderTag,t=e.attributes,r=e.children,o=p()({},t,{className:d()(b.c.menuWrapper,t.className),onContextMenu:this.handleContextMenu,onClick:this.handleMouseClick,onMouseDown:this.handleMouseDown,onMouseUp:this.handleMouseUp,onTouchStart:this.handleTouchstart,onTouchEnd:this.handleTouchEnd,onMouseOut:this.handleMouseOut,ref:this.elemRef});return a.a.createElement(n,o,r)}}]),n}(u.Component);v.propTypes={id:s.a.string.isRequired,children:s.a.node.isRequired,attributes:s.a.object,collect:s.a.func,disable:s.a.bool,holdToDisplay:s.a.number,posX:s.a.number,posY:s.a.number,renderTag:s.a.elementType,mouseButton:s.a.number,disableIfShiftIsPressed:s.a.bool},v.defaultProps={attributes:{},collect:function(){return null},disable:!1,holdToDisplay:1e3,renderTag:"div",posX:0,posY:0,mouseButton:2,disableIfShiftIsPressed:!1},n.a=v},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(12);t.d(n,"ContextMenu",(function(){return r.a}));var o=t(10);t.d(n,"ContextMenuTrigger",(function(){return o.a}));var i=t(8);t.d(n,"MenuItem",(function(){return i.a}));var u=t(9);t.d(n,"SubMenu",(function(){return u.a}));var a=t(15);t.d(n,"connectMenu",(function(){return a.a}));var c=t(1);t.d(n,"hideMenu",(function(){return c.c})),t.d(n,"showMenu",(function(){return c.d}))},function(e,n,t){"use strict";function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function i(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function u(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var a=t(0),c=t.n(a),s=t(3),l=t.n(s),d=t(5),f=t.n(d),p=t(4),h=t.n(p),b=t(6),m=t(7),v=t(9),y=t(1),g=t(2),O=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),w=function(e){function n(e){o(this,n);var t=i(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return t.registerHandlers=function(){document.addEventListener("mousedown",t.handleOutsideClick),document.addEventListener("touchstart",t.handleOutsideClick),t.props.preventHideOnScroll||document.addEventListener("scroll",t.handleHide),t.props.preventHideOnContextMenu||document.addEventListener("contextmenu",t.handleHide),document.addEventListener("keydown",t.handleKeyNavigation),t.props.preventHideOnResize||window.addEventListener("resize",t.handleHide)},t.unregisterHandlers=function(){document.removeEventListener("mousedown",t.handleOutsideClick),document.removeEventListener("touchstart",t.handleOutsideClick),document.removeEventListener("scroll",t.handleHide),document.removeEventListener("contextmenu",t.handleHide),document.removeEventListener("keydown",t.handleKeyNavigation),window.removeEventListener("resize",t.handleHide)},t.handleShow=function(e){if(e.detail.id===t.props.id&&!t.state.isVisible){var n=e.detail.position,r=n.x,o=n.y;t.setState({isVisible:!0,x:r,y:o}),t.registerHandlers(),Object(g.a)(t.props.onShow,e)}},t.handleHide=function(e){!t.state.isVisible||e.detail&&e.detail.id&&e.detail.id!==t.props.id||(t.unregisterHandlers(),t.setState({isVisible:!1,selectedItem:null,forceSubMenuOpen:!1}),Object(g.a)(t.props.onHide,e))},t.handleOutsideClick=function(e){t.menu.contains(e.target)||Object(y.c)()},t.handleMouseLeave=function(e){e.preventDefault(),Object(g.a)(t.props.onMouseLeave,e,h()({},t.props.data,g.e.data),g.e.target),t.props.hideOnLeave&&Object(y.c)()},t.handleContextMenu=function(e){e.preventDefault(),t.handleHide(e)},t.hideMenu=function(e){27!==e.keyCode&&13!==e.keyCode||Object(y.c)()},t.getMenuPosition=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r={top:n,left:e};if(!t.menu)return r;var o=window,i=o.innerWidth,u=o.innerHeight,a=t.menu.getBoundingClientRect();return n+a.height>u&&(r.top-=a.height),e+a.width>i&&(r.left-=a.width),r.top<0&&(r.top=a.height<u?(u-a.height)/2:0),r.left<0&&(r.left=a.width<i?(i-a.width)/2:0),r},t.getRTLMenuPosition=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r={top:n,left:e};if(!t.menu)return r;var o=window,i=o.innerWidth,u=o.innerHeight,a=t.menu.getBoundingClientRect();return r.left=e-a.width,n+a.height>u&&(r.top-=a.height),r.left<0&&(r.left+=a.width),r.top<0&&(r.top=a.height<u?(u-a.height)/2:0),r.left+a.width>i&&(r.left=a.width<i?(i-a.width)/2:0),r},t.menuRef=function(e){t.menu=e},t.state=h()({},t.state,{x:0,y:0,isVisible:!1}),t}return u(n,e),O(n,[{key:"getSubMenuType",value:function(){return v.a}},{key:"componentDidMount",value:function(){this.listenId=b.a.register(this.handleShow,this.handleHide)}},{key:"componentDidUpdate",value:function(){var e=this,n=window.requestAnimationFrame||setTimeout;n(this.state.isVisible?function(){var t=e.state,r=t.x,o=t.y,i=e.props.rtl?e.getRTLMenuPosition(r,o):e.getMenuPosition(r,o),u=i.top,a=i.left;n((function(){e.menu&&(e.menu.style.top=u+"px",e.menu.style.left=a+"px",e.menu.style.opacity=1,e.menu.style.pointerEvents="auto")}))}:function(){e.menu&&(e.menu.style.opacity=0,e.menu.style.pointerEvents="none")})}},{key:"componentWillUnmount",value:function(){this.listenId&&b.a.unregister(this.listenId),this.unregisterHandlers()}},{key:"render",value:function(){var e=this.props,n=e.children,t=e.className,o=e.style,i=this.state.isVisible,u=h()({},o,{position:"fixed",opacity:0,pointerEvents:"none"}),a=f()(g.c.menu,t,r({},g.c.menuVisible,i));return c.a.createElement("nav",{role:"menu",tabIndex:"-1",ref:this.menuRef,style:u,className:a,onContextMenu:this.handleContextMenu,onMouseLeave:this.handleMouseLeave},this.renderChildren(n))}}]),n}(m.a);w.propTypes={id:l.a.string.isRequired,children:l.a.node.isRequired,data:l.a.object,className:l.a.string,hideOnLeave:l.a.bool,rtl:l.a.bool,onHide:l.a.func,onMouseLeave:l.a.func,onShow:l.a.func,preventHideOnContextMenu:l.a.bool,preventHideOnResize:l.a.bool,preventHideOnScroll:l.a.bool,style:l.a.object},w.defaultProps={className:"",data:{},hideOnLeave:!1,rtl:!1,onHide:function(){return null},onMouseLeave:function(){return null},onShow:function(){return null},preventHideOnContextMenu:!1,preventHideOnResize:!1,preventHideOnScroll:!1,style:{}},n.a=w},function(e,n,t){"use strict";function r(){}function o(){}var i=t(14);o.resetWarningCache=r,e.exports=function(){function e(e,n,t,r,o,u){if(u!==i){var a=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function n(){return e}e.isRequired=e;var t={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:n,element:e,elementType:e,instanceOf:n,node:e,objectOf:n,oneOf:n,oneOfType:n,shape:n,exact:n,checkPropTypes:o,resetWarningCache:r};return t.PropTypes=t,t}},function(e,n,t){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,n,t){"use strict";function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function o(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=t(0),a=t.n(u),c=t(10),s=t(6),l=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},d=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),f=[].concat(function(e){if(Array.isArray(e)){for(var n=0,t=Array(e.length);n<e.length;n++)t[n]=e[n];return t}return Array.from(e)}(Object.keys(c.a.propTypes)),["children"]);n.a=function(e){return function(n){return function(t){function u(n){r(this,u);var t=o(this,(u.__proto__||Object.getPrototypeOf(u)).call(this,n));return t.handleShow=function(n){if(n.detail.id===e){var r=n.detail.data,o={};for(var i in r)f.includes(i)||(o[i]=r[i]);t.setState({trigger:o})}},t.handleHide=function(){t.setState({trigger:null})},t.state={trigger:null},t}return i(u,t),d(u,[{key:"componentDidMount",value:function(){this.listenId=s.a.register(this.handleShow,this.handleHide)}},{key:"componentWillUnmount",value:function(){this.listenId&&s.a.unregister(this.listenId)}},{key:"render",value:function(){return a.a.createElement(n,l({},this.props,{id:e,trigger:this.state.trigger}))}}]),u}(u.Component)}}}]))},26739:function(e,n,t){"use strict";t.d(n,{G:function(){return u},p:function(){return a}});var r=t(20193),o=t(27878),i=o.createElement,u=o.createContext(void 0);function a(e){return function(n){return i(u.Consumer,null,(function(t){return t?i(e,(0,r.Z)({},n,{api:t})):i(o.Fragment,null)}))}}},55956:function(e,n,t){"use strict";t.d(n,{zx:function(){return d},a7:function(){return f},kq:function(){return p},j2:function(){return h},I8:function(){return b}});var r=t(44807),o=t(98538);function i(){var e=(0,r.Z)(["\n  align-self: center;\n  justify-content: center;\n  width: 200px;\n"]);return i=function(){return e},e}function u(){var e=(0,r.Z)(["\n  background-color: transparent;\n  color: ",";\n  padding: 1px 8px;\n\n  &:hover {\n    background-color: rgba(255, 255, 255, 0.2);\n  }\n\n  &:active {\n    background-color: rgba(255, 255, 255, 0.2);\n  }\n\n  &:disabled {\n    background-color: transparent;\n    color: ",";\n\n    &:hover {\n      background-color: transparent;\n    }\n  }\n"]);return u=function(){return e},e}function a(){var e=(0,r.Z)(["\n  background-color: ",";\n  color: ",";\n\n  &:hover {\n    background-color: ",";\n  }\n\n  &:active {\n    background-color: ",";\n  }\n\n  &:disabled {\n    background-color: ",";\n    color: ",";\n\n    &:hover {\n      background-color: transparent;\n    }\n  }\n"]);return a=function(){return e},e}function c(){var e=(0,r.Z)(["\n  min-height: 24px;\n  padding: 1em 2em;\n  font-size: 1.5em;\n"]);return c=function(){return e},e}function s(){var e=(0,r.Z)(["\n  line-height: 1em;\n  height: 3em;\n  padding: 1em;\n"]);return s=function(){return e},e}function l(){var e=(0,r.Z)(["\n  display: flex;\n  border: none;\n  border-radius: 4px;\n  background: ",";\n  color: ",';\n  white-space: nowrap;\n  min-height: 24px;\n  font-size: 12px;\n  font-family: "Lato", sans-serif;\n  text-align: center;\n  cursor: pointer;\n  align-items: center;\n  justify-content: center;\n  text-decoration: none;\n  padding: 1px 6px;\n\n  &:hover {\n    color: ',";\n    background-color: ",";\n  }\n\n  &:active {\n    color: ",";\n    background-color: ",";\n  }\n\n  &:disabled {\n    background: ",";\n    color: ",";\n\n    &:hover {\n      background-color: ",";\n    }\n  }\n"]);return l=function(){return e},e}var d=o.ZP.button.attrs((function(e){return{type:e.type||"button"}}))(l(),(function(e){return e.theme.blue}),(function(e){return e.theme.white}),(function(e){return e.theme.text}),(function(e){return e.theme.bluePressed}),(function(e){return e.theme.text}),(function(e){return e.theme.bluePressed}),(function(e){return e.theme.disabled}),(function(e){return e.theme.disabledText}),(function(e){return e.theme.disabled})),f=(0,o.ZP)(d)(s()),p=((0,o.ZP)(d)(c()),(0,o.ZP)(d)(a(),(function(e){return e.theme.hover}),(function(e){return e.theme.text}),(function(e){return e.theme.text2}),(function(e){return e.theme.text2}),(function(e){return e.theme.disabled}),(function(e){return e.theme.disabledText}))),h=(0,o.ZP)(d)(u(),(function(e){return e.theme.text2}),(function(e){return e.theme.disabledText})),b=(0,o.ZP)(d)(i())},9424:function(e,n,t){"use strict";var r=t(44807);function o(){var e=(0,r.Z)(["\n  background-color: ",";\n  border-radius: 4px;\n  border: 1px solid ",";\n  color: ",";\n  height: 24px;\n  padding: 6px 8px;\n\n  &:hover {\n    border-color: ",";\n  }\n\n  &:focus {\n    border-color: ",";\n  }\n\n  &:disabled {\n    background-color: ",";\n    color: ",";\n  }\n"]);return o=function(){return e},e}function i(e,n){return e.canDrop?e.theme.blue:e.error?e.theme.error:n}var u=t(98538).ZP.input(o(),(function(e){return e.disabled?e.theme.disabled:e.theme.inputBackground}),(function(e){return i(e,e.theme.border)}),(function(e){return e.disabled?e.theme.disabledText:e.theme.text}),(function(e){return i(e,e.theme.blueHover)}),(function(e){return i(e,e.theme.blue)}),(function(e){return e.theme.disabled}),(function(e){return e.theme.disabledText}));n.Z=u},22400:function(e,n,t){"use strict";t.d(n,{Y:function(){return p}});var r=t(11742),o=t(44807),i=t(27878),u=t(98538),a=t(9424);function c(){var e=(0,o.Z)(["\n  display: flex;\n  width: 100%;\n"]);return c=function(){return e},e}function s(){var e=(0,o.Z)(["\n  display: flex;\n  width: 100%;\n"]);return s=function(){return e},e}var l=(0,u.ZP)(a.Z)(s()),d=i.forwardRef((function(e,n){var t=e.onChange,o=(0,r.Z)(e,["onChange"]);return i.createElement(l,Object.assign({onChange:function(e){return t(e.target.value,e)}},o,{ref:n}))}));d.displayName="StringInput",d.defaultProps={value:"",onChange:function(){},type:"text",required:!1,placeholder:""},n.Z=d;var f=u.ZP.div(c()),p=i.forwardRef((function(e,n){var t=e.onChange,o=e.value,u=(0,r.Z)(e,["onChange","value"]),a=(0,i.useRef)(),c=(0,i.useState)(o),s=c[0],d=c[1],p=(0,i.useCallback)((function(e){"Enter"!==e.key&&"Escape"!==e.key||a.current.blur()}),[]);(0,i.useEffect)((function(){d(o)}),[o]);var h=(0,i.useCallback)((function(){t(s)}),[t,s]),b=(0,i.useCallback)((function(e){d(e.target.value)}),[d]);return i.createElement(f,{ref:n},i.createElement(l,Object.assign({ref:a,onChange:b,onBlur:h,onKeyUp:p,value:s},u)))}));p.displayName="ControlledStringInput",p.defaultProps={value:"",onChange:function(){},type:"text",required:!1}},54522:function(e,n,t){"use strict";t.d(n,{ti:function(){return d},sN:function(){return f},AE:function(){return p},Wd:function(){return h},W4:function(){return b},xV:function(){return v}});var r=t(20193),o=t(11742),i=t(44807),u=t(27878),a=t(66742),c=t(98538),s=u.createElement;function l(){var e=(0,i.Z)(["\n  .react-contextmenu {\n    background-color: ",";\n    background-clip: padding-box;\n    border-radius: 4px;\n    margin: 2px 0 0;\n    min-width: 140px;\n    outline: none;\n    opacity: 0;\n    padding: 4px 0;\n    pointer-events: none;\n    text-align: left;\n    box-shadow: ",";\n  }\n\n  .react-contextmenu.react-contextmenu--visible {\n    opacity: 1;\n    pointer-events: auto;\n    z-index: 9999;\n  }\n\n  .react-contextmenu-item {\n    background: 0 0;\n    border: 0;\n    cursor: pointer;\n    line-height: 24px;\n    padding: 4px 8px;\n    text-align: inherit;\n    white-space: nowrap;\n    display: flex;\n    flex: 1;\n    justify-content: space-between;\n    color: ",";\n  }\n\n  .react-contextmenu-item.react-contextmenu-item--active,\n  .react-contextmenu-item.react-contextmenu-item--selected {\n    color: ",";\n    background-color: ",";\n    border-color: transparent;\n    text-decoration: none;\n  }\n\n  .react-contextmenu-item.react-contextmenu-item--disabled,\n  .react-contextmenu-item.react-contextmenu-item--disabled:hover {\n    background-color: transparent;\n    border-color: rgba(0,0,0,.15);\n    color: ",";\n  }\n\n  .react-contextmenu-item--divider {\n    border-bottom: 1px solid ",';\n    cursor: inherit;\n    margin: 4px 0;\n    height: 1px;\n    padding: 0;\n  }\n\n  .react-contextmenu-item.react-contextmenu-submenu {\n    padding: 0;\n  }\n\n  .react-contextmenu-item.react-contextmenu-submenu > .react-contextmenu-item::after {\n    display: inline-block;\n    font-size: 12px;\n    content: "\u25b8";\n    vertical-align: middle;\n  }\n']);return l=function(){return e},e}var d=a.connectMenu,f=a.MenuItem,p=a.showMenu,h=a.SubMenu,b=a.ContextMenuTrigger,m=(0,c.vJ)(l(),(function(e){return e.theme.dropdown}),(function(e){return e.theme.shadow30}),(function(e){return e.theme.text}),(function(e){return e.theme.text}),(function(e){return e.theme.selected}),(function(e){return e.theme.text}),(function(e){return e.theme.border})),v=function(e){var n=e.children,t=e.id,i=(0,o.Z)(e,["children","id"]);return s(u.Fragment,null,s(a.ContextMenu,(0,r.Z)({id:t},i),n),s(m,null))}},28008:function(e,n,t){"use strict";t.d(n,{sg:function(){return d},X2:function(){return f},Zo:function(){return p}});var r=t(44807),o=t(98538);function i(){var e=(0,r.Z)(["\n  overflow-x: auto;\n"]);return i=function(){return e},e}function u(){var e=(0,r.Z)(["\n  overflow-y: auto;\n  min-height: 0;\n"]);return u=function(){return e},e}function a(){var e=(0,r.Z)(["\n  display: flex;\n  flex: ",";\n  height: ",";\n  width: ",";\n"]);return a=function(){return e},e}function c(){var e=(0,r.Z)(["\n  display: flex;\n  flex-direction: column;\n  flex: ",";\n  height: ",";\n  width: ",";\n"]);return c=function(){return e},e}function s(e){return null==e.flex?0:"number"!==typeof e.flex?1:e.flex}function l(e){return"number"===typeof e?e+"px":"string"===typeof e?e:"auto"}var d=o.ZP.div(c(),s,(function(e){return l(e.height)}),(function(e){return l(e.width)})),f=o.ZP.div(a(),s,(function(e){return l(e.height)}),(function(e){return l(e.width)})),p=(0,o.ZP)(d)(u());(0,o.ZP)(f)(i())}}]);