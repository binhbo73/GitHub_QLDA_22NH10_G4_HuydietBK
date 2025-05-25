from django.test import TestCase

# Create your tests here.

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

headers = {
    "Authorization": "Bearer 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",  # thay bằng key của bạn
    "Content-Type": "application/json"
}

data = {
    "model": "deepseek/deepseek-r1:free",
    "messages": [
        {"role": "system", "content": "Bạn là một copywriter chuyên nghiệp, bài viết sẽ được đăng lên Facebook."},
        {"role": "user", "content": "Viết một đoạn văn 300 từ giới thiệu về bộ phim Địa đạo."}
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