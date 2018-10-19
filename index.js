#!/usr/bin/env node

const si = require("systeminformation");
const mri = require("mri");
const sll = require("single-line-log").stdout;
const kleur = require("kleur");
const fork = require("child_process").fork;
const sleep = require("sleep");
const emoji = require('node-emoji')

async function readTemp() {
    const temp = await si.cpuTemperature();
    return { main: temp.main, cores: temp.cores };
}

function avg(arr) {
    return arr.reduce((sum, t) => t.main + sum, 0) / arr.length;
}

async function thawMyCarrots(targetTemp) {
    let temp = await readTemp(),
        temps = [temp, temp, temp],
        children = [];

    while (1) {
        if (avg(temps) < targetTemp) {
            if (children.length < 10) {
                children.push(fork("./eat-cpu"));
            }
        } else if (avg(temps) > targetTemp) {
            if (children.length > 0) {
                children.pop().kill();
            }
        }

        temp = await readTemp();
        temps.shift();
        temps.push(temp);

        sll(
            `Thawing carrots 🥕`,
            `\nCurrent temp: ${kleur.bold.red(temp.main.toFixed(2))} ${temp.main > targetTemp ? emoji.get('fire') : emoji.get('snowflake')}`,
            `\nCores at ${kleur.bold.gray(temp.cores)}'`,
            `\nChildren: ${children.length}`
        );
        sleep.msleep(500);
    }
}

const args = process.argv.slice(2),
    targetTemp = mri(args, {
        alias: { temp: "t" },
        default: { temp: 85 }
    });

thawMyCarrots(targetTemp.temp);
