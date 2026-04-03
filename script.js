// 🔥 Firebase Config (replace with YOUR values)
const firebaseConfig = {
  apiKey: "AIzaSyC9V1lK0m0zpNmrT4VRHIDYnH3ewl7etbU",
  authDomain: "okiedokiepoke-d84fc.firebaseapp.com",
  projectId: "okiedokiepoke-d84fc"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// 🔐 Only your UID can add items
const ADMIN_UID = "x1uYPtpwoAWitQuyNG4LVBOdi1F2";

// Login function
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

// Show add button only for admin
auth.onAuthStateChanged(user => {
  if (user && user.uid === ADMIN_UID) {
    document.getElementById("addBtn").style.display = "inline-block";
  }
});

// Live products
db.collection("products").onSnapshot(snapshot => {
  const shop = document.querySelector('.shop');
  shop.innerHTML = "";
  snapshot.forEach(doc => {
    const product = doc.data();
    const id = "paypal-" + doc.id;

    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${product.image}">
      <h2>${product.name}</h2>
      <p>$${product.price}</p>
      <div id="${id}"></div>
    `;
    shop.appendChild(div);

    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: product.price } }]
        });
      }
    }).render(`#${id}`);
  });
});

// Add product (admin only)
function addProduct() {
  const user = auth.currentUser;
  if (!user || user.uid !== ADMIN_UID) return alert("Not allowed");

  const name = prompt("Product name:");
  const price = prompt("Price:");
  const image = prompt("Image URL:");
  if (!name || !price) return;

  db.collection("products").add({ name, price, image });
}
