const si = require("systeminformation");
const mri = require("mri");
const sll = require("single-line-log").stdout;
const kleur = require("kleur");
const isPrime = require("prime-number");
const eatCPU = require("./eat-cpu");

async function readTemp() {
    const temp = await si.cpuTemperature();
    return { main: temp.main, cores: temp.cores };
}

async function thawMyCarrots(targetTemp) {
    let temp = await readTemp(),
        n = 2;

    while (1) {
        if (temp.main < targetTemp) {
            eatCPU(n);
            n = n + 1;
        }

        temp = await readTemp();
        sll(
            "Current temp",
            kleur.bold.red(temp.main.toFixed(2)),
            "\nCores at",
            kleur.bold.gray(temp.cores),
            n
        );
    }
}

const args = process.argv.slice(2),
    targetTemp = mri(args, {
        alias: { temp: "t" },
        default: { temp: 85 }
    });

thawMyCarrots(targetTemp.temp);
