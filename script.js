const SHEET_URL = "YOUR_WEB_APP_URL"; // Replace with the Google Apps Script Web App URL

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

    data[0].forEach(header => {
        let th = document.createElement("th");
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    data.slice(1).forEach(row => {
        let tr = document.createElement("tr");
        row.forEach(cell => {
            let td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
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
        alert(result);
        fetchData(); // Reload Data
    } catch (error) {
        console.error("Error writing data:", error);
    }
}

// Load Data on Page Load
fetchData();
