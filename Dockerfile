# -----------------------------------------------------------------------------
# Base image
# -----------------------------------------------------------------------------
# Keep Python 3.8 as expected by the assignment.
FROM python:3.8

# Use bash instead of sh
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install required system packages
RUN apt-get update
RUN apt-get install -y \
    curl \
    nano \
    wget \
    nginx \
    git

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get install -y yarn

# Environment variables
ENV ENV_TYPE=staging
ENV MONGO_HOST=mongo
ENV MONGO_PORT=27017

ENV PYTHONPATH=$PYTHONPATH:/src/

# Copy Python dependencies
COPY src/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt