import torch
import numpy as np
from PIL import Image
import pathlib


class Predictor:
    def __init__(self):
        self.model = torch.jit.load(
            str(pathlib.Path(__file__).parent.absolute()) + "/../../model/model.pth",
            map_location="cpu",
        )
        self.model.eval()

    def predict(self, input):
        pred = self.model(input)
        pred = pred.argmax().item()

        prob = torch.nn.functional.softmax(self.model(input), dim=1)[0][pred].item()

        return pred, prob
