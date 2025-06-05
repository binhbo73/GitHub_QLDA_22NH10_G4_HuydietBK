import requests
import os
import json

api_keys = [
    "pJ8qlkMaWXEzfqp0ZLwQAfxyxnreftkk",
    "qqt7P6dg9I3cH3uJJY5R0qoKKf16OAnb",
    "B7k5ug9C9ELEMNO2jNGIFgesCV28Dgbr"
    "ZQuA2RYMn4QTgmGikOEimV6iQF7tXtL2",
]
current = 0

def text_to_speech_zalo(text, output_file="output.wav"):
    url = "https://api.zalo.ai/v1/tts/synthesize"

    # Tạo đường dẫn đầy đủ cho file output
    media_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "media"
    )
    os.makedirs(media_dir, exist_ok=True)
    output_path = os.path.join(media_dir, output_file)

    # Cấu hình payload theo đúng yêu cầu của Zalo API
    payload = {
        "input": text,
        "speed": 1.0,
        "encode_type": 0,  # Changed to 0 for better compatibility
        "speaker_id": 1    # Changed to 1 for female southern voice
    }

    headers = {
        "apikey": api_keys[0],
        "Content-Type": "application/x-www-form-urlencoded"  # Changed content type
    }

    try:
        # Use data parameter instead of json
        response = requests.post(url, data=payload, headers=headers)

        # Debug info
        print(f"Request payload: {payload}")
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {response.headers}")
        print(f"Response content: {response.text[:200]}")

        if response.status_code == 200:
            try:
                json_response = response.json()
                if isinstance(json_response, dict) and json_response.get("error_code") == 0:
                    audio_url = json_response.get("data", {}).get("url")
                    if audio_url:
                        return audio_url  # Return the audio URL directly
                        # print(f"Downloading audio from: {audio_url}")
                        # audio_response = requests.get(audio_url)
                        # if audio_response.status_code == 200:
                        #     with open(output_path, "wb") as f:
                        #         f.write(audio_response.content)
                        #     print(f"Successfully generated audio file at: {output_path}")
                        #     return output_path
                else:
                    raise Exception(f"Zalo API Error: {json_response.get('error_message', 'Unknown error')}")
            except json.JSONDecodeError:
                # If response is direct audio content
                with open(output_path, "wb") as f:
                    f.write(response.content)
                print(f"Successfully generated audio file at: {output_path}")
                return output_path
        else:
            raise Exception(f"HTTP Error: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"Error in text_to_speech_zalo: {str(e)}")
        return None

# Test function
if __name__ == "__main__":
    test_text = '''
    "Con gái hay con trai, điều quan trọng nhất là được yêu thương và tôn trọng! 💞
Trong một gia đình hạnh phúc, mỗi đứa trẻ đều xứng đáng có cơ hội phát triển toàn diện, dù là con trai hay con gái.
🌻 Hãy nuôi dưỡng tài năng, tính cách và ước mơ của các con, thay vì gò bó bởi định kiến giới.
💪 Khuyến khích con trai biết dịu dàng, con gái mạnh mẽ, vì thế giới này cần cả sự cân bằng và đa màu sắc.

Nhớ nhé:
- Con gái không "yếu đuối" chỉ vì là phái nữ.
- Con trai không cần "che giấu" cảm xúc để tỏ ra cứng rắn.

Gia đình là nơi ươm mầm hạnh phúc, hãy để tình yêu thương vượt lên mọi khuôn mẫu. 🏠✨

#BìnhĐẳngGiới #GiaĐìnhHạnhPhúc #NuôiDạyConTíchCực"

---

Thông điệp này vừa tôn vinh sự đa dạng, vừa gửi gắm tinh thần tiến bộ, phù hợp với cộng đồng Facebook. Bạn có thể tuỳ chỉnh theo phong cách cá nhân nhé! 😊
'''
    result = text_to_speech_zalo(test_text)
    if result:
        print(f"Audio generated successfully at: {result}")
