from musiclang_predict import MusicLangPredictor
from music21 import converter
from transformers import AutoTokenizer, AutoModelForCausalLM
import os
import random
import subprocess
import torch

nb_tokens = 1024
nb_chords = 1 
temperature = 0.9
top_p = 1.0
seed = 16

ml = MusicLangPredictor('musiclang/musiclang-v2')

tokenizer = AutoTokenizer.from_pretrained("musiclang/text-chord-predictor")
ml_chord = AutoModelForCausalLM.from_pretrained("musiclang/text-chord-predictor")

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

def suggest_harmonies(chords = "CM CM"):
    inputs = tokenizer(chords, return_tensors='pt')
    input_ids = inputs.input_ids
    attention_mask = inputs.attention_mask
    # torch.manual_seed(3000)
    x = ml_chord.generate(input_ids, attention_mask=attention_mask, max_length = len(input_ids[0]) + 1, num_return_sequences=100, do_sample=True)
    tally = {}
    for a in x:
        d = tokenizer.decode(a, skip_special_tokens=True)
        if d not in tally:
            tally[d] = 1
        else:
            tally[d] += 1

    # Get top 5 most common suggestions
    tally = sorted(tally.items(), key=lambda x: x[1], reverse=True)
    if tally[0] == "":
        tally = [x[0] for x in tally[1:6]]
    else:
        tally = [x[0] for x in tally[:5]]
    
    return tally