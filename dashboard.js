// Metabase-compatible Dashboard Controller
class Dashboard {
    constructor() {
        this.data = null;
        this.currentTeam = 'overview';
        this.init();
    }

    async init() {
        try {
            console.log('Dashboard initializing...');
            await this.loadData();
            console.log('Data loaded successfully');
            document.title = '[Pak Hemy] Technical - LOADED'; // Show data loaded status
            this.attachTabEventListeners();
            console.log('Tab listeners attached');
            this.populateOverviewTab();
            console.log('Overview tab populated');
            this.setupTeamTabs();
            console.log('Team tabs setup complete');
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            document.title = '[Pak Hemy] Technical - ERROR';
        }
    }

    attachTabEventListeners() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Hide all panes using inline style
        const panes = document.querySelectorAll('.tab-pane');
        panes.forEach(pane => pane.style.display = 'none');

        // Show selected pane
        const selectedPane = document.getElementById(tabName);
        if (selectedPane) {
            selectedPane.style.display = 'block';
            console.log(`Switched to tab: ${tabName}`);
        }

        // Update active button styles
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === tabName;
            if (isActive) {
                btn.classList.add('border-blue-600', 'text-blue-600');
                btn.classList.remove('border-transparent', 'text-gray-600');
            } else {
                btn.classList.remove('border-blue-600', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-600');
            }
        });

        this.currentTeam = tabName;
    }

    async loadData() {
        // In production, this would fetch from Metabase API
        // For now, we're loading mock data from data.json
        try {
            const response = await fetch('data.json');
            const jsonData = await response.json();
            this.data = jsonData;
            console.log('Data loaded:', this.data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    populateOverviewTab() {
        const alarmTable = document.querySelector('#overviewAlarmLog tbody');
        if (!alarmTable) {
            console.error('Alarm table tbody not found');
            return;
        }
        
        if (!this.data || !this.data.alarmLog) {
            console.error('No alarm data available');
            return;
        }

        console.log(`Populating overview with ${this.data.alarmLog.length} alarms`);
        alarmTable.innerHTML = this.data.alarmLog.map(alarm => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">${alarm.timestamp}</td>
                <td class="px-4 py-3">${alarm.vessel}</td>
                <td class="px-4 py-3">${alarm.vessel_team}</td>
                <td class="px-4 py-3">${alarm.engine}</td>
                <td class="px-4 py-3">${alarm.issue}</td>
            </tr>
        `).join('');
    }

    populateTeamGrid(teamKey) {
        const tableId = `${teamKey}Grid`;
        const table = document.querySelector(`#${tableId} tbody`);

        if (!table) {
            console.error(`Table not found: #${tableId} tbody`);
            return;
        }

        if (!this.data || !this.data.technicalMetrics) {
            console.error('No technical metrics data available');
            return;
        }

        // Get metrics for this team
        const teamMetrics = this.getMetricsForTeam(teamKey);
        console.log(`Metrics for ${teamKey}:`, teamMetrics);
        
        if (teamMetrics.length === 0) {
            table.innerHTML = '<tr><td colspan="10" class="px-3 py-1 text-center text-gray-500">No data available</td></tr>';
            return;
        }

        // Group by vessel
        const groupedByVessel = {};
        teamMetrics.forEach(metric => {
            if (!groupedByVessel[metric.vessel]) {
                groupedByVessel[metric.vessel] = [];
            }
            groupedByVessel[metric.vessel].push(metric);
        });

        let html = '';
        Object.entries(groupedByVessel).forEach(([vessel, metrics]) => {
            // Add vessel header row with prominent styling
            html += `<tr class="vessel-header bg-blue-100 border-b-2 border-blue-300">
                <td colspan="10" class="px-3 py-2 text-sm font-bold text-blue-900">${vessel}</td>
            </tr>`;
            
            // Add metric rows for each engine
            metrics.forEach(metric => {
                html += this.createMetricRow(metric);
            });
        });

        table.innerHTML = html;
        console.log(`Populated ${teamKey} table with ${teamMetrics.length} metrics`);
    }


    getMetricsForTeam(teamKey) {
        // Map team key to team name
        const teamNames = {
            'teamC': 'Team C',
            'teamD': 'Team D',
            'teamE': 'Team E',
            'teamH': 'Team H',
            'teamI': 'Team I'
        };
        
        const teamName = teamNames[teamKey];
        const teamVessels = this.data.teamMapping[teamName];
        
        // Filter metrics by team
        return this.data.technicalMetrics.filter(metric => {
            if (Array.isArray(teamVessels)) {
                return teamVessels.includes(metric.vessel);
            }
            return metric.vessel === teamVessels;
        });
    }

    createMetricRow(metric) {
        const cells = [
            metric.engine,
            this.formatMetricCell(metric.rpm),
            this.formatMetricCell(metric.oil_pt),
            this.formatMetricCell(metric.fuel_p),
            this.formatMetricCell(metric.egt),
            this.formatMetricCell(metric.tc_temp),
            this.formatMetricCell(metric.scav_p),
            this.formatMetricCell(metric.ht_cool),
            this.formatMetricCell(metric.lt_cool),
            this.formatMetricCell(metric.start_sys)
        ];

        return `<tr class="hover:bg-gray-50">
            <td class="px-3 py-1 font-medium sticky left-0 bg-white border-r-2 border-gray-200 text-xs">${cells[0]}</td>
            <td class="px-3 py-1 text-center border-l border-gray-200 text-xs">${cells[1]}</td>
            <td class="px-3 py-1 text-center border-l border-gray-200 text-xs">${cells[2]}</td>
            <td class="px-3 py-1 text-center border-l border-gray-200 text-xs">${cells[3]}</td>
            <td class="px-3 py-1 text-center border-l border-gray-200 text-xs">${cells[4]}</td>
            <td class="px-3 py-1 text-center border-l border-gray-200 text-xs">${cells[5]}</td>
            <td class="px-3 py-1 text-center border-l border-gray-200 text-xs">${cells[6]}</td>
            <td class="px-3 py-1 text-center border-l border-gray-200 text-xs">${cells[7]}</td>
            <td class="px-3 py-1 text-center border-l border-gray-200 text-xs">${cells[8]}</td>
            <td class="px-3 py-1 text-center border-l border-gray-200 text-xs">${cells[9]}</td>
        </tr>`;
    }

    formatMetricCell(metricData) {
        // Handle null/standby values
        if (metricData.value === null || metricData.value === undefined || metricData.value === '') {
            return `<div class="metric-cell status-standby">—<span class="unit-text">${metricData.unit || 'standby'}</span></div>`;
        }

        let statusClass = 'status-' + (metricData.status || 'ok');
        
        // Determine CSS class based on status or note
        if (metricData.note) {
            if (metricData.note === 'caution' || metricData.note === 'low!') {
                statusClass = 'status-caution';
            }
            if (metricData.note === 'watch') {
                statusClass = 'status-alert';
            }
        }

        const value = metricData.value;
        const unit = metricData.unit || metricData.temp || '';
        const note = metricData.note ? `<span class="unit-text">${metricData.note}</span>` : '';

        return `<div class="metric-cell ${statusClass}">${value}${unit ? `<span class="unit-text">${unit}</span>` : ''}${note}</div>`;
    }

    setupTeamTabs() {
        console.log('Setting up team tabs...');
        const teams = ['teamC', 'teamD', 'teamE', 'teamH', 'teamI'];
        teams.forEach(teamKey => {
            console.log(`Populating ${teamKey}...`);
            this.populateTeamAlarmLog(teamKey);
            this.populateTeamKpis(teamKey);
            this.populateTeamGrid(teamKey);
        });
    }

    populateTeamAlarmLog(teamKey) {
        const tableId = `${teamKey}AlarmLog`;
        const table = document.querySelector(`#${tableId} tbody`);

        if (!table) {
            console.error(`Alarm table not found: #${tableId} tbody`);
            return;
        }

        if (!this.data || !this.data.alarmLog) {
            console.error('No alarm data available');
            return;
        }

        // Get team vessels
        const teamNames = {
            'teamC': 'Team C',
            'teamD': 'Team D',
            'teamE': 'Team E',
            'teamH': 'Team H',
            'teamI': 'Team I'
        };

        const teamName = teamNames[teamKey];
        const teamVessels = this.data.teamMapping[teamName];
        const vesselList = Array.isArray(teamVessels) ? teamVessels : [teamVessels];

        // Filter alarms by team vessels
        const teamAlarms = this.data.alarmLog.filter(alarm => vesselList.includes(alarm.vessel));

        console.log(`Populating ${teamKey} alarm log with ${teamAlarms.length} alarms`);
        
        if (teamAlarms.length === 0) {
            table.innerHTML = '<tr><td colspan="4" class="px-4 py-3 text-center text-gray-500">No alarms</td></tr>';
            return;
        }

        table.innerHTML = teamAlarms.map(alarm => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">${alarm.timestamp}</td>
                <td class="px-4 py-3">${alarm.vessel}</td>
                <td class="px-4 py-3">${alarm.engine}</td>
                <td class="px-4 py-3">${alarm.issue}</td>
            </tr>
        `).join('');
    }

    populateTeamKpis(teamKey) {
        const teamNames = {
            'teamC': 'Team C',
            'teamD': 'Team D',
            'teamE': 'Team E',
            'teamH': 'Team H',
            'teamI': 'Team I'
        };

        const teamName = teamNames[teamKey];
        const teamVessels = this.data.teamMapping[teamName];
        const vesselList = Array.isArray(teamVessels) ? teamVessels : [teamVessels];

        // Filter metrics by team vessels
        const teamMetrics = this.data.technicalMetrics.filter(metric => vesselList.includes(metric.vessel));

        // Calculate KPIs
        const onHire = vesselList.length;
        const alerts = this.data.alarmLog.filter(a => vesselList.includes(a.vessel)).length;
        const deficiency = teamMetrics.length; // Example calculation

        let oilPassed = 0, oilMonitor = 0, oilFailed = 0;
        teamMetrics.forEach(metric => {
            if (metric.oil_pt && metric.oil_pt.note === 'low!') {
                oilFailed++;
            } else if (metric.oil_pt && metric.oil_pt.status === 'caution') {
                oilMonitor++;
            } else if (metric.oil_pt) {
                oilPassed++;
            }
        });

        // Update KPI cards
        document.getElementById(`${teamKey}OnHire`).textContent = onHire;
        document.getElementById(`${teamKey}Alert`).textContent = alerts;
        document.getElementById(`${teamKey}Deficiency`).textContent = deficiency;
        document.getElementById(`${teamKey}OilPassed`).textContent = oilPassed;
        document.getElementById(`${teamKey}OilMonitor`).textContent = oilMonitor;
        document.getElementById(`${teamKey}OilFailed`).textContent = oilFailed;
    }

}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
