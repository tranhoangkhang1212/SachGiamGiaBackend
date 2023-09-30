#!/bin/bash

# Tên của container mới
container_name="sach_giam_gia_be_container"

# Kiểm tra xem container đã tồn tại chưa
if [[ "$(docker ps -aqf name=${container_name})" ]]; then
  # Nếu container tồn tại, dừng và xóa container cũ
  echo "Stopping and removing the existing Docker container: ${container_name}"
  docker stop ${container_name}
  docker rm ${container_name}
fi

# Step 1: Build the Docker image
docker build -t sach_giam_gia_be .

# Kiểm tra xem quá trình build thành công hay không
if [ $? -eq 0 ]; then
  echo "Docker image built successfully."
else
  echo "Docker image build failed. Exiting..."
  exit 1
fi

# Step 2: Run the Docker container
docker run -d --name ${container_name} -p 8080:3001 sach_giam_gia_be

# Kiểm tra xem container có đang chạy không
if [ $? -eq 0 ]; then
  echo "Docker container running on PORT 8080"