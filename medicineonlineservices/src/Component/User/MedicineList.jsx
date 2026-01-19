import axios from "axios";
import { useEffect, useState } from "react";

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);

  // 🔹 Get all medicines
  useEffect(() => {
    axios
      .get("/api/medicine/all")
      .then((res) => setMedicines(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Add to cart
  const addToCart = (id) => {
    const token = localStorage.getItem("token");

    axios
      .post(
        `/api/cart/addcart?medicineId=${id}&quantity=1`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Medicine added to cart ✅");
      })
      .catch((err) => {
        console.error(err);
        alert("Please login first ❌");
      });
  };

  return (
    <>
      {medicines.length > 0 ? (
        medicines.map((m) => (
          <div key={m.id}>
            <h4>{m.name}</h4>
            <p>₹{m.unitPrice}</p>
            <button onClick={() => addToCart(m.id)}>
              Add to Cart
            </button>
          </div>
        ))
      ) : (
        <p>No medicines available</p>
      )}
    </>
  );
}
