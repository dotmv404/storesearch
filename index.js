const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to search for products from both APIs
app.get("/search", async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    return res.status(400).send({ error: "Search query is required" });
  }

  try {
    // Fetch data from all APIs
    const [
      firstApiData,
      secondApiData,
      thirdApiData,
      fourApiData,
      fiveApiData,
      sixApiData,
      sevenApiData,
    ] = await Promise.all([
      fetchFirstAPI(searchQuery),
      fetchAndFilterSecondAPI(searchQuery),
      third(searchQuery),
      four(searchQuery),
      five(searchQuery),
      six(searchQuery),
      seven(searchQuery),
    ]);

    // Log the data from the fifth API to debug
    // console.log('Fifth API Data:', JSON.stringify(fiveApiData, null, 2));

    // Render products from all APIs in HTML
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Search Results</title>
    <link rel="icon" href="https://www.recordedfuture.com/favicon.ico" />

            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <header>
                   <img
  src="/store.svg"
  alt="Logo 1"
  class="responsive-image"
/>
                <form action="/search" method="get" class="search-form">
                    <input type="text" name="q" placeholder="Search for products" value="${searchQuery}">
                    <button type="submit">Search</button>
                </form>
            </header>
            <main>
        `;

    // Render products from the first API
    if (firstApiData.data && firstApiData.data.length > 0) {
      html += renderProducts(
        ' <img src="https://store.bhmtraders.com/bhm-traders-logo.svg" width="50%" height="50%" alt="bhm">',
        firstApiData.data,
        (product) => `
                <img src="${product.image}" alt="${product.description}">
                <div class="product-info">
                <div class="api-price"><h3>${product.units.CTN.price} /-</h3> </div>
                    <h3>${product.description}</h3>
                    <p>Brand: ${product.brand}</p>
                    <p>Inventory: ${product.inventory}</p>
                    <p>Status: ${product.status}</p>
                    <p>Available: ${product.available}</p>
                </div>
            `
      );
    }

    // Render products from the second API
    if (secondApiData.length > 0) {
      html += renderProducts(
        '<img src="https://www.eurostoremv.com/apple-touch-icon.png" width="20%" height="20%" alt="euro store">',
        secondApiData,
        (product) => `
                <img src="https://www.eurostoremv.com/storage/images/${product.image}" alt="${product.name}">
                <div class="product-info">
                <div class="api-price"><h3>${product.price} /-</h3> </div>

                    <h3>${product.name}</h3>
                    <p>Stock: ${product.stock}</p>
                    <p>Status: ${product.status}</p>
                    <p>Category: ${product.category.name}</p>
                </div>
            `
      );
    }

    // Render products from the third API
    if (thirdApiData.data && thirdApiData.data.length > 0) {
      html += renderProducts(
        '<img src="https://villamart.mv/_nuxt/img/vm_logo.8babdfa.svg" width="50%" height="50%"  alt="villa">',
        thirdApiData.data,
        (product) => `
                <img src="https://villamart.sgp1.cdn.digitaloceanspaces.com/site/products/${product.bc_item_number}.jpg" alt="${product.bc_item_number}">
                <div class="product-info">
                <div class="api-price"><h3>${product.bc_unit_price} /-</h3> </div>

                    <h3>${product.title}</h3>
                    <p>Inventory: ${product.bc_inventory}</p>
                    <p>In Stock: ${product.in_stock}</p>
                </div>
            `
      );
    }

    // Render products from the fourth API
    if (fourApiData.products && fourApiData.products.length > 0) {
      html += renderProducts(
        '<img src="https://ikzotrading.com/assets/assets/image/app_logo.png" width="50%" height="50%"  alt="ikio">',
        fourApiData.products,
        (product) => `
                <img src="https://me.ikzotrading.com/storage/app/public/product/${product.image[0]}" alt="${product.name}">
                <div class="product-info">
                <div class="api-price"><h3>${product.price} /-</h3> </div>

                    <h3>${product.name}</h3>
                    <p>Unit: ${product.unit}</p>
                    <p>In Stock: ${product.total_stock}</p>
                </div>
            `
      );
    }

    // Render products from the fifth API
    if (
      fiveApiData.data &&
      fiveApiData.data.products &&
      fiveApiData.data.products.length > 0
    ) {
      html += renderProducts(
        '<img src="https://play-lh.googleusercontent.com/Z2-spuF5YaGraiBmFLKJP6MOjhi0Ads2PPmpf-BOJDzXFuRsvWjxMsS7BJIKrhAJfuE=w240-h480-rw" width="20%" height="20%"  alt="gannamart"> <br/> <p> Gannamart App',
        fiveApiData.data.products,
        (product) => `
                <img src="https://app.gannamart.com/api/attachables/${product.attachable.id}/download" alt="${product.name}">
                <div class="product-info">
                <div class="api-price"><h3>${product.display_price} /-</h3> </div>

                    <h3>${product.name}</h3>
                    <p>Unit: ${product.uom}</p>
                </div>
            `
      );
    }

    if (sixApiData && sixApiData.length > 0) {
      html += renderProducts(
        '<img src="https://www.mustore.mv/web/image/website/1/logo/MU%20STORE?unique=676cd3a" width="50%" height="50%"  alt="ikio">',
        sixApiData,
        (product) => `
                <img src="https://www.mustore.mv${product.image_url}"  width="30%" height="30%" alt="x">
                <div class="product-info">
                <div class="api-price"><h3>${product.detail} /-</h3> </div>

                    <h3>${product.name}</h3>
                </div>
            `
      );
    }

    if (sevenApiData.length > 0) {
      html += renderProducts(
        '<img src="https://www.orbitgeneraltradings.com/wp-content/uploads/2024/06/cropped-Orbit-Logo-1-199x93.png" width="20%" height="20%" alt=" store">',
        sevenApiData,
        (product) => `
                  <img src="${product.images[0].src}" alt="${product.name}">
                  <div class="product-info">
                  <div class="api-price"><h3>${product.prices.price} /-</h3> </div>
  
                      <h3>${product.name}</h3>
            
                  </div>
              `
      );
    }
    // End of HTML content
    html += `
            </main>
        </body>
        </html>
        `;

    res.send(html);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Failed to fetch data from external APIs" });
  }
});

// Function to fetch data from the first API using Axios
async function fetchFirstAPI(searchQuery) {
  const apiUrl = `https://connect.bhmtraders.com/api/shop/male/products?page=1&search=${searchQuery}`;
  const response = await axios.get(apiUrl);
  return response.data;
}

