import lineReader from "line-reader";

const values: number[] = []
const twoDimensionalArray: Array<string[]> = []

let regex = /\d+/g;

const getXIndexesToGoThrough = (numberLength: number, startIndex: number) => {
    const xIndexesToGoThrough = []

    for (let i = 0; i <= numberLength; i++) {
        xIndexesToGoThrough.push(startIndex + i);
    }

    return xIndexesToGoThrough
}

const transformTheInput = () => {
    // Supposing all lines are the same length
    const maxXIndex = twoDimensionalArray[0].length - 1;
    const maxYIndex = twoDimensionalArray.length - 1;

    const xIndexFilterFunction = (num: number) => num >= 0 && num <= maxXIndex
    const yIndexFilterFunction = (num: number) => num >= 0 && num <= maxYIndex

    twoDimensionalArray.forEach((lineArray, index) => {
        const line = lineArray.join('');

        const numbersInLine = [...line.matchAll(regex)]

        numbersInLine.forEach((number) => {
            const matchedNumberAsString = number[0];
            const startIndex = number.index;
            const numberLength = matchedNumberAsString.length;

            if (startIndex === null || startIndex === undefined) return 0;

            const xIndexesToGoThrough = getXIndexesToGoThrough(numberLength, startIndex)

            const xIndexes = [startIndex - 1, ...xIndexesToGoThrough].filter(xIndexFilterFunction)
            const yIndexes = [index - 1, index, index + 1].filter(yIndexFilterFunction);

            const isValidPartNumber = yIndexes.some((y) =>
                xIndexes.some((x) => {
                    const charAtIndex = twoDimensionalArray[y][x];

                    const isDigit = !!charAtIndex.match(/\d/g)
                    const isPoint = charAtIndex === '.';

                    const isSymbol = !(isDigit || isPoint)

                    return isSymbol;
                })
            )

            if (isValidPartNumber) {
                const numberAsNumber = +matchedNumberAsString;

                values.push(numberAsNumber)
            }
        })

    })

    logTheResult()
}


const logTheResult = () => {
    const result = values?.reduce((acc, curr) => acc + curr, 0)

    console.log({result})
}

lineReader.eachLine('./src/03/input.txt', function (line, last) {
    const lineArray = line.split("")

    twoDimensionalArray.push(lineArray);

    if (last) transformTheInput()
});