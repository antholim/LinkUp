import torch
import sys
import json
import torch.nn as nn
import torch.nn as nn
from transformers import AutoTokenizer, DistilBertModel
import numpy as np
import os
import warnings
warnings.filterwarnings("ignore", message="TypedStorage is deprecated.")
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

#Macbook
# torch.backends.quantized.engine = 'qnnpack'


class MultiLabelClassifier(nn.Module):
    def __init__(self, output_dim):
        super(MultiLabelClassifier, self).__init__()
        self.bert = DistilBertModel.from_pretrained("distilbert-base-uncased")
        self.fc = nn.Linear(self.bert.config.hidden_size, output_dim)
        self.sigmoid = nn.Sigmoid()

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.last_hidden_state[:, 0, :]
        return self.sigmoid(self.fc(pooled_output))
    
device = torch.device("cpu")

# Model Parameters
output_dim = 6
label_names = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]
threshold = 0.6

#Load Quantized Model

model = MultiLabelClassifier(output_dim).to(device)
quantized_model = torch.quantization.quantize_dynamic(
    model, {torch.nn.Linear}, dtype=torch.qint8
)
quantized_model_path = "model//LINKUP_final.pth"
checkpoint = torch.load(quantized_model_path, map_location=device)
quantized_model.load_state_dict(checkpoint)

quantized_model.to(device)
quantized_model.eval()
# model = quantized_model


# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def predict_toxicity(text):
    # """Tokenizes input text, runs inference, and returns multi-label predictions."""
    
    # Tokenize input text
    print(text)
    threshold = 0.9
    inputs = tokenizer(
        text,
        padding="max_length",
        truncation=True,
        max_length=128,
        return_tensors="pt" 
    ).to(device) 
    label_names = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]
    with torch.no_grad():
        output = quantized_model(inputs["input_ids"], inputs["attention_mask"].float())
    
    # Apply Sigmoid Activation & Convert to Binary Labels
    probabilities = output.cpu().numpy()
    binary_predictions = (probabilities >= threshold).astype(int)


    # Create dictionary of predictions
    result = {label_names[i]: int(binary_predictions[0][i]) for i in range(len(label_names))}
    
    return result, probabilities

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        input_data = json.loads(input_data)
        result, probabilities = predict_toxicity(input_data["text"]) # input str
        # print(json.dumps({"predictions": result}))
        print(json.dumps(result))

    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"JSON Decode Error: {str(e)}"}))
    except Exception as e:
        print(json.dumps({"error": f"Unexpected Error: {str(e)}"}))