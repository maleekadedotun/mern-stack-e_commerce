import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialState

const initialState = {
    products: [],
    product: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create product action
export const createProductAction = createAsyncThunk(
    "product/create", 
    async(payload, {rejectWithValue, getState, dispatch}) => {
        //   console.log(payload);
      
      try {
        const { 
        name,
        description,
        category,
        sizes,
        brand,
        colors,
        price,
        totalQty,
        files,
      } = payload;
          // make request
          // token authenticated
          const token = getState().users?.userAuth?.userInfo?.token;
          
        //   const formData = new FormData();
            // append stuff...

            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            };



          // Build FormData
          const formData = new FormData();
          formData.append("name", name);
          formData.append("description", description);
          formData.append("category", category);
          formData.append("brand", brand);
          formData.append("price", price);
          formData.append("totalQty", totalQty);

          sizes.forEach((size) =>{
              formData.append("sizes", size)
          });

          colors.forEach((color) =>{
            formData.append("colors", color)
          });

          files.forEach((file) =>{
            formData.append("files", file)
          });
          // images
        // const { data } = await axios.post(`${baseURL}/products`, config);
        const { data } = await axios.post(
          `${baseURL}/products`,
          formData, config
        ); 

        // console.log("PRODUCT RESPONSE", data);
        return data
      } catch (error) {
          return rejectWithValue(error?.response?.data)
      }
    }
);

// update action

export const updateProductAction = createAsyncThunk(
  "product/update", 
  async(payload, {rejectWithValue, getState, dispatch}) => {
    //   console.log(payload);
    
    try {
      const { 
      name,
      description,
      category,
      sizes,
      brand,
      colors,
      price,
      totalQty,
      id,
    } = payload;
        // make request
        // token authenticated
        const token = getState().users?.userAuth?.userInfo?.token;
        
      //   const formData = new FormData();
          // append stuff...

          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        // request
      // const { data } = await axios.post(`${baseURL}/products`, config);
      const { data } = await axios.put(
        `${baseURL}/products/update/${id}`,
        { 
          name,
          description,
          category,
          sizes,
          brand,
          colors,
          price,
          totalQty,
        }, config
      ); 

      // console.log("PRODUCT RESPONSE", data);
      return data
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
  }
);

// fetch products action
export const fetchProductsAction = createAsyncThunk(
  "product/list", 
async({url}, {rejectWithValue, getState, dispatch}) => {
    console.log({url}, "working");
    
    try {
      
      // make request
      // token authenticated
      const token = getState().users?.userAuth?.userInfo?.token;
      //   console.log("Full state:", getState());

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };


        // images
        const { data } = await axios.get(`${url}`,config); 

        // console.log("PRODUCT RESPONSE", data);
        // console.log(data, "data");
        
        return data
      } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
);

// fetch product action
export const fetchProductAction = createAsyncThunk(
  "product/details", 
  async(productId, {rejectWithValue, getState, dispatch}) => {
    //   console.log(payload);
    
    try {
      
      // make request
      // token authenticated
      const token = getState().users?.userAuth?.userInfo?.token;
      //   console.log("Full state:", getState());
      //   console.log("Token in fetchProductsAction:", token);

          const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          };
          // request
          const { data } = await axios.get(`${baseURL}/products/${productId}`,config); 
          // console.log(data, "data");
          
          return data
      } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
);

// slice
const productSlice = createSlice({
    name : "products",
    initialState,
    extraReducers: (builder) => {
      // create
      builder.addCase(createProductAction.pending, (state) =>{
        state.loading = true;
      });

      builder.addCase(createProductAction.fulfilled, (state, action) =>{            
        state.loading = false;
        state.product = action.payload;
        state.isAdded = true;
      });

      builder.addCase(createProductAction.rejected, (state, action) =>{
        state.loading = false;
        state.product = null;
        state.isAdded = false;
        state.error = action.payload;
      });

      // update
      builder.addCase(updateProductAction.pending, (state) =>{
        state.loading = true;
      });

      builder.addCase(updateProductAction.fulfilled, (state, action) =>{            
        state.loading = false;
        state.product = action.payload;
        state.isUpdated = true;
      });

      builder.addCase(updateProductAction.rejected, (state, action) =>{
        state.loading = false;
        state.product = null;
        state.isUpdated = false;
        state.error = action.payload;
      });

      // fetch all products
      builder.addCase(fetchProductsAction.pending, (state) =>{
        state.loading = true;
      });

      builder.addCase(fetchProductsAction.fulfilled, (state, action) =>{            
        state.loading = false;
        state.products = action.payload;
        state.isAdded = true;
      });

      builder.addCase(fetchProductsAction.rejected, (state, action) =>{
        state.loading = false;
        state.products = null;
        state.isAdded = false;
        state.error = action.payload;
      });

      // fetch single product
      builder.addCase(fetchProductAction.pending, (state) =>{
        state.loading = true;
      });

      builder.addCase(fetchProductAction.fulfilled, (state, action) =>{            
        state.loading = false;
        state.product = action.payload;
        state.isAdded = true;
      });

      builder.addCase(fetchProductAction.rejected, (state, action) =>{
        state.loading = false;
        state.product = null;
        state.isAdded = false;
        state.error = action.payload;
      });

      // reset success
      builder.addCase(resetSuccessAction.pending,(state, action) =>{
          state.isAdded = false;
      });

      // reset error
      builder.addCase(resetErrAction.pending,(state, action) =>{
          state.error = null;
      });
      
    },
});

// Generate the reducer

const productReducer = productSlice.reducer;

export default productReducer;