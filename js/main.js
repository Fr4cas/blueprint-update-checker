console.log("App is running...");

// Load blueprint data from file
fetch("test/trimble-api.json")
    .then(response => response.json())
    .then(apiData => {
        const blueprint = apiData.latestBlueprint

        // Show data in HTML
        document.getElementById("version").textContent = blueprint.version;
        document.getElementById("updated").textContent = blueprint.updatedAt;
        document.getElementById("blueprint-link").href = blueprint.url;
        document.getElementById("blueprint-link").textContent = "打開藍圖";

        // Generate QR code
        new QRCode(document.getElementById("qrcode"), {
            text: blueprint.url,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
        })
            .catch(error => {
                console.error("Error loading blueprint data or generating QRCode", error);
            })

    });