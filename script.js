// Menunggu hingga konten DOM dimuat sebelum menjalankan kode
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

    // Inisialisasi data kosong
    let data = [];
    let originalData = []; 
    const rowsPerPage = 25;
    let currentPage = 1;
    let totalPages = 1;
    let sortAsc = true;

    // Mengambil data dari file JSON
    fetch("data.json")
        .then(response => response.json())
        .then(fetchedData => {
            data = fetchedData;
            originalData = [...fetchedData];
            totalPages = Math.ceil(data.length / rowsPerPage);
            renderTable();
            updatePagination();
            createMonthlySalesChart(data); 
            createTotalRevenueMonthlyChart(data); 
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
        
        // Menambahkan event listener untuk filter neighborhood
        filterNeighborhood.addEventListener("change", applyFilters);
        // Menambahkan event listener untuk filter building class category
        filterBuildingClassCategory.addEventListener("change", applyFilters);
         // Menambahkan event listener untuk filter tahun tanggal penjualan
        filterSaleDateYear.addEventListener("change", applyFilters);

    // Fungsi untuk menerapkan filter pada data
        function applyFilters() {
            const neighborhood = filterNeighborhood.value;
            const buildingClassCategory = filterBuildingClassCategory.value;
            const saleDateYear = filterSaleDateYear.value;

            // Menerapkan filter pada data asli dan menyimpan data yang difilter
            let filteredData = originalData.filter(item => {
                return (!neighborhood || item["NEIGHBORHOOD"] === neighborhood) &&
                    (!buildingClassCategory || item["BUILDING_CLASS_CATEGORY"] === buildingClassCategory) &&
                    (!saleDateYear || item["SALE_DATE_YEAR"] === saleDateYear);
            });


            // Mengupdate data yang ditampilkan, merender ulang tabel, dan elemen lainnya sesuai dengan data yang difilter
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

        // Menambahkan event listener untuk reset filter
        filterNeighborhood.addEventListener("change", function() {
            if (filterNeighborhood.value === "") {
                resetFilters();
            }
        });

        // Menambahkan event listener untuk reset filter
        filterBuildingClassCategory.addEventListener("change", function() {
            if (filterBuildingClassCategory.value === "") {
                resetFilters();
            }
        });

        // Menambahkan event listener untuk reset filter
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

            // Mengembalikan ke data asli
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
        

        // Menambahkan event listener untuk tombol sort berdasarkan sale date
        if (sortSaleDateButton) {
            sortSaleDateButton.addEventListener("click", () => {
                toggleSortOrder();
                sortDataBySaleDate();
            });
        }
    
        // Menambahkan event listener untuk reset sort berdasarkan sale date
        if (resetSortSaleDateButton) {
            resetSortSaleDateButton.addEventListener("click", () => {
                resetSortOrder();
            });
        }
    
        // Menambahkan event listener untuk tombol sort berdasarkan year built
        if (sortYearBuiltButton) {
            sortYearBuiltButton.addEventListener("click", () => {
                toggleSortOrder();
                sortDataByYearBuilt();
            });
        }
    
        // Menambahkan event listener untuk reset sort berdasarkan year built
        if (resetSortYearBuiltButton) {
            resetSortYearBuiltButton.addEventListener("click", () => {
                resetSortOrderYearBuilt();
            });
        }
    
        // Menambahkan event listener untuk tombol sort berdasarkan sale price
        if (sortSalePriceButton) { 
            sortSalePriceButton.addEventListener("click", () => {
                toggleSortOrder();
                sortDataBySalePrice();
            });
        }
    
        // Menambahkan event listener untuk reset sort berdasarkan sale price
        if (resetSortSalePriceButton) { 
            resetSortSalePriceButton.addEventListener("click", () => {
                resetSortOrderSalePrice();
            });
        }
    
        // Fungsi untuk membalikkan urutan pengurutan
        function toggleSortOrder() {
            sortAsc = !sortAsc;
        }
    
        // Fungsi untuk mengurutkan data berdasaekan sale date
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
    
        // Fungsi untuk reset pengurutan
        function resetSortOrder() {
            data = [...originalData];
            currentPage = 1;
            renderTable();
            updatePagination();
        }
    
        // Fungsi untuk mengurutkan data berdasarkan year built
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
    
        // Fungsi untuk reset pengurutan year built
        function resetSortOrderYearBuilt() {
            data = [...originalData];
            currentPage = 1;
            renderTable();
            updatePagination();
        }
    
        // Fungsi untuk mengurutkan data berdasarkan sale price
        function sortDataBySalePrice() { 
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
    
        // Fungsi untuk reset pengurutan sale price
        function resetSortOrderSalePrice() { 
            data = [...originalData];
            currentPage = 1;
            renderTable();
            updatePagination();
        }
    
        // Fungsi untuk merender tabel dengan data yang telah diurutkan atau difilter
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

        // Fungsi untuk merender elemen pagination setelah perubahan data atau halaman
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
        
        // Menambahkan event listener untuk tombol prev
        if (prevButton) {
            prevButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderTable();
                    updatePagination();
                }
            });
        }
        
        // Menambahkan event listener untuk tombol next
        if (nextButton) {
            nextButton.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTable();
                    updatePagination();
                }
            });
        }
        
        // Menambahkan event listener untuk tombol select page
        if (pageSelect) {
            pageSelect.addEventListener("change", () => {
                currentPage = parseInt(pageSelect.value);
                renderTable();
                updatePagination();
            });
        }
        
        // Fungsi untuk membuat chart monthly sales
        function createMonthlySalesChart(data) {

            // Membuat objek untuk menyimpan data penjualan bulanan
            const monthlySalesData = {};
            data.forEach(entry => {
                const monthYear = `${entry["SALE_DATE_YEAR"]}-${entry["SALE_DATE_MONTH"].padStart(2, '0')}`;
                if (monthlySalesData[monthYear]) {
                    monthlySalesData[monthYear]++;
                } else {
                    monthlySalesData[monthYear] = 1;
                }
            });

            // Mengurutkan data penjualan bulanan berdasarkan tahun dan bulan
            const sortedMonthlySales = Object.entries(monthlySalesData).sort(([a], [b]) => {
                const [yearA, monthA] = a.split('-').map(Number);
                const [yearB, monthB] = b.split('-').map(Number);
                return yearA - yearB || monthA - monthB;
            });

            // Mendapatkan label bulan dan tahun serta data penjualan
            const monthsYears = sortedMonthlySales.map(([monthYear]) => monthYear);
            const sales = sortedMonthlySales.map(([, count]) => count);

            // Membuat chart menggunakan chart.js
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

        // Fungsi untuk membuat chart total revenue monthly
        function createTotalRevenueMonthlyChart(data) {
            
            // Membuat objek untuk menyimpan data penjualan bulanan
            const totalRevenueMonthlyData = {};
            data.forEach(entry => {
                const monthYear = `${entry["SALE_DATE_YEAR"]}-${entry["SALE_DATE_MONTH"].padStart(2, '0')}`;
                const revenue = parseFloat(entry["SALE_PRICE"]); 
                if (totalRevenueMonthlyData[monthYear]) {
                    totalRevenueMonthlyData[monthYear] += revenue;
                } else {
                    totalRevenueMonthlyData[monthYear] = revenue;
                }
            });

            // Mengurutkan total pendapatan bulanan berdasarkan tahun dan bulan
            const sortedTotalRevenue = Object.entries(totalRevenueMonthlyData).sort(([a], [b]) => {
                const [yearA, monthA] = a.split('-').map(Number);
                const [yearB, monthB] = b.split('-').map(Number);
                return yearA - yearB || monthA - monthB;
            });

            // Mendapatkan label bulan dan tahun serta data pendapatan
            const monthsYears = sortedTotalRevenue.map(([monthYear]) => monthYear);
            const revenue = sortedTotalRevenue.map(([, amount]) => amount);

            // Membuat chart menggunakan chart.js
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

        // Fungsi untuk membuat chart best selling building class
        function createBestSellingBuildingClassChart(data) {
            
            // Membuat objek untuk menyimpan data penjualan per building class
            const buildingClassSalesData = {};
            data.forEach(entry => {
                const buildingClass = entry["BUILDING_CLASS_CATEGORY"];
                if (buildingClassSalesData[buildingClass]) {
                    buildingClassSalesData[buildingClass]++;
                } else {
                    buildingClassSalesData[buildingClass] = 1;
                }
            });

            // Mengonversi objek menjadi array dan mengurutkannya berdasarkan total penjualan building class
            const sortedBuildingClassSales = Object.entries(buildingClassSalesData).sort(([, countA], [, countB]) => countB - countA);
        
            // Mengambil label kategori kelas bangunan teratas dan data penjualan total
            const topBuildingClasses = sortedBuildingClassSales.slice(0, 10).map(([buildingClass]) => buildingClass);
            const topSales = sortedBuildingClassSales.slice(0, 10).map(([, count]) => count);
        
            // Membuat chart menggunakan chart.js
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
            // Membuat objek untuk menyimpan total penjualan dan jumlah penjualan untuk setiap kategori kelas bangunan
            const buildingClassSales = {};
        
            // iterasi data untuk menghitung total penjualan dan jumlah penjualan untuk setiap building class category
            data.forEach(entry => {
                const buildingClass = entry["BUILDING_CLASS_CATEGORY"];
                const salePrice = parseFloat(entry["SALE_PRICE"]); 
        
                // inisialisasi building class jika belum ada di objek
                if (!buildingClassSales[buildingClass]) {
                    buildingClassSales[buildingClass] = { total: 0, count: 0 };
                }
        
                // Menambah total penjualan dan jumlah penjualan untuk building class category
                buildingClassSales[buildingClass].total += salePrice;
                buildingClassSales[buildingClass].count++;
            });
        
            // Hitung rata-rata penjualan untuk setiap kategori building class
            const averageSalesByBuildingClass = {};
            for (const buildingClass in buildingClassSales) {
                const totalSales = buildingClassSales[buildingClass].total;
                const countSales = buildingClassSales[buildingClass].count;
                averageSalesByBuildingClass[buildingClass] = totalSales / countSales;
            }
        
            // Ubah objek menjadi array tuples dan urutkan berdasarkan penjualan rata-rata
            const sortedAverageSales = Object.entries(averageSalesByBuildingClass).sort(([, averageA], [, averageB]) => averageB - averageA);
        
            // Ekstrak building class category dan data penjualan rata-rata
            const buildingClassCategories = sortedAverageSales.slice(0, 5).map(([buildingClass]) => buildingClass);
            const averageSales = sortedAverageSales.slice(0, 5).map(([, average]) => average);
        
            // Membuat chart menggunakan chart.js
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

            // Inisialisasi objek untuk menyimpan total pendapatan untuk setiap kategori kelas bangunan
            const totalRevenueByBuildingClass = {};
        
            // Loop melalui data untuk menghitung total pendapatan untuk setiap kategori kelas bangunan
            data.forEach(entry => {
                const buildingClass = entry["BUILDING_CLASS_CATEGORY"];
                const salePrice = parseFloat(entry["SALE_PRICE"]); 
        
                // Jika kelas bangunan sudah ada dalam objek, tambahkan harga penjualan ke total pendapatannya
                if (totalRevenueByBuildingClass[buildingClass]) {
                    totalRevenueByBuildingClass[buildingClass] += salePrice;
                } 
                
                // Jika kelas bangunan belum ada, inisialisasi dengan harga penjualan
                else {
                    totalRevenueByBuildingClass[buildingClass] = salePrice;
                }
            });
        
            // Mengonversi objek menjadi array tupel
            const totalRevenueArray = Object.entries(totalRevenueByBuildingClass);
        
            // Mengurutkan array berdasarkan total pendapatan secara menurun
            totalRevenueArray.sort(([, revenueA], [, revenueB]) => revenueB - revenueA);
        
             // Mendapatkan kategori kelas bangunan dan data total pendapatan
            const buildingClassCategories = totalRevenueArray.slice(0, 10).map(([buildingClass]) => buildingClass);
            const totalRevenue = totalRevenueArray.slice(0, 10).map(([, revenue]) => revenue);
        
            // Membuat chart menggunakan chart.js
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
        
        // Fungsi untuk membuat grafik penjualan berdasarkan neighborhood
        function createNeighborhoodSalesChart(data) {
            
            // Membuat objek untuk menyimpan data penjualan untuk setiap neigborhood
            const neighborhoodSalesData = {};
            data.forEach(entry => {
                const neighborhood = entry["NEIGHBORHOOD"];
                if (neighborhoodSalesData[neighborhood]) {
                    neighborhoodSalesData[neighborhood]++;
                } else {
                    neighborhoodSalesData[neighborhood] = 1;
                }
            });
        
            // Mengonversi objek menjadi array tupel dan mengurutkannya berdasarkan penjualan
            const sortedNeighborhoodSales = Object.entries(neighborhoodSalesData).sort(([, countA], [, countB]) => countB - countA);
        
           // Mendapatkan 10 neigborhood teratas dan data penjualan
            const topNeighborhoods = sortedNeighborhoodSales.slice(0, 10).map(([neighborhood]) => neighborhood);
            const topSales = sortedNeighborhoodSales.slice(0, 10).map(([, count]) => count);
        
            // Membuat chart menggunakan chart.js
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
        
        // Fungsi untuk membuat grafik rata-rata penjualan berdasarkan neigborhood
        function createAverageSalesByNeighborhoodChart(data) {
            
            // Membuat objek untuk menyimpan total penjualan dan jumlah penjualan untuk setiap neigborhood
            const neighborhoodSales = {};
        
            // iterasi data untuk menghitung total penjualan dan jumlah penjualan untuk setiap neigborhood
            data.forEach(entry => {
                const neighborhood = entry["NEIGHBORHOOD"];
                const salePrice = parseFloat(entry["SALE_PRICE"]); 
        
                // mengecek apakah neigborhood sudah ada di objek, jika belum ada inisialisasi
                if (!neighborhoodSales[neighborhood]) {
                    neighborhoodSales[neighborhood] = { total: 0, count: 0 };
                }
        
                // menambah total penjualan dan chalk penjualan untuk neigborhood
                neighborhoodSales[neighborhood].total += salePrice;
                neighborhoodSales[neighborhood].count++;
            });
        
            // menghitung rata-rata penjualan untuk setiap neigborhood
            const averageSalesByNeighborhood = {};
            for (const neighborhood in neighborhoodSales) {
                const totalSales = neighborhoodSales[neighborhood].total;
                const countSales = neighborhoodSales[neighborhood].count;
                averageSalesByNeighborhood[neighborhood] = totalSales / countSales;
            }
        
            // mengurutkan objek berdasarkan penjualan rata-rata
            const sortedAverageSales = Object.entries(averageSalesByNeighborhood).sort(([, averageA], [, averageB]) => averageB - averageA);
        
            // mendapatkan 5 neigborhood teratas dan rata-rata penjualan
            const top5Neighborhoods = sortedAverageSales.slice(0, 5).map(([neighborhood]) => neighborhood);
            const top5AverageSales = sortedAverageSales.slice(0, 5).map(([, average]) => average);
        
            // membuat chart menggunakan chart.js
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

        // Fungsi untuk membuat grafik total penjualan berdasarkan neigborhood
        function createTotalRevenueByNeighborhoodChart(data) {
            // Inisialisasi objek untuk menyimpan total pendapatan untuk setiap neigborhood
            const totalRevenueByNeighborhood = {};

            // Loop melalui data untuk menghitung total pendapatan untuk setiap neigborhood
            data.forEach(entry => {
                const neighborhood = entry["NEIGHBORHOOD"];
                const salePrice = parseFloat(entry["SALE_PRICE"]); 
        
                 // Jika lingkungan sudah ada dalam objek, tambahkan harga penjualan ke total pendapatannya
                if (totalRevenueByNeighborhood[neighborhood]) {
                    totalRevenueByNeighborhood[neighborhood] += salePrice;
                } 

                // Jika lingkungan belum ada, inisialisasi dengan harga penjualan
                else {
                    totalRevenueByNeighborhood[neighborhood] = salePrice;
                }
            });
            
            // Mengonversi objek menjadi array tupel
            const totalRevenueArray = Object.entries(totalRevenueByNeighborhood);
        
            // Mengurutkan array berdasarkan total pendapatan secara menurun
            totalRevenueArray.sort(([, revenueA], [, revenueB]) => revenueB - revenueA);
        
            // Mendapatkan 10 neigborhood teratas dan total pendapatan  
            const topNeighborhoods = totalRevenueArray.slice(0, 10).map(([neighborhood]) => neighborhood);
            const topTotalRevenue = totalRevenueArray.slice(0, 10).map(([, revenue]) => revenue);
        
            // membuat chart menggunakan chart.js
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

