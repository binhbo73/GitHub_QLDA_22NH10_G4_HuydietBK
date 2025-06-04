# syntax=docker/dockerfile:1
FROM python:3.11-slim

# Cài g++ nếu có dùng những package như numpy, psycopg2, v.v.
RUN apt-get update && apt-get install -y gcc

# Tạo thư mục app
WORKDIR /app

# Sao chép requirements trước để tận dụng cache
COPY requirements.txt .

# Cài thư viện Python
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn sau cùng
COPY . .

# Mặc định chạy server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]