document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    const loader = document.getElementById('loader');

    function showLoader() {
        loader.style.display = 'block';
        searchResults.innerHTML = '';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }
    function displayResults(books) {
        if (!books || books.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }

        searchResults.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            const imageUrl = book.imageLink || book.image || book.cover || 'https://via.placeholder.com/80x120?text=No+Image';
            
            bookItem.innerHTML = `
                <img src="${imageUrl}" 
                     alt="${book.title || 'Book'}" 
                     class="book-image" 
                     onerror="this.src='https://via.placeholder.com/80x120?text=No+Image'">
                <div class="book-info">
                    <h5 class="book-title">${book.title || 'Unknown Title'}</h5>
                    <p class="book-author">${book.author || 'Unknown Author'}</p>
                </div>
            `;
            
            searchResults.appendChild(bookItem);
        });
    }
    async function searchBooks(searchTerm) {
        try {
            showLoader();
            
            const url = `https://apis.ccbp.in/book-store?title=${encodeURIComponent(searchTerm)}`;
            console.log('Searching for:', searchTerm);
            console.log('API URL:', url);
            
            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            let books = [];
            
            if (Array.isArray(data)) {
                books = data;
            } else if (data && data.books && Array.isArray(data.books)) {
                books = data.books;
            } else if (data && data.data && Array.isArray(data.data)) {
                books = data.data;
            } else if (data && data.results && Array.isArray(data.results)) {
                books = data.results;
            } else if (data && typeof data === 'object') {
                
                for (let key in data) {
                    if (Array.isArray(data[key])) {
                        books = data[key];
                        console.log('Found books in property:', key);
                        break;
                    }
                }
            }
            
            console.log('Final books array:', books);
            displayResults(books);
            
        } catch (error) {
            console.error('Error searching books:', error);
            searchResults.innerHTML = `
                <div class="no-results">
                    <h4>Error occurred while searching</h4>
                    <p>${error.message}</p>
                    <p>Please try again.</p>
                </div>
            `;
        } finally {
            hideLoader();
        }
    }

    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchBooks(searchTerm);
        }
    });

   
    searchBtn.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchBooks(searchTerm);
            }
        }
    });

    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchBooks(searchTerm);
            }
        }
    });
});
