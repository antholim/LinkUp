import torch
import sys
import json
import torch.nn as nn
import torch.nn as nn
from transformers import AutoTokenizer, BertModel
import numpy as np
import os


class MultiLabelClassifier(nn.Module):
    def __init__(self, output_dim):
        super(MultiLabelClassifier, self).__init__()
        self.bert = BertModel.from_pretrained("bert-base-uncased")
        self.fc = nn.Linear(self.bert.config.hidden_size, output_dim)
        self.sigmoid = nn.Sigmoid()

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.pooler_output
        return self.sigmoid(self.fc(pooled_output))
    
device = "cuda" if torch.cuda.is_available() else "cpu"

# Recreate the model architecture
output_dim = 6  # Change this based on your model output
model = MultiLabelClassifier(output_dim).to(device)

# Load the saved state_dict
checkpoint = torch.load("LINKUP_model1.pth", map_location=device)
model.load_state_dict(checkpoint)  # ✅ Correct way to load state_dict

model.eval()  # Set model to evaluation mode


# Load BERT tokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

def predict_toxicity(text):
    # """Tokenizes input text, runs inference, and returns multi-label predictions."""
    
    # Tokenize input text
    inputs = tokenizer(
        text,
        padding="max_length",
        truncation=True,
        max_length=128,
        return_tensors="pt" 
    ).to(device) 
    
    # Run inference
    with torch.no_grad():
        output = model(inputs["input_ids"], inputs["attention_mask"])
    
    # Convert probabilities to binary labels
    predicted_labels = (output.cpu().numpy() > 0.5).astype(int)

    # Define label names
    label_names = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]

    # Create dictionary of predictions
    result = {label_names[i]: int(predicted_labels[0][i]) for i in range(len(label_names))}

    return result

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        input_data = json.loads(input_data)
        result = predict_toxicity(input_data["text"]) # input str
        print(json.dumps(result))

    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"JSON Decode Error: {str(e)}"}))
    except Exception as e:
        print(json.dumps({"error": f"Unexpected Error: {str(e)}"}))