import os
import time
import json
import math
import pickle
import logging
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import shutil
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AdaptLearnML")

# ── Optional heavy imports with graceful fallbacks ────────────────────────────
try:
    from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
    from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
    from sklearn.metrics import classification_report, accuracy_score
    from sklearn.preprocessing import StandardScaler
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    logger.warning("scikit-learn not found – using pure heuristic fallback")

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    logger.warning("XGBoost not installed – falling back to GradientBoostingClassifier")

try:
    import shap
    SHAP_AVAILABLE = True
except Exception:
    SHAP_AVAILABLE = False
    logger.warning("SHAP not installed – using feature-importance fallback")

# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="AdaptLearn AI – Dynamic Learner Modeling & XAI Service",
    version="2.0.0",
    description=(
        "FastAPI service providing real-time adaptive learning recommendations "
        "via XGBoost classifiers trained on synthetic dyslexic-learner data, "
        "SHAP explainability, train/test evaluation, and cross-validation."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)
# Directory for raw uploaded data
RAW_DATA_DIR = os.path.join(os.path.dirname(__file__), "data", "raw")
os.makedirs(RAW_DATA_DIR, exist_ok=True)

# ── Pydantic Schemas ──────────────────────────────────────────────────────────
class LearnerFeatures(BaseModel):
    readingAccuracy:     float = Field(..., ge=0.0,  le=100.0)
    comprehensionScore:  float = Field(..., ge=0.0,  le=100.0)
    averageResponseTime: float = Field(..., ge=0)
    errorRate:           float = Field(..., ge=0.0,  le=1.0)
    audioPerformance:    float = Field(..., ge=0.0,  le=100.0)
    textPerformance:     float = Field(..., ge=0.0,  le=100.0)
    recentPerformance:   float = Field(..., ge=0.0,  le=100.0)


class PredictionResponse(BaseModel):
    difficulty:       str
    modality:         str
    pacing:           str
    feedbackStrategy: str
    confidence:       float
    features:         Dict[str, float]


class XAIExplanationResponse(BaseModel):
    recommendation:          PredictionResponse
    featureImportances:      Dict[str, float]
    shapValues:              Dict[str, float]
    naturalLanguageExplanation: str
    observedData:            Dict[str, float]


class ModelMetrics(BaseModel):
    modality_train_accuracy:      float
    modality_test_accuracy:       float
    modality_cv_mean:             float
    modality_cv_std:              float
    difficulty_train_accuracy:    float
    difficulty_test_accuracy:     float
    difficulty_cv_mean:           float
    difficulty_cv_std:            float
    training_samples:             int
    test_samples:                 int
    model_backend:                str
    shap_available:               bool
    trained_at:                   str


