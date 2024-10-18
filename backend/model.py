from transformers import AutoTokenizer, AutoModelForCausalLM, GenerationConfig
import torch
import re
from string import Template
prompt_template = Template("Human: ${inst} </s> Assistant: ")

tokenizer = AutoTokenizer.from_pretrained("m-a-p/ChatMusician-Base", trust_remote_code=True)
# you may replace "m-a-p/ChatMusician-Base" with "m-a-p/ChatMusician", since the base model may not follow instructions. 
model = AutoModelForCausalLM.from_pretrained("m-a-p/ChatMusician-Base", torch_dtype=torch.float16, resume_download=True).eval()

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

instruction = """Develop a musical piece using the given chord progression.
'Dm', 'C', 'Dm', 'Dm', 'C', 'Dm', 'C', 'Dm'
"""

prompt = prompt_template.safe_substitute({"inst": instruction})
inputs = tokenizer(prompt, return_tensors="pt", add_special_tokens=False)
response = model.generate(
        input_ids=inputs["input_ids"].to(model.device),
        attention_mask=inputs['attention_mask'].to(model.device),
        eos_token_id=tokenizer.eos_token_id,
        generation_config=generation_config,
        )
response = tokenizer.decode(response[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)
print(response)
