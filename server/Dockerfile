
FROM python:3.9-buster

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir -r requirements.txt
# Upgrade pip and install Python dependencies
RUN pip3 install -r requirements.txt
# Expose the port that your Flask app runs on
EXPOSE 5050

# Set the default environment variable
ENV NAME World

# Command to run the Flask application
CMD ["python", "app.py"]
