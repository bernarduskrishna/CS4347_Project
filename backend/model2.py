from musiclang_predict import MusicLangPredictor
from music21 import converter
import os
import random
import subprocess

nb_tokens = 1024
nb_chords = 1 
temperature = 0.9
top_p = 1.0
seed = 16

ml = MusicLangPredictor('musiclang/musiclang-v2') # Only available model for now

def suggest_melody(abc):
    # save abc to temp.abc
    with open('temp.abc', 'w') as f:
        f.write(abc)

    # remove temp.mid
    os.system('rm temp.mid')

    # convert abc notation to midi and save it as temp.mid
    s = converter.parse('temp.abc')
    s.write('midi', fp='temp.mid')

    # generate melody
    score = ml.predict(
        nb_tokens=nb_tokens,
        score='temp.mid',
        temperature=temperature,
        topp=top_p,
        rng_seed=seed,
        nb_chords=1
    )

    # Delete temp.musicxml and ./META-INF and ./temp
    os.system('rm temp.mxl')
    os.system('rm -r META-INF')
    os.system('rm -r temp')

    score.to_musicxml('temp.mxl')
    
    # unzip temp.mxl
    os.system('unzip temp.mxl')

    args = ['python', 'xml2abc.py', 'temp.musicxml', '-o', 'temp']
    os.system(' '.join(args))

    # look at stdout
    result = subprocess.run(args, stdout=subprocess.PIPE, stderr = subprocess.PIPE).stderr.decode('utf-8')

    # if it's not temp.abc written with 1 voices, return ""
    if 'temp.abc written with 1 voices' not in result:
        return ""

    # Read the generated abc
    with open('./temp/temp.abc', 'r') as f:
        melody = f.read()

    return melody

# call suggest_melody, but change seed every time
def suggest_melodies(abc):
    global seed
    melodies_set = set()
    while len(melodies_set) < 5:
        # random seed
        seed = random.randint(0, 1000)
        melody = suggest_melody(abc)
        if melody not in melodies_set and melody != "":
            melodies_set.add(melody)
    return list(melodies_set)
