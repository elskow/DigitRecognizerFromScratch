import base64
import io
import numpy as np
from flask import Flask, jsonify, request
from PIL import Image
from Predictor import Predictor
import torch

app = Flask(__name__)
predictor = Predictor()


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    return response


@app.route("/predict", methods=["POST"])
def predict():
    try:
        image_data_url = request.json["image_data"]

        image_data = image_data_url.split(",")[1]
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))
        image = np.array(image)
        image = Image.fromarray(image, mode="CMYK").convert("L")
        image = Image.eval(image, lambda x: 255 - x)
        image = image.resize((28, 28))
        image = image.point(lambda x: 0 if x < 128 else 255, "1")
        image = np.array(image)
        image = image.astype(np.float32) / 255.0
        image = torch.from_numpy(image).unsqueeze(0).unsqueeze(0)

        prediction, confidence = predictor.predict(image)

        return jsonify(
            {"predicted_digit": str(prediction), "confidence": str(confidence)}
        )

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
