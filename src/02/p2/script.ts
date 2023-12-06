import lineReader from "line-reader";

const values: number[] = []
const DEFAULT_FALLBACK_NUMBER = 0;

enum COLORS {
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue'
}

const INITIAL_MIN_SETS_OF_CUBES_RESULTS = {
    [COLORS.RED]: 0,
    [COLORS.GREEN]: 0,
    [COLORS.BLUE]: 0
}

const colors = Object.values(COLORS);

const findFirstAndLastDigit = (line: string): number => {
    const matchGameNumber = line.match(/Game (\d+):/)

    if (!matchGameNumber) return DEFAULT_FALLBACK_NUMBER;

    const setsInString = line.split(":")[1];
    const setsOfCubes = setsInString.split(';');

    const minSetsOfCubes = setsOfCubes.reduce((acc, curr) => {
        colors.forEach((color) => {
            const cubes = curr.match(new RegExp(`(\\d+) ${color}`))

            const cubesNumber = +(cubes?.[1] ?? DEFAULT_FALLBACK_NUMBER)

            acc[color] = Math.max(cubesNumber, acc[color])
        })

        return acc
    }, INITIAL_MIN_SETS_OF_CUBES_RESULTS)

    const result = minSetsOfCubes[COLORS.RED] * minSetsOfCubes[COLORS.GREEN] * minSetsOfCubes[COLORS.BLUE]

    return result;
}

const logTheResult = () => {
    const result = values?.reduce((acc, curr) => acc + curr, 0)

    console.log({result})
}

lineReader.eachLine('./src/02/input.txt', function (line, last) {
    const digit = findFirstAndLastDigit(line);

    values.push(digit);

    if (last) logTheResult()
});

