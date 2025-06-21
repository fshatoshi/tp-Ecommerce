const paginationContainer = document.getElementById("pagination");


function ajouterAuPanier(produit, quantite) {
  // Lire le panier actuel (ou tableau vide)
  let panier = JSON.parse(localStorage.getItem("panier")) || [];

  // Vérifier si produit déjà présent
  const index = panier.findIndex(p => p.id === produit.id);
  if (index !== -1) {
    panier[index].quantite += quantite;
  } else {
    panier.push({
      id: produit.id,
      titre: produit.title,
      prix: produit.price,
      image: produit.thumbnail,
      quantite: quantite
    });
  }

  // Sauvegarder
  localStorage.setItem("panier", JSON.stringify(panier));
}



function mettreAJourCompteurPanier() {
  const badge = document.getElementById("cartCount");
  const panier = JSON.parse(localStorage.getItem("panier")) || [];

  const totalQuantite = panier.reduce((acc, item) => acc + item.quantite, 0);

  if (totalQuantite > 0) {
    badge.textContent = totalQuantite;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}





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
    produits.forEach(produit => {
      const div = document.createElement("div");
      div.className = "col-md-4 mb-4";
      div.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${produit.thumbnail}" class="card-img-top" alt="${produit.title}" style="height:200px; object-fit:cover">
          <div class="card-body">
            <h5 class="card-title">${produit.title}</h5>
            <p class="card-text text-muted">${produit.description.substring(0, 80)}...</p>
            <p class="fw-bold text-primary">${produit.price}€</p>
            <button class="btn btn-primary w-100">Voir les détails</button>
          </div>
        </div>`;

    const btn = div.querySelector("button");
    btn.onclick = () => afficherDetailsProduit(produit);

    produitsContainer.appendChild(div);
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
  mettreAJourCompteurPanier();
}

chargerProduits();


function afficherDetailsProduit(produit) {
  // Remplir les infos texte
  document.getElementById("productModalLabel").textContent = produit.title;
  document.getElementById("productDescription").textContent = produit.description;
  document.getElementById("productPrice").textContent = produit.price;
  document.getElementById("productStock").textContent = produit.stock;
  document.getElementById("productQuantity").value = 1;

  // Injecter les images dans le carrousel
  const carouselInner = document.getElementById("carouselInner");
  carouselInner.innerHTML = "";

  produit.images.forEach((img, index) => {
    const div = document.createElement("div");
    div.className = `carousel-item ${index === 0 ? "active" : ""}`;
    div.innerHTML = `<img src="${img}" class="d-block w-100" style="max-height:300px; object-fit:cover">`;
    carouselInner.appendChild(div);
  });

  // Ajouter l’événement "ajouter au panier"
  document.getElementById("btnAddToCart").onclick = () => {
  const quantite = parseInt(document.getElementById("productQuantity").value);
  ajouterAuPanier(produit, quantite);
};


  // Ouvrir la modale Bootstrap
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}


function mettreAJourCompteurPanier() {
  const badge = document.getElementById("cartCount");
  if (!badge) {
    console.warn("⚠️ Élément #cartCount introuvable");
    return;
  }

  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  const total = panier.reduce((acc, item) => acc + item.quantite, 0);

  if (total > 0) {
    badge.textContent = total;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}



document.addEventListener("DOMContentLoaded", () => {
  mettreAJourCompteurPanier();
});
