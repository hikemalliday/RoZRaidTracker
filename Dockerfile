FROM python:3.11-slim AS builder

WORKDIR ./roz_loot_tracker

RUN apt-get update && apt-get install -y \
    gcc \
    libmariadb-dev \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY ./roz_loot_tracker/requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.11-slim

WORKDIR ./roz_loot_tracker

RUN apt-get update && apt-get install -y \
    libmariadb-dev \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*

COPY ./roz_loot_tracker .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
