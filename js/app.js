document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openPopupBtn = document.getElementById("openPopup");
    const closePopupBtn = document.getElementById("closePopup");
    const mainContent = document.getElementById("mainContent");
    const createKeysSection = document.getElementById("createKeysSection");

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
        clearMainContent();

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

    // Function to show the "Create Keys" screen
    function showCreateKeysScreen() {
        clearMainContent();
        createKeysSection.classList.remove("d-none");
        mainContent.appendChild(createKeysSection);
    }

    // Example: Show loading, then display "Create Keys"
    showLoading("Fetching key details...");
    
    setTimeout(() => {
        showCreateKeysScreen();
    }, 3000);
});
