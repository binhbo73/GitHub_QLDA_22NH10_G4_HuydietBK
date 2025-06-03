# tngtech/deepseek-r1t-chimera:free
# qwen/qwen3-30b-a3b:free
# deepseek/deepseek-chat-v3-0324:free
# deepseek/deepseek-prover-v2:free
# opengvlab/internvl3-14b:free
# meta-llama/llama-3.3-8b-instruct:free
# microsoft/mai-ds-r1:free
# thudm/glm-z1-32b:free
# meta-llama/llama-4-maverick:free
# meta-llama/llama-4-scout:free
# google/gemma-3-27b-it:free
# qwen/qwq-32b:free
# deepseek/deepseek-r1:free

import httpx
import json
from pathlib import Path
import os
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

headers = {
  "Authorization": "Bearer " + os.getenv('OPENROUTER_API_KEY'),
  "Content-Type": "application/json"
}

def generate_content(model, prompt):
  data = {
    "model": model,
    "messages": [
      {"role": "system", "content": "Bạn là một copywriter chuyên nghiệp, bài viết sẽ được đăng lên Facebook."},
      {"role": "user", "content": prompt}
    ],
    "stream": True  # bật chế độ stream
  }

  with httpx.stream("POST", "https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data, timeout=60.0) as response:
    for line in response.iter_lines():
      if line.startswith("data: "):
        raw = line.removeprefix("data: ").strip()
        if raw == "[DONE]":
          break
        try:
          content = json.loads(raw)["choices"][0]["delta"].get("content", "")
          print(content, end="", flush=True)
        except Exception as e:
          pass  # hoặc in lỗi ra để debug

generate_content("deepseek/deepseek-r1:free", "Viết một đoạn văn 100 từ giới thiệu về bộ phim Conan.")