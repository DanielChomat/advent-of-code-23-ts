import lineReader from "line-reader";

const values: number[] = []

const findFirstAndLastDigit = (line: string): number => {
    const splitLine = line.split(':')

    const allNumbersString = splitLine[1]
    const splitNumbers = allNumbersString.split('|')

    const winningNumbersString = splitNumbers[0]
    const acquiredNumbersString = splitNumbers[1]

    // TODO: Fix this empty array?
    const winningNumbers = winningNumbersString.match(/\d+/g) ?? []
    const acquiredNumbers = new Set(acquiredNumbersString.match(/\d+/g))


    const multipliedNumber = winningNumbers.reduce((acc, curr) => {
        const hasWinningNumber = acquiredNumbers.has(curr)

        if (!hasWinningNumber) return acc;

        console.log({hasWinningNumber})
        console.log({curr})
        console.log({acc})

        const isFirstNumber = acc === 0;
        if (isFirstNumber) {
            return 1;
        }

        const newAcc = acc * 2;

        return newAcc;
    }, 0)

    if (multipliedNumber > 0) {
        console.log({winningNumbers})
        console.log({acquiredNumbers})
    }

    console.log({ multipliedNumber})

    return multipliedNumber;
}

const logTheResult = () => {
    const result = values?.reduce((acc, curr) => acc + curr, 0)

    console.log({result})
}

lineReader.eachLine('./src/04/input.txt', function (line, last) {
    const digit = findFirstAndLastDigit(line);

    values.push(digit);

    if (last) logTheResult()
});