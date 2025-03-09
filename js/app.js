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

    // Function to replace the main content with a new fullscreen section
    function replaceMainContent(content) {
        // Clear previous content completely
        mainContent.innerHTML = "";

        // Create new fullscreen section
        const section = document.createElement("div");
        section.classList.add("fullscreen-section", "p-4");
        section.innerHTML = content;

        // Insert into mainContent
        mainContent.appendChild(section);
    }

    // Example: Replace content dynamically after 2 seconds
    //setTimeout(() => {
        replaceMainContent("<h3>New Fullscreen Section</h3><p>This replaces the previous content entirely.</p>");
    //}, 2000);
});
