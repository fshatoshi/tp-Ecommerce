const paginationContainer = document.getElementById("pagination");

function genererPagination(totalPages) {
  paginationContainer.innerHTML = "";

  // Bouton « première page
  const firstLi = document.createElement("li");
  firstLi.className = `page-item ${currentPage === 0 ? "disabled" : ""}`;
  firstLi.innerHTML = `<a class="page-link">«</a>`;
  firstLi.onclick = () => {
    if (currentPage > 0) {
      currentPage = 0;
      chargerProduits();
    }
  };
  paginationContainer.appendChild(firstLi);

  // Bouton ‹ précédent
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 0 ? "disabled" : ""}`;
  prevLi.innerHTML = `<a class="page-link">‹</a>`;
  prevLi.onclick = () => {
    if (currentPage > 0) {
      currentPage--;
      chargerProduits();
    }
  };
  paginationContainer.appendChild(prevLi);

  // Pages visibles autour de la page actuelle
  const visiblePages = [];
  const maxVisible = 5;
  const startPage = Math.max(0, currentPage - 2);
  const endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  // Afficher les pages
  if (startPage > 0) {
    addPageItem(0); // page 1
    if (startPage > 1) addDots();
  }

  visiblePages.forEach(i => addPageItem(i));

  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) addDots();
    addPageItem(totalPages - 1); // page finale
  }

  // Bouton › suivant
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${currentPage + 1 >= totalPages ? "disabled" : ""}`;
  nextLi.innerHTML = `<a class="page-link">›</a>`;
  nextLi.onclick = () => {
    if (currentPage + 1 < totalPages) {
      currentPage++;
      chargerProduits();
    }
  };
  paginationContainer.appendChild(nextLi);

  // Bouton » dernière page
  const lastLi = document.createElement("li");
  lastLi.className = `page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`;
  lastLi.innerHTML = `<a class="page-link">»</a>`;
  lastLi.onclick = () => {
    if (currentPage < totalPages - 1) {
      currentPage = totalPages - 1;
      chargerProduits();
    }
  };
  paginationContainer.appendChild(lastLi);

  // Fonctions utilitaires
  function addPageItem(i) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link">${i + 1}</a>`;
    li.onclick = () => {
      currentPage = i;
      chargerProduits();
    };
    paginationContainer.appendChild(li);
  }

  function addDots() {
    const li = document.createElement("li");
    li.className = "page-item disabled";
    li.innerHTML = `<a class="page-link">...</a>`;
    paginationContainer.appendChild(li);
  }
}






const produitsContainer = document.getElementById("produits");
const totalProduitsSpan = document.getElementById("totalProduits");

let currentPage = 0;
let limit = 12;

function afficherProduits(produits) {
  produitsContainer.innerHTML = "";

  produits.forEach(prod => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 mb-4";

    col.innerHTML = `
      <div class="card shadow-sm">
        <img src="${prod.thumbnail}" class="card-img-top" alt="${prod.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.title}</h5>
          <p class="card-text text-muted small">${prod.description.substring(0, 60)}...</p>
          <div class="mt-auto">
            <span class="badge bg-primary mb-2">${prod.price}€</span>
            <button class="btn btn-sm btn-outline-primary w-100" onclick='ajouterAuPanier(${JSON.stringify(prod)})'>Ajouter au panier</button>
          </div>
        </div>
      </div>`;
      
    produitsContainer.appendChild(col);
  });
}

function chargerProduits() {
  const skip = currentPage * limit;
  fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
    .then(res => res.json())
    .then(data => {
      totalProduits = data.total;
      totalProduitsSpan.textContent = totalProduits;
      afficherProduits(data.products);
      const totalPages = Math.ceil(totalProduits / limit);
      genererPagination(totalPages);
    });
}


function ajouterAuPanier(produit) {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  panier.push(produit);
  localStorage.setItem('panier', JSON.stringify(panier));
  alert("Produit ajouté au panier !");
}

chargerProduits();

