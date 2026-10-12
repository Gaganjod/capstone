import time
import math
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np

# Try importing ML libraries with graceful fallbacks
try:
    from sklearn.ensemble import RandomForestClassifier
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    from sklearn.ensemble import RandomForestClassifier
    XGBOOST_AVAILABLE = False

try:
    import shap
    SHAP_AVAILABLE = True
except Exception:
    SHAP_AVAILABLE = False


app = FastAPI(
    title="AdaptLearn AI - Dynamic Learner Modeling & XAI Service",
    version="1.0.0",
    description="FastAPI service serving dynamic learner predictions, difficulty & modality adaptation, and SHAP explainability."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LearnerFeatures(BaseModel):
    readingAccuracy: float = Field(..., ge=0.0, le=100.0, description="Reading accuracy score (0-100)")
    comprehensionScore: float = Field(..., ge=0.0, le=100.0, description="Comprehension test score (0-100)")
    averageResponseTime: float = Field(..., ge=0, description="Average response time in milliseconds")
    errorRate: float = Field(..., ge=0.0, le=1.0, description="Error rate (0-1)")
    audioPerformance: float = Field(..., ge=0.0, le=100.0, description="Modality performance with audio (0-100)")
    textPerformance: float = Field(..., ge=0.0, le=100.0, description="Modality performance text-only (0-100)")
    recentPerformance: float = Field(..., ge=0.0, le=100.0, description="Recent trend score (0-100)")


class PredictionResponse(BaseModel):
    difficulty: str
    modality: str
    pacing: str
    feedbackStrategy: str
    confidence: float
    features: Dict[str, float]


class XAIExplanationResponse(BaseModel):
    recommendation: PredictionResponse
    featureImportances: Dict[str, float]
    shapValues: Dict[str, float]
    naturalLanguageExplanation: str
    observedData: Dict[str, float]


# Model Store
class AdaptiveModelTrainer:
    def __init__(self):
        self.feature_names = [
            "readingAccuracy",
            "comprehensionScore",
            "averageResponseTime",
            "errorRate",
            "audioPerformance",
            "textPerformance",
            "recentPerformance"
        ]
        self.modality_model = None
        self.difficulty_model = None
        self.explainer = None
        self._train_baseline_models()

    def _generate_synthetic_data(self, n_samples=600):
        np.random.seed(42)
        reading_acc = np.random.uniform(30, 100, n_samples)
        comp_score = np.random.uniform(30, 100, n_samples)
        resp_time = np.random.uniform(2000, 15000, n_samples)
        error_rate = 1.0 - (reading_acc / 100.0) + np.random.normal(0, 0.05, n_samples)
        error_rate = np.clip(error_rate, 0, 1)
        audio_perf = reading_acc + np.random.uniform(5, 25, n_samples)
        audio_perf = np.clip(audio_perf, 0, 100)
        text_perf = reading_acc - np.random.uniform(0, 15, n_samples)
        text_perf = np.clip(text_perf, 0, 100)
        recent_perf = (reading_acc * 0.5) + (comp_score * 0.5) + np.random.normal(0, 5, n_samples)
        recent_perf = np.clip(recent_perf, 0, 100)

        X = np.column_stack([
            reading_acc, comp_score, resp_time, error_rate,
            audio_perf, text_perf, recent_perf
        ])

        # Targets for Modality: 0: TEXT, 1: AUDIO_TEXT, 2: HIGHLIGHTED_TEXT
        y_modality = []
        for i in range(n_samples):
            diff = audio_perf[i] - text_perf[i]
            if diff > 15:
                y_modality.append(1) # AUDIO_TEXT
            elif diff > 5:
                y_modality.append(2) # HIGHLIGHTED_TEXT
            else:
                y_modality.append(0) # TEXT

        # Targets for Difficulty: 0: EASY, 1: MEDIUM, 2: HARD
        y_difficulty = []
        for i in range(n_samples):
            score = (reading_acc[i] * 0.4) + (comp_score[i] * 0.4) - (resp_time[i] / 300)
            if score > 65:
                y_difficulty.append(2) # HARD
            elif score > 40:
                y_difficulty.append(1) # MEDIUM
            else:
                y_difficulty.append(0) # EASY

        return X, np.array(y_modality), np.array(y_difficulty)

    def _train_baseline_models(self):
        X, y_mod, y_diff = self._generate_synthetic_data()

        if XGBOOST_AVAILABLE:
            self.modality_model = xgb.XGBClassifier(
                n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42
            )
            self.difficulty_model = xgb.XGBClassifier(
                n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42
            )
        else:
            self.modality_model = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
            self.difficulty_model = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)

        self.modality_model.fit(X, y_mod)
        self.difficulty_model.fit(X, y_diff)

        if SHAP_AVAILABLE:
            try:
                self.explainer = shap.TreeExplainer(self.modality_model)
            except Exception:
                self.explainer = None

    def predict(self, features: LearnerFeatures) -> Dict[str, Any]:
        X_input = np.array([[
            features.readingAccuracy,
            features.comprehensionScore,
            features.averageResponseTime,
            features.errorRate,
            features.audioPerformance,
            features.textPerformance,
            features.recentPerformance
        ]])

        mod_probs = self.modality_model.predict_proba(X_input)[0]
        mod_idx = int(np.argmax(mod_probs))
        mod_confidence = float(mod_probs[mod_idx])

        diff_probs = self.difficulty_model.predict_proba(X_input)[0]
        diff_idx = int(np.argmax(diff_probs))

        mod_map = {0: "TEXT", 1: "AUDIO_TEXT", 2: "HIGHLIGHTED_TEXT"}
        diff_map = {0: "EASY", 1: "MEDIUM", 2: "HARD"}

        modality = mod_map.get(mod_idx, "AUDIO_TEXT")
        difficulty = diff_map.get(diff_idx, "MEDIUM")

        # Pacing heuristic
        if features.averageResponseTime > 9000 or features.errorRate > 0.35:
            pacing = "SLOWER"
        elif features.averageResponseTime < 4000 and features.readingAccuracy > 80:
            pacing = "ACCELERATED"
        else:
            pacing = "STANDARD"

        # Feedback strategy heuristic
        if features.errorRate > 0.4:
            feedback = "ENCOURAGING_ELABORATE"
        elif features.readingAccuracy < 65:
            feedback = "CONCEPTUAL_HINT"
        elif features.readingAccuracy > 85:
            feedback = "MINIMAL_PROMPT"
        else:
            feedback = "DIRECT_CORRECTIVE"

        return {
            "difficulty": difficulty,
            "modality": modality,
            "pacing": pacing,
            "feedbackStrategy": feedback,
            "confidence": round(mod_confidence, 2),
            "features": {
                "readingAccuracy": features.readingAccuracy,
                "comprehensionScore": features.comprehensionScore,
                "averageResponseTime": features.averageResponseTime,
                "errorRate": features.errorRate,
                "audioPerformance": features.audioPerformance,
                "textPerformance": features.textPerformance,
                "recentPerformance": features.recentPerformance
            }
        }

    def explain(self, features: LearnerFeatures) -> Dict[str, Any]:
        pred = self.predict(features)
        X_input = np.array([[
            features.readingAccuracy,
            features.comprehensionScore,
            features.averageResponseTime,
            features.errorRate,
            features.audioPerformance,
            features.textPerformance,
            features.recentPerformance
        ]])

        # Compute SHAP values or feature importances
        shap_dict = {}
        importance_dict = {}

        if self.explainer is not None and SHAP_AVAILABLE:
            try:
                shap_vals = self.explainer.shap_values(X_input)
                # If multi-class, shap_vals is a list or 3D array
                if isinstance(shap_vals, list):
                    vals = np.abs(shap_vals[0]).flatten()
                else:
                    vals = np.abs(shap_vals).mean(axis=0).flatten()

                total = np.sum(vals) + 1e-6
                for name, v in zip(self.feature_names, vals):
                    shap_dict[name] = float(round(v / total, 3))
                    importance_dict[name] = float(round(v / total, 3))
            except Exception:
                shap_dict = self._fallback_importances(features)
                importance_dict = shap_dict
        else:
            shap_dict = self._fallback_importances(features)
            importance_dict = shap_dict

        # Generate Natural Language XAI Explanation
        explanation_text = self._build_natural_language_xai(pred, features, importance_dict)

        return {
            "recommendation": pred,
            "featureImportances": importance_dict,
            "shapValues": shap_dict,
            "naturalLanguageExplanation": explanation_text,
            "observedData": {
                "readingAccuracy": features.readingAccuracy,
                "audioPerformance": features.audioPerformance,
                "textPerformance": features.textPerformance,
                "responseTimeMs": features.averageResponseTime,
                "comprehension": features.comprehensionScore
            }
        }

    def _fallback_importances(self, features: LearnerFeatures) -> Dict[str, float]:
        # Weighted feature attribution fallback
        audio_diff = abs(features.audioPerformance - features.textPerformance)
        acc = features.readingAccuracy
        resp = features.averageResponseTime / 100.0

        weights = {
            "readingAccuracy": 0.35 * (100 - acc) / 100.0 + 0.15,
            "audioPerformance": 0.25 * (audio_diff / 50.0) + 0.10,
            "textPerformance": 0.15,
            "averageResponseTime": 0.15 * (resp / 100.0),
            "comprehensionScore": 0.10,
            "errorRate": 0.05,
            "recentPerformance": 0.05
        }
        total = sum(weights.values())
        return {k: round(v / total, 3) for k, v in weights.items()}

    def _build_natural_language_xai(
        self, pred: Dict[str, Any], f: LearnerFeatures, importances: Dict[str, float]
    ) -> str:
        modality = pred["modality"]
        difficulty = pred["difficulty"]

        sorted_features = sorted(importances.items(), key=lambda x: x[1], reverse=True)
        top_feature_name, top_weight = sorted_features[0]

        reasons = []

        if f.audioPerformance > f.textPerformance + 10:
            reasons.append(
                f"Student scored {f.audioPerformance:.0f}% with audio support vs {f.textPerformance:.0f}% with text alone."
            )
        if f.readingAccuracy < 70:
            reasons.append(
                f"Recent reading accuracy of {f.readingAccuracy:.0f}% indicates a need for supplementary bimodal guidance."
            )
        if f.averageResponseTime > 8000:
            reasons.append(
                f"Average response time ({f.averageResponseTime/1000:.1f}s) suggests cognitive load is higher with dense text."
            )

        if not reasons:
            reasons.append(
                f"Student demonstrates stable comprehension ({f.comprehensionScore:.0f}%) across modalities."
            )

        reason_str = " ".join(reasons)

        return (
            f"The AI Model recommended {modality} modality at {difficulty} difficulty with {pred['confidence']*100:.0f}% confidence. "
            f"Key driving factors: {reason_str} "
            f"Primary feature influence: '{top_feature_name}' ({top_weight*100:.1f}% relative impact)."
        )


trainer = AdaptiveModelTrainer()


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AdaptLearn AI ML Service",
        "xgboost": XGBOOST_AVAILABLE,
        "shap": SHAP_AVAILABLE,
        "timestamp": time.time()
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_adaptation(features: LearnerFeatures):
    try:
        return trainer.predict(features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/explain", response_model=XAIExplanationResponse)
def explain_adaptation(features: LearnerFeatures):
    try:
        return trainer.explain(features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
