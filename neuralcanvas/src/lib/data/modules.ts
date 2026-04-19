// src/lib/data/modules.ts

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
}

export interface Module {
    id: number;
    title: string;
    description: string;
    duration: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    points: number;
    category: string;
    content: string;
    codeExample?: string;
    quiz?: QuizQuestion[];
}

export const modules: Module[] = [
    // Beginner Modules (1-5)
    {
        id: 1,
        title: "What is Artificial Intelligence?",
        description: "Understand the basics of AI and its applications in the real world",
        duration: "15 min",
        level: "Beginner",
        points: 50,
        category: "Foundations",
        content: `
Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn like humans.

Key Concepts:
• Machine Learning: Systems that learn from data
• Deep Learning: Neural networks with multiple layers
• Natural Language Processing: Understanding human language
• Computer Vision: Interpreting visual information

Real-world applications include:
• Virtual assistants (Siri, Alexa)
• Recommendation systems (Netflix, Amazon)
• Self-driving cars
• Medical diagnosis
        `,
        codeExample: `# Simple logic that feels like AI
def simple_assistant(query):
    query = query.lower()
    if "weather" in query:
        return "It looks sunny today!"
    elif "time" in query:
        return "It's time to learn AI!"
    else:
        return "I'm still learning. Try asking about weather or time."

print(simple_assistant("What is the weather?"))`,
        quiz: [
            {
                id: 1,
                question: "What is the primary goal of Artificial Intelligence?",
                options: [
                    "To make machines physically stronger than humans",
                    "To simulate human intelligence in machines",
                    "To replace all human jobs with robots",
                    "To create faster internet speeds"
                ],
                correctIndex: 1
            },
            {
                id: 2,
                question: "Which field of AI focuses on understanding human language?",
                options: [
                    "Computer Vision",
                    "Robotics",
                    "Natural Language Processing",
                    "Reinforcement Learning"
                ],
                correctIndex: 2
            }
        ]
    },
    {
        id: 2,
        title: "Introduction to Machine Learning",
        description: "Learn what Machine Learning is and how it differs from traditional programming",
        duration: "20 min",
        level: "Beginner",
        points: 50,
        category: "Foundations",
        content: `
Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.

Traditional Programming vs Machine Learning:
• Traditional: Input Data + Rules = Output
• ML: Input Data + Output = Rules

The ML Process:
1. Collect data
2. Prepare data
3. Choose a model
4. Train the model
5. Evaluate the model
6. Make predictions
        `,
        quiz: [
            {
                id: 1,
                question: "In Machine Learning, what is used to create the 'Rules'?",
                options: [
                    "Input Data + Rules",
                    "Input Data + Output",
                    "Output + Logic",
                    "Manual coding by programmers"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 3,
        title: "Types of Machine Learning",
        description: "Explore Supervised, Unsupervised, and Reinforcement Learning",
        duration: "25 min",
        level: "Beginner",
        points: 75,
        category: "Concepts",
        content: `
Three Main Types of Machine Learning:

1. Supervised Learning
• Learns from labeled data
• Examples: Classification, Regression
• Use cases: Spam detection, price prediction

2. Unsupervised Learning
• Finds patterns in unlabeled data
• Examples: Clustering, Association
• Use cases: Customer segmentation, anomaly detection

3. Reinforcement Learning
• Learns through trial and error
• Agent learns from rewards/punishments
• Use cases: Game playing, robotics
        `,
        quiz: [
            {
                id: 1,
                question: "Which type of learning uses labeled data?",
                options: [
                    "Unsupervised Learning",
                    "Reinforcement Learning",
                    "Supervised Learning",
                    "Evolutionary Learning"
                ],
                correctIndex: 2
            },
            {
                id: 2,
                question: "Clustering is an example of which type of ML?",
                options: [
                    "Supervised Learning",
                    "Unsupervised Learning",
                    "Reinforcement Learning",
                    "Deep Learning"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 4,
        title: "Python Basics for ML",
        description: "Essential Python concepts needed for Machine Learning",
        duration: "30 min",
        level: "Beginner",
        points: 100,
        category: "Skills",
        content: `
Essential Python Libraries for ML:

1. NumPy: Numerical computing
• Arrays and matrices
• Mathematical functions

2. Pandas: Data manipulation
• DataFrames for tabular data
• Data cleaning and analysis

3. Matplotlib & Seaborn: Data visualization
• Plots and charts
• Visualizing data patterns

4. Scikit-learn: Machine Learning
• Pre-built algorithms
• Model evaluation tools
        `,
        codeExample: `import numpy as np
import pandas as pd

# Creating a simple dataset
data = {
    'Hours_Studied': [1, 2, 3, 4, 5],
    'Test_Score': [50, 60, 70, 80, 90]
}
df = pd.DataFrame(data)
print("Dataset Head:")
print(df.head())

# Basic stats
print("\\nStatistics:")
print(df.describe())`,
        quiz: [
            {
                id: 1,
                question: "Which library is most commonly used for handling tabular data (DataFrames)?",
                options: [
                    "NumPy",
                    "Matplotlib",
                    "Pandas",
                    "Scikit-learn"
                ],
                correctIndex: 2
            }
        ]
    },
    {
        id: 5,
        title: "Your First ML Model",
        description: "Build a simple linear regression model from scratch using Scikit-Learn",
        duration: "35 min",
        level: "Beginner",
        points: 100,
        category: "Applied",
        content: `
Building a Linear Regression Model:

Step 1: Import libraries
Step 2: Create or Load data
Step 3: Split into training and test sets
Step 4: Train model
Step 5: Make predictions
Step 6: Evaluate performance

Linear Regression tries to find the best-fit line through your data points.
        `,
        codeExample: `from sklearn.linear_model import LinearRegression
import numpy as np

# Prepare data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Initialize and train
model = LinearRegression()
model.fit(X, y)

# Predict for a new value
new_val = np.array([[6]])
prediction = model.predict(new_val)
print(f"Prediction for input 6: {prediction[0]}")`,
        quiz: [
            {
                id: 1,
                question: "What is the correct order of the ML workflow?",
                options: [
                    "Predict -> Train -> Collect Data",
                    "Collect Data -> Train -> Predict",
                    "Train -> Predict -> Collect Data",
                    "Predict -> Collect Data -> Train"
                ],
                correctIndex: 1
            }
        ]
    },

    // Intermediate Modules (6-11)
    {
        id: 6,
        title: "Data Preprocessing & Cleaning",
        description: "Learn how to prepare raw data for machine learning models",
        duration: "35 min",
        level: "Intermediate",
        points: 100,
        category: "Data Preparation",
        content: `
Data preprocessing is crucial for building effective machine learning models. Real-world data is often messy and requires cleaning.

Key Steps in Data Preprocessing:

1. Handling Missing Values
• Remove rows with missing values
• Fill with mean/median/mode
• Forward fill or backward fill
\`\`\`python
# Fill missing values with mean
df.fillna(df.mean(), inplace=True)
\`\`\`

2. Handling Outliers
• Use Z-score method
• Use IQR (Interquartile Range)
• Cap or remove extreme values

3. Data Transformation
• Scaling (Min-Max, Standardization)
• Normalization
• Log transformation for skewed data

4. Encoding Categorical Variables
• Label Encoding
• One-Hot Encoding
        `,
        quiz: [
            {
                id: 1,
                question: "What does 'Label Encoding' do?",
                options: [
                    "Removes missing values",
                    "Converts text labels into numerical values",
                    "Scales data between 0 and 1",
                    "Detects outliers in the dataset"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 7,
        title: "Feature Engineering",
        description: "Transform raw data into meaningful features for better model performance",
        duration: "40 min",
        level: "Intermediate",
        points: 120,
        category: "Feature Engineering",
        content: `
Feature engineering is the art of creating new features from existing data to improve model performance.

Techniques for Feature Engineering:

1. Creating Interaction Features
• Multiply or add features together
• Capture relationships between variables

2. Polynomial Features
• Add squared, cubed terms
• Capture non-linear relationships

3. Domain-Specific Features
• Extract date components (day, month, year)
• Create ratios or percentages

4. Binning/Discretization
• Convert continuous variables to categorical
• Group values into buckets
        `,
        quiz: [
            {
                id: 1,
                question: "Which technique captures non-linear relationships by adding squared or cubed terms?",
                options: [
                    "One-Hot Encoding",
                    "Polynomial Features",
                    "Data Cleaning",
                    "Min-Max Scaling"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 8,
        title: "Linear Regression Deep Dive",
        description: "Master the fundamentals of linear regression and its variants",
        duration: "45 min",
        level: "Intermediate",
        points: 150,
        category: "Regression",
        content: `
Linear regression is the foundation of many machine learning algorithms.

Mathematical Foundation:
y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε

Assumptions of Linear Regression:
1. Linearity: Relationship between X and Y is linear
2. Independence: Observations are independent
3. Homoscedasticity: Constant variance of errors
4. Normality: Errors are normally distributed

Regularization Techniques:
• Ridge Regression (L2): Adds penalty on squared coefficients
• Lasso Regression (L1): Adds penalty on absolute coefficients
• Elastic Net: Combines both L1 and L2 penalties
        `,
        quiz: [
            {
                id: 1,
                question: "What is 'Homoscedasticity' in the context of Linear Regression?",
                options: [
                    "Errors follow a normal distribution",
                    "Constant variance of errors across all levels of independent variables",
                    "A linear relationship between X and Y",
                    "Independent observations"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 9,
        title: "Logistic Regression & Classification",
        description: "Learn binary and multi-class classification algorithms",
        duration: "45 min",
        level: "Intermediate",
        points: 150,
        category: "Classification",
        content: `
Logistic regression is used for binary and multi-class classification problems.

How it Works:
1. Linear combination of inputs
2. Apply sigmoid function to map output to probability
3. Threshold at 0.5 for classification

Evaluation Metrics for Classification:
• Accuracy: (TP + TN) / Total
• Precision: TP / (TP + FP)
• Recall: TP / (TP + FN)
• F1-Score: Harmonic mean of Precision and Recall
• ROC-AUC: Area under ROC curve
        `,
        quiz: [
            {
                id: 1,
                question: "Which metric is the harmonic mean of Precision and Recall?",
                options: [
                    "Accuracy",
                    "F1-Score",
                    "ROC-AUC",
                    "Mean Squared Error"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 10,
        title: "Decision Trees & Random Forests",
        description: "Build powerful tree-based models for classification and regression",
        duration: "50 min",
        level: "Intermediate",
        points: 150,
        category: "Ensemble Methods",
        content: `
Decision trees are intuitive models that make decisions based on asking a series of questions.

Splitting Criteria:
• Gini Impurity: 1 - Σ(pᵢ)²
• Entropy: -Σ pᵢ log(pᵢ)

Advantages of Random Forests:
• Reduces overfitting (Ensemble technique)
• Handles non-linear relationships
• Provides feature importance
• Works well with high-dimensional data
        `,
        quiz: [
            {
                id: 1,
                question: "How does a Random Forest reduce overfitting?",
                options: [
                    "By using a single very deep tree",
                    "By combining predictions from multiple decision trees",
                    "By ignoring half of the data",
                    "By only using linear splits"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 11,
        title: "Model Evaluation & Validation",
        description: "Learn to assess model performance and avoid overfitting",
        duration: "40 min",
        level: "Intermediate",
        points: 120,
        category: "Model Evaluation",
        content: `
Proper model evaluation ensures your model generalizes well to new data.

Cross-Validation Techniques:
1. K-Fold Cross Validation: Split data into K folds, train on K-1, test on 1.
2. Stratified K-Fold: Maintains class distribution in each fold.
3. Leave-One-Out (LOO): Train on all but one sample.

Bias-Variance Tradeoff:
• High Bias: Underfitting (too simple)
• High Variance: Overfitting (too complex)
• Goal: Find the sweet spot
        `,
        quiz: [
            {
                id: 1,
                question: "Wait is 'High Variance' in a model commonly associated with?",
                options: [
                    "Underfitting",
                    "Overfitting",
                    "Optimal performance",
                    "Data cleaning"
                ],
                correctIndex: 1
            }
        ]
    },

    // Advanced Modules (12-19)
    {
        id: 12,
        title: "Neural Networks Fundamentals",
        description: "Understand the architecture and training process of neural networks",
        duration: "60 min",
        level: "Advanced",
        points: 200,
        category: "Deep Learning",
        content: `
Neural networks are inspired by the human brain and form the core of Deep Learning.

Architecture:
• Input Layer: Receives input data
• Hidden Layers: Perform complex transformations
• Output Layer: Produces final prediction

Key Components:
1. Activation Functions: Sigmoid, ReLU, Tanh
2. Forward Propagation: Data passed through network
3. Backpropagation: Error sent back to update weights
4. Gradient Descent: Optimization algorithm to minimize loss
        `,
        quiz: [
            {
                id: 1,
                question: "What is the primary function of 'Backpropagation'?",
                options: [
                    "To generate the initial weights",
                    "To pass data from input to output",
                    "To calculate the gradient of the loss function and update weights",
                    "To visualize the neural network"
                ],
                correctIndex: 2
            }
        ]
    },
    {
        id: 13,
        title: "Convolutional Neural Networks (CNN)",
        description: "Master CNNs for image recognition and computer vision tasks",
        duration: "75 min",
        level: "Advanced",
        points: 250,
        category: "Computer Vision",
        content: `
CNNs are specialized neural networks for processing structured grid data like images.

Layer Types:
1. Convolutional Layer: Extracts local features using filters/kernels
2. Pooling Layer: Reduces spatial dimensions (Max Pooling, Average Pooling)
3. Fully Connected (Dense) Layer: Final classification layer

Concepts:
• Strides: Distance filter moves
• Padding: Adding zeros to image borders
• Receptive Field: Area filter covers
        `,
        quiz: [
            {
                id: 1,
                question: "Which layer type in a CNN is primarily responsible for feature extraction?",
                options: [
                    "Pooling Layer",
                    "Convolutional Layer",
                    "Fully Connected Layer",
                    "Dropout Layer"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 14,
        title: "Recurrent Neural Networks (RNN) & LSTM",
        description: "Learn sequence models for time series and natural language processing",
        duration: "75 min",
        level: "Advanced",
        points: 250,
        category: "Sequence Modeling",
        content: `
RNNs are designed for sequential data where order matters.

Challenges:
• Vanishing Gradient Problem: Gradients become too small
• Exploding Gradient Problem: Gradients become too large

Solutions:
1. LSTM (Long Short-Term Memory): Uses gates to regulate information flow.
2. GRU (Gated Recurrent Unit): Simplified version of LSTM.

Applications:
• Machine Translation
• Sentiment Analysis
• Stock Price Prediction
        `,
        quiz: [
            {
                id: 1,
                question: "Why are LSTMs preferred over standard RNNs for long sequences?",
                options: [
                    "They are faster to train",
                    "They solve the vanishing gradient problem using gates",
                    "They use less memory",
                    "They only work on text"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 15,
        title: "Transformers & Attention Mechanism",
        description: "Explore the modern architecture behind LLMs like GPT",
        duration: "90 min",
        level: "Advanced",
        points: 300,
        category: "NLP",
        content: `
Transformers revolutionized NLP by allowing parallel processing of sequences.

Key Feature:
• Self-Attention: Weighs the importance of different words in a sentence.

Architecture:
• Encoder: Processes input sequence
• Decoder: Generates output sequence
• Multi-Head Attention: Attends to information from different representation subspaces.

The basis for BERT, GPT, and modern Generative AI.
        `,
        quiz: [
            {
                id: 1,
                question: "What mechanism allows Transformers to process entire sequences in parallel?",
                options: [
                    "Recurrence",
                    "Convolution",
                    "Self-Attention",
                    "Backpropagation"
                ],
                correctIndex: 2
            }
        ]
    },
    {
        id: 16,
        title: "Model Optimization & Hyperparameter Tuning",
        description: "Learn advanced techniques to squeeze every bit of performance from your models",
        duration: "60 min",
        level: "Advanced",
        points: 200,
        category: "Optimization",
        content: `
Optimization is about finding the best set of parameters for your model.

Hyperparameter Search:
1. Grid Search: Exhaustive search over specified parameter values.
2. Random Search: Randomly samples parameters from distributions.
3. Bayesian Optimization: Builds a probability model of the objective function.

Optimization Algorithms:
• SGD (Stochastic Gradient Descent)
• Adam (Adaptive Moment Estimation)
• RMSprop
        `,
        quiz: [
            {
                id: 1,
                question: "Which search method for hyperparameters builds a probability model to find the best values?",
                options: [
                    "Grid Search",
                    "Random Search",
                    "Bayesian Optimization",
                    "Linear Search"
                ],
                correctIndex: 2
            }
        ]
    },
    {
        id: 17,
        title: "MLOps & Model Deployment",
        description: "Bring your models from notebook to production at scale",
        duration: "90 min",
        level: "Advanced",
        points: 300,
        category: "Engineering",
        content: `
MLOps (Machine Learning Operations) focuses on the lifecycle of ML models.

Phases:
1. Model Versioning: Tracking different versions of models and data.
2. Serving: Deploying models as APIs (Flask, FastAPI, TensorFlow Serving).
3. Monitoring: Tracking drift, accuracy, and latency in production.
4. CI/CD for ML: Automating the training and deployment pipeline.

Tools: MLflow, Kubeflow, DVC, AWS SageMaker.
        `,
        quiz: [
            {
                id: 1,
                question: "What is 'Model Drift' in a production MLOps environment?",
                options: [
                    "The model moving between different servers",
                    "Degradation of model performance over time due to changing data",
                    "The model learning new features automatically",
                    "A type of model deployment"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 18,
        title: "Generative AI & GANs",
        description: "Harness the power of AI to create images, text, and music",
        duration: "80 min",
        level: "Advanced",
        points: 280,
        category: "Generative AI",
        content: `
Generative Adversarial Networks (GANs) consist of two networks competing against each other.

1. Generator: Learns to create fake data that looks real.
2. Discriminator: Learns to distinguish between real and fake data.

Key Architectures:
• Variational Autoencoders (VAEs)
• Diffusion Models (Stable Diffusion, DALL-E)
• Large Language Models (LLMs)
        `,
        quiz: [
            {
                id: 1,
                question: "In a GAN, what is the role of the 'Discriminator'?",
                options: [
                    "To generate new images",
                    "To distinguish between real data and data produced by the generator",
                    "To optimize the loss function",
                    "To store the training data"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        id: 19,
        title: "Reinforcement Learning",
        description: "Train agents to make decisions in complex environments",
        duration: "70 min",
        level: "Advanced",
        points: 250,
        category: "Reinforcement Learning",
        content: `
RL is about training an agent to maximize rewards in an environment.

Core Elements:
• Agent: The learner/decision-maker
• Environment: Everything the agent interacts with
• State: Current situation
• Action: What the agent does
• Reward: Feedback for the action
• Policy: Strategy the agent follows

Algorithms: Q-Learning, Deep Q-Networks (DQN), PPO.
        `,
        quiz: [
            {
                id: 1,
                question: "What is the 'Policy' in Reinforcement Learning?",
                options: [
                    "The rule for calculating rewards",
                    "The state of the environment",
                    "The strategy the agent uses to decide actions based on the state",
                    "The legal terms of using AI"
                ],
                correctIndex: 2
            }
        ]
    }
];
