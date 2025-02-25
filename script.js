const SHEET_URL = "https://script.google.com/macros/s/AKfycbwWY5BiJHAcYeTZGcdmoM0smqdmK4ke-dQxnnYb2phOv6Ga8a1LThsSV6t91DFaQK57/exec"; // Replace with the Google Apps Script Web App UR

// Read Data
async function fetchData() {
    try {
        let response = await fetch(SHEET_URL);
        let data = await response.json();
        displayData(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayData(data) {
    const tableHeader = document.getElementById("table-header");
    const tableBody = document.getElementById("table-body");

    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    // Create table headers
    data[0].forEach(header => {
        let th = document.createElement("th");
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    // Add "Actions" column
    let th = document.createElement("th");
    th.textContent = "Actions";
    tableHeader.appendChild(th);

    // Populate table rows
    data.slice(1).forEach((row, rowIndex) => {
        let tr = document.createElement("tr");
        
        row.forEach(cell => {
            let td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });

        // Add Edit & Delete Buttons
        let actionTd = document.createElement("td");
        actionTd.innerHTML = `
            <button onclick="editRow(${rowIndex + 1})">Edit</button>
            <button onclick="deleteRow(${rowIndex + 1})">Delete</button>
        `;
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
    });
}

//rowIndex is 1-based
async function editRow(row) {
    let newData = prompt("Enter new data (comma-separated):");
    if (!newData) return;
    
    let payload = { action: "update", row: row, data: newData.split(",") };
    
    let response = await fetch(SHEET_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    });

    alert(await response.text());
    fetchData(); // Reload Data
}

async function deleteRow(row) {
    let confirmDelete = confirm("Are you sure you want to delete this row?");
    if (!confirmDelete) return;

    let payload = { action: "delete", row: row };
    
    let response = await fetch(SHEET_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    });

    alert(await response.text());
    fetchData(); // Reload Data
}



// Write Data
async function writeToSheet() {
    const data1 = document.getElementById("data1").value;
    const data2 = document.getElementById("data2").value;
    
    if (!data1 || !data2) {
        alert("Please enter all fields!");
        return;
    }

    let payload = { data: [data1, data2] };

    try {
        let response = await fetch(SHEET_URL, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });

        let result = await response.text();
        alert(result); // Shows "Success" if writing works
        fetchData(); // Reload Data
    } catch (error) {
        console.error("Error writing data:", error);
    }
}


// Load Data on Page Load
fetchData();
