from transformers import AutoTokenizer, AutoModelForCausalLM, GenerationConfig
import torch
import re
from string import Template
prompt_template = Template("Human: ${inst} </s> Assistant: ")

tokenizer = AutoTokenizer.from_pretrained("m-a-p/ChatMusician-Base", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained("m-a-p/ChatMusician-Base", device_map='cuda', torch_dtype=torch.float16).eval()

generation_config = GenerationConfig(
    temperature=0.2,
    top_k=40,
    top_p=0.9,
    do_sample=True,
    num_beams=1,
    repetition_penalty=1.1,
    min_new_tokens=10,
    max_new_tokens=1536
)

def prompt_llm(instruction):
    prompt = prompt_template.safe_substitute({"inst": instruction})
    inputs = tokenizer(prompt, return_tensors="pt", add_special_tokens=False)
    response = model.generate(
            input_ids=inputs["input_ids"].to(model.device),
            attention_mask=inputs['attention_mask'].to(model.device),
            eos_token_id=tokenizer.eos_token_id,
            generation_config=generation_config,
            )
    
    return tokenizer.decode(response[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)

def suggest_harmony(melody, harmony):
    instruction = f"""
    Given the following melody: {melody}
    And the following harmony: {harmony}
    Suggest only the harmony for the next unwritten bar in abc notation.
    Respond with just the abc notation for the new bar, and nothing else.
    Do not repeat the previous bars or provide any additional context.
    """

    return prompt_llm(instruction)

def suggest_melody(melody, harmony):
    instruction = f"""
    Given the following melody in abc notation: {melody}
    And the following harmony in abc notation: {harmony}
    Suggest only the melody for the next unwritten bar in abc notation.
    Respond with just the abc notation for the new bar, and nothing else.
    Do not repeat the previous bars or provide any additional context.
    """

    return prompt_llm(instruction)
