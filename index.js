const si = require("systeminformation");
const mri = require("mri");

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

async function thawMyCarrots(targetTemp) {
    let temp = await readTemp();

    console.log(`Warming from ${temp} to ${targetTemp}`);

    for (let n = 1; temp < targetTemp; temp = await readTemp(), n += 1) {
        console.log("Current temp", temp);
        console.log(`Collatz takes ${collatz(n)} steps for n=${n}`);
    }
}

const args = process.argv.slice(2),
    targetTemp = mri(args, {
        alias: { temp: "t" },
        default: { temp: 85 }
    });

thawMyCarrots(targetTemp.temp);
