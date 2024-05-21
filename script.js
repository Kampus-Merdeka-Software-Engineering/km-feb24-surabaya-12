//dibawah ini adalah code untuk menampilkan file json ke table
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("table tbody");

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const row = document.createElement("tr");

                for (const key in item) {
                    const cell = document.createElement("td");
                    cell.textContent = item[key];
                    row.appendChild(cell);
                }

                const actionCell = document.createElement("td");
                const updateButton = document.createElement("a");
                updateButton.href = "#";
                updateButton.classList.add("btn", "btn-update");
                updateButton.innerHTML = '<i class="fas fa-edit"></i> Update';
                
                const deleteButton = document.createElement("a");
                deleteButton.href = "#";
                deleteButton.classList.add("btn", "btn-delete");
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
                
                actionCell.appendChild(updateButton);
                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
});

//dibawah ini adalah code untuk menampilkan data table 100 per page

