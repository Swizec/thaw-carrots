const si = require("systeminformation");

function collatz_step(n) {
    return n % 2 ? n / 2 : 3 * n + 1;
}

function collatz(n) {
    let count = 0;
    while (n !== 1) {
        n = collatz_step(n);
        count += 1;
    }
    return count;
}

async function readTemp() {
    const temp = await si.cpuTemperature();
    return temp.main;
}

async function thawMyCarrots() {
    let temp = await readTemp();

    console.log(temp);

    for (let n = 1; temp < 80; temp = await readTemp(), n += 1) {
        console.log("Current temp", temp);
        console.log(`Collatz takes ${collatz(n)} steps for n=${n}`);
    }
}

thawMyCarrots();
