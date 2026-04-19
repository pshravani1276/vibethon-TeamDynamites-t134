// src/lib/pyodide.ts
// Pyodide Python executor utility

declare global {
    interface Window {
        loadPyodide: any;
        pyodide: any;
    }
}

let pyodideInstance: any = null;
let pyodideLoading = false;
let pyodideLoadPromise: Promise<any> | null = null;

export async function loadPyodideInstance(): Promise<any> {
    if (pyodideInstance) return pyodideInstance;
    if (pyodideLoadPromise) return pyodideLoadPromise;

    pyodideLoading = true;

    pyodideLoadPromise = new Promise(async (resolve, reject) => {
        try {
            // Load Pyodide script if not already loaded
            if (!window.loadPyodide) {
                await new Promise<void>((res, rej) => {
                    const script = document.createElement("script");
                    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
                    script.onload = () => res();
                    script.onerror = () => rej(new Error("Failed to load Pyodide"));
                    document.head.appendChild(script);
                });
            }

            pyodideInstance = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
            });

            // Install common ML packages
            await pyodideInstance.loadPackage(["numpy", "micropip"]);

            // Set up matplotlib mock for basic support
            await pyodideInstance.runPythonAsync(`
import sys
import io

# Redirect stdout
class CaptureOutput:
    def __init__(self):
        self.outputs = []
    def write(self, text):
        self.outputs.append(text)
    def flush(self):
        pass
    def getvalue(self):
        return ''.join(self.outputs)
    def clear(self):
        self.outputs = []
`);

            pyodideLoading = false;
            resolve(pyodideInstance);
        } catch (error) {
            pyodideLoading = false;
            pyodideLoadPromise = null;
            reject(error);
        }
    });

    return pyodideLoadPromise;
}

export interface ExecutionResult {
    output: string;
    error: string | null;
    executionTime: number;
    success: boolean;
}

export async function executePython(code: string, timeoutMs: number = 10000): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
        const pyodide = await loadPyodideInstance();

        // Set up output capture
        await pyodide.runPythonAsync(`
import sys
import io
_capture = io.StringIO()
sys.stdout = _capture
sys.stderr = _capture
`);

        // Execute with timeout
        const result = await Promise.race([
            pyodide.runPythonAsync(code),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`Execution timed out after ${timeoutMs / 1000} seconds. Check for infinite loops.`)), timeoutMs)
            ),
        ]);

        // Get captured output
        const output = await pyodide.runPythonAsync(`
_out = _capture.getvalue()
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
_out
`);

        const executionTime = performance.now() - startTime;

        // If no output was printed but there's a return value, show it
        const outputStr = output || "";
        const resultStr = result !== undefined && result !== null && result.toString() !== "undefined" && result.toString() !== "None"
            ? result.toString()
            : "";

        const finalOutput = outputStr || resultStr || "(No output)";

        return {
            output: finalOutput,
            error: null,
            executionTime,
            success: true,
        };
    } catch (error: any) {
        const executionTime = performance.now() - startTime;

        // Try to reset stdout
        try {
            const pyodide = await loadPyodideInstance();
            await pyodide.runPythonAsync(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);
        } catch { /* ignore */ }

        // Clean up error message
        let errorMsg = error.message || String(error);
        // Extract just the Python traceback part if present
        if (errorMsg.includes("PythonError:")) {
            errorMsg = errorMsg.split("PythonError:").pop()?.trim() || errorMsg;
        }

        return {
            output: "",
            error: errorMsg,
            executionTime,
            success: false,
        };
    }
}

export function isPyodideLoaded(): boolean {
    return pyodideInstance !== null;
}

export function isPyodideLoading(): boolean {
    return pyodideLoading;
}

