import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { X, Edit3, Trash2 } from "lucide-react";

export function AdminProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products, removeProduct } = useProducts();

  const product = products.find(p => p.id === id);

  if (!product) return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
      <Link to="/admin" className="text-blue-500 mt-4 inline-block">Back to Admin</Link>
    </div>
  );

  const handleDelete = () => {
    removeProduct(product.id);
    alert("Product removed"); // or use your toast system
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-gray-600 mb-5"
      >
        <X className="w-4 h-4" /> Back to Admin
      </Link>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* Product Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex gap-2">
            <Link
              to={`/admin`}
              className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg col-span-1"
          />
          <div className="col-span-2 space-y-2">
            <p><span className="font-semibold">Category:</span> {product.category}</p>
            <p><span className="font-semibold">Price:</span> ${product.price}</p>
            {product.originalPrice && <p><span className="font-semibold">Original Price:</span> ${product.originalPrice}</p>}
            <p><span className="font-semibold">Condition:</span> {product.condition}</p>
            {product.size && <p><span className="font-semibold">Size:</span> {product.size}</p>}
            <p><span className="font-semibold">Featured:</span> {product.featured ? "Yes" : "No"}</p>
            <p className="mt-2"><span className="font-semibold">Description:</span> {product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}