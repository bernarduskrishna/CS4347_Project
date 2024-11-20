import * as Tone from "tone";

export const DEFAULT_VALUE = `X:1
T:Shire - Excerpt
C:Howard Shore
L:1/8
M:4/4
I:linebreak $
K:C
V:1 treble nm="Piano" snm="Pno."
V:1
| E2 G4 E1D1 | C4- C1C1E1G1 | A2 C'2 B2 G2 | E3 F/2E/2 D4 |] %16`;

export const DEFAULT_CHORDS = ["CM", "CM", "FM", "GM"];

export const PIANO = new Tone.Sampler({
  urls: {
    C4: "C4.mp3",
    "D#4": "Ds4.mp3",
    "F#4": "Fs4.mp3",
    A4: "A4.mp3",
  },
  release: 1,
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

export const removeChords = (abc) => {
  // Removes all "" enclosed strings unless they are part of key-value pairings
  // E.g. will remove standalond chord labels, but not the instrumentations for the V: lines
  // console.log(abc.replace(/(?<=^|[^\w"=])"(?!\s*=)[^"]*"(?!\s*=)/g, ""))
  // return abc.replace(/(?<=^|[^\w"=])"(?!\s*=)[^"]*"(?!\s*=)/g, "");
  return abc.replace(/"(?![^"]*=\s*["]?[a-zA-Z]+["]?\s*")[^"]*"/g, "");
}

export const addChords = (abc, chords = []) => {

  // Split the lines into each line
  let lines = abc.split("\n");

  // Find the index of the last line starting with V:
  let vIndex = lines.findLastIndex((line) => line.startsWith("V:1"));

  // Start iterating through the line after the last line containing V:
  let vLine = lines[vIndex + 1];
  let newVLine = "";

  // Add each chord to the newVLine after each | has been encountered
  if (chords.length > 0) {
    newVLine += ``;
    let i = 0;

    for (let j = 0; j < vLine.length; j++) {
      if (vLine[j] === "|") {
        newVLine += "|";
        if (i < chords.length) {
          newVLine += ` "${chords[i]}"`;
          i++;
        }
      } else {
        newVLine += vLine[j];
      }
    }

    lines[vIndex + 1] = newVLine;
  }

  return lines.join("\n").replace(/ +/g, " ");;
}

export const extractChords = (abc) => {

  // Split the lines into each line
  let lines = abc.split("\n");

  // Find the index of the last line starting with V:
  let vIndex = lines.findLastIndex((line) => line.startsWith("V:1"));

  // Extract chords from the value; Chords are those characters that are enclosed in double quotes
  let newChords = [];
  const chordMatch = /"\s*([CDEFGAB][a-zA-Z#]*\s*)\s*"/g;
  let match;

  // Start iterating through the lines after the last line containing V:
  for (let i = vIndex + 1; i < lines.length; i++) {
    while ((match = chordMatch.exec(lines[i])) !== null) {
      newChords.push(match[1].trim());
    }
  }
  return newChords;
}

export const formatChords = (chords) => {
  let newChords = chords;
  for (let i = 0; i < chords.length; i++) {
    if (chords[i].slice(-3) === "maj") {
      newChords[i] = chords[i].replace("maj", "M");
    } else if (chords[i].slice(-3) === "min") {
      newChords[i] = chords[i].replace("min", "m");
    }
  }
  return newChords;
}

export const addFiller = (abc, chords) => {

  // Replace || with |
  abc = abc.replace(/\|\|/g, "|");

  // Split the lines into each line
  let lines = abc.split("\n");

  // Find index of line where we should add in the filler
  let noteLines = lines.filter((line) => line.includes("|"));
  let measureCount = noteLines.map((line) => (line.match(/\|/g) || []).length).reduce((partialSum, a) => partialSum + a, 0) - 1;
  let chordCount = chords.length;

  // If we have more chords than measures (or equal number), add in fillers
  if (chordCount > measureCount) {
    const overflow = chordCount - measureCount; // How many measures we need to fill in
    const overflowFiller = '|' + ' C |'.repeat(overflow);
    let fIndex = lines.findLastIndex((line) => line.includes("|"));
    let lastBarIndex = lines[fIndex].lastIndexOf('|');
    if (lastBarIndex !== -1) {
      lines[fIndex] = lines[fIndex].slice(0, lastBarIndex) + overflowFiller + lines[fIndex].slice(lastBarIndex + 1);
    }
  }
  return lines.join("\n");
}

export const extractVLines = (abc) => {
  // Split the lines into each line
  let lines = abc.split("\n");

  // Find indexes of all lines starting with V:
  let vIndexArr = lines.reduce(function(arr, line, idx) {
    if (line.startsWith("V:")) {
      arr.push(idx);
    }
    return arr;
  }, []);

  // Extract all vLines
  let vLines = [];
  vIndexArr.forEach((idx) => {
    vLines.push(lines[idx]);
    lines[idx] = "";
  })

  return [vLines, lines.filter(line => line !== "").join("\n")];
}

export const addVLines = (abc, vlines) => {
  // Split the lines into each line
  let lines = abc.split("\n");

  // Find index of line where we should add in the V: lines
  let vIndex = lines.findIndex((line) => line.includes("|"));
  vlines.forEach((vline) => {
    lines.splice(vIndex, 0, vline);
    vIndex++;
  })

  return lines.join("\n");
}

export const extractTCLines = (abc) => {
  // Split the lines into each line
  let lines = abc.split("\n");

  // Find indexes of all lines starting with V:
  let tcIndexArr = lines.reduce(function(arr, line, idx) {
    if (line.startsWith("T:") || line.startsWith("C:")) {
      arr.push(idx);
    }
    return arr;
  }, []);

  // Extract all vLines
  let tcLines = [];
  tcIndexArr.forEach((idx) => {
    tcLines.push(lines[idx]);
    lines[idx] = "";
  })

  return [tcLines, lines.filter(line => line !== "").join("\n")];
}

export const addTCLines = (abc, tclines) => {
  // Split the lines into each line
  let lines = abc.split("\n");

  // Find index of line where we should add in the T: / C: lines
  let tcIndex = lines.findIndex((line) => line.includes("X:")) + 1;
  tclines.forEach((tcline) => {
    lines.splice(tcIndex, 0, tcline);
    tcIndex++;
  })

  return lines.join("\n");
}

export const extractL = (abc) => {
  // Split the lines into each line
  let lines = abc.split("\n");

  // Find index of line where we should add in the T: / C: lines
  let LIndex = lines.findIndex((line) => line.includes("L:"));

  // Find the default note length set
  let defaultLength = lines[LIndex].slice(2);

  if (defaultLength.includes('/')) {
    let [numerator, denominator] = defaultLength.split('/').map(Number);
    return numerator / denominator;
  } else {
      return parseInt(defaultLength, 10);
  }
}

export const formatABCGeneration = (abc) => {

  // Firstly, remove all lines that start with T: or C: or Q: or V: or w:
  abc = abc.split("\n").filter((line) => {
    return !line.startsWith("T:") && !line.startsWith("C:") && !line.startsWith("Q:") && !line.startsWith("V:") && !line.startsWith("w:");
  }).join("\n");

  // If last line is empty line, remove it
  if (abc[abc.length - 1] === "\n") {
    abc = abc.slice(0, -1);
  }

  // // If there are multiple V: lines, remove all but the first one
  // let vCount = 0;

  // abc = abc.split("\n").filter((line) => {
  //   if (line.startsWith("V:")) {
  //     if (vCount === 0) {
  //       vCount++;
  //       return true;
  //     }
  //     return false;
  //   }
  //   return true;
  // }
  // ).join("\n");

  // Change all occurrences of !f! to |
  abc = abc.replace(/!f!/g, '|');

  // Change all occurrences of |] to |
  // abc = abc.replace(/\|]/g, "|");
  // Using regex, remove all occurrences of %{any_number}
  // abc = abc.replace(/%\d+/g, "");
  // From the first |, remove all subsequent occurrences of \n
  // let firstBarIndex = abc.indexOf("|");
  // abc = abc.slice(0, firstBarIndex + 1) + abc.slice(firstBarIndex + 1).replace(/\n/g, "");

  // Replace || with |
  abc = abc.replace(/\|\|/g, "|");

  // Replace consecutive spaces with a single space
  abc = abc.replace(/ +/g, " ");

  return abc;
}
