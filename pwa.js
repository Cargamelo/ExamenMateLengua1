"use strict";
(function(){
 if(!("serviceWorker" in navigator)||location.protocol!=="https:"&&location.hostname!=="localhost")return;
 window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(err=>console.warn("PWA no disponible:",err.message)));
})();