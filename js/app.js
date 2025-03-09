document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openPopupBtn = document.getElementById("openPopup");
    const closePopupBtn = document.getElementById("closePopup");
    const mainContent = document.getElementById("mainContent");

    // Open Popup
    openPopupBtn.addEventListener("click", () => {
        popup.classList.add("show");
    });

    // Close Popup
    closePopupBtn.addEventListener("click", () => {
        popup.classList.remove("show");
    });

    // Function to clear mainContent
    function clearMainContent() {
        while (mainContent.firstChild) {
            mainContent.removeChild(mainContent.firstChild);
        }
    }

    // Function to show a loading screen with a custom message
    function showLoading(message = "Loading...") {
        clearMainContent(); // Clear previous content

        const loadingDiv = document.createElement("div");
        loadingDiv.classList.add("loading-container");

        const loadingText = document.createElement("p");
        loadingText.classList.add("loading-text");
        loadingText.textContent = message;

        const spinner = document.createElement("div");
        spinner.classList.add("loading-spinner");

        loadingDiv.appendChild(loadingText);
        loadingDiv.appendChild(spinner);
        mainContent.appendChild(loadingDiv);
    }

    // Function to replace the main content with a new fullscreen section
    function replaceMainContent(content) {
        clearMainContent(); // Ensure previous content is fully removed

        // Create new fullscreen section
        const section = document.createElement("div");
        section.classList.add("fullscreen-section", "p-4");
        section.innerHTML = content;

        // Insert into mainContent
        mainContent.appendChild(section);
    }

//    replaceMainContent("<h4>Hello World</h4><p>Your data will load shortly</p>");
//
//    setTimeout(() => {
//        showLoading("Fetching your data...");
//    }, 3000);
//
//
//    // Example: Show loading before displaying content
//    setTimeout(() => {
//        replaceMainContent("<h4>Your Data</h4><p>Your Coolness: 75%</p>");
//    }, 6000);
});