# ── Adaptive Model Trainer ────────────────────────────────────────────────────
class AdaptiveModelTrainer:
    FEATURE_NAMES = [
        "readingAccuracy",
        "comprehensionScore",
        "averageResponseTime",
        "errorRate",
        "audioPerformance",
        "textPerformance",
        "recentPerformance",
    ]
    MOD_MAP  = {0: "TEXT", 1: "AUDIO_TEXT", 2: "HIGHLIGHTED_TEXT"}
    DIFF_MAP = {0: "EASY", 1: "MEDIUM",     2: "HARD"}

    def __init__(self):
        self.modality_model   = None
        self.difficulty_model = None
        self.scaler           = None
        self.explainer        = None
        self.metrics: Optional[Dict] = None
        self._train()

    # ── Data Generation ───────────────────────────────────────────────────────
    def _generate_data(self, n: int = 1200, seed: int = 42) -> tuple:
        """Generate synthetic data or load uploaded raw data if available.
        If a JSON file exists at RAW_DATA_DIR/data.json, it will be loaded and used.
        The file should contain a list of objects matching the LearnerFeatures schema.
        """
        raw_path = os.path.join(RAW_DATA_DIR, "data.json")
        if os.path.isfile(raw_path):
            logger.info("🔄 Loading uploaded raw dataset for training.")
            with open(raw_path, "r") as f:
                raw_list = json.load(f)
            # Convert list of dicts to numpy arrays
            X = []
            y_mod = []
            y_diff = []
            for entry in raw_list:
                # Expect keys matching LearnerFeatures fields plus optional labels
                vec = [
                    entry.get("readingAccuracy", 0),
                    entry.get("comprehensionScore", 0),
                    entry.get("averageResponseTime", 0),
                    entry.get("errorRate", 0),
                    entry.get("audioPerformance", 0),
                    entry.get("textPerformance", 0),
                    entry.get("recentPerformance", 0),
                ]
                X.append(vec)
                # Simple heuristic for labels if not provided
                y_mod.append(entry.get("modality_label", 0))
                y_diff.append(entry.get("difficulty_label", 0))
            X = np.array(X)
            y_mod = np.array(y_mod)
            y_diff = np.array(y_diff)
            return X, y_mod, y_diff
        # Fallback to synthetic generation
        rng = np.random.default_rng(seed)
        reading_acc  = rng.uniform(25, 100, n)
        comp_score   = reading_acc * 0.6 + rng.uniform(-10, 20, n)
        comp_score   = np.clip(comp_score, 20, 100)
        resp_time    = rng.uniform(2000, 16000, n)
        error_rate   = np.clip(1.0 - reading_acc / 100 + rng.normal(0, 0.08, n), 0, 1)
        audio_boost  = rng.uniform(8, 35, n)
        audio_perf   = np.clip(reading_acc + audio_boost, 0, 100)
        text_perf    = np.clip(reading_acc - rng.uniform(0, 20, n), 0, 100)
        recent_perf  = np.clip(reading_acc * 0.45 + comp_score * 0.55 + rng.normal(0, 6, n), 0, 100)
        X = np.column_stack([
            reading_acc, comp_score, resp_time, error_rate,
            audio_perf, text_perf, recent_perf,
        ])
        # Modality labels
        y_mod = []
        for i in range(n):
            diff = audio_perf[i] - text_perf[i]
            if diff > 18:
                y_mod.append(1)
            elif diff > 7:
                y_mod.append(2)
            else:
                y_mod.append(0)
        y_mod = np.array(y_mod)
        # Difficulty labels
        score = reading_acc * 0.4 + comp_score * 0.4 - resp_time / 280
        y_diff = np.where(score > 68, 2, np.where(score > 42, 1, 0))
        return X, y_mod, y_diff
        """
        Generate synthetic learner data that mirrors typical dyslexic-reader
        profiles.  n=1200 gives a comfortable train/test split.
        """
        rng = np.random.default_rng(seed)

        reading_acc  = rng.uniform(25, 100, n)
        comp_score   = reading_acc * 0.6 + rng.uniform(-10, 20, n)
        comp_score   = np.clip(comp_score, 20, 100)
        resp_time    = rng.uniform(2000, 16000, n)
        error_rate   = np.clip(1.0 - reading_acc / 100 + rng.normal(0, 0.08, n), 0, 1)

        # Dyslexia pattern: audio consistently outperforms text
        audio_boost  = rng.uniform(8, 35, n)
        audio_perf   = np.clip(reading_acc + audio_boost, 0, 100)
        text_perf    = np.clip(reading_acc - rng.uniform(0, 20, n), 0, 100)
        recent_perf  = np.clip(reading_acc * 0.45 + comp_score * 0.55 + rng.normal(0, 6, n), 0, 100)

        X = np.column_stack([
            reading_acc, comp_score, resp_time, error_rate,
            audio_perf, text_perf, recent_perf,
        ])

        # ── Modality labels ────────────────────────────────────────────────
        y_mod = []
        for i in range(n):
            diff = audio_perf[i] - text_perf[i]
            if diff > 18:
                y_mod.append(1)   # AUDIO_TEXT
            elif diff > 7:
                y_mod.append(2)   # HIGHLIGHTED_TEXT
            else:
                y_mod.append(0)   # TEXT
        y_mod = np.array(y_mod)

        # ── Difficulty labels ──────────────────────────────────────────────
        score = reading_acc * 0.4 + comp_score * 0.4 - resp_time / 280
        y_diff = np.where(score > 68, 2, np.where(score > 42, 1, 0))

        return X, y_mod, y_diff

    # ── Training ──────────────────────────────────────────────────────────────
    def _build_model(self, model_type: str = "auto"):
        if XGBOOST_AVAILABLE:
            if model_type in ("xgboost", "auto"):
                return xgb.XGBClassifier(
                    n_estimators=150,
                    max_depth=5,
                    learning_rate=0.08,
                    subsample=0.85,
                    colsample_bytree=0.85,
                    eval_metric="mlogloss",
                    random_state=42,
                    verbosity=0,
                )
        if SKLEARN_AVAILABLE:
            if model_type in ("gbc", "auto"):
                return GradientBoostingClassifier(
                    n_estimators=120, max_depth=4, learning_rate=0.08, random_state=42
                )
        raise RuntimeError("No ML library available to build a model")

    def _train(self, n: int = 1200, seed: int = 42, model_type: str = "auto"):
        logger.info("🚀 Training AdaptLearn models…")
        X, y_mod, y_diff = self._generate_data(n=n, seed=seed)

        if not SKLEARN_AVAILABLE:
            logger.warning("sklearn unavailable – running heuristic-only mode")
            return

        # ── Train / Test split (80 / 20, stratified) ─────────────────────
        X_train, X_test, ym_train, ym_test, yd_train, yd_test = train_test_split(
            X, y_mod, y_diff, test_size=0.20, random_state=42, stratify=y_mod
        )

        self.scaler = StandardScaler()
        X_train_s = self.scaler.fit_transform(X_train)
        X_test_s  = self.scaler.transform(X_test)

        # ── Modality model ────────────────────────────────────────────────
        self.modality_model = self._build_model(model_type)
        self.modality_model.fit(X_train_s, ym_train)

        mod_acc_train = accuracy_score(ym_train, self.modality_model.predict(X_train_s))
        mod_acc_test  = accuracy_score(ym_test,  self.modality_model.predict(X_test_s))
        cv_mod = cross_val_score(
            self._build_model(), X_train_s, ym_train,
            cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=7),
            scoring="accuracy",
        )

        logger.info(f"  Modality  → train={mod_acc_train:.3f}  test={mod_acc_test:.3f}  "
                    f"cv={cv_mod.mean():.3f}±{cv_mod.std():.3f}")

        # ── Difficulty model ──────────────────────────────────────────────
        self.difficulty_model = self._build_model()
        self.difficulty_model.fit(X_train_s, yd_train)

        diff_acc_train = accuracy_score(yd_train, self.difficulty_model.predict(X_train_s))
        diff_acc_test  = accuracy_score(yd_test,  self.difficulty_model.predict(X_test_s))
        cv_diff = cross_val_score(
            self._build_model(), X_train_s, yd_train,
            cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=7),
            scoring="accuracy",
        )

        logger.info(f"  Difficulty→ train={diff_acc_train:.3f}  test={diff_acc_test:.3f}  "
                    f"cv={cv_diff.mean():.3f}±{cv_diff.std():.3f}")

        # ── SHAP explainer ────────────────────────────────────────────────
        if SHAP_AVAILABLE:
            try:
                self.explainer = shap.TreeExplainer(self.modality_model)
                logger.info("  SHAP TreeExplainer initialised ✅")
            except Exception as e:
                logger.warning(f"  SHAP init failed: {e}")
                self.explainer = None

        # ── Persist metrics ───────────────────────────────────────────────
        self.metrics = {
            "modality_train_accuracy":   round(mod_acc_train, 4),
            "modality_test_accuracy":    round(mod_acc_test,  4),
            "modality_cv_mean":          round(float(cv_mod.mean()), 4),
            "modality_cv_std":           round(float(cv_mod.std()),  4),
            "difficulty_train_accuracy": round(diff_acc_train, 4),
            "difficulty_test_accuracy":  round(diff_acc_test,  4),
            "difficulty_cv_mean":        round(float(cv_diff.mean()), 4),
            "difficulty_cv_std":         round(float(cv_diff.std()),  4),
            "training_samples":          X_train.shape[0],
            "test_samples":              X_test.shape[0],
            "model_backend":             "XGBoost" if XGBOOST_AVAILABLE else "GradientBoosting",
            "shap_available":            SHAP_AVAILABLE and self.explainer is not None,
            "trained_at":               time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }

        # Save metrics to JSON
        # Save current metrics
        metrics_path = os.path.join(MODEL_DIR, "metrics.json")
        with open(metrics_path, "w") as f:
            json.dump(self.metrics, f, indent=2)

        # ------------------------------------------------------------------- #
        # Persist a versioned snapshot of the model + metrics
        # ------------------------------------------------------------------- #
        timestamp = time.strftime("%Y-%m-%dT%H-%M-%S", time.gmtime())
        version_dir = os.path.join(MODEL_DIR, "versions", timestamp)
        os.makedirs(version_dir, exist_ok=True)
        # copy metrics
        shutil.copy(metrics_path, os.path.join(version_dir, "metrics.json"))
        # copy any model files (XGBoost or sklearn) if they exist
        for ext in ("model.pkl", "xgb_model.json"):
            src = os.path.join(MODEL_DIR, ext)
            if os.path.isfile(src):
                shutil.copy(src, os.path.join(version_dir, ext))

        logger.info("✅ Training complete.  Metrics saved to models/metrics.json")

    # ── Inference helpers ─────────────────────────────────────────────────────
    def _feature_vector(self, f: LearnerFeatures) -> np.ndarray:
        vec = np.array([[
            f.readingAccuracy,
            f.comprehensionScore,
            f.averageResponseTime,
            f.errorRate,
            f.audioPerformance,
            f.textPerformance,
            f.recentPerformance,
        ]])
        if self.scaler is not None:
            vec = self.scaler.transform(vec)
        return vec

    def predict(self, f: LearnerFeatures) -> Dict[str, Any]:
        X = self._feature_vector(f)

        if self.modality_model is None or not SKLEARN_AVAILABLE:
            return self._heuristic_predict(f)

        mod_probs  = self.modality_model.predict_proba(X)[0]
        mod_idx    = int(np.argmax(mod_probs))
        confidence = float(mod_probs[mod_idx])

        diff_probs = self.difficulty_model.predict_proba(X)[0]
        diff_idx   = int(np.argmax(diff_probs))

        # Pacing heuristic
        if f.averageResponseTime > 9000 or f.errorRate > 0.35:
            pacing = "SLOWER"
        elif f.averageResponseTime < 4000 and f.readingAccuracy > 80:
            pacing = "ACCELERATED"
        else:
            pacing = "STANDARD"

        # Feedback strategy
        if f.errorRate > 0.40:
            feedback = "ENCOURAGING_ELABORATE"
        elif f.readingAccuracy < 65:
            feedback = "CONCEPTUAL_HINT"
        elif f.readingAccuracy > 85:
            feedback = "MINIMAL_PROMPT"
        else:
            feedback = "DIRECT_CORRECTIVE"

        return {
            "difficulty":       self.DIFF_MAP.get(diff_idx, "MEDIUM"),
            "modality":         self.MOD_MAP.get(mod_idx, "AUDIO_TEXT"),
            "pacing":           pacing,
            "feedbackStrategy": feedback,
            "confidence":       round(confidence, 3),
            "features": {
                "readingAccuracy":     f.readingAccuracy,
                "comprehensionScore":  f.comprehensionScore,
                "averageResponseTime": f.averageResponseTime,
                "errorRate":           f.errorRate,
                "audioPerformance":    f.audioPerformance,
                "textPerformance":     f.textPerformance,
                "recentPerformance":   f.recentPerformance,
            },
        }

    def explain(self, f: LearnerFeatures) -> Dict[str, Any]:
        pred = self.predict(f)
        X    = self._feature_vector(f)

        # ── SHAP values ───────────────────────────────────────────────────
        shap_dict = {}
        importance_dict = {}

        if self.explainer is not None and SHAP_AVAILABLE:
            try:
                sv = self.explainer.shap_values(X)
                # Multi-class → sv is list[array] or 3-D array
                if isinstance(sv, list):
                    vals = np.abs(sv[pred.get("_mod_idx", 0)]).flatten()
                else:
                    vals = np.abs(sv).mean(axis=0).flatten()
                total = float(np.sum(vals)) + 1e-9
                for name, v in zip(self.FEATURE_NAMES, vals):
                    shap_dict[name]      = round(float(v) / total, 4)
                    importance_dict[name] = round(float(v) / total, 4)
            except Exception as e:
                logger.debug(f"SHAP compute error: {e}")
                shap_dict = importance_dict = self._fallback_importances(f)
        elif self.modality_model is not None and hasattr(self.modality_model, "feature_importances_"):
            raw = self.modality_model.feature_importances_
            total = float(raw.sum()) + 1e-9
            for name, v in zip(self.FEATURE_NAMES, raw):
                importance_dict[name] = round(float(v) / total, 4)
            shap_dict = importance_dict.copy()
        else:
            shap_dict = importance_dict = self._fallback_importances(f)

        explanation = self._build_nl_explanation(pred, f, importance_dict)

        return {
            "recommendation": pred,
            "featureImportances": importance_dict,
            "shapValues": shap_dict,
            "naturalLanguageExplanation": explanation,
            "observedData": {
                "readingAccuracy":  f.readingAccuracy,
                "audioPerformance": f.audioPerformance,
                "textPerformance":  f.textPerformance,
                "responseTimeMs":   f.averageResponseTime,
                "comprehension":    f.comprehensionScore,
            },
        }

    # ── Fallbacks ─────────────────────────────────────────────────────────────
    def _heuristic_predict(self, f: LearnerFeatures) -> Dict[str, Any]:
        audio_diff = f.audioPerformance - f.textPerformance
        modality   = "AUDIO_TEXT" if audio_diff > 15 else ("HIGHLIGHTED_TEXT" if audio_diff > 5 else "TEXT")
        difficulty = "EASY" if f.readingAccuracy < 60 else ("HARD" if f.readingAccuracy > 85 else "MEDIUM")
        pacing     = "SLOWER" if f.averageResponseTime > 9000 or f.errorRate > 0.35 else "STANDARD"
        feedback   = "ENCOURAGING_ELABORATE" if f.errorRate > 0.4 else "DIRECT_CORRECTIVE"
        return {
            "difficulty": difficulty, "modality": modality,
            "pacing": pacing, "feedbackStrategy": feedback,
            "confidence": 0.72,
            "features": {
                "readingAccuracy": f.readingAccuracy, "comprehensionScore": f.comprehensionScore,
                "averageResponseTime": f.averageResponseTime, "errorRate": f.errorRate,
                "audioPerformance": f.audioPerformance, "textPerformance": f.textPerformance,
                "recentPerformance": f.recentPerformance,
            },
        }

    def _fallback_importances(self, f: LearnerFeatures) -> Dict[str, float]:
        audio_diff = abs(f.audioPerformance - f.textPerformance)
        w = {
            "readingAccuracy":     0.35 * (100 - f.readingAccuracy) / 100 + 0.15,
            "audioPerformance":    0.25 * (audio_diff / 50)         + 0.10,
            "textPerformance":     0.15,
            "averageResponseTime": 0.15 * (f.averageResponseTime / 16000),
            "comprehensionScore":  0.10,
            "errorRate":           0.05,
            "recentPerformance":   0.05,
        }
        total = sum(w.values()) + 1e-9
        return {k: round(v / total, 4) for k, v in w.items()}

    def _build_nl_explanation(
        self, pred: Dict, f: LearnerFeatures, imp: Dict[str, float]
    ) -> str:
        top_feat = max(imp, key=imp.get)
        top_pct  = round(imp[top_feat] * 100, 1)
        reasons  = []

        if f.audioPerformance > f.textPerformance + 10:
            reasons.append(
                f"Student achieved {f.audioPerformance:.0f}% with audio support vs "
                f"{f.textPerformance:.0f}% text-only (+{f.audioPerformance - f.textPerformance:.0f}% audio boost)."
            )
        if f.readingAccuracy < 70:
            reasons.append(
                f"Reading accuracy of {f.readingAccuracy:.0f}% signals a need for bimodal "
                f"scaffolding to reduce decoding fatigue."
            )
        if f.averageResponseTime > 8000:
            reasons.append(
                f"Average response time of {f.averageResponseTime/1000:.1f}s indicates higher "
                f"cognitive load; SLOWER pacing is recommended."
            )
        if f.errorRate > 0.35:
            reasons.append(
                f"Error rate of {f.errorRate*100:.0f}% warrants ENCOURAGING_ELABORATE feedback "
                f"to build confidence."
            )
        if not reasons:
            reasons.append(
                f"Student shows stable comprehension ({f.comprehensionScore:.0f}%) across modalities."
            )

        return (
            f"The XGBoost model recommended '{pred['modality']}' modality at "
            f"'{pred['difficulty']}' difficulty with {pred['confidence']*100:.0f}% confidence. "
            f"{' '.join(reasons)} "
            f"Primary driver: '{top_feat}' ({top_pct}% relative SHAP impact)."
        )


