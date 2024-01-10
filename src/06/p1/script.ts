import lineReader from "line-reader";


export type RaceRecord = {
    time: number;
    distanceRecord: number
}

const races: RaceRecord[] = []

const consumeLine = (line: string) => {
    const numbers = line.match(/\d+/g);

    if (!numbers || !numbers.length) {
        throw "Incorrect input (no numbers found)."
    }

    if (line.includes("Time")) {
        numbers.forEach((timeNumber, index) => {
            races[index] = {
                ...races[index],
                time: +timeNumber
            }
        })
    }

    if (line.includes("Distance")) {
        numbers.forEach((distanceNumber, index) => {
            races[index] = {
                ...races[index],
                distanceRecord: +distanceNumber
            }
        })
    }
}

const logTheResult = () => {
    const allTheNumbersOfPossibilities: number[] = [];

    races.forEach(({time, distanceRecord}) => {
        const possibilities: Set<number> = new Set()

        // Starting from the half for faster
        const beginningTime = Math.floor(time / 2)

        for (let i = beginningTime; i >= 0; i--) {
            const buttonTime = i;
            const speed = buttonTime
            const remainingTime = time - buttonTime;

            const totalDistance = speed * remainingTime;

            if (totalDistance <= distanceRecord) {
                break;
            } else {
                possibilities.add(i)
            }
        }

        for (let i = beginningTime; i <= distanceRecord; i++) {
            const buttonTime = i;
            const speed = buttonTime
            const remainingTime = time - buttonTime;

            const totalDistance = speed * remainingTime;

            if (totalDistance <= distanceRecord) {
                break;
            } else {
                possibilities.add(i)
            }
        }

        const numberOfPossibilities = possibilities.size

        allTheNumbersOfPossibilities.push(numberOfPossibilities)
    })

    const result = allTheNumbersOfPossibilities.reduce((acc, curr) => acc * curr, 1)

    console.log(result)
}

lineReader.eachLine('./src/06/input.txt', function (line, last) {
    consumeLine(line);

    if (last) logTheResult()
});