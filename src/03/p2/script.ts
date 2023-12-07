import lineReader from "line-reader";

const values: number[] = []
const twoDimensionalArray: Array<string[]> = []

const asteriskRegex = /\*/g;
const numberRegex = /\d/g

const getCharAtCoordProps = ({xCoord, y}: {
    xCoord: number,
    y: number
}) => {
    const charAtCoord = twoDimensionalArray[y][xCoord]
    const isAnotherDigit = !!charAtCoord.match(numberRegex)

    return {
        charAtCoord, isAnotherDigit
    }
}

type StringNumberWithCoords = {
    char: string;
    y: number;
    x: number;
}

type ResultNumberWithCoords = {
    number: number;
    y: number;
    xCoords: number[]
}

const getNumbersBefore = ({y, x}: { y: number; x: number }) => {
    const startingIndex = x - 1;
    const resultNumbers: StringNumberWithCoords[] = []

    for (let xCoord = startingIndex; xCoord >= 0; xCoord--) {
        const {isAnotherDigit, charAtCoord} = getCharAtCoordProps({xCoord, y})

        if (!isAnotherDigit) break;

        resultNumbers.push({char: charAtCoord, y, x: xCoord});
    }

    const resultNumbersInCorrectOrder = resultNumbers.reverse();
    return resultNumbersInCorrectOrder
}

const getNumbersAfter = ({y, x, maxXIndex}: { y: number; x: number; maxXIndex: number }) => {
    const startingIndex = x + 1;
    const resultNumbers: StringNumberWithCoords[] = []

    for (let xCoord = startingIndex; xCoord <= maxXIndex; xCoord++) {
        const {isAnotherDigit, charAtCoord} = getCharAtCoordProps({xCoord, y})

        if (!isAnotherDigit) break;

        resultNumbers.push({char: charAtCoord, y, x: xCoord});
    }

    return resultNumbers
}

const transformTheInput = () => {
    // Supposing all lines are the same length
    const maxXIndex = twoDimensionalArray[0].length - 1;
    const maxYIndex = twoDimensionalArray.length - 1;

    const xIndexFilterFunction = (num: number) => num >= 0 && num <= maxXIndex
    const yIndexFilterFunction = (num: number) => num >= 0 && num <= maxYIndex

    twoDimensionalArray.forEach((lineArray, index) => {
        const line = lineArray.join('');

        const matchedAsterisks = [...line.matchAll(asteriskRegex)]

        matchedAsterisks.forEach((asterisk) => {
            const startIndex = asterisk.index;

            if (startIndex === null || startIndex === undefined) return 0;

            const xIndexes = [startIndex - 1, startIndex, startIndex + 1].filter(xIndexFilterFunction)
            const yIndexes = [index - 1, index, index + 1].filter(yIndexFilterFunction);

            // Set to help with handling duplicates
            const matchedNumbers: Set<string> = new Set()

            const yIndexMaxNumber = yIndexes[0] + yIndexes.length
            for (let y = yIndexes[0]; y < yIndexMaxNumber; y++) {

                const xIndexMaxNumber = xIndexes[0] + xIndexes.length
                for (let x = xIndexes[0]; x < xIndexMaxNumber; x++) {
                    // Skip the asterisk by itself
                    const isSameXCoord = x === startIndex;
                    const isSameYCoord = y === index;
                    if (isSameXCoord && isSameYCoord) continue;

                    const charAtIndex = twoDimensionalArray[y][x];

                    const isDigit = !!charAtIndex.match(numberRegex)

                    if (isDigit) {
                        // Getting the whole number
                        const numbersPrev = getNumbersBefore({y, x})
                        const numbersNext = getNumbersAfter({y, x, maxXIndex})
                        const originalNumberObject: StringNumberWithCoords = {
                            char: charAtIndex,
                            y,
                            x: x
                        }

                        // All the digits (as an object) of the number in an array to join into a number
                        const foundDigitsInObjectArray: StringNumberWithCoords[] = [...numbersPrev, originalNumberObject, ...numbersNext]

                        // Creating the number from digits
                        const joinedDigitsNumber = +foundDigitsInObjectArray.map(({char}) => char).join('')
                        // Indexes of digits for duplicate handling
                        const xCoords = foundDigitsInObjectArray.map(({x}) => x);
                        const xCoordsSorted = xCoords.toSorted((a, b) => a - b)

                        const wholeResultNumber: ResultNumberWithCoords = {
                            number: joinedDigitsNumber,
                            y,
                            xCoords: xCoordsSorted,
                        }

                        // Thanks to JSON.stringify, we can handle the duplicates in the Set
                        matchedNumbers.add(JSON.stringify(wholeResultNumber))
                    }
                }
            }

            // Creating an array from the Set to use the array methods
            const uniqueMatchedNumbers: ResultNumberWithCoords[] = Array.from(matchedNumbers).map(item => JSON.parse(item));

            const hasExactlyTwoMatchedNumbers = uniqueMatchedNumbers.length === 2;

            if (hasExactlyTwoMatchedNumbers) {
                const result = uniqueMatchedNumbers.reduce((acc, {number}) => acc * number, 1);

                values.push(result)
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