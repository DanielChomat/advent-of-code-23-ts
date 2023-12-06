import lineReader from 'line-reader';

const values: number[] = []

const findFirstAndLastDigit = (line: string): number => {
    const match = line.match(/\d/g);

    if (!match) return 0;

    const lastIndex = match?.length - 1 ?? 0;

    const firstDigit = match[0]
    const lastDigit = match[lastIndex];

    return +`${firstDigit}${lastDigit}`
}

const logTheResult = () => {
    const result = values?.reduce((acc, curr) => acc + curr, 0)

    console.log({result})
}

lineReader.eachLine('./src/01/input.txt', function (line, last) {
    const digit = findFirstAndLastDigit(line);

    values.push(digit);

    if (last) logTheResult()
});

