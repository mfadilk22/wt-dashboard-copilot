# Wintermar WT Dashboard Copilot

A Metabase-compatible tabbed dashboard for vessel monitoring and technical metrics visualization.

## Features

- **Tabbed Navigation**: Overview, Team C, Team D, Team E, Team H, Team I
- **Overview Tab**: Aggregated KPIs and global alarm log across all teams
- **Team Tabs**: Detailed technical grids filtered by team with vessel grouping
- **Conditional Formatting**: Color-coded metrics based on status (OK, Caution, Alert, Standby)
- **Metabase-Compatible**: Data structure and behavior follow Metabase query result format
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
.
├── index.html           # Main dashboard HTML
├── dashboard.js         # Dashboard controller logic
├── styles.css          # Styling and responsive design
├── data.json           # Mock data in Metabase format
├── README.md           # This file
└── .github/
    └── copilot-instructions.md  # Development guidelines
```

## Data Structure

### Metabase Response Format

The dashboard processes data in a Metabase-compatible format:

```json
{
  "alarmsResult": {
    "data": {
      "rows": [["timestamp", "vessel", "team", "engine", "issue"]],
      "cols": [{"name": "TIMESTAMP"}, ...]
    }
  },
  "technicalMetricsResult": {
    "data": {
      "rows": [["vessel", "engine", "rpm", "oil_pt", ...]],
      "cols": [{"name": "VESSEL"}, ...]
    }
  }
}
```

### Technical Metrics

Each metric includes:
- **RPM**: Engine revolutions per minute (status: ok, standby)
- **Oil P&T**: Oil pressure and temperature (status: ok, low, caution)
- **Fuel P**: Fuel pressure (status: ok, caution)
- **EGT**: Exhaust gas temperature (status: avg, watch)
- **TC Temp**: Turbocharger temperature (status: inlet)
- **SCAV P**: Scavenge pressure (status: ok)
- **HT Cool**: High temperature coolant (status: ok)
- **LT Cool**: Low temperature coolant (status: ok)
- **Start Sys**: Starting system (status: ok, standby)

### Status Color Coding

- **Green**: OK status - Normal operation
- **Yellow**: Caution status - Monitor closely
- **Red**: Alert status - Requires attention
- **Gray**: Standby - Engine not running

## Team-to-Vessel Mapping

- **Team C**: WM Sulawesi
- **Team D**: WM Kalimantan
- **Team E**: WM Java
- **Team H**: WM Sulawesi, WM Kalimantan
- **Team I**: WM Kalimantan, WM Java

## Getting Started

### Local Development

1. Open the project in VS Code
2. Use the Live Server extension to serve the dashboard:
   - Right-click on `index.html` → "Open with Live Server"
   - Or run: `python -m http.server 8000` in the project directory

3. Navigate to `http://localhost:8000` (or Live Server port)

### File Structure for Metabase Integration

When embedding in Metabase:

1. Replace `data.json` with actual Metabase API calls
2. Update the `loadData()` method in `dashboard.js` to fetch from Metabase:

```javascript
async loadData() {
    const response = await fetch('http://your-metabase/api/card/YOUR_CARD_ID/query');
    const data = await response.json();
    this.data = this.formatMetabaseResponse(data);
}
```

3. The dashboard will automatically filter results by team using the `teamMapping` object

## Customization

### Adding New Teams

1. Add tab in `index.html`:
```html
<li class="nav-item">
    <button class="nav-link" id="teamX-tab" data-bs-toggle="tab" data-bs-target="#teamX">Team X</button>
</li>
```

2. Add content div:
```html
<div class="tab-pane fade" id="teamX" role="tabpanel">
    <table class="table technical-grid" id="teamXGrid">...</table>
</div>
```

3. Add mapping in `data.json`:
```json
"Team X": "Vessel Name"
```

### Custom Conditioning Rules

Modify the conditional formatting in `dashboard.js`:

```javascript
// In formatMetricCell() method
if (metricData.value > THRESHOLD) {
    statusClass = 'alert'; // or 'caution'
}
```

### Theme Customization

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #0066cc;
    --ok-color: #28a745;
    --caution-color: #ffc107;
    --alert-color: #dc3545;
}
```

## API Reference

### Dashboard Class

#### `constructor()`
Initializes the dashboard on page load.

#### `loadData()`
Loads mock data from `data.json`. Override for Metabase API integration.

#### `populateOverviewTab()`
Renders alarm log in the Overview tab.

#### `populateTeamGrid(team)`
Populates technical metrics for a specific team.

#### `getMetricsForTeam(team)`
Filters metrics by team name.

#### `formatMetricCell(metricData)`
Applies conditional styling based on metric status.

#### `filterDataByTeam(team)`
Returns filtered alarms and metrics for a team.

#### `getAggregatedMetrics(team)`
Returns aggregated statistics (total engines, active engines, caution/alert counts).

## Metabase Integration

This dashboard is designed to work with Metabase queries:

1. **Alarm Log Query**: Groups technical data by Timestamp, Vessel, Team, Engine, and Issue
2. **Technical Metrics Query**: Groups by Vessel Name and Engine with conditional formatting rules

### Conditional Formatting in Metabase

For each metric column:
- Set the range for Green (OK): 0-100% of safe operating range
- Set the range for Yellow (Caution): 100-120% of safe operating range
- Set the range for Red (Alert): >120% of safe operating range

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- Dashboard handles up to 100 technical metrics rows efficiently
- Tab switching is instant with no re-rendering lag
- Sticky headers remain visible during scroll

## Troubleshooting

### Data not loading
- Check browser console (F12) for fetch errors
- Verify `data.json` is in the project root
- Check CORS headers if loading from Metabase API

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Verify Bootstrap CDN is loading
- Check for CSS conflicts with extension styling

## License

Internal use only - Wintermar Fleet Services
