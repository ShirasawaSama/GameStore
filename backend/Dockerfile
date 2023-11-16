FROM python:3.12

MAINTAINER Shirasawa

ADD . /app
WORKDIR /app

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

EXPOSE 5000

ENTRYPOINT python -m flask run --host 0.0.0.0 --port 5000
