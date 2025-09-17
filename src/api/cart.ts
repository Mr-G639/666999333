import { Cart, Product } from '@/types'; 
import productsData from "../mock/products.json";

// Dummy in-memory cart state for simulation
let dummyCart: Cart = [];

// Function to find a product by ID from products.json
const findDummyProduct = (productId: number): Product | undefined => {
  console.log(`Looking for product with ID ${productId} in products.json...`);
  
  // Find product data in products.json
  const productData = productsData.find(p => p.id === productId);
  
  if (!productData) {
    console.error(`Product with ID ${productId} not found in products.json`);
    return undefined;
  }
  
  // Convert the product data to match the Product interface
  return {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    originalPrice: productData.originalPrice,
    image: productData.image,
    detail: productData.detail,
    // Map categoryId to a simple category object
    category: { 
      id: productData.categoryId, 
      name: `Category ${productData.categoryId}`,
      image: "" 
    }
  };
};


export const getCartFromApi = async (): Promise<Cart> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate delay
  console.log("Simulating API call: getCartFromApi");
  // In a real scenario, fetch cart data from the backend
  return dummyCart; // Return current dummy state
};

export const incrementCartItemQuantityApi = async (productId: number, quantity: number): Promise<Cart> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate delay for incrementing
  console.log(`Simulating API call: addToCartApi (productId: ${productId}, quantity: ${quantity})`);

  const productToAdd = findDummyProduct(productId);

  if (!productToAdd) {
      console.error(`Simulating API error: Product with ID ${productId} not found.`);
      throw new Error(`Product with ID ${productId} not found.`);
  }

  const existingItemIndex = dummyCart.findIndex(item => item.product.id === productId);

  if (existingItemIndex > -1) {
    // Update quantity if item exists
    dummyCart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    dummyCart.push({ product: productToAdd, quantity: quantity });
  }

  // In a real scenario, send data to backend and return updated cart from backend response
  return [...dummyCart]; // Return a new array reference
};

export const updateCartItemApi = async (productId: number, quantity: number): Promise<Cart> => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate delay
    console.log(`Simulating API call: updateCartItemApi (productId: ${productId}, quantity: ${quantity})`);

    const existingItemIndex = dummyCart.findIndex(item => item.product.id === productId);

    if (existingItemIndex === -1) {
        console.error(`Simulating API error: Product with ID ${productId} not found in cart.`);
        throw new Error(`Product with ID ${productId} not found in cart.`);
    }

    if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        dummyCart.splice(existingItemIndex, 1);
    } else {
        // Update quantity
        dummyCart[existingItemIndex].quantity = quantity;
    }

     // In a real scenario, send data to backend and return updated cart from backend response
    return [...dummyCart]; // Return a new array reference
};

export const updateCartApi = async (cart: Cart): Promise<Cart> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate delay
  console.log("Simulating API call: updateCartApi with provided cart:", cart);
  // In a real scenario, send the entire cart structure to the backend
  // and the backend confirms/returns the state. For dummy, just replace.
  dummyCart = cart;
  return [...dummyCart]; // Return a new array reference
};

export const removeCartItemApi = async (productId: number): Promise<Cart> => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate delay
    console.log(`Simulating API call: removeCartItemApi (productId: ${productId})`);

    const existingItemIndex = dummyCart.findIndex(item => item.product.id === productId);

    if (existingItemIndex > -1) {
        dummyCart.splice(existingItemIndex, 1);
    } else {
        console.warn(`Simulating API: Product with ID ${productId} not found in cart, no removal needed.`);
    }

    // In a real scenario, send data to backend and return updated cart from backend response
    return [...dummyCart]; // Return a new array reference
};