from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
import joblib, os

os.makedirs("models", exist_ok=True)
X, y = load_iris(return_X_y=True)
clf = RandomForestClassifier().fit(X, y)
joblib.dump(clf, "models/test-model-001.pkl")
print("Done — models/test-model-001.pkl created")