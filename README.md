# BQ Labs - Bitcoin Risk Management Layer

## Overview

BQ Labs is pioneering the first Bitcoin Risk Management Layer, aiming to secure the Bitcoin ecosystem through a decentralized insurance infrastructure. The BQ Protocol provides a robust technical, operational, and legal framework that enables members to underwrite and trade risk as a liquid asset, purchase coverage, and efficiently assess claims. This protocol is designed to bring transparency, trust, and efficiency to the Bitcoin financial landscape.

## System Architecture

### Key Actors and Processes

The BQ Protocol is structured around three primary user roles, each interacting with the protocol’s layered architecture to facilitate decentralized risk management:

- **Proposers (Cover Buyers/Clients):**  
   Proposers utilize the platform to secure their Bitcoin-related financial activities, such as staking and smart contracts, by purchasing tailored insurance coverage. After connecting their non-custodial wallet, proposers can select from various coverage options based on their specific risk profiles. The claims process is managed through a decentralized governance model, involving risk assessors, validators, and underwriters, particularly for complex risk scenarios.

- **Stakers (Liquidity Providers):**  
   Stakers provide liquidity to insurance pools, and vaults earning returns on their investments. The protocol ensures full transparency of risk and yield details, allowing Stakers to make informed decisions. The capital provided by Stakers is deployed to cover risks during adverse events, ensuring a resilient insurance framework.

# Risk Infrastructure Layer (Risk Engine)

The BQ Risk Engine performs risk analysis on different cover products to provides scores and premium calculation models enabling precise risk assessment and dynamic premium adjustments. [Read more](https://github.com/bitquid-labs/bnb-hackathon/blob/main/risk-engine/README.md)

## Core Features

1. **Purchase Cover:**  
   Users can browse through a selection of risks, select a coverage tenure and amount, and secure their BTCFi position. This feature is fully integrated with non-custodial wallets, enabling seamless transactions.

2. **Stake:**  
   The staking module allows users to contribute assets to various credit-rated pools or vaults. The module provides real-time visibility into pool fund utilization, daily yield claims, and asset withdrawal upon the completion of the staking period.

3. **Dynamic Pricing:**  
   The platform employs dynamic pricing algorithms to calculate cover capacity, pool ratios, and claim-based price discovery. This ensures that pricing remains fair and reflective of real-time risk assessments.

4. **Vaults**:
    

[Read more](https://github.com/bitquid-labs/bnb-hackathon/blob/main/bnb-contracts/README.md)

## Technical Details

- **Smart Contracts:** Developed using Solidity, with a focus on security, efficiency, and scalability.
- **Frontend:** Built using React.js, providing a responsive and user-friendly interface.
- **Wallet Integration:** Implemented using the Wagmi library, supporting various non-custodial wallets.
- **Blockchain:** The application is powered by the BSC Testnet network, ensuring high transaction throughput and minimal latency.
- **Storage:** All logos, images, and related assets are securely stored on IPFS, ensuring decentralized and immutable storage.

## Demo Link -

## Deployed Contracts

Below is a list of the smart contracts deployed within the BQ Protocol:

1. **Insurance Pool Contract:** 0xFc226a099aE3068C3A7C7389bcFa0d7FfDa37C0e
2. **Insurance Cover Contract:** 0xEe5bbDB9FC36Db581E54d47Fc55dBFEb6d03f47E
3. **Vault Contract:** 0xBda761B689b5b9D05E36f8D5A3A5D9be51aCe6c9
4. **BQ BTC Contract:** 0x295eDf61d4368db80ad512c2f4030BfB2244cBa2

## Conclusion

BQ Labs represents a significant advancement in the Bitcoin ecosystem by introducing a decentralized and robust risk management layer. By addressing the gaps in trust, transparency, and on-chain risk management, BQ Labs aims to become the go-to solution for insurance and risk mitigation in the BTCFi space. With its comprehensive technical framework and community-driven governance model, BQ Labs is poised to enhance the security and resilience of Bitcoin financial operations.
