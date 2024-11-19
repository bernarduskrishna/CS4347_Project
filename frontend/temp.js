// App.js

function onEditorChange(value, event) {
  setValue(value);
  // Extract chords from the value. Chords will be those characters that are enclosed in double quotes
  let newChords = [];
  let chord = "";
  let inChord = false;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '"') {
      if (inChord) {
        newChords.push(chord);
        chord = "";
        inChord = false;
      } else {
        inChord = true;
      }
    } else if (inChord) {
      chord += value[i];
    }
  }
  setChords(newChords);
}

const update_chords = () => {
  // extract chords from the value. chords are those characters that are enclosed in double quotes
  let newChords = [];
  let chord = "";
  let inChord = false;

  for (let i = 0; i < value.length; i++) {
    if (value[i] === '"') {
      if (inChord) {
        newChords.push(chord);
        chord = "";
        inChord = false;
      } else {
        inChord = true;
      }
    } else if (inChord) {
      chord += value[i];
    }
  }
  setChords(newChords);
}





export const formatAbc = (abc, chords = [], just_update_chords = false) => {
  if (just_update_chords) {
    abc = removeChords(abc);
    let lines = abc.split("\n");
    let vIndex = lines.findIndex((line) => line.startsWith("V:1"));
    let vLine = lines[vIndex + 1];
    let newVLine = "";

    if (chords.length > 0) {
      newVLine += `"${chords[0]}" `;
      let i = 1;

      for (let j = 0; j < vLine.length; j++) {
        if (vLine[j] === "|") {
          newVLine += "|";
          if (i < chords.length) {
            newVLine += ` "${chords[i]}" `;
            i++;
          }
        } else {
          newVLine += vLine[j];
        }
      }

      lines[vIndex + 1] = newVLine;
      abc = lines.join("\n");
    }
    return abc;
  }

  // Remove existing chords in the abc
  abc = removeChords(abc);
  // Firstly, remove all lines that start with T: or C: or w:
  abc = abc.split("\n").filter((line) => {
    return !line.startsWith("T:") && !line.startsWith("C:") && !line.startsWith("w:");
  }).join("\n");
  // If last line is empty line, remove it
  if (abc[abc.length - 1] === "\n") {
    abc = abc.slice(0, -1);
  }
  // If there are multiple V: lines, remove all but the first one
  let vCount = 0;

  abc = abc.split("\n").filter((line) => {
    if (line.startsWith("V:")) {
      if (vCount === 0) {
        vCount++;
        return true;
      }
      return false;
    }
    return true;
  }
  ).join("\n");

  // Change all occurrences of |] to |
  abc = abc.replace(/\|]/g, "|");

  // Using regex, remove all occurrences of %{any_number}
  abc = abc.replace(/%\d+/g, "");

  // From the first |, remove all subsequent occurrences of \n
  let firstBarIndex = abc.indexOf("|");
  abc = abc.slice(0, firstBarIndex + 1) + abc.slice(firstBarIndex + 1).replace(/\n/g, "");

  // Add the chords with "" around them, in every bar
  let lines = abc.split("\n");
  let vIndex = lines.findIndex((line) => line.startsWith("V:1"));
  let vLine = lines[vIndex + 1];
  let newVLine = "";

  if (chords.length > 0) {
    newVLine += `"${chords[0]}" `;
    let i = 1;

    for (let j = 0; j < vLine.length; j++) {
      if (vLine[j] === "|") {
        newVLine += "|";
        if (i < chords.length) {
          newVLine += ` "${chords[i]}" `;
          i++;
        }
      } else {
        newVLine += vLine[j];
      }
    }

    lines[vIndex + 1] = newVLine;
    abc = lines.join("\n");
  }

  // If there are 10 or more | characters, add \n after every 10th |
  let barCountAfter = 0;
  let newAbc = "";
  for (let i = 0; i < abc.length; i++) {
    if (abc[i] === "|") {
      barCountAfter++;
    }
    newAbc += abc[i];
    if (barCountAfter === 10) {
      barCountAfter = 0;
      newAbc += "\n";
    }
  }

  abc = newAbc;

  // If there are fewer than 10 | characters, add one | on the last line
  let barCount = 0;
  for (let i = 0; i < abc.length; i++) {
    if (abc[i] === "|") {
      barCount++;
    }
  }

  if (barCount < 10) {
    abc = abc + "\n|";
  }

  // Replace || with |
  abc = abc.replace(/\|\|/g, "|");

  // Replace consecutive spaces with a single space
  abc = abc.replace(/ +/g, " ");

  return `\`\`\`abc\n${abc}\n\`\`\``;
}