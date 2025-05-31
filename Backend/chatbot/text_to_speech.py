import requests
import os
import json

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
        "apikey": "pJ8qlkMaWXEzfqp0ZLwQAfxyxnreftkk",
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
                        print(f"Downloading audio from: {audio_url}")
                        audio_response = requests.get(audio_url)
                        if audio_response.status_code == 200:
                            with open(output_path, "wb") as f:
                                f.write(audio_response.content)
                            print(f"Successfully generated audio file at: {output_path}")
                            return output_path
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
    test_text = '''**Doraemon** - bộ phim hoạt hình Nhật Bản kinh điển, ra đời từ năm 1973, 
'''
    result = text_to_speech_zalo(test_text)
    if result:
        print(f"Audio generated successfully at: {result}")