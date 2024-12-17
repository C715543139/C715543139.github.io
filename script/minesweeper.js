// 画布属性
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");
const cellSize = 50;
const counter = document.getElementById("counter");
const ratio = window.devicePixelRatio;
let height = 9, width = 9;

// 扫雷地图，0表示无雷，1表示有雷
let minesMap;
// 地图状态，0表示揭开，1表示未揭开，2表示旗帜
let mapStatus;
// 地雷数目
let minesCount = 10;
// 首开无雷
let first = true;
// 旗帜计数
let flagCount;

// 绘制扫雷游戏网格
function drawGrid() {
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            // 使用交替颜色：基于行列索引之和判断颜色
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = "white"; // 亮色
            } else {
                ctx.fillStyle = "lightgray"; // 暗色
            }
            // 绘制单元格
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

function generateMines(x, y) {
    let index = xy2XY(x, y), X = index[0], Y = index[1];
    let placedMines = 0;
    while (placedMines < minesCount) {
        // 生成随机坐标 (1~height 和 1~width 范围内)
        let row = Math.floor(Math.random() * height) + 1;
        let col = Math.floor(Math.random() * width) + 1;
        // 确保该位置没有地雷
        if (row === Y && col === X) continue;
        if (minesMap[row][col] !== 1) {
            minesMap[row][col] = 1; // 放置地雷
            placedMines++;
        }
    }
}

function init() {
    // 解决文字模糊问题
    canvas.style.width = width * cellSize + "px";   // 显示宽度
    canvas.style.height = height * cellSize + "px"; // 显示高度
    canvas.width = width * ratio * cellSize;    // 实际分辨率宽度
    canvas.height = height * ratio * cellSize;  // 实际分辨率高度
    ctx.scale(ratio, ratio);

    minesMap = Array.from({length: height + 2}, () => Array(width + 2).fill(0));
    mapStatus = Array.from({length: height + 2}, () => Array(width + 2).fill(1));
    first = true;
    flagCount = 0;

    counter.textContent = `占 ${minesCount - flagCount}`;
    drawGrid();
}

// 换算坐标x，y到下标X，Y
function xy2XY(x, y) {
    return [Math.floor(x / cellSize) + 1, Math.floor(y / cellSize) + 1];
}

// 换算下标X，Y到坐标x，y
function XY2xy(X, Y) {
    return [(X - 1) * cellSize, (Y - 1) * cellSize];
}

// 计算雷数
function sumMines(X, Y) {
    if (minesMap[Y][X] !== 0) {
        return -1;
    }

    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) continue;
            sum += minesMap[Y + i][X + j];
        }
    }
    return sum;
}

// 绘制数字
function drawNum(cx, cy, num) {
    ctx.font = `${cellSize * 0.8}px Arial`;
    ctx.fillStyle = "white";
    ctx.fillText(num.toString(), cx + cellSize * 0.27, cy + cellSize * 0.78);
}

// 揭开单个格子
function uncoverSingleGrid(X, Y) {
    if (X < 1 || Y < 1 || X > width || Y > height) return;

    let coord = XY2xy(X, Y), cx = coord[0], cy = coord[1];
    if (mapStatus[Y][X] === 1) {
        let num = sumMines(X, Y);
        if (num === -1) {
            alert("GAME OVER!");
            init();
        } else {
            ctx.clearRect(cx, cy, cellSize + 1, cellSize + 1);
            if (num !== 0) drawNum(cx, cy, num);
            mapStatus[Y][X] = 0;
            return num;
        }
    }
}

// 正常揭开格子
function uncoverGrid(x, y) {
    let index = xy2XY(x, y), X = index[0], Y = index[1];
    if (X < 1 || Y < 1 || X > width || Y > height) return;

    let coord = XY2xy(X, Y), cx = coord[0], cy = coord[1];
    let num = uncoverSingleGrid(X, Y);
    if (num === 0) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                uncoverGrid(cx + i * cellSize, cy + j * cellSize);
            }
        }
    }
}

// 揭开四周所有格子
function uncoverAllGrid(x, y) {
    let index = xy2XY(x, y), X = index[0], Y = index[1];
    if (X < 1 || Y < 1 || X > width || Y > height || mapStatus[Y][X] !== 0) return;

    let coord = XY2xy(X, Y), cx = coord[0], cy = coord[1];
    let flags = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (mapStatus[Y + i][X + j] === 2) flags++;
        }
    }
    if (flags >= sumMines(X, Y)) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                uncoverGrid(cx + i * cellSize, cy + j * cellSize);
            }
        }
    }
}

// 旗帜设置
function setFlag(x, y) {
    if (flagCount >= minesCount) return;

    let index = xy2XY(x, y), X = index[0], Y = index[1];
    let coord = XY2xy(X, Y), cx = coord[0], cy = coord[1];
    if (mapStatus[Y][X] === 1) {
        ctx.font = `${cellSize * 0.6}px Arial`;
        ctx.fillStyle = "black";
        ctx.fillText("占", cx + cellSize * 0.18, cy + cellSize * 0.74);
        mapStatus[Y][X] = 2;

        flagCount++;
        counter.textContent = `占 ${minesCount - flagCount}`;
    } else if (mapStatus[Y][X] === 2) {
        if ((X + Y) % 2 === 0) {
            ctx.fillStyle = "white"; // 亮色
        } else {
            ctx.fillStyle = "lightgray"; // 暗色
        }
        ctx.fillRect(cx, cy, cellSize, cellSize);
        mapStatus[Y][X] = 1;

        flagCount--;
        counter.textContent = `占 ${minesCount - flagCount}`;
    }
}

// 胜利设置
function checkWin() {
    for (let i = 1; i <= height; i++) {
        for (let j = 1; j < width; j++) {
            if (mapStatus[i][j] === 1 && minesMap[i][j] === 0) {
                return;
            }
        }
    }
    alert("YOU WIN!");
    location.reload();
}

// main
init();
// canvas监听
canvas.addEventListener("click", (event) => {
    event.preventDefault();
    if (first) {
        generateMines(event.offsetX, event.offsetY);
        first = false;
    }
    uncoverGrid(event.offsetX, event.offsetY);
    checkWin();
});
canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    setFlag(event.offsetX, event.offsetY);
})
canvas.addEventListener("dblclick", (event) => {
    event.preventDefault();
    uncoverAllGrid(event.offsetX, event.offsetY);
    checkWin();
})

// toolbar监听
document.getElementById("restart").addEventListener("click", () => {
    init();
})
document.getElementById("mode").addEventListener("click", () => {
    let w = Number(prompt("请输入地图宽度(9-25)", "9"));
    if (w == null || w < 9 || w > 99) {
        alert("无效的宽度！");
        return;
    }
    let h = Number(prompt("请输入地图高度(9-25)", "9"));
    if (h == null || h < 9 || h > 99) {
        alert("无效的高度！");
        return;
    }
    let n = Number(prompt("请输入地雷数量(10-100)", "10"));
    if (n == null || n < 10 || n > 100) {
        alert("无效的数量！");
        return;
    } if (n >= w * h){
        alert("已经装不下了口牙！");
        return;
    }

    width = w;
    height = h;
    minesCount = n;
    init();
})