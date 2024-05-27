//dibawah ini adalah code untuk menampilkan file json ke table
// document.addEventListener("DOMContentLoaded", () => {
//     const tableBody = document.querySelector("table tbody");

//     fetch("data.json")
//         .then(response => response.json())
//         .then(data => {
//             data.forEach(item => {
//                 const row = document.createElement("tr");

//                 for (const key in item) {
//                     const cell = document.createElement("td");
//                     cell.textContent = item[key];
//                     row.appendChild(cell);
//                 }

//                 const actionCell = document.createElement("td");
//                 const updateButton = document.createElement("a");
//                 updateButton.href = "#";
//                 updateButton.classList.add("btn", "btn-update");
//                 updateButton.innerHTML = '<i class="fas fa-edit"></i> Update';
                
//                 const deleteButton = document.createElement("a");
//                 deleteButton.href = "#";
//                 deleteButton.classList.add("btn", "btn-delete");
//                 deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
                
//                 actionCell.appendChild(updateButton);
//                 actionCell.appendChild(deleteButton);
//                 row.appendChild(actionCell);

//                 tableBody.appendChild(row);
//             });
//         })
//         .catch(error => console.error("Error fetching data:", error));
// });

//dibawah ini adalah code untuk menampilkan data table 25 per page
document.addEventListener('DOMContentLoaded', function() {
    const rowsPerPage = 10;
    let currentPage = 1;
    let data = [];

    function fetchData() {
        fetch('data.json')
            .then(response => response.json())
            .then(json => {
                data = json;
                displayTable();
                updatePagination();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function displayTable() {
        const tbody = document.querySelector('#data-table tbody');
        tbody.innerHTML = '';

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = data.slice(start, end);

        pageData.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            const actionTd = document.createElement('td');
            tr.appendChild(actionTd);
            tbody.appendChild(tr);
        });
    }

    function updatePagination() {
        const totalPages = Math.ceil(data.length / rowsPerPage);
        document.getElementById('prev').disabled = currentPage === 1;
        document.getElementById('next').disabled = currentPage === totalPages;

        const pageInfo = document.getElementById('page-info');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    document.getElementById('prev').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
            updatePagination();
        }
    });

    document.getElementById('next').addEventListener('click', function() {
        const totalPages = Math.ceil(data.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayTable();
            updatePagination();
        }
    });

    fetchData();
});
