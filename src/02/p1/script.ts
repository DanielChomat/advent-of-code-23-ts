import lineReader from "line-reader";

const values: number[] = []
const DEFAULT_FALLBACK_NUMBER = 0;

const MAX_RED_CUBES = 12;
const MAX_GREEN_CUBES = 13;
const MAX_BLUE_CUBES = 14;

const findFirstAndLastDigit = (line: string): number => {
    const matchGameNumber = line.match(/Game (\d+):/)

    if (!matchGameNumber) return DEFAULT_FALLBACK_NUMBER;

    const gameNumber = matchGameNumber[1];

    const setsInString = line.split(":")[1];
    const setsOfCubes = setsInString.split(';');

    const isGamePossible = setsOfCubes.every((set) => {
        const numberOfRedCubes = set.match(/(\d+) red/)
        const numberOfGreenCubes = set.match(/(\d+) green/)
        const numberOfBlueCubes = set.match(/(\d+) blue/)

        const isWithinRedCubeLimit = !numberOfRedCubes || +numberOfRedCubes[1] <= MAX_RED_CUBES;
        const isWithinGreenCubeLimit = !numberOfGreenCubes || +numberOfGreenCubes[1] <= MAX_GREEN_CUBES;
        const isWithinBlueCubeLimit = !numberOfBlueCubes || +numberOfBlueCubes[1] <= MAX_BLUE_CUBES;

        return isWithinRedCubeLimit && isWithinGreenCubeLimit && isWithinBlueCubeLimit
    })

    return isGamePossible ? +gameNumber : DEFAULT_FALLBACK_NUMBER;
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