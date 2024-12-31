# Risk Scoring and Premium Calculation Models

This repository contains two key models designed for assessing risks and calculating premiums based on different factors:

1. **Depegging Risk Model**: Evaluates the risk associated with stablecoins by analyzing their price stability.
2. **Slashing Risk Model**: Determines the risk of validator slashing for blockchain protocols based on their performance metrics.

---

## Depegging Risk Model

### Overview
The Depegging Risk Model calculates the likelihood of stablecoins deviating from their pegged value. It generates a risk score and computes a premium for coverage based on three key factors:

1. **Volatility**: The price fluctuation of the stablecoin.
2. **Average Deviation**: The average extent to which the stablecoin deviates from its peg.
3. **Persistence**: The consistency of depegging over time.

### Methodology

1. **Data Simulation**: Generates daily price data for each stablecoin based on their volatility and base value.
2. **Risk Factors Calculation**:
   - **Volatility**: Measured using the standard deviation of price fluctuations.
   - **Average Deviation**: The mean absolute deviation of prices from the peg.
   - **Persistence**: The tendency of a stablecoin to stay depegged once it deviates.
3. **Scaling and Scoring**:
   - Each risk factor is normalized using Min-Max scaling and adjusted to a range of 0.01 to 0.99 to avoid idealized extremes.
4. **Final Risk Score**:
   - Combines the three factors into a single score using the cube root of their product.
5. **Premium Calculation**:
   - Premium (%) = 5 + (Risk Score × 15).

### Output
The model provides:
- Risk scores for each stablecoin.
- Corresponding premium percentages.

---

## Slashing Risk Model

### Overview
The Slashing Risk Model evaluates the probability of validator protocols being slashed due to poor performance or misconduct. It generates protocol-specific risk scores and calculates premiums accordingly.

### Methodology

1. **Dataset Creation**:
   - Synthetic data simulates validator performance, including metrics like uptime, missed blocks, and stake size.
2. **Feature Selection**:
   - Relevant metrics include missed blocks, uptime percentage, stake size, and block completion rate.
3. **Model Training**:
   - A Logistic Regression model predicts slashing probabilities for each validator based on selected features.
4. **Protocol Risk Assessment**:
   - Slashing probabilities are averaged across validators to compute protocol-specific risk scores.
5. **Premium Calculation**:
   - Premium (%) = 5 + (Risk Score × 15).
   - The premium reflects the slashing risk associated with each protocol.

### Output
The model provides:
- Risk scores for each protocol.
- Corresponding premium percentages.

---

## Example Usage

### Depegging Risk Model
```python
price, risk_score = calc_risk_price(
    start_date="2024-01-01",
    end_date="2024-10-31",
    stablecoins=["USDe", "TUSD"],
    selected_stablecoin="USDe",
    volatility_dict={"USDe": 0.74, "TUSD": 0.66},
    base_dict={"USDe": 1, "TUSD": 1}
)
print(f"Risk Score: {risk_score}")
print(f"Calculated Premium: {round(5 + (risk_score * 15))}%")
```

### Slashing Risk Model
```python
risk_scores, premiums = calc_slashing_risks(
    protocols=["Stakecito", "DAIC"],
    performance_data=data
)
print(f"Protocol Risk Scores: {risk_scores}")
print(f"Premiums: {premiums}")
```

---

## Key Insights
- Both models provide actionable risk scores and premiums, enabling data-driven decision-making for coverage pricing.
- The flexible design allows for easy adaptation to additional stablecoins, protocols, or performance metrics.

---

## Future Enhancements
- Incorporate real-world datasets for improved accuracy.
- Extend models to include additional risk factors and machine learning techniques.
- Visualize risk scores and premiums using interactive dashboards.

---


For questions or contributions, feel free to raise an issue or submit a pull request!


