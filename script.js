document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("table tbody");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const pageInfo = document.getElementById("page-info");
    const pageSelect = document.getElementById("page-select");
    const totalRevenueElement = document.getElementById("total-revenue");
    const totalPropertiesElement = document.getElementById("total-properties");
    const sortSaleDateButton = document.getElementById("sort-sale-date");
    const resetSortSaleDateButton = document.getElementById("reset-sort-sale-date");
    const sortYearBuiltButton = document.getElementById("sort-year-built"); // Tambahkan ini
    const resetSortYearBuiltButton = document.getElementById("reset-sort-year-built");
    const sortSalePriceButton = document.getElementById("sort-sale-price"); // Tambahkan ini
    const resetSortSalePriceButton = document.getElementById("reset-sort-sale-price");
    const totalNeighborhoodElement = document.getElementById("total-neighborhood");
    const totalBuildingClassCategoryElement = document.getElementById("total-building-class-category");
    const filterNeighborhood = document.getElementById("filter-neighborhood");
    const filterBuildingClassCategory = document.getElementById("filter-building-class-category");
    const filterSaleDateYear = document.getElementById("filter-sale-date-year");


    let data = [];
    let originalData = []; 
    const rowsPerPage = 25;
    let currentPage = 1;
    let totalPages = 1;
    let sortAsc = true;

    fetch("data.json")
        .then(response => response.json())
        .then(fetchedData => {
            data = fetchedData;
            originalData = [...fetchedData];
            totalPages = Math.ceil(data.length / rowsPerPage);
            renderTable();
            updatePagination();
            createMonthlySalesChart(data); // Call the function to create the monthly sales chart
            createTotalRevenueMonthlyChart(data); // Call the function to create the total revenue monthly chart
            createBestSellingBuildingClassChart(data);
            createAverageSalesByNeighborhoodChart(data);
            createNeighborhoodSalesChart(data);
            createTotalRevenueByNeighborhoodChart(data);
            createAverageSalesByBuildingClassChart(data);
            createTotalRevenueByBuildingClassChart(data);
            displayTotalRevenue(data);
            displayTotalProperties(data);
            displayTotalNeighborhood(data); 
            displayTotalBuildingClassCategory(data); 
        })
        .catch(error => console.error("Error fetching data:", error));
        
        filterNeighborhood.addEventListener("change", applyFilters);
        filterBuildingClassCategory.addEventListener("change", applyFilters);
        filterSaleDateYear.addEventListener("change", applyFilters);

    // Fungsi untuk menerapkan filter
        function applyFilters() {
            const neighborhood = filterNeighborhood.value;
            const buildingClassCategory = filterBuildingClassCategory.value;
            const saleDateYear = filterSaleDateYear.value;

            let filteredData = originalData.filter(item => {
                return (!neighborhood || item["NEIGHBORHOOD"] === neighborhood) &&
                    (!buildingClassCategory || item["BUILDING_CLASS_CATEGORY"] === buildingClassCategory) &&
                    (!saleDateYear || item["SALE_DATE_YEAR"] === saleDateYear);
            });

            data = filteredData;
            currentPage = 1;
            renderTable();
            updatePagination();
            createMonthlySalesChart(filteredData);
            createTotalRevenueMonthlyChart(filteredData);
            createBestSellingBuildingClassChart(filteredData);
            createAverageSalesByBuildingClassChart(filteredData);
            createTotalRevenueByBuildingClassChart(filteredData);
            createNeighborhoodSalesChart(filteredData);
            createAverageSalesByNeighborhoodChart(filteredData);
            createTotalRevenueByNeighborhoodChart(filteredData);
            displayTotalRevenue(filteredData);
            displayTotalProperties(filteredData);
            displayTotalNeighborhood(filteredData); 
            displayTotalBuildingClassCategory(filteredData); 
        }

        // Event listener untuk reset nilai filter saat opsi paling atas dipilih
        filterNeighborhood.addEventListener("change", function() {
            if (filterNeighborhood.value === "") {
                resetFilters();
            }
        });

        filterBuildingClassCategory.addEventListener("change", function() {
            if (filterBuildingClassCategory.value === "") {
                resetFilters();
            }
        });

        filterSaleDateYear.addEventListener("change", function() {
            if (filterSaleDateYear.value === "") {
                resetFilters();
            }
        });

        // Fungsi untuk mereset nilai dari setiap dropdown filter
        function resetFilters() {
            filterNeighborhood.value = "";
            filterBuildingClassCategory.value = "";
            filterSaleDateYear.value = "";

            data = [...originalData];
            currentPage = 1;
            renderTable();
            updatePagination();
            createMonthlySalesChart(data);
            createTotalRevenueMonthlyChart(data);
            createBestSellingBuildingClassChart(data);
            createAverageSalesByBuildingClassChart(data);
            createTotalRevenueByBuildingClassChart(data);
            createNeighborhoodSalesChart(data);
            createAverageSalesByNeighborhoodChart(data);
            createTotalRevenueByNeighborhoodChart(data);
            displayTotalRevenue(data);
            displayTotalProperties(data);
            displayTotalNeighborhood(data); 
            displayTotalBuildingClassCategory(data); 
        }
        
        if (sortSaleDateButton) {
            sortSaleDateButton.addEventListener("click", () => {
                toggleSortOrder();
                sortDataBySaleDate();
            });
        }
    
        if (resetSortSaleDateButton) {
            resetSortSaleDateButton.addEventListener("click", () => {
                resetSortOrder();
            });
        }
    
        if (sortYearBuiltButton) {
            sortYearBuiltButton.addEventListener("click", () => {
                toggleSortOrder();
                sortDataByYearBuilt();
            });
        }
    
        if (resetSortYearBuiltButton) {
            resetSortYearBuiltButton.addEventListener("click", () => {
                resetSortOrderYearBuilt();
            });
        }
    
        if (sortSalePriceButton) { // Tambahkan ini
            sortSalePriceButton.addEventListener("click", () => {
                toggleSortOrder();
                sortDataBySalePrice();
            });
        }
    
        if (resetSortSalePriceButton) { // Tambahkan ini
            resetSortSalePriceButton.addEventListener("click", () => {
                resetSortOrderSalePrice();
            });
        }
    
        function toggleSortOrder() {
            sortAsc = !sortAsc;
        }
    
        function sortDataBySaleDate() {
            data.sort((a, b) => {
                const dateA = new Date(a["SALE_DATE"]);
                const dateB = new Date(b["SALE_DATE"]);
                if (sortAsc) {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            });
            currentPage = 1;
            renderTable();
            updatePagination();
        }
    
        function resetSortOrder() {
            data = [...originalData];
            currentPage = 1;
            renderTable();
            updatePagination();
        }
    
        function sortDataByYearBuilt() {
            data.sort((a, b) => {
                const yearA = parseInt(a["YEAR_BUILT"]);
                const yearB = parseInt(b["YEAR_BUILT"]);
                if (sortAsc) {
                    return yearA - yearB;
                } else {
                    return yearB - yearA;
                }
            });
            currentPage = 1;
            renderTable();
            updatePagination();
        }
    
        function resetSortOrderYearBuilt() {
            data = [...originalData];
            currentPage = 1;
            renderTable();
            updatePagination();
        }
    
        function sortDataBySalePrice() { // Tambahkan ini
            data.sort((a, b) => {
                const priceA = parseFloat(a["SALE_PRICE"]);
                const priceB = parseFloat(b["SALE_PRICE"]);
                if (sortAsc) {
                    return priceA - priceB;
                } else {
                    return priceB - priceA;
                }
            });
            currentPage = 1;
            renderTable();
            updatePagination();
        }
    
        function resetSortOrderSalePrice() { // Tambahkan ini
            data = [...originalData];
            currentPage = 1;
            renderTable();
            updatePagination();
        }
    
        function renderTable() {
            if (!tableBody) return;

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
            if (!pageInfo || !pageSelect) return;
        
            const totalPages = Math.ceil(data.length / rowsPerPage);
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
        
        if (prevButton) {
            prevButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderTable();
                    updatePagination();
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTable();
                    updatePagination();
                }
            });
        }
        
        if (pageSelect) {
            pageSelect.addEventListener("change", () => {
                currentPage = parseInt(pageSelect.value);
                renderTable();
                updatePagination();
            });
        }
        

        function createMonthlySalesChart(data) {
            // Create an object to store sales data for each month and year
            const monthlySalesData = {};
            data.forEach(entry => {
                const monthYear = `${entry["SALE_DATE_YEAR"]}-${entry["SALE_DATE_MONTH"].padStart(2, '0')}`;
                if (monthlySalesData[monthYear]) {
                    monthlySalesData[monthYear]++;
                } else {
                    monthlySalesData[monthYear] = 1;
                }
            });

            // Convert the object to an array and sort by year and month
            const sortedMonthlySales = Object.entries(monthlySalesData).sort(([a], [b]) => {
                const [yearA, monthA] = a.split('-').map(Number);
                const [yearB, monthB] = b.split('-').map(Number);
                return yearA - yearB || monthA - monthB;
            });

            // Extract the sorted month-year labels and sales data
            const monthsYears = sortedMonthlySales.map(([monthYear]) => monthYear);
            const sales = sortedMonthlySales.map(([, count]) => count);

            // Create chart using Chart.js
            var ctx = document.getElementById('monthly-sales-chart').getContext('2d');
            if (window.monthlySalesChart) {
                window.monthlySalesChart.destroy();
            }
            window.monthlySalesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: monthsYears,
                    datasets: [{
                        label: 'Monthly Sales',
                        data: sales,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }

        function createTotalRevenueMonthlyChart(data) {
            // Create an object to store total revenue data for each month and year
            const totalRevenueMonthlyData = {};
            data.forEach(entry => {
                const monthYear = `${entry["SALE_DATE_YEAR"]}-${entry["SALE_DATE_MONTH"].padStart(2, '0')}`;
                const revenue = parseFloat(entry["SALE_PRICE"]); // Convert SALE_PRICE to a float
                if (totalRevenueMonthlyData[monthYear]) {
                    totalRevenueMonthlyData[monthYear] += revenue;
                } else {
                    totalRevenueMonthlyData[monthYear] = revenue;
                }
            });

            // Convert the object to an array and sort by year and month
            const sortedTotalRevenue = Object.entries(totalRevenueMonthlyData).sort(([a], [b]) => {
                const [yearA, monthA] = a.split('-').map(Number);
                const [yearB, monthB] = b.split('-').map(Number);
                return yearA - yearB || monthA - monthB;
            });

            // Extract the sorted month-year labels and total revenue data
            const monthsYears = sortedTotalRevenue.map(([monthYear]) => monthYear);
            const revenue = sortedTotalRevenue.map(([, amount]) => amount);

            // Create chart using Chart.js
            var ctx = document.getElementById('total-revenue-monthly').getContext('2d');
            if (window.totalRevenueMonthlyChart) {
                window.totalRevenueMonthlyChart.destroy();
            }
            window.totalRevenueMonthlyChart = new Chart(ctx, {
                type:'line',
                data: {
                    labels: monthsYears,
                    datasets: [{
                        label: 'Total Revenue Monthly',
                        data: revenue,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }

        function createBestSellingBuildingClassChart(data) {
            // Create an object to store total sales for each building class category
            const buildingClassSalesData = {};
            data.forEach(entry => {
                const buildingClass = entry["BUILDING_CLASS_CATEGORY"];
                if (buildingClassSalesData[buildingClass]) {
                    buildingClassSalesData[buildingClass]++;
                } else {
                    buildingClassSalesData[buildingClass] = 1;
                }
            });
        
            // Convert the object to an array and sort by total sales
            const sortedBuildingClassSales = Object.entries(buildingClassSalesData).sort(([, countA], [, countB]) => countB - countA);
        
            // Extract the top 5 building class labels and total sales data
            const topBuildingClasses = sortedBuildingClassSales.slice(0, 10).map(([buildingClass]) => buildingClass);
            const topSales = sortedBuildingClassSales.slice(0, 10).map(([, count]) => count);
        
            // Create chart using Chart.js
            var ctx = document.getElementById('best-selling-building-class').getContext('2d');
            if (window.bestSellingBuildingClassChart) {
                window.bestSellingBuildingClassChart.destroy();
            }
            window.bestSellingBuildingClassChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: topBuildingClasses,
                    datasets: [{
                        label: 'Total Sales by Building Class Category',
                        data: topSales,
                        backgroundColor: 'rgb(106, 90, 205, 0.2)',
                        borderColor: 'rgb(106, 90, 205, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
        function createAverageSalesByBuildingClassChart(data) {
            // Create an object to store total sales and count of sales for each building class category
            const buildingClassSales = {};
        
            // Iterate through the data to calculate total sales and count of sales for each building class category
            data.forEach(entry => {
                const buildingClass = entry["BUILDING_CLASS_CATEGORY"];
                const salePrice = parseFloat(entry["SALE_PRICE"]); // Convert SALE_PRICE to a float
        
                // If the building class category is not yet in the buildingClassSales object, initialize it
                if (!buildingClassSales[buildingClass]) {
                    buildingClassSales[buildingClass] = { total: 0, count: 0 };
                }
        
                // Increment the total sales and count of sales for the building class category
                buildingClassSales[buildingClass].total += salePrice;
                buildingClassSales[buildingClass].count++;
            });
        
            // Calculate the average sales for each building class category
            const averageSalesByBuildingClass = {};
            for (const buildingClass in buildingClassSales) {
                const totalSales = buildingClassSales[buildingClass].total;
                const countSales = buildingClassSales[buildingClass].count;
                averageSalesByBuildingClass[buildingClass] = totalSales / countSales;
            }
        
            // Convert the object to an array of tuples and sort by average sales
            const sortedAverageSales = Object.entries(averageSalesByBuildingClass).sort(([, averageA], [, averageB]) => averageB - averageA);
        
            // Extract the building class categories and average sales data
            const buildingClassCategories = sortedAverageSales.slice(0, 5).map(([buildingClass]) => buildingClass);
            const averageSales = sortedAverageSales.slice(0, 5).map(([, average]) => average);
        
            // Create chart using Chart.js
            var ctx = document.getElementById('average-sales-by-building-class').getContext('2d');
            if (window.averageSalesByBuildingClassChart) {
                window.averageSalesByBuildingClassChart.destroy();
            }
            window.averageSalesByBuildingClassChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: buildingClassCategories,
                    datasets: [{
                        label: 'Average Sales by Building Class Category',
                        data: averageSales,
                        backgroundColor: 'rgba(252, 255, 0, 0.2)',
                        borderColor: 'rgba(252, 255, 0, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'x',
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
        function createTotalRevenueByBuildingClassChart(data) {
            // Initialize an object to store total revenue for each building class category
            const totalRevenueByBuildingClass = {};
        
            // Loop through the data to calculate total revenue for each building class category
            data.forEach(entry => {
                const buildingClass = entry["BUILDING_CLASS_CATEGORY"];
                const salePrice = parseFloat(entry["SALE_PRICE"]); // Convert SALE_PRICE to a float
        
                // If the building class already exists in the object, add the sale price to its total revenue
                if (totalRevenueByBuildingClass[buildingClass]) {
                    totalRevenueByBuildingClass[buildingClass] += salePrice;
                } 
                // If the building class doesn't exist, initialize it with the sale price
                else {
                    totalRevenueByBuildingClass[buildingClass] = salePrice;
                }
            });
        
            // Convert the object to an array of tuples
            const totalRevenueArray = Object.entries(totalRevenueByBuildingClass);
        
            // Sort the array by total revenue in descending order
            totalRevenueArray.sort(([, revenueA], [, revenueB]) => revenueB - revenueA);
        
            // Extract the building class categories and total revenue data
            const buildingClassCategories = totalRevenueArray.slice(0, 10).map(([buildingClass]) => buildingClass);
            const totalRevenue = totalRevenueArray.slice(0, 10).map(([, revenue]) => revenue);
        
            // Create chart using Chart.js
            var ctx = document.getElementById('total-revenue-by-building-class').getContext('2d');
            if (window.totalRevenueByBuildingClassChart) {
                window.totalRevenueByBuildingClassChart.destroy();
            }
            window.totalRevenueByBuildingClassChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: buildingClassCategories,
                    datasets: [{
                        label: 'Total Revenue by Building Class Category',
                        data: totalRevenue,
                        backgroundColor: 'rgba(40, 84, 33, 0.2)',
                        borderColor: 'rgba(40, 84, 33, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }                
        function createNeighborhoodSalesChart(data) {
            // Create an object to store sales data for each neighborhood
            const neighborhoodSalesData = {};
            data.forEach(entry => {
                const neighborhood = entry["NEIGHBORHOOD"];
                if (neighborhoodSalesData[neighborhood]) {
                    neighborhoodSalesData[neighborhood]++;
                } else {
                    neighborhoodSalesData[neighborhood] = 1;
                }
            });
        
            // Convert the object to an array of tuples and sort by sales
            const sortedNeighborhoodSales = Object.entries(neighborhoodSalesData).sort(([, countA], [, countB]) => countB - countA);
        
            // Extract the top 5 neighborhoods and sales data
            const topNeighborhoods = sortedNeighborhoodSales.slice(0, 10).map(([neighborhood]) => neighborhood);
            const topSales = sortedNeighborhoodSales.slice(0, 10).map(([, count]) => count);
        
            // Create chart using Chart.js
            var ctx = document.getElementById('neighborhood-sales').getContext('2d');
            if (window.neighborhoodSalesChart) {
                window.neighborhoodSalesChart.destroy();
            }
            window.neighborhoodSalesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: topNeighborhoods,
                    datasets: [{
                        label: 'Neighborhood Sales',
                        data: topSales,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
        function createAverageSalesByNeighborhoodChart(data) {
            // Create an object to store total sales and count of sales for each neighborhood
            const neighborhoodSales = {};
        
            // Iterate through the data to calculate total sales and count of sales for each neighborhood
            data.forEach(entry => {
                const neighborhood = entry["NEIGHBORHOOD"];
                const salePrice = parseFloat(entry["SALE_PRICE"]); // Convert SALE_PRICE to a float
        
                // If the neighborhood is not yet in the neighborhoodSales object, initialize it
                if (!neighborhoodSales[neighborhood]) {
                    neighborhoodSales[neighborhood] = { total: 0, count: 0 };
                }
        
                // Increment the total sales and count of sales for the neighborhood
                neighborhoodSales[neighborhood].total += salePrice;
                neighborhoodSales[neighborhood].count++;
            });
        
            // Calculate the average sales for each neighborhood
            const averageSalesByNeighborhood = {};
            for (const neighborhood in neighborhoodSales) {
                const totalSales = neighborhoodSales[neighborhood].total;
                const countSales = neighborhoodSales[neighborhood].count;
                averageSalesByNeighborhood[neighborhood] = totalSales / countSales;
            }
        
            // Convert the object to an array of tuples and sort by average sales
            const sortedAverageSales = Object.entries(averageSalesByNeighborhood).sort(([, averageA], [, averageB]) => averageB - averageA);
        
            // Extract the top 5 neighborhoods and average sales data
            const top5Neighborhoods = sortedAverageSales.slice(0, 5).map(([neighborhood]) => neighborhood);
            const top5AverageSales = sortedAverageSales.slice(0, 5).map(([, average]) => average);
        
            // Create chart using Chart.js
            var ctx = document.getElementById('average-sales-by-neighborhood').getContext('2d');
            if (window. averageSalesByNeighborhoodChart) {
                window. averageSalesByNeighborhoodChart.destroy();
            }
            window. averageSalesByNeighborhoodChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: top5Neighborhoods,
                    datasets: [{
                        label: 'Average Sales by Neighborhood',
                        data: top5AverageSales,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }        
        function createTotalRevenueByNeighborhoodChart(data) {
            // Initialize an object to store total revenue for each neighborhood
            const totalRevenueByNeighborhood = {};
        
            // Loop through the data to calculate total revenue for each neighborhood
            data.forEach(entry => {
                const neighborhood = entry["NEIGHBORHOOD"];
                const salePrice = parseFloat(entry["SALE_PRICE"]); // Convert SALE_PRICE to a float
        
                // If the neighborhood already exists in the object, add the sale price to its total revenue
                if (totalRevenueByNeighborhood[neighborhood]) {
                    totalRevenueByNeighborhood[neighborhood] += salePrice;
                } 
                // If the neighborhood doesn't exist, initialize it with the sale price
                else {
                    totalRevenueByNeighborhood[neighborhood] = salePrice;
                }
            });
        
            // Convert the object to an array of tuples
            const totalRevenueArray = Object.entries(totalRevenueByNeighborhood);
        
            // Sort the array by total revenue in descending order
            totalRevenueArray.sort(([, revenueA], [, revenueB]) => revenueB - revenueA);
        
            // Extract the top 5 neighborhoods and total revenue data
            const topNeighborhoods = totalRevenueArray.slice(0, 10).map(([neighborhood]) => neighborhood);
            const topTotalRevenue = totalRevenueArray.slice(0, 10).map(([, revenue]) => revenue);
        
            // Create chart using Chart.js
            var ctx = document.getElementById('total-revenue-by-neighborhood').getContext('2d');
            if (window. totalRevenueByNeighborhoodChart) {
                window. totalRevenueByNeighborhoodChart.destroy();
            }
            window. totalRevenueByNeighborhoodChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: topNeighborhoods,
                    datasets: [{
                        label: 'Total Revenue by Neighborhood',
                        data: topTotalRevenue,
                        backgroundColor: 'rgb(238, 130, 238, 0.2)',
                        borderColor: 'rgb(238, 130, 238, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }     
        function displayTotalRevenue(data) {
            // Hitung total pendapatan dari semua entri data
            const totalRevenue = data.reduce((total, entry) => {
                // Konversi SALE_PRICE ke tipe float
                const salePrice = parseFloat(entry["SALE_PRICE"]);
                // Tambahkan ke total pendapatan
                return total + salePrice;
            }, 0);
        
            // Periksa apakah elemen total-revenue ada
            if (totalRevenueElement) {
                // Format total pendapatan sebagai mata uang dengan 2 angka desimal
                let formattedTotalRevenue = totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
        
                // Cek apakah dua angka desimal terakhir adalah 0, jika iya, hapus angka tersebut
                if (formattedTotalRevenue.endsWith('.00')) {
                    formattedTotalRevenue = formattedTotalRevenue.slice(0, -3);
                }
        
                // Set teks elemen total-revenue dengan total pendapatan yang diformat
                totalRevenueElement.textContent = formattedTotalRevenue;
            }
        }
        function displayTotalProperties(data) {
            // Hitung total properti dari jumlah entri data
            const totalProperties = data.length;
        
            // Periksa apakah elemen total-properties ada
            if (totalPropertiesElement) {
                // Tampilkan total properti
                totalPropertiesElement.textContent = `${totalProperties}`;
            }
        }
        function displayTotalNeighborhood(data) {
            // Hitung jumlah neighborhood yang unik
            const uniqueNeighborhoods = new Set(data.map(entry => entry["NEIGHBORHOOD"])).size;

            // Periksa apakah elemen total-neighborhood ada
            if (totalNeighborhoodElement) {
                // Tampilkan total neighborhood
                totalNeighborhoodElement.textContent = `${uniqueNeighborhoods}`;
            }
        }
        function displayTotalBuildingClassCategory(data) {
            const uniqueBuildingClassCategories = new Set(data.map(item => item["BUILDING_CLASS_CATEGORY"]));
            totalBuildingClassCategoryElement.textContent = uniqueBuildingClassCategories.size;
        }
    });

