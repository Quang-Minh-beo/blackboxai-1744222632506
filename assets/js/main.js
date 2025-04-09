// Main functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.md\\:hidden');
    const mobileMenu = document.querySelector('.hidden.md\\:flex');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            mobileMenu.classList.toggle('flex-col');
            mobileMenu.classList.toggle('absolute');
            mobileMenu.classList.toggle('top-16');
            mobileMenu.classList.toggle('left-0');
            mobileMenu.classList.toggle('right-0');
            mobileMenu.classList.toggle('bg-white');
            mobileMenu.classList.toggle('p-4');
            mobileMenu.classList.toggle('shadow-md');
        });
    }

    // Search functionality
    const searchInput = document.querySelector('input[type="text"]');
    const searchButton = document.querySelector('.fa-search')?.parentElement;

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // In a real implementation, this would redirect to search results
                alert(`Searching for: ${searchTerm}`);
                // window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    alert(`Searching for: ${searchTerm}`);
                    // window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
    }

    // Quantity selector
    const quantityMinus = document.querySelector('.quantity-selector button:first-child');
    const quantityPlus = document.querySelector('.quantity-selector button:last-child');
    const quantityDisplay = document.querySelector('.quantity-selector span');

    if (quantityMinus && quantityPlus && quantityDisplay) {
        quantityMinus.addEventListener('click', function() {
            let quantity = parseInt(quantityDisplay.textContent);
            if (quantity > 1) {
                quantityDisplay.textContent = quantity - 1;
            }
        });

        quantityPlus.addEventListener('click', function() {
            let quantity = parseInt(quantityDisplay.textContent);
            quantityDisplay.textContent = quantity + 1;
        });
    }
});

// Product filtering functionality
function filterProducts(category) {
    // This would be implemented when we have actual product listings
    console.log(`Filtering by category: ${category}`);
}

// Product image gallery
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = thumbnail.src;
        
        // Update active thumbnail
        const thumbnails = document.querySelectorAll('.product-gallery img');
        thumbnails.forEach(img => {
            img.classList.remove('border-indigo-500');
            img.classList.add('border-transparent');
        });
        thumbnail.classList.add('border-indigo-500');
        thumbnail.classList.remove('border-transparent');
    }
}

// Product tabs
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.querySelectorAll("#productTabs button");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("border-indigo-600", "text-indigo-600");
        tablinks[i].classList.add("border-transparent");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("border-indigo-600", "text-indigo-600");
    evt.currentTarget.classList.remove("border-transparent");
}

// Initialize first tab as active if on product page
if (document.getElementById('productTabs')) {
    document.querySelector("#productTabs button").click();
}
