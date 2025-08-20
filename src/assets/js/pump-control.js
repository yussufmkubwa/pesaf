// Pump Control with Blynk API Integration
// This script implements a special pump control sequence with debouncing

// Configuration
const BLYNK_TOKEN = "oM1I_kX96wCPnfZe5vM8xTmzy84hW65p";
const API_BASE_URL = "https://ny3.blynk.cloud/external/api";
const TEMP_PIN = "V0";
const SOIL_PIN = "V1";
const PUMP_PIN = "V2";
const UPDATE_INTERVAL = 5000; // 5 seconds

// State tracking
let isPumpRunning = false;
let isProcessing = false;
let lastClickTime = 0;
const DEBOUNCE_DELAY = 1000; // 1 second debounce

// DOM Elements (to be initialized when DOM is ready)
let tempDisplay;
let soilDisplay;
let pumpButton;
let statusDisplay;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    tempDisplay = document.getElementById('tempDisplay');
    soilDisplay = document.getElementById('soilDisplay');
    pumpButton = document.getElementById('pumpButton');
    statusDisplay = document.getElementById('statusDisplay');
    
    // Set up event listener for pump button
    if (pumpButton) {
        pumpButton.addEventListener('click', handlePumpButtonClick);
    }
    
    // Initial data fetch and start polling
    fetchSensorData();
    syncPumpState();
    setInterval(() => {
        fetchSensorData();
        // Only sync pump state if we're not in the middle of a sequence
        if (!isProcessing) {
            syncPumpState();
        }
    }, UPDATE_INTERVAL);
});

// Fetch temperature and soil moisture data
async function fetchSensorData() {
    try {
        // Fetch temperature
        const tempResponse = await fetch(`${API_BASE_URL}/get?token=${BLYNK_TOKEN}&pin=${TEMP_PIN}`);
        const tempData = await tempResponse.text();
        
        // Fetch soil moisture
        const soilResponse = await fetch(`${API_BASE_URL}/get?token=${BLYNK_TOKEN}&pin=${SOIL_PIN}`);
        const soilData = await soilResponse.text();
        
        // Update UI
        if (tempDisplay) tempDisplay.textContent = `${tempData} °C`;
        if (soilDisplay) soilDisplay.textContent = `${soilData} %`;
    } catch (error) {
        console.error("Error fetching sensor data:", error);
        updateStatus("Error fetching sensor data");
    }
}

// Sync pump state with Blynk
async function syncPumpState() {
    try {
        // We don't sync if we're currently processing a command
        if (isProcessing) return;
        
        // We maintain our own state logic rather than relying solely on the Blynk pin value
        updatePumpButton();
    } catch (error) {
        console.error("Error syncing pump state:", error);
    }
}

// Handle pump button click with debounce
function handlePumpButtonClick() {
    const currentTime = Date.now();
    
    // Debounce protection
    if (currentTime - lastClickTime < DEBOUNCE_DELAY) {
        updateStatus("Please wait before clicking again");
        return;
    }
    lastClickTime = currentTime;
    
    // Prevent multiple clicks during processing
    if (isProcessing) {
        updateStatus("Processing previous command...");
        return;
    }
    
    // Toggle pump state
    togglePump();
}

// Toggle pump with appropriate sequence
async function togglePump() {
    setProcessing(true);
    
    try {
        if (!isPumpRunning) {
            // START PUMP: OFF → ON → OFF sequence
            await startPumpSequence();
            isPumpRunning = true;
        } else {
            // STOP PUMP: OFF → ON sequence
            await stopPumpSequence();
            isPumpRunning = false;
        }
    } catch (error) {
        console.error("Error controlling pump:", error);
        updateStatus("Error controlling pump");
    } finally {
        setProcessing(false);
        updatePumpButton();
    }
}

// START PUMP SEQUENCE: OFF → ON → OFF
async function startPumpSequence() {
    updateStatus("Starting pump: OFF → ON → OFF");
    
    // Step 1: Ensure OFF state
    await sendPumpCommand(0);
    
    // Step 2: Turn ON after a delay
    await delay(500);
    await sendPumpCommand(1);
    
    // Step 3: Turn OFF after a delay (pump should now be running)
    await delay(500);
    await sendPumpCommand(0);
    
    updateStatus("Pump started successfully");
}

// STOP PUMP SEQUENCE: OFF → ON
async function stopPumpSequence() {
    updateStatus("Stopping pump: OFF → ON");
    
    // Step 1: Ensure OFF state
    await sendPumpCommand(0);
    
    // Step 2: Turn ON (this stops the pump)
    await delay(500);
    await sendPumpCommand(1);
    
    updateStatus("Pump stopped successfully");
}

// Send a single command to the Blynk API
async function sendPumpCommand(value) {
    try {
        const url = `${API_BASE_URL}/update?token=${BLYNK_TOKEN}&pin=${PUMP_PIN}&value=${value}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log(`Pump command sent: ${value}`);
        return true;
    } catch (error) {
        console.error(`Failed to send pump command ${value}:`, error);
        throw error;
    }
}

// Utility function for delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Update the pump button appearance and text
function updatePumpButton() {
    if (!pumpButton) return;
    
    if (isProcessing) {
        pumpButton.textContent = "Processing...";
        pumpButton.className = "processing";
        pumpButton.disabled = true;
    } else {
        pumpButton.disabled = false;
        
        if (isPumpRunning) {
            pumpButton.textContent = "Pump ON";
            pumpButton.className = "on";
        } else {
            pumpButton.textContent = "Pump OFF";
            pumpButton.className = "off";
        }
    }
}

// Set processing state
function setProcessing(processing) {
    isProcessing = processing;
    updatePumpButton();
}

// Update status message
function updateStatus(message) {
    if (statusDisplay) {
        statusDisplay.textContent = message;
        
        // Auto-clear status after 3 seconds
        setTimeout(() => {
            if (statusDisplay.textContent === message) {
                statusDisplay.textContent = isPumpRunning ? "Pump is ON" : "Pump is OFF";
            }
        }, 3000);
    }
}