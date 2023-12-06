import lineReader from 'line-reader';

const reverseAString = (stringToReverse: string) => stringToReverse.split('').reverse().join('')

const POSSIBLE_SINGLE_NUMBERS_SPELLED_OUT = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
const REGEX_PATTERN_SPELLED_OUT_SINGLE_NUMBERS = POSSIBLE_SINGLE_NUMBERS_SPELLED_OUT.join('|'); // 'apple|orange|banana'

const createRegExPattern = (pattern: string) => new RegExp(`\\d|${pattern}`, 'g')

const regex = createRegExPattern(REGEX_PATTERN_SPELLED_OUT_SINGLE_NUMBERS)
const reversedRegex = createRegExPattern(reverseAString(REGEX_PATTERN_SPELLED_OUT_SINGLE_NUMBERS));

const values: number[] = []

const getSpelledOutNumber = (matchedNumberInString: string): number => {

    const spelledOutIndex = POSSIBLE_SINGLE_NUMBERS_SPELLED_OUT.findIndex(value => value === matchedNumberInString)
    const isSpelledOut = spelledOutIndex > -1

    if (isSpelledOut) return spelledOutIndex + 1;

    return +matchedNumberInString
}

const findFirstAndLastNumber = (line: string): number => {
    const match = line.match(regex);

    const reversedLine = reverseAString(line)
    const reversedMatch = reversedLine.match(reversedRegex)

    if (!match || !reversedMatch) return 0;

    const firstDigit = getSpelledOutNumber(match[0])
    const lastDigit = getSpelledOutNumber(reverseAString(reversedMatch[0]));

    return +`${firstDigit}${lastDigit}`
}


const logTheResult = () => {
    const result = values?.reduce((acc, curr) => acc + curr, 0)

    console.log({result})
}

lineReader.eachLine('./src/01/input.txt', function (line, last) {
    const digit = findFirstAndLastNumber(line);

    values.push(digit);

    if (last) logTheResult()
});

