type Product = {
  id: string;
  name: string;
  stock: number;
};

async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.API_URL ?? "http://localhost:3001";
  const res = await fetch(`${apiUrl}/products`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-6 py-16 px-16">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Products
        </h1>

        {products.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No products found.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-black/[.08] dark:divide-white/[.145]">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between py-4"
              >
                <span className="text-black dark:text-zinc-50">
                  {product.name}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {product.stock} in stock
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