# ── Startup ───────────────────────────────────────────────────────────────────
trainer = AdaptiveModelTrainer()


# ── API Routes ────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status":    "healthy",
        "service":   "AdaptLearn AI ML Service v2",
        "xgboost":   XGBOOST_AVAILABLE,
        "sklearn":   SKLEARN_AVAILABLE,
        "shap":      SHAP_AVAILABLE,
        "metrics":   trainer.metrics,
        "timestamp": time.time(),
    }

# ---------------------------------------------------------------------------
# Data ingestion endpoint – upload raw learner data for training
# ---------------------------------------------------------------------------
from pydantic import BaseModel

class RawLearner(BaseModel):
    readingAccuracy: float
    comprehensionScore: float
    averageResponseTime: float
    errorRate: float
    audioPerformance: float
    textPerformance: float
    recentPerformance: float
    modality_label: int | None = None
    difficulty_label: int | None = None

class RawDataset(BaseModel):
    data: List[RawLearner]

@app.post("/data")
def upload_data(dataset: RawDataset):
    """Accept a JSON payload of learner records and store for future training.
    The file is saved as data/raw/data.json.
    """
    try:
        path = os.path.join(RAW_DATA_DIR, "data.json")
        with open(path, "w") as f:
            dump_items = [item.model_dump() if hasattr(item, 'model_dump') else item.dict() for item in dataset.data]
            json.dump(dump_items, f, indent=2)
        return {"status": "uploaded", "records": len(dataset.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics", response_model=ModelMetrics)
def get_metrics():
    if trainer.metrics is None:
        raise HTTPException(status_code=503, detail="Model not yet trained")
    return trainer.metrics


@app.post("/predict", response_model=PredictionResponse)
def predict(features: LearnerFeatures):
    try:
        return trainer.predict(features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/explain", response_model=XAIExplanationResponse)
def explain(features: LearnerFeatures):
    try:
        return trainer.explain(features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --------------------------------------------------------------------------- #
# New endpoint – train with custom config
# --------------------------------------------------------------------------- #
class TrainConfig(BaseModel):
    n_samples: int = Field(1200, ge=100, description="Number of synthetic samples")
    seed: int = Field(42, ge=0, description="Random seed")
    model_type: str = Field(
        "auto",
        description="‘auto’, ‘xgboost’, or ‘gbc’ (GradientBoostingClassifier)",
    )


@app.post("/train")
def train(config: TrainConfig):
    """Train models with user‑supplied parameters."""
    try:
        trainer._train(n=config.n_samples, seed=config.seed, model_type=config.model_type)
        dump_data = config.model_dump() if hasattr(config, 'model_dump') else config.dict()
        return {"status": "trained", "metrics": trainer.metrics, "config": dump_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Keep the original simple retrain endpoint for backward compatibility
@app.post("/retrain")
def retrain():
    """Legacy retrain – uses default params."""
    return train(TrainConfig())

# --------------------------------------------------------------------------- #
# List persisted model versions
# --------------------------------------------------------------------------- #
@app.get("/versions")
def list_versions():
    base = os.path.join(MODEL_DIR, "versions")
    if not os.path.isdir(base):
        return []
    return sorted(os.listdir(base), reverse=True)
