import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-api-reference',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-reference.component.html',
  styleUrl: './api-reference.component.css'
})
export class ApiReferenceComponent {
  isObject(val: any): boolean {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }
  
  deviceReadingEndpoints = [
    {
      name: 'Web Interface (Authenticated)',
      method: 'GET',
      endpoint: '/api/devices/readings/',
      description: 'List all device readings (temperature, soil moisture)',
      response: 'List of all sensor readings with timestamps',
      fields: [
        { name: 'temperature', type: 'number', description: 'Temperature reading in Celsius' },
        { name: 'soil_moisture', type: 'number', description: 'Soil moisture percentage' },
        { name: 'timestamp', type: 'string', description: 'Time when reading was taken' },
        { name: 'device_id', type: 'string', description: 'Unique identifier for the device' }
      ]
    },
    {
      name: 'IoT Device Specific (Unauthenticated)',
      method: 'GET',
      endpoint: '/api/iot/readings/',
      description: 'Get all sensor readings from IoT devices',
      response: 'Same data as the web interface endpoint but doesn\'t require authentication',
      fields: [
        { name: 'temperature', type: 'number', description: 'Temperature reading in Celsius' },
        { name: 'soil_moisture', type: 'number', description: 'Soil moisture percentage' },
        { name: 'timestamp', type: 'string', description: 'Time when reading was taken' },
        { name: 'device_id', type: 'string', description: 'Unique identifier for the device' }
      ]
    },
    {
      name: 'IoT Device Data Submission',
      method: 'POST',
      endpoint: '/api/iot/readings/',
      description: 'Send sensor data from IoT device',
      requestBody: {
        temperature: 25.5,
        soil_moisture: 65,
        device_id: 'ESP32-DEVICE1'
      },
      response: 'Confirmation of data received'
    }
  ];

  pumpControlEndpoints = [
    {
      name: 'Web Interface (Authenticated)',
      method: 'GET',
      endpoint: '/api/devices/pump-control/',
      description: 'Get all pump control commands',
      response: 'Information about pump status (ON/OFF)',
      fields: [
        { name: 'status', type: 'string', description: 'ON or OFF' },
        { name: 'control_type', type: 'string', description: 'MANUAL or AUTOMATIC' },
        { name: 'controlled_by', type: 'string', description: 'User who controlled the pump' },
        { name: 'timestamp', type: 'string', description: 'When the command was issued' }
      ]
    },
    {
      name: 'IoT Device Specific (Unauthenticated)',
      method: 'GET',
      endpoint: '/api/iot/pump-control/',
      description: 'Get pump control commands for IoT devices',
      response: 'Latest pump control status that should be executed by the device',
      fields: [
        { name: 'status', type: 'string', description: 'ON or OFF' }
      ]
    },
    {
      name: 'Set Pump Status (Web Interface)',
      method: 'POST',
      endpoint: '/api/devices/pump-control/',
      description: 'Set pump status from web interface',
      requestBody: {
        status: 'ON',
        control_type: 'MANUAL'
      },
      response: 'Confirmation of status update'
    }
  ];

  irrigationEventEndpoints = [
    {
      name: 'Get Irrigation Events',
      method: 'GET',
      endpoint: '/api/devices/irrigation-events/',
      description: 'List all irrigation events',
      response: 'History of irrigation events including duration, water consumption',
      fields: [
        { name: 'duration_minutes', type: 'number', description: 'How long the irrigation ran' },
        { name: 'water_consumed_liters', type: 'number', description: 'How much water was used' },
        { name: 'timestamp', type: 'string', description: 'When the irrigation occurred' },
        { name: 'created_by', type: 'string', description: 'User who initiated the irrigation' },
        { name: 'notes', type: 'string', description: 'Additional information' }
      ]
    },
    {
      name: 'Create Irrigation Event',
      method: 'POST',
      endpoint: '/api/devices/irrigation-events/',
      description: 'Record a new irrigation event',
      requestBody: {
        duration_minutes: 30,
        water_consumed_liters: 250,
        notes: 'Automatic irrigation based on soil moisture threshold'
      },
      response: 'Confirmation of event creation'
    }
  ];

  authEndpoints = [
    {
      name: 'Login',
      method: 'POST',
      endpoint: '/api/auth/login/',
      description: 'Authenticate and get JWT tokens',
      requestBody: {
        username: 'user@example.com',
        password: 'password'
      },
      response: {
        access: 'eyJ0eXAiOiJKV1QiLCJhbGc...',
        refresh: 'eyJ0eXAiOiJKV1QiLCJhbGc...'
      }
    }
  ];
}