// ML Templates for the playground
export const ML_TEMPLATES = [
    {
        id: "hello",
        name: "Hello World",
        category: "Basics",
        code: `# Hello World in Python
print("Hello, NeuralCanvas! 🧠")
print("Let's learn AI/ML together!")

# Basic Python
name = "Neural Explorer"
points = 1250
print(f"Welcome, {name}! You have {points} points.")
`,
    },
    {
        id: "numpy-basics",
        name: "NumPy Basics",
        category: "Data Science",
        code: `import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

print("Array:", arr)
print("Matrix:\\n", matrix)
print("Shape:", matrix.shape)
print("Mean:", np.mean(arr))
print("Sum:", np.sum(matrix))
print("Transpose:\\n", matrix.T)
`,
    },
    {
        id: "linear-regression",
        name: "Linear Regression",
        category: "ML Algorithms",
        code: `import numpy as np

# Simple Linear Regression from scratch
np.random.seed(42)

# Generate sample data
X = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], dtype=float)
y = 2 * X + 1 + np.random.randn(10) * 0.5

# Calculate coefficients using least squares
n = len(X)
x_mean = np.mean(X)
y_mean = np.mean(y)
slope = np.sum((X - x_mean) * (y - y_mean)) / np.sum((X - x_mean) ** 2)
intercept = y_mean - slope * x_mean

print(f"Linear Regression Results:")
print(f"Slope (weight): {slope:.4f}")
print(f"Intercept (bias): {intercept:.4f}")
print(f"Equation: y = {slope:.2f}x + {intercept:.2f}")

# Predictions
predictions = slope * X + intercept
mse = np.mean((y - predictions) ** 2)
r2 = 1 - np.sum((y - predictions)**2) / np.sum((y - y_mean)**2)
print(f"\\nMean Squared Error: {mse:.4f}")
print(f"R² Score: {r2:.4f}")

# Predict new values
new_x = 15
pred = slope * new_x + intercept
print(f"\\nPrediction for x={new_x}: {pred:.2f}")
`,
    },
    {
        id: "decision-tree",
        name: "Decision Tree",
        category: "ML Algorithms",
        code: `import numpy as np

# Simple Decision Tree from scratch
class DecisionStump:
    def __init__(self):
        self.feature = None
        self.threshold = None
        self.left_label = None
        self.right_label = None
    
    def fit(self, X, y):
        best_acc = 0
        for f in range(X.shape[1]):
            thresholds = np.unique(X[:, f])
            for t in thresholds:
                left_mask = X[:, f] <= t
                right_mask = ~left_mask
                if np.sum(left_mask) == 0 or np.sum(right_mask) == 0:
                    continue
                left_label = np.bincount(y[left_mask].astype(int)).argmax()
                right_label = np.bincount(y[right_mask].astype(int)).argmax()
                pred = np.where(left_mask, left_label, right_label)
                acc = np.mean(pred == y)
                if acc > best_acc:
                    best_acc = acc
                    self.feature = f
                    self.threshold = t
                    self.left_label = left_label
                    self.right_label = right_label
    
    def predict(self, X):
        return np.where(X[:, self.feature] <= self.threshold, 
                       self.left_label, self.right_label)

# Sample data: [weight, sweetness] -> fruit (0=apple, 1=orange)
X = np.array([[150, 7], [170, 8], [140, 6], [130, 7], 
              [180, 3], [160, 4], [190, 2], [175, 5]])
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])

tree = DecisionStump()
tree.fit(X, y)
preds = tree.predict(X)

features = ["Weight", "Sweetness"]
print(f"Decision Rule: if {features[tree.feature]} <= {tree.threshold}")
print(f"  then class = {'Apple' if tree.left_label == 0 else 'Orange'}")
print(f"  else class = {'Apple' if tree.right_label == 0 else 'Orange'}")
print(f"\\nTraining Accuracy: {np.mean(preds == y) * 100:.1f}%")

# Test prediction
test = np.array([[155, 8], [185, 3]])
test_pred = tree.predict(test)
for i, t in enumerate(test):
    print(f"[{t[0]}g, sweetness={t[1]}] -> {'Apple 🍎' if test_pred[i] == 0 else 'Orange 🍊'}")
`,
    },
    {
        id: "kmeans",
        name: "K-Means Clustering",
        category: "ML Algorithms",
        code: `import numpy as np

# K-Means Clustering from scratch
class KMeans:
    def __init__(self, k=3, max_iters=100):
        self.k = k
        self.max_iters = max_iters
    
    def fit(self, X):
        # Random initialization
        idx = np.random.choice(len(X), self.k, replace=False)
        self.centroids = X[idx]
        
        for iteration in range(self.max_iters):
            # Assign clusters
            distances = np.sqrt(((X[:, np.newaxis] - self.centroids[np.newaxis]) ** 2).sum(axis=2))
            self.labels = np.argmin(distances, axis=1)
            
            # Update centroids
            new_centroids = np.array([X[self.labels == i].mean(axis=0) for i in range(self.k)])
            
            # Check convergence
            if np.allclose(self.centroids, new_centroids):
                print(f"Converged in {iteration + 1} iterations!")
                break
            self.centroids = new_centroids
        return self

# Generate sample data (3 clusters)
np.random.seed(42)
cluster1 = np.random.randn(20, 2) + [2, 2]
cluster2 = np.random.randn(20, 2) + [-2, -2]
cluster3 = np.random.randn(20, 2) + [2, -2]
X = np.vstack([cluster1, cluster2, cluster3])

# Run K-Means
kmeans = KMeans(k=3)
kmeans.fit(X)

print(f"\\nCluster centers:")
for i, c in enumerate(kmeans.centroids):
    count = np.sum(kmeans.labels == i)
    print(f"  Cluster {i}: center=({c[0]:.2f}, {c[1]:.2f}), {count} points")

print(f"\\nTotal points: {len(X)}")
`,
    },
    {
        id: "neural-network",
        name: "Neural Network",
        category: "Deep Learning",
        code: `import numpy as np

# Simple Neural Network from scratch
class NeuralNetwork:
    def __init__(self, layers):
        self.weights = []
        self.biases = []
        for i in range(len(layers) - 1):
            w = np.random.randn(layers[i], layers[i+1]) * 0.5
            b = np.zeros((1, layers[i+1]))
            self.weights.append(w)
            self.biases.append(b)
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))
    
    def sigmoid_deriv(self, x):
        return x * (1 - x)
    
    def forward(self, X):
        self.activations = [X]
        current = X
        for i in range(len(self.weights)):
            z = current @ self.weights[i] + self.biases[i]
            current = self.sigmoid(z)
            self.activations.append(current)
        return current
    
    def train(self, X, y, epochs=1000, lr=0.5):
        for epoch in range(epochs):
            # Forward
            output = self.forward(X)
            
            # Backward
            error = y - output
            for i in range(len(self.weights) - 1, -1, -1):
                delta = error * self.sigmoid_deriv(self.activations[i+1])
                self.weights[i] += self.activations[i].T @ delta * lr
                self.biases[i] += np.sum(delta, axis=0, keepdims=True) * lr
                error = delta @ self.weights[i].T
            
            if (epoch + 1) % 200 == 0:
                loss = np.mean(np.square(y - output))
                print(f"Epoch {epoch+1}: Loss = {loss:.6f}")

# XOR Problem
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])

print("Training Neural Network on XOR problem...")
print(f"Architecture: 2 -> 4 -> 1\\n")

nn = NeuralNetwork([2, 4, 1])
nn.train(X, y, epochs=1000, lr=1.0)

print(f"\\nPredictions:")
preds = nn.forward(X)
for i in range(len(X)):
    print(f"  {X[i]} -> {preds[i][0]:.4f} (expected: {y[i][0]})")
`,
    },
    {
        id: "naive-bayes",
        name: "Spam Detector",
        category: "NLP",
        code: `# Simple Spam Detector using word frequency

# Training data
emails = [
    ("win free money now click here", "spam"),
    ("congratulations you won a prize", "spam"),
    ("free offer limited time buy now", "spam"),
    ("meeting tomorrow at 3pm office", "ham"),
    ("can you review the project report", "ham"),
    ("lunch today at the cafe", "ham"),
    ("claim your free gift card today", "spam"),
    ("please send the quarterly report", "ham"),
]

# Build word frequency per class
spam_words = {}
ham_words = {}
spam_count = 0
ham_count = 0

for text, label in emails:
    words = text.lower().split()
    if label == "spam":
        spam_count += 1
        for w in words:
            spam_words[w] = spam_words.get(w, 0) + 1
    else:
        ham_count += 1
        for w in words:
            ham_words[w] = ham_words.get(w, 0) + 1

total = spam_count + ham_count

def classify(text):
    words = text.lower().split()
    spam_score = spam_count / total
    ham_score = ham_count / total
    
    for w in words:
        spam_freq = (spam_words.get(w, 0) + 1) / (spam_count + 2)
        ham_freq = (ham_words.get(w, 0) + 1) / (ham_count + 2)
        spam_score *= spam_freq
        ham_score *= ham_freq
    
    return "🚫 SPAM" if spam_score > ham_score else "✅ HAM"

# Test
test_emails = [
    "win free money",
    "meeting tomorrow morning",
    "free gift claim now",
    "project deadline report",
]

print("Spam Detector Results:")
print("=" * 40)
for email in test_emails:
    result = classify(email)
    print(f'"{email}"')
    print(f"  -> {result}\\n")
`,
    },
];
