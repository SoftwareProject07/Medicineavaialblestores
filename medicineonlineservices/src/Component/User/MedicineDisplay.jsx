import React from "react";
import { useCart } from "./CartContext";

export default function MedicineDisplay() {
  // 🔹 Cart function from context
  const { addToCart } = useCart();

  // 🔹 Medicine list
  const meds = [
    {
      cartId: 1,
      medicineName: "Paracetamol",
      unitPrice: 20,
      discount: 0,
      imageUrl: "https://via.placeholder.com/100",
      totalPrice: 20
    },
    {
      cartId: 2,
      medicineName: "Vitamin C",
      unitPrice: 50,
      discount: 5,
      imageUrl: "https://via.placeholder.com/100",
      totalPrice: 45
    }
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-3">All Medicines</h3>

      <div className="row">
        {meds.map((med) => (
          <div className="col-md-4 mb-3" key={med.cartId}>
            <div className="card p-3 text-center h-100 shadow-sm">

              {/* Medicine Image */}
              <img
                src={med.imageUrl}
                alt={med.medicineName}
                className="img-fluid mb-2"
              />

              {/* Medicine Name */}
              <h5>{med.medicineName}</h5>

              {/* Price */}
              <p className="mb-1">Price: ₹{med.unitPrice}</p>

              {/* Discount */}
              {med.discount > 0 && (
                <p className="text-success">
                  Discount: ₹{med.discount}
                </p>
              )}

              {/* Add to Cart Button */}
              <button
                className="btn btn-primary mt-auto"
                onClick={() =>
                  addToCart({
                    ...med,
                    quantity: 1 // ✅ important
                  })
                }
              >
                Add to Cart
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
