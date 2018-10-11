const si = require("systeminformation");
const mri = require("mri");
const sll = require("single-line-log").stdout;
const kleur = require("kleur");

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
    return { main: temp.main, cores: temp.cores };
}

async function thawMyCarrots(targetTemp) {
    let temp = await readTemp();

    for (let n = 1; temp.main < targetTemp; n += 1) {
        collatz(n);
        // console.log(`Collatz takes ${collatz(n)} steps for n=${n}`);
        temp = await readTemp();
        sll("Current temp", kleur.bold.red(temp.main.toFixed(2)));
    }
}

const args = process.argv.slice(2),
    targetTemp = mri(args, {
        alias: { temp: "t" },
        default: { temp: 85 }
    });

thawMyCarrots(targetTemp.temp);
