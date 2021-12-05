// set noteMap map object
// in form (staveIndex, pitchIndex)
const noteMap = new Map();
noteMap.set(0, 0);
noteMap.set(1, 2);
noteMap.set(2, 4);
noteMap.set(3, 5);
noteMap.set(4, 7);
noteMap.set(5, 9);
noteMap.set(6, 11);
noteMap.set(7, 12);
noteMap.set(8, 14);
noteMap.set(9, 16);
noteMap.set(10, 17);
noteMap.set(11, 19);
noteMap.set(12, 21);
noteMap.set(13, 23);
noteMap.set(14, 24);
noteMap.set(15, 26);
noteMap.set(16, 28);
noteMap.set(17, 29);
noteMap.set(18, 31);
noteMap.set(19, 33);
noteMap.set(20, 35);
noteMap.set(21, 36);
noteMap.set(22, 38);
noteMap.set(23, 40);
noteMap.set(24, 41);
noteMap.set(25, 43);

const noteArray = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36, 38, 40, 41, 43]

const trialArray = [
    // in format: staveIndex, flat-pitchIndex, natural-pitchIndex, sharp-pitchIndex
    0, 0, 0, 0,
    1, 1, 2, 3,
    2, 3, 4, 5,
    3, 4, 5, 6,
    4, 6, 7, 8,
    5, 8, 9, 10,
    6, 10, 11, 12,
    7, 11, 12, 13,
    8, 13, 14, 15,
    9, 15, 16, 17,
    10, 16, 17, 18,
    11, 18, 19, 20,
    12, 20, 21, 22,
    13, 22, 23, 24,
    14, 23, 24, 25,
    15, 25, 26, 27,
    16, 27, 28, 29,
    17, 28, 29, 30,
    18, 29, 30, 31,
    19, 32, 33, 34,
    20, 34, 35, 36,
    21, 35, 36, 37,
    22, 37, 38, 39,
    23, 39, 40, 41,
    24, 40, 41, 42,
    25, 42, 43, 44
]