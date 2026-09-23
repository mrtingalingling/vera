import pytest
from frontend.metrics import calculate_fact_vs_opinion_ratio

def test_metrics_schema_validation():
    agent_output = {
        "hallucination_likelihood": 10.5,
        "accuracy_confidence": 85.0,
        "falsehood_confidence": 5.0
    }
    assert "hallucination_likelihood" in agent_output
    assert isinstance(agent_output["hallucination_likelihood"], (int, float))
    assert "accuracy_confidence" in agent_output
    assert isinstance(agent_output["accuracy_confidence"], (int, float))
    assert "falsehood_confidence" in agent_output
    assert isinstance(agent_output["falsehood_confidence"], (int, float))

def test_metrics_ratio_predominantly_fact():
    """Row 6: High accuracy produces high verifiable facts ratio."""
    result = calculate_fact_vs_opinion_ratio(accuracy=85.0, hallucination=15.0, falsehood=0.0)
    assert result["verifiable_facts_pct"] == 85.0
    assert result["opinion_speculation_pct"] == 15.0
    assert result["dominant_category"] == "FACT"

def test_metrics_ratio_predominantly_opinion():
    """Row 7: High hallucination/speculation produces high opinion/speculation ratio."""
    result = calculate_fact_vs_opinion_ratio(accuracy=10.0, hallucination=90.0, falsehood=0.0)
    assert result["verifiable_facts_pct"] == 10.0
    assert result["opinion_speculation_pct"] == 90.0
    assert result["dominant_category"] == "OPINION/SPECULATION"

def test_metrics_ratio_empty_or_zero():
    """Row 8: 0 or missing values fallback gracefully without division errors."""
    result = calculate_fact_vs_opinion_ratio(accuracy=0.0, hallucination=0.0, falsehood=0.0)
    assert result["verifiable_facts_pct"] == 50.0
    assert result["opinion_speculation_pct"] == 50.0
    assert result["dominant_category"] == "NEUTRAL"

def test_analyze_claim_metrics_speculative_text():
    """Row 8: Text with speculative wording computes opinion dominant ratio."""
    from frontend.metrics import analyze_claim_metrics
    result = analyze_claim_metrics(text="In my opinion, I think AI might replace programmers maybe in the future.")
    assert result["opinion_speculation_pct"] >= 50.0
    assert result["dominant_category"] == "OPINION/SPECULATION"

def test_analyze_claim_metrics_factual_text():
    """Row 9: Text with factual wording computes fact dominant ratio."""
    from frontend.metrics import analyze_claim_metrics
    result = analyze_claim_metrics(text="Scientific data and official records confirmed the Apollo mission was verified in 1969.")
    assert result["verifiable_facts_pct"] >= 70.0
    assert result["dominant_category"] == "FACT"

