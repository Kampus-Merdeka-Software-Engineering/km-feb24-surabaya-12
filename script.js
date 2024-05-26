document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("table tbody");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const pageInfo = document.getElementById("page-info");
    const pageSelect = document.getElementById("page-select");

    let data = [];
    const rowsPerPage = 25;
    let currentPage = 1;
    let totalPages = 1;

    fetch("data.json")
        .then(response => response.json())
        .then(fetchedData => {
            data = fetchedData;
            totalPages = Math.ceil(data.length / rowsPerPage);
            renderTable();
            updatePagination();
        })
        .catch(error => console.error("Error fetching data:", error));

    function renderTable() {
        tableBody.innerHTML = "";
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = data.slice(start, end);

        pageData.forEach(item => {
            const row = document.createElement("tr");
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const cell = document.createElement("td");
                    cell.textContent = item[key];
                    row.appendChild(cell);
                }
            }
            tableBody.appendChild(row);
        });
    }

    function updatePagination() {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        pageSelect.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            if (i === currentPage) {
                option.selected = true;
            }
            pageSelect.appendChild(option);
        }

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            updatePagination();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            updatePagination();
        }
    });

    pageSelect.addEventListener("change", () => {
        currentPage = parseInt(pageSelect.value);
        renderTable();
        updatePagination();
    });
});
