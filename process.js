console.log("Script Run");

const canvas = document.getElementById("Playarea");
const ctx = canvas.getContext("2d");
let mouse_isdown = false;
let pos_x;
let pos_y;
let wide = 500;

let grid = Array.from({ length: wide }, () => Array(wide).fill(null));
ctx.fillStyle = "grey";
ctx.fillRect(0, 0, wide, wide);
document.addEventListener("mousedown", function () {
  mouse_isdown = true;
});

document.addEventListener("mouseup", function () {
  mouse_isdown = false;
});

canvas.addEventListener("mousemove", function (event) {
  const rect = canvas.getBoundingClientRect();
  pos_x = Math.floor(event.clientX - rect.left);
  pos_y = Math.floor(event.clientY - rect.top);
});

canvas.addEventListener("mouseleave", function (event) {
  pos_x = null;
  pos_y = null;
});
let select_mat = 1;
//1 = sand
//2 = water
//3 = brick/wall
//null = air
function mat_to_color(mat_type) {
  switch (mat_type) {
    case null:
      select_mat = null;
      ctx.fillStyle = "grey";
      break;
    case 1:
      select_mat = 1;
      ctx.fillStyle = "yellow";
      break;
    case 3:
      select_mat = 3;
      ctx.fillStyle = "black";
      break;
  }
}

function mat_button(mat_type) {
  select_mat = mat_type;
  console.log(mat_type);
  mat_to_color(mat_type);
}
let brushSize = 50;

function placing(x, y) {
  for (
    let j = y - Math.floor(brushSize / 2);
    j < y + Math.floor(brushSize / 2);
    j++
  ) {
    //I am such a terrible person
    for (
      let i = x - Math.floor(brushSize / 2);
      i < x + Math.floor(brushSize / 2);
      i++
    ) {
      if (i >= 0 && i < wide && j >= 0 && j < wide) {
        mat_to_color(select_mat);
        grid[j][i] = select_mat; //J IS A DUCKING Y
        ctx.fillRect(i, j, 1, 1);
      }
    }
  }
}

function displacement(x, y) {
  ctx.fillStyle = "grey";
  ctx.fillRect(x, y, 1, 1);
}

function sandmove(x, y, x_move, y_move) {
  grid[y_move][x_move] = 1;
  grid[y][x] = null;
  displacement(x, y);
  ctx.fillStyle = "yellow";
  ctx.fillRect(x_move, y_move, 1, 1);
}

let cal = 0;
function sand_physic_calculation() {
  for (let y = wide - 2; y >= 0; y--) {
    if (grid[y].every((values) => values === null)) {
      continue;
    }
    const direction = Math.random() < 0.5;
    if (direction) {
      for (let x = 0; x < wide; x++) {
        //emtpy cell
        if (grid[y][x] === null) {
          continue;
        }
        if (grid[y][x] === 1 && grid[y + 1][x] === null) {
          sandmove(x, y, x, y + 1);
          continue;
        }

        if (
          grid[y][x] === 1 &&
          x > 0 &&
          x < wide - 1 &&
          grid[y + 1][x - 1] === null &&
          grid[y + 1][x + 1] === null
        ) {
          sandmove(x, y, x - 1, y + 1);
          continue;
        }

        if (grid[y][x] === 1 && x > 0 && grid[y + 1][x - 1] === null) {
          sandmove(x, y, x - 1, y + 1);
          continue;
        }

        if (grid[y][x] === 1 && x < wide - 1 && grid[y + 1][x + 1] === null) {
          sandmove(x, y, x + 1, y + 1);
          continue;
        }
      }
    } else {
      for (let x = wide - 1; x >= 0; x--) {
        //emtpy cell
        if (grid[y][x] === null) {
          continue;
        }
        if (grid[y][x] === 1 && grid[y + 1][x] === null) {
          sandmove(x, y, x, y + 1);
          continue;
        }

        if (
          grid[y][x] === 1 &&
          x < wide - 1 &&
          grid[y + 1][x - 1] === null &&
          grid[y + 1][x + 1] === null
        ) {
          sandmove(x, y, x + 1, y + 1);
          continue;
        }

        if (grid[y][x] === 1 && x > 0 && grid[y + 1][x - 1] === null) {
          sandmove(x, y, x - 1, y + 1);
          continue;
        }

        if (grid[y][x] === 1 && x < wide - 1 && grid[y + 1][x + 1] === null) {
          sandmove(x, y, x + 1, y + 1);
          continue;
        }
      }
    }
  }
}
/*function draw(){ //same as physic cal but just for redraw canvas|| unused due to change how physic calculation too many time in a frame
    //ctx.fillStyle = "grey";
    //ctx.fillRect(0, 0, wide, wide);
    for(let y = wide-2 ;y >= 0;y--){
        for(let x = 0; x < wide; x++){
            if(grid[y][x] === 1){
                ctx.fillStyle = "yellow";
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}*/

function process() {
  if (
    mouse_isdown &&
    pos_x >= 0 &&
    pos_x < wide &&
    pos_y >= 0 &&
    pos_y < wide &&
    pos_x != null &&
    pos_y != null
  ) {
    //ctx.fillRect(pos_x,pos_y,1,1)
    placing(pos_x, pos_y);
    //grid[pos_y][pos_x] = "sand" //row and col that why y is first index
  }
  sand_physic_calculation();

  requestAnimationFrame(process);
}
process();
