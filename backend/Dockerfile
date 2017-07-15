FROM python:2.7

WORKDIR /tmp
COPY requirements.txt /tmp
RUN pip install -r requirements.txt

COPY . /app
WORKDIR /app

EXPOSE 5000
ENTRYPOINT ["python", "app.py"]