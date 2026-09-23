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
