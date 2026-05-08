// Simple Express server for managing contacts
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let contacts = [
    { id: 1, name: "John", lastname: "Doe", sex: "male", phone: "555-1234", city: "New York", address: "123 Main St" },
    { id: 2, name: "Jane", lastname: "Smith", sex: "female", phone: "555-5678", city: "Los Angeles", address: "456 Oak Ave" },
    { id: 3, name: "Michael", lastname: "Johnson", sex: "male", phone: "555-9012", city: "Chicago", address: "789 Elm Blvd" },
    { id: 4, name: "Emily", lastname: "Davis", sex: "female", phone: "555-3456", city: "Houston", address: "321 Pine Rd" },
    { id: 5, name: "Carlos", lastname: "Garcia", sex: "male", phone: "555-7890", city: "Miami", address: "654 Maple Dr" }
];

let nextId = 6;

// API endpoints
// GET /api/contacts - Get all contacts
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

// POST /api/contacts - Create a new contact
app.post('/api/contacts', (req, res) => {
    const { name, lastname, sex, phone, city, address } = req.body;
    
    if (!name || !lastname || !sex || !phone || !city || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const contact = {
        id: nextId++,
        name,
        lastname,
        sex,
        phone,
        city,
        address
    };

    contacts.push(contact);
    res.status(201).json(contact);
});

// PUT /api/contacts/:id - Update a contact
app.put('/api/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, lastname, sex, phone, city, address } = req.body;

    const index = contacts.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Contact not found' });
    }

    if (!name || !lastname || !sex || !phone || !city || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    contacts[index] = {
        id,
        name,
        lastname,
        sex,
        phone,
        city,
        address
    };

    res.json(contacts[index]);
});

// DELETE /api/contacts/:id - Delete a contact
app.delete('/api/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = contacts.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Contact not found' });
    }

    contacts.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});