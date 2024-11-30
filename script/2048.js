/* This implement is convert from C. */
const MAP_SIZE = 4;
const SWAP = (x, y) => [y, x]

let g_map = Array.from({length: MAP_SIZE + 2}, () => Array(MAP_SIZE + 2).fill(0));

function RandNumber(max) {
    const minCeiled = 0;
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function NewBlock() {
    let freeBlock = [];
    for (let y = 1; y <= MAP_SIZE; y++) {
        for (let x = 1; x <= MAP_SIZE; x++) {
            if (g_map[y][x] === 0) freeBlock.push([y, x]);
        }
    }
    if (freeBlock.length === 0) return;
    let [y, x] = freeBlock[RandNumber(freeBlock.length)];
    g_map[y][x] = RandNumber(10) === 5 ? 4 : 2;
}

function Initiate() {
    NewBlock();
    NewBlock();
}

function Push(flag) {
    let change = false;
    let UP = flag === "ArrowUp", DOWN = flag === "ArrowDown", LEFT = flag === "ArrowLeft";
    for (let x = 1; x <= MAP_SIZE; ++x) {
        for (let y = (UP || LEFT ? 1 : MAP_SIZE); (UP || LEFT ? (y < MAP_SIZE) : (y > 1)); UP || LEFT ? y++ : y--) {
            if (g_map[UP || DOWN ? y : x][UP || DOWN ? x : y] === 0) {
                let i = (UP || LEFT ? (y + 1) : (y - 1));
                while ((UP || LEFT ? (i <= MAP_SIZE) : (i > 0)) && g_map[UP || DOWN ? i : x][UP || DOWN ? x : i] === 0) UP || LEFT ? i++ : i--;
                if ((UP || LEFT ? (i <= MAP_SIZE) : (i > 0))) {
                    change = true;
                    [g_map[UP || DOWN ? y : x][UP || DOWN ? x : y], g_map[UP || DOWN ? i : x][UP || DOWN ? x : i]]
                        = SWAP(g_map[UP || DOWN ? y : x][UP || DOWN ? x : y], g_map[UP || DOWN ? i : x][UP || DOWN ? x : i])
                }
            }
        }
    }
    return change;
}

function Merge(flag) {
    let change = false;
    let UP = flag === "ArrowUp", DOWN = flag === "ArrowDown", LEFT = flag === "ArrowLeft";
    if (UP || DOWN) {
        for (let x = 1; x <= MAP_SIZE; ++x) {
            for (let y = (UP ? 1 : MAP_SIZE); (UP ? (y < MAP_SIZE) : (y > 0)); UP ? y++ : y--) {
                if (g_map[y][x] === g_map[UP ? (y + 1) : (y - 1)][x] && g_map[y][x] !== 0) {
                    change = true;
                    g_map[y][x] *= 2;
                    g_map[UP ? (y + 1) : (y - 1)][x] = 0;
                }
            }
        }
    } else {
        for (let y = 1; y <= MAP_SIZE; ++y) {
            for (let x = (LEFT ? 1 : MAP_SIZE); (LEFT ? (x < MAP_SIZE) : (x > 0)); LEFT ? x++ : x--) {
                if (g_map[y][x] === g_map[y][LEFT ? (x + 1) : (x - 1)] && g_map[y][x] !== 0) {
                    change = true;
                    g_map[y][x] *= 2;
                    g_map[y][LEFT ? (x + 1) : (x - 1)] = 0;
                }
            }
        }
    }
    return change;
}

function Check() {
    for (let y = 1; y <= MAP_SIZE; ++y) {
        for (let x = 1; x <= MAP_SIZE; ++x) {
            if (g_map[y][x] === g_map[y - 1][x] || g_map[y][x] === g_map[y + 1][x] ||
                g_map[y][x] === g_map[y][x - 1] || g_map[y][x] === g_map[y][x + 1] ||
                g_map[y][x] === 0) {
                return true;
            }
        }
    }
    return false;
}

function PrintMap() {
    for (let y = 1; y <= MAP_SIZE; ++y) {
        for (let x = 1; x <= MAP_SIZE; ++x) {
            let block = document.getElementById(String((y - 1) * MAP_SIZE + x - 1));
            block.innerText = g_map[y][x] === 0 ? "" : g_map[y][x];
        }
    }
}

/* main */
Initiate();
PrintMap();
document.addEventListener("keydown", (event)=>{
    let op = event.key;
    if (op === "ArrowUp" || op === "ArrowDown" || op === "ArrowLeft" || op === "ArrowRight") {
        event.preventDefault();
        let change;
        change = Push(op);
        change = Merge(op) || change;
        change = Push(op) || change;

        change ? NewBlock() : null;
        PrintMap();

        if (!Check()) {
            alert("GAME OVER!");
            location.reload();
        }
    }
})