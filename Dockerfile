FROM python:3.8

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update && \
    apt-get install -y \
    curl \
    nano \
    wget \
    nginx \
    git

ENV ENV_TYPE=staging
ENV MONGO_HOST=mongo
ENV MONGO_PORT=27017

ENV PYTHONPATH=$PYTHONPATH:/src/

COPY src/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt