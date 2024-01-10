import lineReader from "line-reader";

let index = 0;
const arrayToUseAsIndex = []

const SEEDS_STRING_TO_CHECK = "seeds"

const seeds: number[] = []

type Interval = {
    sourceStart: number;
    destinationStart: number;
    length: number;
}
type Mapping = {
    source: string;
    destination: string;
    intervals: Interval[]
}

const resultMapping: Mapping[] = []

const saveSeedsIntoMemory = (line: string) => {
    const seedsString = line.split(":").join("");

    const seedsMatched = seedsString.match(/\d+/g);

    seedsMatched?.forEach(seed => seeds.push(+seed))
}

const transformMappingIntoMemory = (line: string) => {
    const usefulLineSplit = line.split(" ");

    const usefulStuffSplit = usefulLineSplit[0].split("-");

    const sourceMapping = usefulStuffSplit[0]
    const destinationMapping = usefulStuffSplit[2];

    resultMapping.push({
        source: sourceMapping.toUpperCase(),
        destination: destinationMapping.toUpperCase(),
        intervals: []
    })
}

const saveTheIntervals = (line: string) => {
    const numbersStringSplit = line.match(/\d+/g)
    if (!numbersStringSplit) return;

    const sourceStart = +numbersStringSplit[1]
    const destinationStart = +numbersStringSplit[0]
    const length = +numbersStringSplit[2];

    const indexOfTheMappingToInserInto = arrayToUseAsIndex.length - 1
    const intervalsToPushInto = resultMapping[indexOfTheMappingToInserInto]?.intervals

    intervalsToPushInto?.push({
        sourceStart,
        destinationStart,
        length
    })

}

const consumeLine = (line: string) => {
    // Saving the seeds into memory    
    if (line.includes(SEEDS_STRING_TO_CHECK)) {
        saveSeedsIntoMemory(line)
        return;
    }

    // Skipping empty lines
    if (line === '') return;

    // If it is the heading of the mapping or the specific mapping numbers
    const containsNumbers = !!line.match(/\d/)
    // Consuming heading of the mapping    
    if (!containsNumbers) {
        transformMappingIntoMemory(line)
        arrayToUseAsIndex.push(0)
        return;
    }

    // Consuming numbers from intervals/mappings
    saveTheIntervals(line);
}

const logTheResult = () => {

    // Going through the seeds & finding the lowest one
    const seedWithLowestLocation = seeds.reduce((lowestSeed, currSeed) => {

        // Traversing from seed through soil, fetilizer, etc. until the location
        // acc - traversed number
        // curr - the mapping ({source, destination, intervals)
        const traversedNumber = resultMapping.reduce((accTraversedNumber, currMapping) => {
            const intervals = currMapping.intervals

            const mappingToUse = intervals.find((singleMapping) => {
                const min = singleMapping.sourceStart;
                const max = min + singleMapping.length;

                const isLowerIntervalChecked = min <= accTraversedNumber
                const isHigherIntervalChecked = accTraversedNumber <= max

                return isLowerIntervalChecked && isHigherIntervalChecked;
            })

            const getDestinationTraversedNumber = () => {
                // When the numbers in the input are not mapped. From the assignment: 
                // "Any source numbers that aren't mapped correspond to the same destination number.
                // So, seed number 10 corresponds to soil number 10."
                if (!mappingToUse) {
                    return accTraversedNumber
                }

                // Getting the diff from the sourceStart
                const diff = accTraversedNumber - mappingToUse.sourceStart;
                const destinationNumber = mappingToUse.destinationStart + diff
                return destinationNumber;
            }
            const destinationTraversedNumber = getDestinationTraversedNumber()

            return destinationTraversedNumber;
        }, currSeed)

        return Math.min(lowestSeed, traversedNumber);
    }, Infinity)

    console.log(seedWithLowestLocation)
}

lineReader.eachLine('./src/05/input.txt', function (line, last) {
    consumeLine(line);

    if (last) logTheResult()
});