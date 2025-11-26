document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".photo-img").forEach(e=>{e.addEventListener("error",function(){this.closest(".photo-item")?.remove()})})});
