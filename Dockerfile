# Dockerfile
FROM python:3.11-slim

WORKDIR /app/roz_loot_tracker

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libmariadb-dev \
    default-libmysqlclient-dev \
    pkg-config \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY roz_loot_tracker/requirements.txt .
RUN pip install -r requirements.txt

COPY roz_loot_tracker .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
