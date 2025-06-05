from pydub import AudioSegment
from pydub.effects import normalize
import torchvision

# Tắt cảnh báo Beta từ torchvision
torchvision.disable_beta_transforms_warning()

def transfer_audio_to_text():
  from transformers import pipeline

  import os

  media_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "Backend")
  os.makedirs(media_dir, exist_ok=True)

  filename = os.path.join(media_dir, "audio.wav")
  processed_filename = os.path.join(media_dir, "processed_audio.wav")

  # Tiền xử lý âm thanh
  audio = AudioSegment.from_wav(filename)
  audio = normalize(audio)  # Chuẩn hóa âm lượng
  audio = audio.strip_silence(silence_len=1000, silence_thresh=-40)  # Cắt bỏ khoảng lặng
  audio.export(processed_filename, format="wav")
  print(f"Đã lưu ghi âm đã xử lý vào tệp {processed_filename}")

  transcriber = pipeline("automatic-speech-recognition", model="vinai/PhoWhisper-base")
  output = transcriber(processed_filename)['text']

  print(output)

  return output

if __name__ == "__main__":
  transfer_audio_to_text()
