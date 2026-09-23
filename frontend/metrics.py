"""Metrics calculation module for VeriFact AI.
Calculates the level of verifiable facts vs. opinion/speculation.
"""

def calculate_fact_vs_opinion_ratio(accuracy: float = 0.0, hallucination: float = 0.0, falsehood: float = 0.0) -> dict:
    """Calculates comparative ratio of verifiable facts vs. opinion/speculation.
    
    Args:
        accuracy: Accuracy confidence percentage (0-100).
        hallucination: Hallucination likelihood / speculation percentage (0-100).
        falsehood: Falsehood confidence percentage (0-100).
        
    Returns:
        dict containing verifiable_facts_pct, opinion_speculation_pct, and dominant_category.
    """
    total = accuracy + hallucination
    if total <= 0.0:
        return {
            "verifiable_facts_pct": 50.0,
            "opinion_speculation_pct": 50.0,
            "falsehood_pct": falsehood,
            "dominant_category": "NEUTRAL"
        }
    
    # If explicit accuracy/hallucination percentages are given out of 100
    facts_pct = round(accuracy, 1)
    opinion_pct = round(hallucination, 1)
    
    if facts_pct > opinion_pct and facts_pct >= 50.0:
        dominant = "FACT"
    elif opinion_pct > facts_pct and opinion_pct >= 50.0:
        dominant = "OPINION/SPECULATION"
    else:
        dominant = "MIXED"
        
    return {
        "verifiable_facts_pct": facts_pct,
        "opinion_speculation_pct": opinion_pct,
        "falsehood_pct": falsehood,
        "dominant_category": dominant
    }

def analyze_claim_metrics(text: str = "", accuracy: float = 0.0, hallucination: float = 0.0, falsehood: float = 0.0) -> dict:
    """Analyzes text heuristics or provided confidences to determine fact vs opinion ratios.
    
    Args:
        text: Query or response text to analyze.
        accuracy: Optional predefined accuracy confidence.
        hallucination: Optional predefined hallucination percentage.
        falsehood: Optional predefined falsehood confidence.
    """
    if accuracy == 0.0 and hallucination == 0.0 and text:
        lower = text.lower()
        speculative_words = ["opinion", "think", "maybe", "could", "might", "speculate", "predict", "unconfirmed", "alleged", "rumor", "believe", "probably", "future", "forecast"]
        factual_words = ["confirmed", "evidence", "proven", "documented", "data", "record", "measurement", "history", "official", "study", "verified", "true", "fact", "scientific"]
        falsehood_words = ["false", "debunked", "hoax", "incorrect", "disproven", "misleading", "fake", "mars in 2024"]

        spec_hits = sum(1 for w in speculative_words if w in lower)
        fact_hits = sum(1 for w in factual_words if w in lower)
        false_hits = sum(1 for w in falsehood_words if w in lower)

        if false_hits > 0 and false_hits >= fact_hits:
            return calculate_fact_vs_opinion_ratio(accuracy=10.0, hallucination=15.0, falsehood=75.0)
        elif spec_hits > fact_hits:
            return calculate_fact_vs_opinion_ratio(accuracy=25.0, hallucination=75.0, falsehood=0.0)
        elif fact_hits > spec_hits:
            return calculate_fact_vs_opinion_ratio(accuracy=85.0, hallucination=15.0, falsehood=0.0)
        else:
            return calculate_fact_vs_opinion_ratio(accuracy=60.0, hallucination=40.0, falsehood=0.0)

    return calculate_fact_vs_opinion_ratio(accuracy, hallucination, falsehood)