// Function to fetch data from the second API and filter based on search query
async function fetchAndFilterSecondAPI(searchQuery) {
  const apiUrl = "https://www.eurostoremv.com/api/public/products";
  const response = await axios.get(apiUrl);
  const products = response.data.data;

  // Filter the products based on search query (through name only)
  return products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

// Function to fetch data from the third API
async function third(searchQuery) {
  const apiUrl = `https://base.villamart.mv/api/products?q=${searchQuery}&page=1&limit=5`;
  const response = await axios.get(apiUrl);
  return response.data;
}

// Function to fetch data from the fourth API
async function four(searchQuery) {
  const apiUrl = `https://me.ikzotrading.com/api/v1/products/search?limit=10&offset=1&name=${searchQuery}`;
  const response = await axios.get(apiUrl);
  return response.data;
}

// Function to fetch data from the fifth API
async function five(searchQuery) {
  const apiUrl = `https://app.gannamart.com/api/mobile/search?search=${searchQuery}`;
  const response = await axios.get(apiUrl);
  return response.data;
}

async function six(searchQuery) {
  const apiUrl = "https://www.mustore.mv/website/dr_search";

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    priority: "u=1, i",
    "sec-ch-ua":
      '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
  };

  const body = {
    id: 3,
    jsonrpc: "2.0",
    method: "call",
    params: {
      term: searchQuery,
      max_nb_chars: 80,
      options: {
        displayImage: true,
        displayDescription: true,
        allowFuzzy: true,
        order: "name asc",
      },
    },
  };

  try {
    const response = await axios.post(apiUrl, body, {
      headers: headers,
      referrer: "https://www.mustore.mv/theme_prime/get_products_data",
      referrerPolicy: "strict-origin-when-cross-origin",
      mode: "cors",
      withCredentials: true,
    });
    //   console.log(response.data.result.products.results)

    return response.data.result.products.results;
  } catch (error) {
    console.error("Error making request", error);
  }
}

async function seven(searchQuery) {
  const apiUrl =
    "https://www.orbitgeneraltradings.com/wp-json/wc/store/v1/products";
  const response = await axios.get(apiUrl);
  const products = response.data;
  // Filter the products based on search query (through name only)
  return products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

// Helper function to render products
function renderProducts(apiUrl, products, renderProduct) {
  let html = `
    <div class="api-section">
        <div class="api-url">
            <p>${apiUrl}</p>
        </div>
        <div class="product-list">
    `;
  products.forEach((product) => {
    html += `<div class="product-item">${renderProduct(product)}</div>`;
  });
  html += `</div></div>`;
  return html;
}

// Serve the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
