import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialState

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
  stats: null,
}

// create product action

export const placeOrderAction = createAsyncThunk(
    "order/place-order", 
    async(payload, {rejectWithValue, getState, dispatch}) => {
        //   console.log(payload);
      
      try {
        const { 
        orderItems,
        shippingAddress,
        totalPrice,
      } = payload;
          // token authenticated
          const token = getState().users?.userAuth?.userInfo?.data?.token;
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              // "Content-Type": "multipart/form-data",
            },
          };
          // request
        const { data } = await axios.post(
          `${baseURL}/orders`,
          {
            orderItems,
            shippingAddress,
            totalPrice,
          }, config
        ); 
        // console.log("PRODUCT RESPONSE", data);
        return window.open(data?.url)
      } catch (error) {
          return rejectWithValue(error?.response?.data)
      }
    }
);

// stats action
export const orderStatsAction = createAsyncThunk(
  "order/statistics", 
  async(payload, {rejectWithValue, getState, dispatch}) => {    
    try {
      
      // token authenticated
      const token = getState().users?.userAuth?.userInfo?.data?.token;
      //   console.log("Full state:", getState());

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // request
        const { data } = await axios.get(`${baseURL}/orders/sales/stats`,config); 
        return data
      } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
);

// fetch orders action
export const fetchOrdersAction = createAsyncThunk(
  "order/list", 
  async(payload, {rejectWithValue, getState, dispatch}) => {    
    try {
      
      // token authenticated
      const token = getState().users?.userAuth?.userInfo?.data?.token;
      //   console.log("Full state:", getState());

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // request
        const { data } = await axios.get(`${baseURL}/orders`,config); 
        return data
      } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
);

// fetch order action
export const fetchOrderAction = createAsyncThunk(
  "order/details", 
  async(productId, {rejectWithValue, getState, dispatch}) => {
    //   console.log(payload);
    
    try {
      // token authenticated
      const token = getState().users?.userAuth?.userInfo?.data?.token;
          const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          };


          // request
          const { data } = await axios.get(`${baseURL}/orders/${productId}`,config); 
          return data
      } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
);

// slice
const orderSlice = createSlice({
    name : "orders",
    initialState,
    extraReducers: (builder) => {
      // create
      builder.addCase(placeOrderAction.pending, (state) =>{
        state.loading = true;
      });

      builder.addCase(placeOrderAction.fulfilled, (state, action) =>{            
        state.loading = false;
        state.order = action.payload;
        state.isAdded = true;
      });

      builder.addCase(placeOrderAction.rejected, (state, action) =>{
        state.loading = false;
        state.order = null;
        state.isAdded = false;
        state.error = action.payload;
      });

       // stats
      builder.addCase(orderStatsAction.pending, (state) =>{
        state.loading = true;
      });

      builder.addCase(orderStatsAction.fulfilled, (state, action) =>{            
        state.loading = false;
        state.stats = action.payload;
        state.isAdded = true;
      });

      builder.addCase(orderStatsAction.rejected, (state, action) =>{
        state.loading = false;
        state.stats = null;
        state.isAdded = false;
        state.error = action.payload;
      });

      // fetch all orders
      builder.addCase(fetchOrdersAction.pending, (state) =>{
        state.loading = true;
      });

      builder.addCase(fetchOrdersAction.fulfilled, (state, action) =>{            
        state.loading = false;
        state.orders = action.payload.orders;
      });

      builder.addCase(fetchOrdersAction.rejected, (state, action) =>{
        state.loading = false;
        state.orders = null;
        state.error = action.payload;
      });



      // fetch single order
        builder.addCase(fetchOrderAction.pending, (state) =>{
        state.loading = true;
      });

      builder.addCase(fetchOrderAction.fulfilled, (state, action) =>{            
        state.loading = false;
        state.order = action.payload;
      });

      builder.addCase(fetchOrderAction.rejected, (state, action) =>{
        state.loading = false;
        state.order = null;
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

const orderReducer = orderSlice.reducer;

export default orderReducer;