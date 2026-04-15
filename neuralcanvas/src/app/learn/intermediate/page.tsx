// src/app/learn/intermediate/page.tsx
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

export default function IntermediateLearningPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [selectedModule, setSelectedModule] = useState<number | null>(null);
    const [showContent, setShowContent] = useState(false);
    const [message, setMessage] = useState("");
    const [modules, setModules] = useState<Module[]>([
        {
            id: 1,
            title: "Data Preprocessing & Cleaning",
            description: "Learn how to prepare raw data for machine learning models",
            duration: "35 min",
            level: "Intermediate",
            completed: false,
            points: 100,
            category: "Data Preparation"
        },
        {
            id: 2,
            title: "Feature Engineering",
            description: "Transform raw data into meaningful features for better model performance",
            duration: "40 min",
            level: "Intermediate",
            completed: false,
            points: 120,
            category: "Feature Engineering"
        },
        {
            id: 3,
            title: "Linear Regression Deep Dive",
            description: "Master the fundamentals of linear regression and its variants",
            duration: "45 min",
            level: "Intermediate",
            completed: false,
            points: 150,
            category: "Regression"
        },
        {
            id: 4,
            title: "Logistic Regression & Classification",
            description: "Learn binary and multi-class classification algorithms",
            duration: "45 min",
            level: "Intermediate",
            completed: false,
            points: 150,
            category: "Classification"
        },
        {
            id: 5,
            title: "Decision Trees & Random Forests",
            description: "Build powerful tree-based models for classification and regression",
            duration: "50 min",
            level: "Intermediate",
            completed: false,
            points: 150,
            category: "Ensemble Methods"
        },
        {
            id: 6,
            title: "Model Evaluation & Validation",
            description: "Learn to assess model performance and avoid overfitting",
            duration: "40 min",
            level: "Intermediate",
            completed: false,
            points: 120,
            category: "Model Evaluation"
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

            // Fetch user's completed modules
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

            // Fetch total points
            const { data: quizScores } = await supabase
                .from("quiz_scores")
                .select("score")
                .eq("user_id", currentUser.id);

            if (quizScores) {
                const total = quizScores?.reduce((sum: number, q: any) => sum + (q.score || 0), 0) || 0;
                setTotalPoints(total);
            }
        };

        fetchUserAndProgress();
    }, [router]);

    const moduleContent = {
        1: {
            title: "Data Preprocessing & Cleaning",
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
        \`\`\`python
        # Remove outliers using Z-score
        from scipy import stats
        df = df[(np.abs(stats.zscore(df)) < 3).all(axis=1)]
        \`\`\`

        3. Data Transformation
        • Scaling (Min-Max, Standardization)
        • Normalization
        • Log transformation for skewed data
        \`\`\`python
        from sklearn.preprocessing import StandardScaler
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(data)
        \`\`\`

        4. Encoding Categorical Variables
        • Label Encoding
        • One-Hot Encoding
        \`\`\`python
        from sklearn.preprocessing import OneHotEncoder
        encoder = OneHotEncoder()
        encoded = encoder.fit_transform(categorical_data)
        \`\`\`
      `,
        },
        2: {
            title: "Feature Engineering",
            content: `
        Feature engineering is the art of creating new features from existing data to improve model performance.

        Techniques for Feature Engineering:

        1. Creating Interaction Features
        • Multiply or add features together
        • Capture relationships between variables
        \`\`\`python
        df['interaction'] = df['feature1'] * df['feature2']
        \`\`\`

        2. Polynomial Features
        • Add squared, cubed terms
        • Capture non-linear relationships
        \`\`\`python
        from sklearn.preprocessing import PolynomialFeatures
        poly = PolynomialFeatures(degree=2)
        poly_features = poly.fit_transform(X)
        \`\`\`

        3. Domain-Specific Features
        • Extract date components (day, month, year)
        • Create ratios or percentages
        • Aggregate by groups
        \`\`\`python
        df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        df['day_of_week'] = pd.to_datetime(df['timestamp']).dt.dayofweek
        \`\`\`

        4. Binning/Discretization
        • Convert continuous variables to categorical
        • Group values into buckets
        \`\`\`python
        df['age_group'] = pd.cut(df['age'], bins=[0,18,35,60,100], 
                                 labels=['Child','Young','Adult','Senior'])
        \`\`\`
      `,
        },
        3: {
            title: "Linear Regression Deep Dive",
            content: `
        Linear regression is the foundation of many machine learning algorithms.

        Mathematical Foundation:
        y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε

        Where:
        • y is the target variable
        • β₀ is the intercept
        • β₁...βₙ are coefficients
        • x₁...xₙ are features
        • ε is the error term

        Assumptions of Linear Regression:
        1. Linearity: Relationship between X and Y is linear
        2. Independence: Observations are independent
        3. Homoscedasticity: Constant variance of errors
        4. Normality: Errors are normally distributed

        Implementation:
        \`\`\`python
        from sklearn.linear_model import LinearRegression
        from sklearn.model_selection import train_test_split
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        
        # Train model
        model = LinearRegression()
        model.fit(X_train, y_train)
        
        # Make predictions
        predictions = model.predict(X_test)
        
        # Evaluate
        from sklearn.metrics import r2_score, mean_squared_error
        print(f"R² Score: {r2_score(y_test, predictions)}")
        print(f"RMSE: {np.sqrt(mean_squared_error(y_test, predictions))}")
        \`\`\`

        Regularization Techniques:
        • Ridge Regression (L2): Adds penalty on squared coefficients
        • Lasso Regression (L1): Adds penalty on absolute coefficients
        • Elastic Net: Combines both L1 and L2 penalties
      `,
        },
        4: {
            title: "Logistic Regression & Classification",
            content: `
        Logistic regression is used for binary and multi-class classification problems.

        How it Works:
        1. Linear combination of inputs
        2. Apply sigmoid function to map output to probability
        3. Threshold at 0.5 for classification

        Sigmoid Function:
        P(y=1) = 1 / (1 + e^-(β₀ + β₁x₁ + ... + βₙxₙ))

        Implementation:
        \`\`\`python
        from sklearn.linear_model import LogisticRegression
        from sklearn.metrics import classification_report, confusion_matrix
        
        # Create and train model
        model = LogisticRegression()
        model.fit(X_train, y_train)
        
        # Predict probabilities
        probabilities = model.predict_proba(X_test)
        
        # Make predictions
        predictions = model.predict(X_test)
        
        # Evaluate
        print(classification_report(y_test, predictions))
        print(confusion_matrix(y_test, predictions))
        \`\`\`

        Evaluation Metrics for Classification:
        • Accuracy: (TP + TN) / (TP + TN + FP + FN)
        • Precision: TP / (TP + FP)
        • Recall: TP / (TP + FN)
        • F1-Score: 2 * (Precision * Recall) / (Precision + Recall)
        • ROC-AUC: Area under ROC curve

        Multi-class Classification:
        • One-vs-Rest (OvR)
        • One-vs-One (OvO)
        • Softmax Regression (Multinomial)
      `,
        },
        5: {
            title: "Decision Trees & Random Forests",
            content: `
        Decision trees are intuitive models that make decisions based on asking a series of questions.

        How Decision Trees Work:
        1. Select the best feature to split data
        2. Split data into subsets
        3. Repeat recursively until stopping criteria met

        Splitting Criteria:
        • Gini Impurity: 1 - Σ(pᵢ)²
        • Entropy: -Σ pᵢ log(pᵢ)
        • Information Gain: Entropy(parent) - Σ(weighted entropy of children)

        Implementation:
        \`\`\`python
        from sklearn.tree import DecisionTreeClassifier
        from sklearn.ensemble import RandomForestClassifier
        
        # Single Decision Tree
        dt = DecisionTreeClassifier(max_depth=5)
        dt.fit(X_train, y_train)
        
        # Random Forest (Ensemble of Trees)
        rf = RandomForestClassifier(n_estimators=100, max_depth=10)
        rf.fit(X_train, y_train)
        
        # Feature importance
        importance = rf.feature_importances_
        \`\`\`

        Advantages of Random Forests:
        • Reduces overfitting
        • Handles non-linear relationships
        • Provides feature importance
        • Works well with high-dimensional data

        Hyperparameter Tuning:
        • n_estimators: Number of trees
        • max_depth: Maximum tree depth
        • min_samples_split: Minimum samples to split
        • min_samples_leaf: Minimum samples at leaf
      `,
        },
        6: {
            title: "Model Evaluation & Validation",
            content: `
        Proper model evaluation ensures your model generalizes well to new data.

        Cross-Validation Techniques:

        1. K-Fold Cross Validation
        • Split data into K folds
        • Train on K-1 folds, validate on 1 fold
        • Repeat K times
        \`\`\`python
        from sklearn.model_selection import cross_val_score
        
        scores = cross_val_score(model, X, y, cv=5)
        print(f"Mean accuracy: {scores.mean():.2f}")
        \`\`\`

        2. Stratified K-Fold
        • Maintains class distribution in each fold
        • Better for imbalanced datasets

        3. Leave-One-Out (LOO)
        • Train on all but one sample
        • Very computationally expensive

        Bias-Variance Tradeoff:
        • High Bias: Underfitting (too simple)
        • High Variance: Overfitting (too complex)
        • Goal: Find sweet spot

        Learning Curves:
        \`\`\`python
        from sklearn.model_selection import learning_curve
        
        train_sizes, train_scores, val_scores = learning_curve(
            model, X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 10)
        )
        \`\`\`

        Validation Strategies:
        • Holdout validation (train/test split)
        • Cross-validation
        • Time series validation (for temporal data)
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
                    quiz_id: `intermediate_module_${selectedModule}`,
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
                                <span className="text-sm px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
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
                        <div className="inline-block px-4 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm mb-4">
                            Intermediate Level
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Intermediate Learning Path
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Deepen your understanding with advanced ML concepts and practical implementations
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
                            <div className="text-2xl mb-2">🎯</div>
                            <div className="text-2xl font-bold text-purple-400">
                                {modules.filter(m => m.completed).length * 100}
                            </div>
                            <div className="text-gray-400">XP Gained</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">Intermediate Path Progress</span>
                            <span className="text-purple-400">{completedCount}/{modules.length} Modules</span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
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
                                        {module.completed ? "✅" : "📘"}
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                                        ⭐ {module.points} pts
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                                <p className="text-gray-400 text-sm mb-3">{module.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                                        {module.category}
                                    </span>
                                    <span className="text-xs text-gray-500">⏱️ {module.duration}</span>
                                </div>
                                {!module.completed && (
                                    <button className="mt-4 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-sm transition-all">
                                        Start Learning →
                                    </button>
                                )}
                                {module.completed && (
                                    <div className="mt-4 text-center text-sm text-green-400">
                                        ✓ Completed • {module.points} XP Earned
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Prerequisites Note */}
                    <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex gap-3">
                            <span className="text-xl">📋</span>
                            <div>
                                <h4 className="font-semibold text-yellow-400">Prerequisites</h4>
                                <p className="text-sm text-gray-300">
                                    Complete the Beginner Learning Path before starting Intermediate modules.
                                    Basic knowledge of Python and statistics is recommended.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Completion Certificate */}
                    {completedCount === modules.length && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-6 border border-yellow-500/30 text-center"
                        >
                            <div className="text-4xl mb-2">🏆🎉</div>
                            <h3 className="text-xl font-bold mb-2">Congratulations, ML Practitioner!</h3>
                            <p className="text-gray-300 mb-2">You've completed all Intermediate modules!</p>
                            <p className="text-purple-400 mb-4">Total Points Earned: {totalPointsEarned}</p>
                            <p className="text-sm text-gray-400 mb-4">You are now ready for Advanced concepts!</p>
                            <div className="flex gap-4 justify-center">
                                <button className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-semibold">
                                    Download Certificate
                                </button>
                                <button
                                    onClick={() => router.push("/learn/advanced")}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold"
                                >
                                    Continue to Advanced →
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}