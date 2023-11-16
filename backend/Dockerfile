FROM python:3.12

MAINTAINER Shirasawa

ADD . /app
WORKDIR /app

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

CMD python -m flask run
