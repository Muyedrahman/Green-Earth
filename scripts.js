const cart = [];

const loadAllTrees = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => displayTreeCard(data.plants))
    .catch((err) => console.log("Error loading trees:", err));
};

const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategory(data.categories))
    .catch((err) => console.log(err));
};

const displayCategory = (categories) => {
  const catContainer = document.getElementById("category-container");
  catContainer.innerHTML = "";

  //All Trees btn
  const allBtn = document.createElement("button");
  allBtn.className =
    "btn btn-block justify-start hover:bg-green-400 btn-category active";
  allBtn.innerText = "All Trees";
  allBtn.onclick = () => {
    // remove
    document
      .querySelectorAll(".btn-category")
      .forEach((btn) => btn.classList.remove("active"));
    allBtn.classList.add("active");
    loadAllTrees();
  };
  catContainer.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className =
      "btn btn-block justify-start hover:bg-green-400 btn-category";
    btn.id = `cat-btn-${cat.id}`;
    btn.innerText = cat.category_name;
    btn.onclick = () => loadPlanTree(cat.id);
    catContainer.appendChild(btn);
  });
};

const loadPlanTree = (id) => {
  document
    .querySelectorAll(".btn-category")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`cat-btn-${id}`)?.classList.add("active");

  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => displayTreeCard(data.plants))
    .catch((err) => console.log(err));
};

const displayTreeCard = (trees) => {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  trees.forEach((tree) => {
    const card = document.createElement("div");
    card.className = "tree-card bg-white p-3 rounded shadow flex flex-col";

    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" class="w-full h-40 object-cover rounded mb-2">
      <h2 class="tree-title font-bold text-lg mb-1" onclick="loadTreeDetails(${tree.id})">${tree.name}</h2>
      <p class="text-sm text-gray-600 mb-1">${tree.description}</p>
      <div class="flex justify-between items-center my-2">
        <span class="bg-green-200 rounded-full px-2 py-1 text-sm">${tree.category}</span>
        <span class="tree-price">৳${tree.price}</span>
      </div>
      <button class="bg-green-500 text-white rounded-full p-2" onclick="addToCart(this)">Add to Cart</button>
    `;
    container.appendChild(card);
  });
};

const loadTreeDetails = (id) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const tree = data.plants;
      const modal = document.getElementById("details-container");
      modal.innerHTML = `
        <h3 class="text-xl font-bold mb-2">${tree.name}</h3>
        <img src="${tree.image}" class="w-full h-52 object-cover rounded mb-2">
        <p><b>Category:</b> ${tree.category}</p>
        <p><b>Price:</b> ৳${tree.price}</p>
        <p>${tree.description}</p>
      `;
      document.getElementById("my_modal_3").showModal();
    });
};

const addToCart = (btn) => {
  const card = btn.closest(".tree-card");
  const title = card.querySelector(".tree-title").innerText;
  const price = Number(
    card.querySelector(".tree-price").innerText.replace("৳", "")
  );

  const existing = cart.find((item) => item.title === title);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ title, price, quantity: 1 });
  }
  updateCart();
};

// Update cart S-bar
const updateCart = () => {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";

  let totalItems = 0;
  let totalCost = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className =
      "flex justify-between items-center p-2 rounded-md bg-green-200 mb-2";

    const spanItem = document.createElement("span");
    spanItem.innerText = `${item.title} x ${item.quantity}`;

    const spanPrice = document.createElement("span");
    spanPrice.innerText = `৳${item.price * item.quantity}`;

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "✕";
    removeBtn.className = "ml-2  font-bold";
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };

    // append
    div.appendChild(spanItem);
    div.appendChild(spanPrice);
    div.appendChild(removeBtn);

    cartContainer.appendChild(div);

    totalItems += item.quantity;
    totalCost += item.price * item.quantity;
  });

  document.getElementById("total-cost").innerText = `৳${totalCost}`;
};

// Initialize
loadCategory();
loadAllTrees();
