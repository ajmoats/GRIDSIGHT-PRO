# GRIDSIGHT-PRO ⚡

GRIDSIGHT-PRO is a full-stack Business Intelligence (BI) platform designed to monitor renewable energy asset health, simulate industrial SCADA telemetry, and quantify financial risk against real-time wholesale electricity market volatility. 

Built using a modern reactive architecture, the system maps high-frequency physical asset metrics directly to regional grid price data streams to calculate live operational revenue impacts.

---

## 🚀 Core Architecture & Features

### 1. Real-Time SCADA Telemetry Simulation
* Spins up containerized background loops simulating industrial SCADA networks.
* Streams high-frequency edge metrics (including active power output $MW$, rotor velocity, and core bearing temperatures).
* Automates threshold validation to log anomaly flags and active downtime incidents immediately to a real-time event pipeline.

### 2. Live Grid Integration (EIA API)
* Built-in ingestion handlers linking directly to the **U.S. Energy Information Administration (EIA) Open Data API**.
* Periodically streams real-time Regional Transmission Organization (RTO) metrics, tracking **Grid Fuel-Mix data** (Wind, Solar, Gas, Coal generation breakdowns) and **Wholesale Node Spot Pricing ($\$/MWh$)** across regions like PJM and ERCOT.

### 3. Revenue Impact Engine
* Implements a deterministic economic evaluation model to cross-reference asset unavailability with real-time grid economics.
* Quantifies immediate financial losses by mapping historical downtime events against concurrent regional spot market pricing using the engine formula:
  $$\text{Financial Loss} = \text{Capacity (MW)} \times \text{Downtime (Hours)} \times \text{Efficiency Factor} \times \text{Spot Price (\$/MWh)}$$

### 4. Role-Based Access Control & Authorization (RBAC)
* Features a secure, session-persistent authentication and authorization state machine.
* Implements context-aware server filters ensuring operators and administrative viewers are strictly isolated to monitoring assets and market boundaries matching their explicitly assigned RTO region.

---

## 🛠️ The Tech Stack

* **Frontend:** React 19, Vite, TanStack Router (Type-safe routing), Tailwind CSS, Shadcn UI
* **Backend & DB:** Convex (Reactive Time-Series Database, Actions, and Graph Queries)
* **Package Manager:** pnpm
* **CI/CD:** Automated deployment workflows via GitHub Actions

---

## 💻 Getting Started

### 1. Clone & Install Dependencies
```bash
pnpm install
