
import { useEffect, useState } from "react";
import "./Showdata.css";

export default function Showdata() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setstock] = useState("");
  const [image, setImage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getProducts() {
      const saved = JSON.parse(
        localStorage.getItem("myProducts") || "[]"
      );

      try {
        const response = await fetch(
          "https://dummyjson.com/products"
        );
        const data = await response.json();

        setProducts([...saved, ...data.products]);
      } catch (error) {
        setProducts(saved);
      }

      setLoaded(true);
    }

    getProducts();
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("myProducts", JSON.stringify(products));
    }
  }, [products, loaded]);

  async function addProduct() {
    if (!title.trim() || price === "" || stock === "" || !image.trim()) {
      alert("Remplis tous les champs");
      return;
    }

    try {
      const response = await fetch(
        "https://dummyjson.com/products/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            price: Number(price),
            stock: Number(stock),
            thumbnail: image,
          }),
        }
      );

      const data = await response.json();

      const newProduct = {
        ...data,
        id: Date.now(),
        title: title,
        price: Number(price),
        stock: Number(stock),
        thumbnail: image,
      };

      setProducts((prev) => [newProduct, ...prev]);

      setTitle("");
      setPrice("");
      setstock("");
      setImage("");

      alert("Produit ajouté avec succès !");
    } catch (error) {
      alert("Erreur lors de l'ajout du produit");
    }
  }

  function deleteProduct(id) {
    const newProducts = products.filter((item) => item.id !== id);
    setProducts(newProducts);

    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
  }

  if (selectedProduct !== null) {
    return (
      <div>
        <button
          onClick={() => setSelectedProduct(null)}
          className="btn"
        >
          Retour
        </button>

        <h1>{selectedProduct.title}</h1>

        <img
          src={selectedProduct.thumbnail}
          alt={selectedProduct.title}
          width="200"
        />

        <p>Price: ${selectedProduct.price}</p>
        <p>Stock: {selectedProduct.stock}</p>
        <p>{selectedProduct.description}</p>

        <button
          className="btn-delete"
          onClick={() => deleteProduct(selectedProduct.id)}
        >
          Supprimer
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Our Products</h1>

      <div className="form">
        <div className="inputs">
          <input
            className="search"
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            className="input"
            type="text"
            placeholder="Nom du produit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="input"
            type="number"
            placeholder="Prix"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            className="input"
            type="number"
            placeholder="Add stock..."
            value={stock}
            onChange={(e) => setstock(e.target.value)}
          />

          <input
            className="input"
            type="url"
            placeholder="Lien de l'image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <button className="btn-add" onClick={addProduct}>
          Add Product
        </button>
      </div>

      {products
        .filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              margin: "10px",
            }}
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              width="150"
            />

            <h3>{item.title}</h3>

            <p>
              <strong>Price:</strong> {item.price} $
            </p>

            <p>
              <strong>Stock:</strong> {item.stock}
            </p>

            <button
              onClick={() => setSelectedProduct(item)}
              className="btn"
            >
              Détail
            </button>

            <button
              className="btn-delete"
              onClick={() => deleteProduct(item.id)}
            >
              Supprimer
            </button>
          </div>
        ))}
    </div>
  );
}
