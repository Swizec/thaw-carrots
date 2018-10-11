const si = require("systeminformation");
const mri = require("mri");
const sll = require("single-line-log").stdout;
const kleur = require("kleur");
const fork = require("child_process").fork;

async function readTemp() {
    const temp = await si.cpuTemperature();
    return { main: temp.main, cores: temp.cores };
}

async function thawMyCarrots(targetTemp) {
    let temp = await readTemp(),
        children = [];

    while (1) {
        if (temp.main < targetTemp) {
            if (children.length < 10) {
                children.push(fork("./eat-cpu"));
            }
        } else if (temp.main > targetTemp) {
            if (children.length > 0) {
                children.pop().kill();
            }
        }

        temp = await readTemp();
        sll(
            "Current temp",
            kleur.bold.red(temp.main.toFixed(2)),
            "\nCores at",
            kleur.bold.gray(temp.cores),
            `\nChildren: ${children.length}`
        );
    }
}

const args = process.argv.slice(2),
    targetTemp = mri(args, {
        alias: { temp: "t" },
        default: { temp: 85 }
    });

thawMyCarrots(targetTemp.temp);
