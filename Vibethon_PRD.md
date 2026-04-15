This **Product Requirements Document (PRD)** is optimized for a **4-hour rapid prototyping challenge**. It strips away the "nice-to-haves" and focuses on a **Vertical Slice** strategy: one high-polish, functional path that proves the concept while hitting every requirement in your problem statement.

---

# **PRD: NeuralCanvas (Hackathon Edition)**
**Project Vision:** An experiential AIML learning platform where high-end design meets technical depth.

---

## **1. Core Objectives**
* **Engagement:** Use Whisk/Flow 3D visuals to eliminate "learning fatigue."
* **Accessibility:** Simplify complex math into interactive visual logic.
* **Rapid Validation:** Demonstrate a fully functional Auth $\rightarrow$ Module $\rightarrow$ Quiz loop in under 4 hours.

---

## **2. System Architecture (The "4-Hour" Stack)**
| Layer | Technology | Why? |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | Best-in-class performance and routing. |
| **Database/Auth** | **Supabase** | Instant backend; 5-minute setup for user tables and auth. |
| **Motion/UI** | **Framer Motion + Tailwind** | Awwwards-level polish with minimal CSS. |
| **3.D. Visuals** | **HTML5 Canvas** | High-performance rendering of 120-frame Whisk sequence. |

---

## **3. Functional Requirements (Scoped for Speed)**

### **3.1. User Authentication (Requirement 3.1)**
* **Feature:** Email/Password Sign-up via Supabase Auth.
* **Success State:** On login, create a profile record in the `profiles` table to track `current_progress` (default: 0%).

### **3.2. Structured Module: "Introduction to ML" (Requirement 3.2)**
* **Visual Storytelling:** A 3-section scroll experience.
    * **Section 1:** Definition of ML using "Scrollytelling" (text fades in as the 3D canvas rotates).
    * **Section 2:** Supervised vs. Unsupervised (Visual cards with hover-tilt effects).
* **Interactive Simulator (Requirement 3.6):** * **The "Weight Adjuster":** A slider that moves a Linear Regression line to fit a set of 3 static data points. Visual feedback: The line turns green when the "Error" (MSE) is minimized.

### **3.3. Interactive Mini-Game (Requirement 3.4)**
* **Game:** "The Data Sorter" (Classification Basics).
* **Logic:** Users drag "Spam" and "Not Spam" icons into correct bins using Framer Motion `drag`. 
* **Gamification:** A real-time "Accuracy Score" that updates as they sort.

### **3.4. Coding Playground (Requirement 3.3)**
* **Mock Environment:** A styled code block representing a `model.fit()` call.
* **Interaction:** Users can change a `learning_rate` variable in a text field. Clicking "Run" triggers a pulse animation on the 3D canvas, simulating training.

### **3.5. Assessment & Progress (Requirement 3.5 & 3.7)**
* **Quiz:** 3-question MCQ (Multiple Choice).
* **Instant Feedback:** Correct answers trigger a green glow; incorrect answers trigger a subtle camera shake.
* **Dashboard Update:** On quiz completion, write `progress: 100` to Supabase and navigate to the User Dashboard.

---

## **4. Design Language (Awwwards/SOTD Spec)**
* **Palette:** Deep Charcoal (`#0A0A0A`), Cyber Blue (`#00F0FF`), and Muted Slate.
* **Texture:** 5% Opacity **Noise Grain** overlay on the body.
* **Physics:** Use `stiffness: 100`, `damping: 30` for all transitions (prevents "robotic" feel).
* **Typography:** **Clash Display** (Bold) for headings, **Inter** for body text.

---

## **5. Execution Timeline (The 240-Minute Sprint)**

* **T+0 to 45m:** **The Skeleton.** Next.js boilerplate + Supabase connection + 120-frame Canvas loader.
* **T+45 to 90m:** **The Hero.** Finalize the scrub-on-scroll logic. This is your visual "wow" factor for the judges.
* **T+90 to 150m:** **The Core Logic.** Build the ML Slider and the Drag-and-Drop Game. These prove "Interactivity."
* **T+150 to 210m:** **The Flow.** Connect Auth and build the Dashboard. 
* **T+210 to 240m:** **The Polish.** Add the sound effects (UI clicks), the noise grain, and ensure mobile responsiveness.

---

## **6. Definition of Done (Submission Ready)**
1.  [ ] User can sign up and see their name on the Dashboard.
2.  [ ] The 120-frame animation plays smoothly on scroll without lag.
3.  [ ] The "Weight Adjuster" slider successfully simulates ML logic.
4.  [ ] The Quiz updates the Supabase database on completion.
5.  [ ] Site is responsive (Bento box stacks on mobile).

---
