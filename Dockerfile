FROM python:3.8

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update && \
    apt-get install -y \
    curl \
    nano \
    wget \
    nginx \
    git

# Install Node.js 16
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install Yarn
RUN npm install -g yarn

ENV ENV_TYPE=staging
ENV MONGO_HOST=mongo
ENV MONGO_PORT=27017

ENV PYTHONPATH=$PYTHONPATH:/src/

COPY src/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt