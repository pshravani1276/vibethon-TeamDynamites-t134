// src/app/learn/advanced/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface Module {
    id: number;
    title: string;
    description: string;
    duration: string;
    level: string;
    completed: boolean;
    points: number;
    category: string;
}

export default function AdvancedLearningPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [selectedModule, setSelectedModule] = useState<number | null>(null);
    const [showContent, setShowContent] = useState(false);
    const [message, setMessage] = useState("");
    const [modules, setModules] = useState<Module[]>([
        {
            id: 1,
            title: "Neural Networks Fundamentals",
            description: "Understand the architecture and mathematics behind neural networks",
            duration: "60 min",
            level: "Advanced",
            completed: false,
            points: 200,
            category: "Deep Learning"
        },
        {
            id: 2,
            title: "Convolutional Neural Networks (CNN)",
            description: "Master CNNs for image recognition and computer vision tasks",
            duration: "75 min",
            level: "Advanced",
            completed: false,
            points: 250,
            category: "Computer Vision"
        },
        {
            id: 3,
            title: "Recurrent Neural Networks (RNN) & LSTM",
            description: "Learn sequence models for time series and NLP",
            duration: "75 min",
            level: "Advanced",
            completed: false,
            points: 250,
            category: "Sequence Models"
        },
        {
            id: 4,
            title: "Transformers & Attention Mechanism",
            description: "Explore the architecture behind modern LLMs like GPT and BERT",
            duration: "90 min",
            level: "Advanced",
            completed: false,
            points: 300,
            category: "NLP"
        },
        {
            id: 5,
            title: "Model Optimization & Hyperparameter Tuning",
            description: "Advanced techniques to optimize model performance",
            duration: "60 min",
            level: "Advanced",
            completed: false,
            points: 200,
            category: "Optimization"
        },
        {
            id: 6,
            title: "MLOps & Model Deployment",
            description: "Learn to deploy, monitor, and maintain ML models in production",
            duration: "90 min",
            level: "Advanced",
            completed: false,
            points: 300,
            category: "MLOps"
        },
        {
            id: 7,
            title: "Generative AI & GANs",
            description: "Create new content using Generative Adversarial Networks",
            duration: "80 min",
            level: "Advanced",
            completed: false,
            points: 280,
            category: "Generative AI"
        },
        {
            id: 8,
            title: "Reinforcement Learning",
            description: "Train agents to make decisions through trial and error",
            duration: "70 min",
            level: "Advanced",
            completed: false,
            points: 250,
            category: "RL"
        }
    ]);

    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
        const fetchUserAndProgress = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);

            const { data: completedModules } = await supabase
                .from("user_progress")
                .select("module_id")
                .eq("user_id", currentUser.id)
                .eq("completed", true);

            if (completedModules) {
                const completedIds = new Set(completedModules.map((m: any) => m.module_id));
                setModules(prev => prev.map(module => ({
                    ...module,
                    completed: completedIds.has(module.id)
                })));
            }

            const { data: quizScores } = await supabase
                .from("quiz_scores")
                .select("score")
                .eq("user_id", currentUser.id);

            const total = quizScores?.reduce((sum: number, q: any) => sum + (q.score || 0), 0) || 0;
            setTotalPoints(total);
        };

        fetchUserAndProgress();
    }, [router]);

    const moduleContent = {
        1: {
            title: "Neural Networks Fundamentals",
            content: `
        Neural networks are the foundation of deep learning, inspired by the human brain.

        Neuron Structure:
        • Inputs (x₁, x₂, ..., xₙ)
        • Weights (w₁, w₂, ..., wₙ)
        • Bias (b)
        • Activation function (σ)
        • Output = σ(Σ(wᵢxᵢ) + b)

        Activation Functions:
        1. Sigmoid: σ(x) = 1/(1+e⁻ˣ)
        • Output between 0 and 1
        • Used for binary classification
        
        2. Tanh: tanh(x) = (eˣ - e⁻ˣ)/(eˣ + e⁻ˣ)
        • Output between -1 and 1
        • Zero-centered
        
        3. ReLU: f(x) = max(0, x)
        • Most popular for hidden layers
        • Solves vanishing gradient problem
        
        4. Leaky ReLU: f(x) = max(0.01x, x)
        • Allows small negative values
        • Prevents dead neurons

        Forward Propagation:
        \`\`\`python
        import numpy as np
        
        def forward_propagation(X, weights, biases):
            # Layer 1
            z1 = np.dot(weights[0], X) + biases[0]
            a1 = relu(z1)
            
            # Layer 2
            z2 = np.dot(weights[1], a1) + biases[1]
            a2 = sigmoid(z2)
            
            return a2
        \`\`\`

        Backpropagation:
        • Calculate error at output
        • Propagate error backward
        • Update weights using gradient descent
        
        Loss Functions:
        • MSE (Mean Squared Error) for regression
        • Cross-Entropy for classification
        • Binary Cross-Entropy for binary classification
      `,
        },
        2: {
            title: "Convolutional Neural Networks (CNN)",
            content: `
        CNNs are specialized neural networks for processing grid-like data (images).

        Key Components:

        1. Convolutional Layers
        • Apply filters/kernels to input
        • Detect features (edges, textures, shapes)
        \`\`\`python
        from tensorflow.keras.layers import Conv2D
        
        Conv2D(filters=32, kernel_size=3, activation='relu')
        \`\`\`

        2. Pooling Layers
        • Reduce spatial dimensions
        • MaxPooling: takes maximum value
        • AveragePooling: takes average
        \`\`\`python
        from tensorflow.keras.layers import MaxPooling2D
        
        MaxPooling2D(pool_size=2)
        \`\`\`

        3. Flatten & Dense Layers
        • Convert 2D features to 1D
        • Make final predictions

        Popular CNN Architectures:
        • LeNet-5 (1998): Handwritten digit recognition
        • AlexNet (2012): ImageNet breakthrough
        • VGG-16 (2014): Very deep networks
        • ResNet (2015): Skip connections
        • EfficientNet (2019): Scalable architecture

        Implementation:
        \`\`\`python
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
        
        model = Sequential([
            Conv2D(32, (3,3), activation='relu', input_shape=(64,64,3)),
            MaxPooling2D(2,2),
            Conv2D(64, (3,3), activation='relu'),
            MaxPooling2D(2,2),
            Flatten(),
            Dense(128, activation='relu'),
            Dense(10, activation='softmax')
        ])
        
        model.compile(optimizer='adam', 
                      loss='categorical_crossentropy',
                      metrics=['accuracy'])
        \`\`\`

        Data Augmentation:
        • Rotation
        • Zoom
        • Flip
        • Shift
        • Brightness adjustment
      `,
        },
        3: {
            title: "Recurrent Neural Networks (RNN) & LSTM",
            content: `
        RNNs are designed for sequential data like time series, text, and audio.

        RNN Architecture:
        • Hidden state maintains memory
        • Same weights shared across time steps
        • hₜ = f(Wₕₕhₜ₋₁ + Wₓₕxₜ)

        Problems with Vanilla RNN:
        • Vanishing gradients
        • Exploding gradients
        • Short-term memory only

        LSTM (Long Short-Term Memory):
        
        Cell State (Memory):
        • Carries information through time
        • Can add or remove information
        
        Three Gates:
        1. Forget Gate: What to discard
        2. Input Gate: What to store
        3. Output Gate: What to output

        \`\`\`python
        from tensorflow.keras.layers import LSTM, SimpleRNN
        
        # Simple RNN
        model.add(SimpleRNN(50, activation='tanh'))
        
        # LSTM
        model.add(LSTM(100, return_sequences=True))
        model.add(LSTM(50))
        model.add(Dense(1, activation='sigmoid'))
        \`\`\`

        GRU (Gated Recurrent Unit):
        • Simplified LSTM
        • Fewer parameters
        • Faster training

        Applications:
        • Stock price prediction
        • Weather forecasting
        • Speech recognition
        • Machine translation
        • Sentiment analysis
      `,
        },
        4: {
            title: "Transformers & Attention Mechanism",
            content: `
        Transformers revolutionized NLP by replacing RNNs with attention mechanisms.

        Attention Mechanism:
        • Focuses on relevant parts of input
        • Calculates attention scores
        • Weighted sum of values
        
        Attention Formula:
        Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V
        
        Where:
        • Q (Query): What we're looking for
        • K (Key): What each position has
        • V (Value): Actual information

        Transformer Architecture:

        1. Self-Attention
        • Each position attends to all positions
        • Captures long-range dependencies

        2. Multi-Head Attention
        • Multiple attention heads in parallel
        • Learns different relationships

        3. Positional Encoding
        • Adds position information
        • Sinusoidal functions

        4. Feed-Forward Networks
        • Applied to each position
        • Same across positions

        \`\`\`python
        from transformers import AutoModel, AutoTokenizer
        
        # Load pre-trained BERT
        model = AutoModel.from_pretrained('bert-base-uncased')
        tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        
        # Encode text
        inputs = tokenizer("Hello world!", return_tensors="pt")
        outputs = model(**inputs)
        \`\`\`

        Popular Transformers:
        • BERT: Bidirectional, great for understanding
        • GPT: Generative, great for text generation
        • T5: Text-to-text transfer transformer
        • Vision Transformer (ViT): For images
      `,
        },
        5: {
            title: "Model Optimization & Hyperparameter Tuning",
            content: `
        Advanced techniques to squeeze maximum performance from models.

        Hyperparameter Optimization:

        1. Grid Search
        • Exhaustive search over parameter grid
        • Guaranteed to find best (but slow)
        \`\`\`python
        from sklearn.model_selection import GridSearchCV
        
        param_grid = {
            'n_estimators': [100, 200, 300],
            'max_depth': [10, 20, None],
            'min_samples_split': [2, 5, 10]
        }
        
        grid_search = GridSearchCV(model, param_grid, cv=5)
        \`\`\`

        2. Random Search
        • Random sampling of parameters
        • More efficient than grid search

        3. Bayesian Optimization
        • Uses probability model
        • Learns from previous trials

        4. Hyperband
        • Early stopping for bad configurations
        • Resource allocation strategy

        Advanced Optimization Techniques:

        1. Learning Rate Scheduling
        • Step decay
        • Exponential decay
        • Cosine annealing
        
        2. Batch Normalization
        • Normalizes layer inputs
        • Faster convergence

        3. Dropout
        • Randomly drops neurons
        • Prevents overfitting

        4. Early Stopping
        • Stop when validation loss stops improving
        • Saves training time

        5. Gradient Clipping
        • Prevents exploding gradients
        • Caps gradient values

        \`\`\`python
        from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
        
        callbacks = [
            EarlyStopping(patience=5, restore_best_weights=True),
            ReduceLROnPlateau(factor=0.5, patience=3)
        ]
        \`\`\`
      `,
        },
        6: {
            title: "MLOps & Model Deployment",
            content: `
        MLOps (Machine Learning Operations) bridges ML development with production.

        ML Lifecycle:

        1. Data Management
        • Version control for datasets (DVC)
        • Data validation and quality checks
        • Data pipeline automation

        2. Model Training & Tracking
        • Experiment tracking (MLflow, Weights & Biases)
        • Hyperparameter logging
        • Model versioning

        3. Model Registry
        • Store trained models
        • Manage model versions
        • Staging to production workflow

        4. Model Deployment Options:

        a) Batch Inference
        • Scheduled predictions
        • Large volume processing
        • Using Apache Spark, Airflow

        b) Real-time API
        • REST API with FastAPI/Flask
        • Docker containers
        • Kubernetes for scaling

        \`\`\`python
        # FastAPI deployment example
        from fastapi import FastAPI
        from pydantic import BaseModel
        
        app = FastAPI()
        model = load_model('model.pkl')
        
        class Input(BaseModel):
            features: list
        
        @app.post("/predict")
        def predict(input: Input):
            prediction = model.predict([input.features])
            return {"prediction": prediction.tolist()}
        \`\`\`

        5. Monitoring & Maintenance
        • Model performance tracking
        • Data drift detection
        • Concept drift monitoring
        • Automated retraining pipelines

        6. CI/CD for ML
        • Automated testing
        • Model validation
        • Canary deployments
        • A/B testing

        Popular MLOps Tools:
        • MLflow: Experiment tracking
        • Kubeflow: Kubernetes-native ML
        • Seldon Core: Model deployment
        • Evidently: Model monitoring
      `,
        },
        7: {
            title: "Generative AI & GANs",
            content: `
        Generative AI creates new content - images, text, audio, and more.

        Generative Adversarial Networks (GANs):

        Two competing networks:
        
        1. Generator (G)
        • Creates fake data
        • Tries to fool discriminator
        • Learns data distribution

        2. Discriminator (D)
        • Distinguishes real from fake
        • Provides feedback to generator

        Training Process:
        1. Generate fake samples
        2. Discriminator evaluates both
        3. Update discriminator
        4. Update generator

        \`\`\`python
        import tensorflow as tf
        
        def make_generator():
            model = tf.keras.Sequential([
                layers.Dense(128, activation='relu'),
                layers.Dense(256, activation='relu'),
                layers.Dense(784, activation='sigmoid')
            ])
            return model
        
        def make_discriminator():
            model = tf.keras.Sequential([
                layers.Dense(256, activation='relu'),
                layers.Dense(128, activation='relu'),
                layers.Dense(1, activation='sigmoid')
            ])
            return model
        \`\`\`

        GAN Variants:
        • DCGAN: Deep Convolutional GAN
        • CycleGAN: Unpaired image translation
        • StyleGAN: High-quality image generation
        • Conditional GAN: Controlled generation

        Other Generative Models:

        1. VAE (Variational Autoencoder)
        • Encoder-decoder architecture
        • Learns latent space
        • Smooth interpolation

        2. Diffusion Models
        • Gradually add noise, then reverse
        • State-of-the-art image generation
        • Used in DALL-E, Stable Diffusion

        3. Autoregressive Models
        • Generate token by token
        • Used in GPT models

        Applications:
        • Image generation (DALL-E, Midjourney)
        • Text generation (GPT, Claude)
        • Music generation
        • Video synthesis
        • Data augmentation
      `,
        },
        8: {
            title: "Reinforcement Learning",
            content: `
        Reinforcement Learning (RL) trains agents through interaction with environments.

        Core Concepts:

        • Agent: The learner/decision maker
        • Environment: What the agent interacts with
        • State (s): Current situation
        • Action (a): What agent can do
        • Reward (r): Feedback signal
        • Policy (π): Strategy mapping states to actions

        Markov Decision Process (MDP):
        M = (S, A, P, R, γ)
        • S: State space
        • A: Action space
        • P: Transition probability
        • R: Reward function
        • γ: Discount factor

        Key Algorithms:

        1. Q-Learning
        • Value-based method
        • Learns Q-values: Q(s,a)
        • Q(s,a) = R(s,a) + γ * max Q(s',a')
        
        \`\`\`python
        import numpy as np
        
        def q_learning(env, episodes=1000):
            Q = np.zeros((state_space, action_space))
            
            for episode in range(episodes):
                state = env.reset()
                done = False
                
                while not done:
                    action = epsilon_greedy(Q, state)
                    next_state, reward, done = env.step(action)
                    Q[state,action] += alpha * (
                        reward + gamma * np.max(Q[next_state]) - Q[state,action]
                    )
                    state = next_state
        \`\`\`

        2. Deep Q-Networks (DQN)
        • Neural networks for Q-learning
        • Experience replay
        • Target networks

        3. Policy Gradient Methods
        • Learn policy directly
        • REINFORCE algorithm
        • Actor-Critic methods

        4. Proximal Policy Optimization (PPO)
        • Stable and efficient
        • Used by OpenAI

        Applications:
        • Game playing (AlphaGo, Dota 2)
        • Robotics
        • Autonomous vehicles
        • Resource management
        • Recommendation systems

        \`\`\`python
        import gym
        
        # Create environment
        env = gym.make('CartPole-v1')
        
        for episode in range(100):
            state = env.reset()
            done = False
            total_reward = 0
            
            while not done:
                action = env.action_space.sample()  # random policy
                next_state, reward, done, info = env.step(action)
                total_reward += reward
                state = next_state
                
            print(f"Episode {episode}: {total_reward}")
        \`\`\`
      `,
        },
    };

    const handleModuleClick = (moduleId: number) => {
        setSelectedModule(moduleId);
        setShowContent(true);
    };

    const handleBack = () => {
        setSelectedModule(null);
        setShowContent(false);
        setMessage("");
    };

    const handleComplete = async () => {
        if (!selectedModule || !user) return;

        const module = modules[selectedModule - 1];

        if (module.completed) {
            setMessage("You've already completed this module!");
            setTimeout(() => setMessage(""), 3000);
            return;
        }

        try {
            const { error: progressError } = await supabase
                .from("user_progress")
                .insert({
                    user_id: user.id,
                    module_id: selectedModule,
                    module_name: module.title,
                    completed: true,
                    points_earned: module.points,
                    completed_at: new Date().toISOString()
                });

            if (progressError) throw progressError;

            const { error: scoreError } = await supabase
                .from("quiz_scores")
                .insert({
                    user_id: user.id,
                    quiz_id: `advanced_module_${selectedModule}`,
                    score: module.points,
                    total_questions: 1,
                    percentage: 100,
                    completed_at: new Date().toISOString()
                });

            if (scoreError) throw scoreError;

            setModules(prev => prev.map(m =>
                m.id === selectedModule ? { ...m, completed: true } : m
            ));
            setTotalPoints(prev => prev + module.points);
            setMessage(`✅ Module completed! You earned ${module.points} points!`);

            setTimeout(() => {
                setShowContent(false);
                setSelectedModule(null);
                setMessage("");
            }, 2000);

        } catch (error) {
            console.error("Error saving progress:", error);
            setMessage("❌ Error saving progress. Please try again.");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    if (showContent && selectedModule) {
        const content = moduleContent[selectedModule as keyof typeof moduleContent];
        const module = modules[selectedModule - 1];

        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <div className="relative z-20"><Navbar /></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            onClick={handleBack}
                            className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2"
                        >
                            ← Back to Modules
                        </button>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-3xl font-bold">{content.title}</h1>
                                <span className="text-sm px-3 py-1 bg-red-500/20 text-red-400 rounded-full">
                                    {module.category}
                                </span>
                            </div>
                            <div className="flex gap-4 mb-6 text-sm">
                                <span className="text-purple-400">⭐ {module.points} points</span>
                                <span className="text-gray-400">⏱️ {module.duration}</span>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
                                    {content.content}
                                </pre>
                            </div>

                            {message && (
                                <div className={`mt-4 p-3 rounded-lg ${message.includes("✅") ? "bg-green-500/20 text-green-400" :
                                    message.includes("❌") ? "bg-red-500/20 text-red-400" :
                                        "bg-blue-500/20 text-blue-400"
                                    }`}>
                                    {message}
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <button
                                    onClick={handleComplete}
                                    disabled={module.completed}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all ${module.completed
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                                        }`}
                                >
                                    {module.completed ? "✓ Completed" : "✓ Mark as Complete & Earn Points"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const completedCount = modules.filter(m => m.completed).length;
    const totalPointsEarned = modules
        .filter(m => m.completed)
        .reduce((sum, m) => sum + m.points, 0);

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-1 bg-red-500/20 rounded-full text-red-400 text-sm mb-4">
                            Advanced Level • Master Level
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Advanced Learning Path
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Master cutting-edge AI/ML techniques and become an expert practitioner
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-2xl mb-2">📚</div>
                            <div className="text-2xl font-bold text-purple-400">{completedCount}/{modules.length}</div>
                            <div className="text-gray-400">Modules Completed</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-2xl mb-2">⭐</div>
                            <div className="text-2xl font-bold text-purple-400">{totalPointsEarned}</div>
                            <div className="text-gray-400">Points Earned</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-2xl mb-2">🏆</div>
                            <div className="text-2xl font-bold text-purple-400">
                                {Math.round((completedCount / modules.length) * 100)}%
                            </div>
                            <div className="text-gray-400">Progress</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-2xl mb-2">🎓</div>
                            <div className="text-2xl font-bold text-purple-400">
                                {modules.filter(m => m.completed).length * 150}
                            </div>
                            <div className="text-gray-400">Mastery XP</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">Advanced Path Progress</span>
                            <span className="text-purple-400">{completedCount}/{modules.length} Modules</span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-red-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${(completedCount / modules.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center">
                            {message}
                        </div>
                    )}

                    {/* Modules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module, idx) => (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border transition-all cursor-pointer ${module.completed
                                    ? "border-green-500/50 hover:border-green-500/70"
                                    : "border-white/10 hover:border-purple-500/30"
                                    }`}
                                onClick={() => !module.completed && handleModuleClick(module.id)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="text-3xl">
                                        {module.completed ? "✅" : "🎓"}
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                                        ⭐ {module.points} pts
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                                <p className="text-gray-400 text-sm mb-3">{module.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
                                        {module.category}
                                    </span>
                                    <span className="text-xs text-gray-500">⏱️ {module.duration}</span>
                                </div>
                                {!module.completed && (
                                    <button className="mt-4 w-full py-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-lg text-sm transition-all">
                                        Start Advanced Module →
                                    </button>
                                )}
                                {module.completed && (
                                    <div className="mt-4 text-center text-sm text-green-400">
                                        ✓ Mastered • {module.points} XP Earned
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Mastery Note */}
                    <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                        <div className="flex gap-3">
                            <span className="text-xl">🏆</span>
                            <div>
                                <h4 className="font-semibold text-purple-400">Mastery Path Complete</h4>
                                <p className="text-sm text-gray-300">
                                    Upon completing all Advanced modules, you'll earn the "AI/ML Master" certificate
                                    and be ready for industry-level AI/ML roles.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Completion Certificate */}
                    {completedCount === modules.length && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-8 border border-yellow-500/30 text-center"
                        >
                            <div className="text-5xl mb-3">🏆🎓🏆</div>
                            <h3 className="text-2xl font-bold mb-2">AI/ML Master Certification</h3>
                            <p className="text-gray-300 mb-2">Congratulations, AI/ML Master!</p>
                            <p className="text-gray-300 mb-2">You've completed all Advanced modules!</p>
                            <p className="text-purple-400 text-xl mb-4">Total Points: {totalPointsEarned}</p>
                            <p className="text-sm text-gray-400 mb-6">You are now ready for professional AI/ML engineering roles!</p>
                            <div className="flex gap-4 justify-center">
                                <button className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-semibold text-lg">
                                    Download Master Certificate
                                </button>
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg"
                                >
                                    Go to Dashboard →
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}