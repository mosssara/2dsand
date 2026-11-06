console.log("Script Run");

const canvas = document.getElementById("Playarea");
const ctx = canvas.getContext("2d");
let mouse_isdown = false;
let pos_x;
let pos_y;
let wide = 500
ctx.fillStyle = "grey";
ctx.fillRect(0, 0, wide, wide);
ctx.font = "1px sans-serif";

document.addEventListener("mousedown", function(){
    mouse_isdown = true;
});

document.addEventListener("mouseup", function(){
    mouse_isdown = false;
});

canvas.addEventListener("mousemove",function(event){
    const rect = canvas.getBoundingClientRect();
    pos_x = event.clientX - rect.left;
    pos_y = event.clientY - rect.top;
    
})

canvas.addEventListener("mouseleave",function(event){
    pos_x = null
    pos_y = null
    console.log("OUT")
})

function process(){
    
    if(mouse_isdown && (pos_x >= 0 && pos_x <= wide) && (pos_y >= 0 && pos_y <= wide)){
        console.log("down");
        console.log(pos_x,"  ",pos_y);
        ctx.strokeText("■",pos_x,pos_y)

    }
    requestAnimationFrame(process);
}
process();