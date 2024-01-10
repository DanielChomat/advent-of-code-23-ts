import lineReader from "line-reader";

type Card = {
    cardNumber: number;
    count: number;
    nextCardsWon: number;
}
const values: Card[] = []

const findFirstAndLastDigit = (line: string) => {
    const splitLine = line.split(':')
    const cardNumberString = splitLine[0].match(/\d+/g)?.[0] ?? 0

    const cardNumber = +cardNumberString

    const allNumbersString = splitLine[1]
    const splitNumbers = allNumbersString.split('|')

    const winningNumbersString = splitNumbers[0]
    const acquiredNumbersString = splitNumbers[1]

    const winningNumbers = winningNumbersString.match(/\d+/g)
    const acquiredNumbers = new Set(acquiredNumbersString.match(/\d+/g))

    if (!winningNumbers || !winningNumbers?.length) {
        throw "No winning numbers found."
    }

    const totalCardsWon = winningNumbers.reduce((acc, curr) => {
        const hasWinningNumber = acquiredNumbers.has(curr)

        if (!hasWinningNumber) return acc;

        return acc + 1;
    }, 0)

    return {
        cardNumber,
        nextCardsWon: totalCardsWon,
    };
}

const logTheResult = () => {

    values.forEach(({nextCardsWon, count}, index) => {
        const maxIndex = index + nextCardsWon
        for (let i = index + 1; i <= maxIndex; i++) {
            const oldValues = values[i].count;

            values[i].count += count;
        }
    })

    const result = values?.reduce((acc, curr) => acc + curr.count, 0)

    console.log({result})
}

lineReader.eachLine('./src/04/input.txt', function (line, last) {
    const {cardNumber, nextCardsWon} = findFirstAndLastDigit(line);

    const cardObject: Card = {
        cardNumber,
        count: 1,
        nextCardsWon,
    }

    values.push(cardObject);

    if (last) logTheResult()
});