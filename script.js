// Load and parse local JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Function to update HTML content based on parsed data
    function updateDashboard(data) {
      createMonthlySalesChart(data);
      createTotalRevenueMonthlyChart(data);
      createBestSellingBuildingClassChart(data);
      createAverageSalesByNeighborhoodChart(data);
      createNeighborhoodSalesChart(data);
      createTotalRevenueByNeighborhoodChart(data);
    }

    // Function to create monthly sales chart using Chart.js
    function createMonthlySalesChart(data) {
      // Filter data to get sales data for each month
      const monthlySalesData = {};
      data.forEach(entry => {
        const month = entry["SALEDATE_MONTH"];
        if (monthlySalesData[month]) {
          monthlySalesData[month]++;
        } else {
          monthlySalesData[month] = 1;
        }
      });

      // Extract months and sales from the filtered data
      const months = Object.keys(monthlySalesData);
      const sales = Object.values(monthlySalesData);

      // Create chart using Chart.js
      var ctx = document.getElementById('monthly-sales-chart').getContext('2d');
      var monthlySalesChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: months,
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

    // Function to create total revenue monthly chart using Chart.js
    function createTotalRevenueMonthlyChart(data) {
      // Filter data to get total revenue for each month
      const totalRevenueMonthlyData = {};
      data.forEach(entry => {
        const month = entry["SALEDATE_MONTH"];
        if (totalRevenueMonthlyData[month]) {
          totalRevenueMonthlyData[month] += entry["SALEPRICE"];
        } else {
          totalRevenueMonthlyData[month] = entry["SALEPRICE"];
        }
      });

      // Extract months and total revenue from the filtered data
      const months = Object.keys(totalRevenueMonthlyData);
      const revenue = Object.values(totalRevenueMonthlyData);

      // Create chart using Chart.js
      var ctx = document.getElementById('total-revenue-monthly').getContext('2d');
      var totalRevenueMonthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: months,
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

    // Function to create chart for best-selling building class
    function createBestSellingBuildingClassChart(data) {
      // Count occurrences of each building class
      const buildingClassCounts = {};
      data.forEach(entry => {
        const buildingClass = entry["BUILDINGCLASSATTIMEOFSALE"];
        if (buildingClassCounts[buildingClass]) {
          buildingClassCounts[buildingClass]++;
        } else {
          buildingClassCounts[buildingClass] = 1;
        }
      });

      // Find the building class with the highest count
      let bestSellingBuildingClass = "";
      let maxCount = 0;
      for (const buildingClass in buildingClassCounts) {
        if (buildingClassCounts[buildingClass] > maxCount) {
          bestSellingBuildingClass = buildingClass;
          maxCount = buildingClassCounts[buildingClass];
        }
      }

      // Create chart using Chart.js
      var ctx = document.getElementById('best-selling-building-class').getContext('2d');
      var bestSellingBuildingClassChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [bestSellingBuildingClass],
          datasets: [{
            label: 'Best-selling Building Class',
            data: [maxCount],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
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
    // Function to create chart for average sales by neighborhood
    function createAverageSalesByNeighborhoodChart(data) {
      // Create an object to store total sales and count of sales for each neighborhood
      const neighborhoodSales = {};
      
      // Iterate through the data to calculate total sales and count of sales for each neighborhood
      data.forEach(entry => {
        const neighborhood = entry["NEIGHBORHOOD"];
        const salePrice = entry["SALEPRICE"];
        
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
      
      // Extract neighborhoods and average sales from the calculated data
      const neighborhoods = Object.keys(averageSalesByNeighborhood);
      const averageSales = Object.values(averageSalesByNeighborhood);
      
      // Create chart using Chart.js
      var ctx = document.getElementById('average-sales-by-neighborhood').getContext('2d');
      var averageSalesByNeighborhoodChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: neighborhoods,
          datasets: [{
            label: 'Average Sales by Neighborhood',
            data: averageSales,
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
// Function to create neighborhood sales chart using Chart.js
    function createNeighborhoodSalesChart(data) {
      // Filter data to get sales data for each neighborhood
      const neighborhoodSalesData = {};
      data.forEach(entry => {
        const neighborhood = entry["NEIGHBORHOOD"];
        if (neighborhoodSalesData[neighborhood]) {
          neighborhoodSalesData[neighborhood] += 1;
        } else {
          neighborhoodSalesData[neighborhood] = 1;
        }
      });

      // Extract neighborhoods and sales from the filtered data
      const neighborhoods = Object.keys(neighborhoodSalesData);
      const sales = Object.values(neighborhoodSalesData);

      // Create chart using Chart.js
      var ctx = document.getElementById('neighborhood-sales').getContext('2d');
      var neighborhoodSalesChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: neighborhoods,
          datasets: [{
            label: 'Neighborhood Sales',
            data: sales,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
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
    // Function to create total revenue by neighborhood chart using Chart.js
    function createTotalRevenueByNeighborhoodChart(data) {
      // Initialize an object to store total revenue for each neighborhood
      const totalRevenueByNeighborhood = {};

      // Loop through the data to calculate total revenue for each neighborhood
      data.forEach(entry => {
        const neighborhood = entry["NEIGHBORHOOD"];
        const salePrice = entry["SALEPRICE"];

        // If the neighborhood already exists in the object, add the sale price to its total revenue
        if (totalRevenueByNeighborhood[neighborhood]) {
          totalRevenueByNeighborhood[neighborhood] += salePrice;
        } 
        // If the neighborhood doesn't exist, initialize it with the sale price
        else {
          totalRevenueByNeighborhood[neighborhood] = salePrice;
        }
      });

      // Extract neighborhoods and total revenue from the object
      const neighborhoods = Object.keys(totalRevenueByNeighborhood);
      const totalRevenue = Object.values(totalRevenueByNeighborhood);

      // Create chart using Chart.js
      var ctx = document.getElementById('total-revenue-by-neighborhood').getContext('2d');
      var totalRevenueByNeighborhoodChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: neighborhoods,
          datasets: [{
            label: 'Total Revenue by Neighborhood',
            data: totalRevenue,
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

    // Initial update of dashboard with all data
    updateDashboard(data);
  })
  .catch(error => console.error('Error loading JSON file:', error));
