# Wintermar WT Dashboard Copilot

Metabase-embedded dashboard for vessel monitoring with tabbed team filtering.

## Project Overview
- **Type**: HTML/JavaScript Dashboard Application
- **Framework**: Vanilla JavaScript with Bootstrap 5
- **Data Source**: Metabase-compatible mock data structure
- **Features**: Tabbed navigation, KPI aggregation, alarm logs, technical grids with conditional formatting

## Setup Checklist

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions (None required - vanilla HTML/CSS/JavaScript)
- [x] Compile the Project (No compilation needed)
- [x] Create and Run Task
- [x] Launch the Project
- [x] Ensure Documentation is Complete

## Development Notes

### Data Structure
- Alarm data includes timestamp, vessel, engine, status
- Technical metrics: RPM, Oil P&T, Fuel P, EGT, TC Temp, SCAV P, HT Cool, LT Cool, Start Sys
- Vessels: WM Sulawesi, WM Kalimantan, WM Java
- Teams: Overview, Team C, Team D, Team E, Team H, Team I

### Key Behaviors
- Overview tab: Aggregated KPIs + Global alarm log
- Team tabs: Detailed technical grid filtered by team
- Color coding: Green (OK), Yellow (Caution), Red (Alert)
- Metabase compatible: All data structures follow Metabase query result format
