import lineReader from "line-reader";
import {RaceRecord} from "../p1/script";

const raceRecord: RaceRecord = {time: 0, distanceRecord: 0}

const consumeLine = (line: string) => {
    const numbers = line.match(/\d+/g);

    if (!numbers || !numbers.length) {
        throw "Incorrect input (no numbers found)."
    }

    if (line.includes("Time")) {
        const timeNumber = numbers.reduce((acc, curr) => acc + curr, "");

        raceRecord.time = +timeNumber
    }

    if (line.includes("Distance")) {
        const distanceNumber = numbers.reduce((acc, curr) => acc + curr, "");

        raceRecord.distanceRecord = +distanceNumber
    }
}

const logTheResult = () => {
    const {time, distanceRecord} = raceRecord

    let result = 0

    // Starting from the half for faster
    const startFromTheMiddleTime = Math.floor(time / 2)

    const getShouldAddResult = (speedButtonTime: number): boolean => {
        const remainingTime = time - speedButtonTime;
        const totalDistance = speedButtonTime * remainingTime;

        return totalDistance > distanceRecord
    }

    for (let speedButtonTime = startFromTheMiddleTime; speedButtonTime >= 0; speedButtonTime--) {
        const shouldAddResult = getShouldAddResult(speedButtonTime)

        if (!shouldAddResult) break;
        result += 1
    }

    for (let speedButtonTime = startFromTheMiddleTime + 1; speedButtonTime <= distanceRecord; speedButtonTime++) {
        const shouldAddResult = getShouldAddResult(speedButtonTime)

        if (!shouldAddResult) break;
        result += 1
    }

    console.log({result})
}

lineReader.eachLine('./src/06/input.txt', function (line, last) {
    consumeLine(line);

    if (last) logTheResult()
});