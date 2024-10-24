from musiclang_predict import MusicLangPredictor
from music21 import converter

nb_tokens = 1024 
temperature = 0.9
top_p = 1.0
seed = 16

ml = MusicLangPredictor('musiclang/musiclang-v2') # Only available model for now

def suggest_melody(abc):
    # save abc to temp.abc
    with open('temp.abc', 'w') as f:
        f.write(abc)

    # convert abc notation to midi and save it as temp.mid
    s = converter.parse('temp.abc')
    s.write('midi', fp='temp.mid')

    # generate melody
    score = ml.predict(
        nb_tokens=nb_tokens,
        score='temp.mid',
        temperature=temperature,
        topp=top_p,
        rng_seed=seed
    )

    score.to_musicxml('temp.mxl')

    # @Hyungwoon: Convert back to abc
    melody = "lalala"

    return melody