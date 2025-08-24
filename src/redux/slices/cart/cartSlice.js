import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

// initialState

const initialState = {
    cartItems: [],
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// add product to cart
export const addOrderToCartAction = createAsyncThunk(
    "cart/add-to-cart", 
    async(cartItem) => {
        const cartItems = localStorage.getItem("cartItems") 
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [];

        // const newItem = {
        //     ...cartItem,
        //     unitPrice: cartItem.price, // store the base price
        //     totalPrice: cartItem.price, // start with qty 1
        //     qty: 1,
        // };
        // push to storage
        cartItems.push(cartItem)
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        return cartItems;
    }
);

// get product to cart
export const getCartItemsFromLocalStorage = createAsyncThunk(
    "cart/get-order-items", 
    async() => {
        const cartItems = localStorage.getItem("cartItems") 
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [];
      return cartItems;
    }
);

// change order qty
export const changeOrderItemQty = createAsyncThunk(
    "cart/order-item-qty", 
    async({productId, qty}) => {
        console.log(productId, qty);
        
        const cartItems = localStorage.getItem("cartItems") 
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [];
        const newCartItems = cartItems?.map((item) =>{
            if(item?._id?.toString() === productId?.toString()){
                // get new price
                const newPrice = item?.price * qty
                item.qty = qty;
                item.totalPrice = newPrice;
                console.log(item);
                                                
            }
            return item;
        })
        localStorage.setItem("cartItems", JSON.stringify(newCartItems));
        return newCartItems;
    }
);

// remove order qty
export const removeOrderItemQty = createAsyncThunk(
    "cart/order-item-qty", 
    async(productId) => {
        console.log(productId);
        
        const cartItems = localStorage.getItem("cartItems") 
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [];
        const newItems = cartItems.filter((item) => item?._id !== productId);
        localStorage.setItem("cartItems", JSON.stringify(newItems));
    }
);

// slice
const cartSlice = createSlice({
    name : "carts",
    initialState,
    reducers: {
        clearCart: (state) => {
        state.cartItems = [];
        localStorage.removeItem("cartItems"); // ⚠️ fix key: "cartItems"
        },
    },
    extraReducers: (builder) => {
        // add to cart
        builder.addCase(addOrderToCartAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(addOrderToCartAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.cartItems = action.payload;
            state.isAdded = true;
        });

        builder.addCase(addOrderToCartAction.rejected, (state, action) =>{
            state.loading = false;
            state.cartItems = null;
            state.isAdded = false;
            state.error = action.payload;
        });

          // get cart items
        builder.addCase(getCartItemsFromLocalStorage.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(getCartItemsFromLocalStorage.fulfilled, (state, action) =>{
            state.loading = false;
            state.cartItems = action.payload;
            state.isAdded = true;
        });

        builder.addCase(getCartItemsFromLocalStorage.rejected, (state, action) =>{
            state.loading = false;
            state.cartItems = null;
            state.isAdded = false;
            state.error = action.payload;
        });


         // get order item qty
        builder.addCase(changeOrderItemQty.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(changeOrderItemQty.fulfilled, (state, action) =>{
            state.loading = false;
            state.cartItems = action.payload;
            state.isAdded = true;
        });

        builder.addCase(changeOrderItemQty.rejected, (state, action) =>{
            state.loading = false;
            state.cartItems = null;
            state.isAdded = false;
            state.error = action.payload;
        });

    },
});

// Generate the reducer
export const { clearCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;

export default cartReducer;