# Digit Recognizer from Scratch + Web UI

<img src="docs/preview.png" alt="preview"/>

## Introduction

This is a simple digit recognizer from scratch using python and numpy. The model is trained on MNIST dataset. The model is trained using resnet architecture. The model is trained on 60,000 images and tested on 10,000 images. The model has an accuracy of 99.01% on the test set. The model is then deployed on a web UI using Flask.

This project is built for the mid-term project of the Artificial Intelligence course at the State University of Surabaya.

## How to run

1. Clone this repository
2. Go to web-app folder

```bash
cd web-app
```

3. Install the dependencies

```bash
npm install && npm run setup
```

4. Run Backend

```bash
npm run be
```

5. Run Frontend

```bash
npm run fe
```

6. Open http://localhost:3000 in your browser
