/*const listePanier = document.getElementById('liste-panier');
let panier = JSON.parse(localStorage.getItem('panier')) || [];

if (panier.length === 0) {
  listePanier.innerHTML = '<li class="list-group-item">Le panier est vide.</li>';
} else {
  panier.forEach(prod => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.innerHTML = `${prod.title} - $${prod.price}`;
    listePanier.appendChild(item);
  });
}*/

const listePanier = document.getElementById('liste-panier');
const totalPanierSpan = document.getElementById('total-panier');
const btnViderPanier = document.getElementById('vider-panier');

let panier = JSON.parse(localStorage.getItem('panier')) || [];

function calculerTotal(panier) {
  return panier.reduce((total, prod) => total + prod.price, 0);
}

function afficherPanier() {
  listePanier.innerHTML = "";

  if (panier.length === 0) {
    listePanier.innerHTML = '<li class="list-group-item">Le panier est vide.</li>';
    totalPanierSpan.textContent = "0 €";
    return;
  }

  panier.forEach((prod, index) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';

    item.innerHTML = `
      <span>${prod.title} - ${prod.price} €</span>
      <button class="btn btn-sm btn-outline-danger" onclick="supprimerProduit(${index})">🗑️</button>
    `;

    listePanier.appendChild(item);
  });

  const total = calculerTotal(panier);
  totalPanierSpan.textContent = `${total.toFixed(2)} €`;
}

function supprimerProduit(index) {
  panier.splice(index, 1);
  localStorage.setItem('panier', JSON.stringify(panier));
  afficherPanier();
}

btnViderPanier.addEventListener('click', () => {
  if (confirm("Voulez-vous vraiment vider le panier ?")) {
    panier = [];
    localStorage.removeItem('panier');
    afficherPanier();
  }
});

// Affichage initial
afficherPanier();
