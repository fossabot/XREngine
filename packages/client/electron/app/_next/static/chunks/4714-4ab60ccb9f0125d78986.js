(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4714],{12455:function(e,t,n){"use strict";var r=n(87400),o=n(68625),i=n(27878),a=n(10101),s=n(31451),c=n(23868),l=i.forwardRef((function(e,t){var n=e.absolute,s=void 0!==n&&n,c=e.classes,l=e.className,d=e.component,u=void 0===d?"hr":d,p=e.flexItem,f=void 0!==p&&p,m=e.light,v=void 0!==m&&m,g=e.orientation,h=void 0===g?"horizontal":g,y=e.role,Z=void 0===y?"hr"!==u?"separator":void 0:y,b=e.variant,x=void 0===b?"fullWidth":b,E=(0,o.Z)(e,["absolute","classes","className","component","flexItem","light","orientation","role","variant"]);return i.createElement(u,(0,r.Z)({className:(0,a.Z)(c.root,l,"fullWidth"!==x&&c[x],s&&c.absolute,f&&c.flexItem,v&&c.light,"vertical"===h&&c.vertical),role:Z,ref:t},E))}));t.Z=(0,s.Z)((function(e){return{root:{height:1,margin:0,border:"none",flexShrink:0,backgroundColor:e.palette.divider},absolute:{position:"absolute",bottom:0,left:0,width:"100%"},inset:{marginLeft:72},light:{backgroundColor:(0,c.U1)(e.palette.divider,.08)},middle:{marginLeft:e.spacing(2),marginRight:e.spacing(2)},vertical:{height:"100%",width:1},flexItem:{alignSelf:"stretch",height:"auto"}}}),{name:"MuiDivider"})(l)},3921:function(e,t,n){"use strict";n.d(t,{ZP:function(){return N},ni:function(){return w},wE:function(){return k}});var r=n(87400),o=n(68625),i=n(27878),a=n(10101),s=n(3841),c=n(64432),l=n(31451),d=n(9531),u=n(47114),p=n(96840),f=n(93467),m=n(19858),v=n(37530),g=n(22078);function h(e,t){var n=function(e,t){var n,r=t.getBoundingClientRect();if(t.fakeTransform)n=t.fakeTransform;else{var o=window.getComputedStyle(t);n=o.getPropertyValue("-webkit-transform")||o.getPropertyValue("transform")}var i=0,a=0;if(n&&"none"!==n&&"string"===typeof n){var s=n.split("(")[1].split(")")[0].split(",");i=parseInt(s[4],10),a=parseInt(s[5],10)}return"left"===e?"translateX(".concat(window.innerWidth,"px) translateX(").concat(i-r.left,"px)"):"right"===e?"translateX(-".concat(r.left+r.width-i,"px)"):"up"===e?"translateY(".concat(window.innerHeight,"px) translateY(").concat(a-r.top,"px)"):"translateY(-".concat(r.top+r.height-a,"px)")}(e,t);n&&(t.style.webkitTransform=n,t.style.transform=n)}var y={enter:v.x9.enteringScreen,exit:v.x9.leavingScreen},Z=i.forwardRef((function(e,t){var n=e.children,a=e.direction,s=void 0===a?"down":a,c=e.in,l=e.onEnter,v=e.onEntered,Z=e.onEntering,b=e.onExit,x=e.onExited,E=e.onExiting,k=e.style,w=e.timeout,C=void 0===w?y:w,P=e.TransitionComponent,N=void 0===P?p.ZP:P,I=(0,o.Z)(e,["children","direction","in","onEnter","onEntered","onEntering","onExit","onExited","onExiting","style","timeout","TransitionComponent"]),T=(0,m.Z)(),S=i.useRef(null),B=i.useCallback((function(e){S.current=d.findDOMNode(e)}),[]),A=(0,f.Z)(n.ref,B),D=(0,f.Z)(A,t),R=function(e){return function(t){e&&(void 0===t?e(S.current):e(S.current,t))}},L=R((function(e,t){h(s,e),(0,g.n)(e),l&&l(e,t)})),M=R((function(e,t){var n=(0,g.C)({timeout:C,style:k},{mode:"enter"});e.style.webkitTransition=T.transitions.create("-webkit-transform",(0,r.Z)({},n,{easing:T.transitions.easing.easeOut})),e.style.transition=T.transitions.create("transform",(0,r.Z)({},n,{easing:T.transitions.easing.easeOut})),e.style.webkitTransform="none",e.style.transform="none",Z&&Z(e,t)})),O=R(v),V=R(E),z=R((function(e){var t=(0,g.C)({timeout:C,style:k},{mode:"exit"});e.style.webkitTransition=T.transitions.create("-webkit-transform",(0,r.Z)({},t,{easing:T.transitions.easing.sharp})),e.style.transition=T.transitions.create("transform",(0,r.Z)({},t,{easing:T.transitions.easing.sharp})),h(s,e),b&&b(e)})),_=R((function(e){e.style.webkitTransition="",e.style.transition="",x&&x(e)})),F=i.useCallback((function(){S.current&&h(s,S.current)}),[s]);return i.useEffect((function(){if(!c&&"down"!==s&&"right"!==s){var e=(0,u.Z)((function(){S.current&&h(s,S.current)}));return window.addEventListener("resize",e),function(){e.clear(),window.removeEventListener("resize",e)}}}),[s,c]),i.useEffect((function(){c||F()}),[c,F]),i.createElement(N,(0,r.Z)({nodeRef:S,onEnter:L,onEntered:O,onEntering:M,onExit:z,onExited:_,onExiting:V,appear:!0,in:c,timeout:C},I),(function(e,t){return i.cloneElement(n,(0,r.Z)({ref:D,style:(0,r.Z)({visibility:"exited"!==e||c?void 0:"hidden"},k,n.props.style)},t))}))})),b=n(68236),x=n(81879),E={left:"right",right:"left",top:"down",bottom:"up"};function k(e){return-1!==["left","right"].indexOf(e)}function w(e,t){return"rtl"===e.direction&&k(t)?E[t]:t}var C={enter:v.x9.enteringScreen,exit:v.x9.leavingScreen},P=i.forwardRef((function(e,t){var n=e.anchor,l=void 0===n?"left":n,d=e.BackdropProps,u=e.children,p=e.classes,f=e.className,v=e.elevation,g=void 0===v?16:v,h=e.ModalProps,y=(h=void 0===h?{}:h).BackdropProps,k=(0,o.Z)(h,["BackdropProps"]),P=e.onClose,N=e.open,I=void 0!==N&&N,T=e.PaperProps,S=void 0===T?{}:T,B=e.SlideProps,A=e.TransitionComponent,D=void 0===A?Z:A,R=e.transitionDuration,L=void 0===R?C:R,M=e.variant,O=void 0===M?"temporary":M,V=(0,o.Z)(e,["anchor","BackdropProps","children","classes","className","elevation","ModalProps","onClose","open","PaperProps","SlideProps","TransitionComponent","transitionDuration","variant"]),z=(0,m.Z)(),_=i.useRef(!1);i.useEffect((function(){_.current=!0}),[]);var F=w(z,l),W=i.createElement(b.Z,(0,r.Z)({elevation:"temporary"===O?g:0,square:!0},S,{className:(0,a.Z)(p.paper,p["paperAnchor".concat((0,x.Z)(F))],S.className,"temporary"!==O&&p["paperAnchorDocked".concat((0,x.Z)(F))])}),u);if("permanent"===O)return i.createElement("div",(0,r.Z)({className:(0,a.Z)(p.root,p.docked,f),ref:t},V),W);var Y=i.createElement(D,(0,r.Z)({in:I,direction:E[F],timeout:L,appear:_.current},B),W);return"persistent"===O?i.createElement("div",(0,r.Z)({className:(0,a.Z)(p.root,p.docked,f),ref:t},V),Y):i.createElement(s.Z,(0,r.Z)({BackdropProps:(0,r.Z)({},d,y,{transitionDuration:L}),BackdropComponent:c.Z,className:(0,a.Z)(p.root,p.modal,f),open:I,onClose:P,ref:t},V,k),Y)})),N=(0,l.Z)((function(e){return{root:{},docked:{flex:"0 0 auto"},paper:{overflowY:"auto",display:"flex",flexDirection:"column",height:"100%",flex:"1 0 auto",zIndex:e.zIndex.drawer,WebkitOverflowScrolling:"touch",position:"fixed",top:0,outline:0},paperAnchorLeft:{left:0,right:"auto"},paperAnchorRight:{left:"auto",right:0},paperAnchorTop:{top:0,left:0,bottom:"auto",right:0,height:"auto",maxHeight:"100%"},paperAnchorBottom:{top:"auto",left:0,bottom:0,right:0,height:"auto",maxHeight:"100%"},paperAnchorDockedLeft:{borderRight:"1px solid ".concat(e.palette.divider)},paperAnchorDockedTop:{borderBottom:"1px solid ".concat(e.palette.divider)},paperAnchorDockedRight:{borderLeft:"1px solid ".concat(e.palette.divider)},paperAnchorDockedBottom:{borderTop:"1px solid ".concat(e.palette.divider)},modal:{}}}),{name:"MuiDrawer",flip:!1})(P)},39627:function(e,t,n){"use strict";var r=n(87400),o=n(68625),i=n(27878),a=n(10101),s=n(31451),c=n(6930),l=n(70423),d=n(93467),u=n(25677),p=n(9531),f="undefined"===typeof window?i.useEffect:i.useLayoutEffect,m=i.forwardRef((function(e,t){var n=e.alignItems,s=void 0===n?"center":n,m=e.autoFocus,v=void 0!==m&&m,g=e.button,h=void 0!==g&&g,y=e.children,Z=e.classes,b=e.className,x=e.component,E=e.ContainerComponent,k=void 0===E?"li":E,w=e.ContainerProps,C=(w=void 0===w?{}:w).className,P=(0,o.Z)(w,["className"]),N=e.dense,I=void 0!==N&&N,T=e.disabled,S=void 0!==T&&T,B=e.disableGutters,A=void 0!==B&&B,D=e.divider,R=void 0!==D&&D,L=e.focusVisibleClassName,M=e.selected,O=void 0!==M&&M,V=(0,o.Z)(e,["alignItems","autoFocus","button","children","classes","className","component","ContainerComponent","ContainerProps","dense","disabled","disableGutters","divider","focusVisibleClassName","selected"]),z=i.useContext(u.Z),_={dense:I||z.dense||!1,alignItems:s},F=i.useRef(null);f((function(){v&&F.current&&F.current.focus()}),[v]);var W=i.Children.toArray(y),Y=W.length&&(0,l.Z)(W[W.length-1],["ListItemSecondaryAction"]),X=i.useCallback((function(e){F.current=p.findDOMNode(e)}),[]),$=(0,d.Z)(X,t),j=(0,r.Z)({className:(0,a.Z)(Z.root,b,_.dense&&Z.dense,!A&&Z.gutters,R&&Z.divider,S&&Z.disabled,h&&Z.button,"center"!==s&&Z.alignItemsFlexStart,Y&&Z.secondaryAction,O&&Z.selected),disabled:S},V),G=x||"li";return h&&(j.component=x||"div",j.focusVisibleClassName=(0,a.Z)(Z.focusVisible,L),G=c.Z),Y?(G=j.component||x?G:"div","li"===k&&("li"===G?G="div":"li"===j.component&&(j.component="div")),i.createElement(u.Z.Provider,{value:_},i.createElement(k,(0,r.Z)({className:(0,a.Z)(Z.container,C),ref:$},P),i.createElement(G,j,W),W.pop()))):i.createElement(u.Z.Provider,{value:_},i.createElement(G,(0,r.Z)({ref:$},j),W))}));t.Z=(0,s.Z)((function(e){return{root:{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",width:"100%",boxSizing:"border-box",textAlign:"left",paddingTop:8,paddingBottom:8,"&$focusVisible":{backgroundColor:e.palette.action.selected},"&$selected, &$selected:hover":{backgroundColor:e.palette.action.selected},"&$disabled":{opacity:.5}},container:{position:"relative"},focusVisible:{},dense:{paddingTop:4,paddingBottom:4},alignItemsFlexStart:{alignItems:"flex-start"},disabled:{},divider:{borderBottom:"1px solid ".concat(e.palette.divider),backgroundClip:"padding-box"},gutters:{paddingLeft:16,paddingRight:16},button:{transition:e.transitions.create("background-color",{duration:e.transitions.duration.shortest}),"&:hover":{textDecoration:"none",backgroundColor:e.palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}}},secondaryAction:{paddingRight:48},selected:{}}}),{name:"MuiListItem"})(m)},6699:function(e,t,n){"use strict";var r=n(87400),o=n(68625),i=n(27878),a=n(10101),s=n(31451),c=n(25677),l=i.forwardRef((function(e,t){var n=e.classes,s=e.className,l=(0,o.Z)(e,["classes","className"]),d=i.useContext(c.Z);return i.createElement("div",(0,r.Z)({className:(0,a.Z)(n.root,s,"flex-start"===d.alignItems&&n.alignItemsFlexStart),ref:t},l))}));t.Z=(0,s.Z)((function(e){return{root:{minWidth:56,color:e.palette.action.active,flexShrink:0,display:"inline-flex"},alignItemsFlexStart:{marginTop:8}}}),{name:"MuiListItemIcon"})(l)},2668:function(e,t,n){"use strict";var r=n(87400),o=n(68625),i=n(27878),a=n(10101),s=n(31451),c=n(66226),l=n(25677),d=i.forwardRef((function(e,t){var n=e.children,s=e.classes,d=e.className,u=e.disableTypography,p=void 0!==u&&u,f=e.inset,m=void 0!==f&&f,v=e.primary,g=e.primaryTypographyProps,h=e.secondary,y=e.secondaryTypographyProps,Z=(0,o.Z)(e,["children","classes","className","disableTypography","inset","primary","primaryTypographyProps","secondary","secondaryTypographyProps"]),b=i.useContext(l.Z).dense,x=null!=v?v:n;null==x||x.type===c.Z||p||(x=i.createElement(c.Z,(0,r.Z)({variant:b?"body2":"body1",className:s.primary,component:"span",display:"block"},g),x));var E=h;return null==E||E.type===c.Z||p||(E=i.createElement(c.Z,(0,r.Z)({variant:"body2",className:s.secondary,color:"textSecondary",display:"block"},y),E)),i.createElement("div",(0,r.Z)({className:(0,a.Z)(s.root,d,b&&s.dense,m&&s.inset,x&&E&&s.multiline),ref:t},Z),x,E)}));t.Z=(0,s.Z)({root:{flex:"1 1 auto",minWidth:0,marginTop:4,marginBottom:4},multiline:{marginTop:6,marginBottom:6},dense:{},inset:{paddingLeft:56},primary:{},secondary:{}},{name:"MuiListItemText"})(d)},90858:function(e,t){var n;!function(){"use strict";var r={}.hasOwnProperty;function o(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var i=typeof n;if("string"===i||"number"===i)e.push(n);else if(Array.isArray(n)&&n.length){var a=o.apply(null,n);a&&e.push(a)}else if("object"===i)for(var s in n)r.call(n,s)&&n[s]&&e.push(s)}}return e.join(" ")}e.exports?(o.default=o,e.exports=o):void 0===(n=function(){return o}.apply(t,[]))||(e.exports=n)}()},25700:function(e,t,n){"use strict";n.d(t,{p_:function(){return o},Z_:function(){return i}});var r=n(62151),o=(0,r.P1)([function(e){return e.get("app")}],(function(e){return e})),i=((0,r.P1)([function(e){return e.getIn(["app","loadPercent"])}],(function(e){return e})),(0,r.P1)([function(e){return e.getIn(["app","inVrMode"])}],(function(e){return e})),(0,r.P1)([function(e){return e.getIn(["app","onBoardingStep"])}],(function(e){return e})));(0,r.P1)([function(e){return e.getIn(["app","isTutorial"])}],(function(e){return e}))},33859:function(e,t,n){"use strict";n.d(t,{_:function(){return r}});var r=(0,n(62151).P1)([function(e){return e.get("auth")}],(function(e){return e}))},88298:function(e,t,n){"use strict";n.d(t,{zy:function(){return o},Uu:function(){return i},C5:function(){return a},lD:function(){return s},gD:function(){return c},Bi:function(){return l},Bd:function(){return d}});var r=n(62575);function o(e){return{type:r.lS,locations:e}}function i(e){return{type:r.Em,location:e}}function a(e){return{type:r.YO,location:e}}function s(e){return{type:r.l3,location:e}}function c(e){return{type:r.Xr,location:e}}function l(){return{type:r.GQ}}function d(){return{type:r.OE}}}}]);