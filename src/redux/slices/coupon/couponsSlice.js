import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialState

const initialState = {
    coupons: [],
    coupon: null,
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create brand action

export const createCouponAction = createAsyncThunk(
    "coupon/create", 
    async({code, discount, startDate, endDate}, {rejectWithValue, getState, dispatch}) =>{
        try {
            // const {
            //     name
            // } = payload
            // make request
            // token authenticated
            const token = getState().users?.userAuth?.userInfo?.data?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            // images
            const res = await axios.post(`${baseURL}/coupons`,
                {
                  code, discount, startDate, endDate
                },
              config
            )
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

// fetch coupons

export const fetchCouponsAction = createAsyncThunk(
    "coupon/fetch All", 
    async(payload, {rejectWithValue, getState, dispatch}) =>{
        try {
            // images
            // make request
            const res = await axios.get(`${baseURL}/coupons`);
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

// fetch single coupon
export const fetchCouponAction = createAsyncThunk(
    "coupon/single", 
    async(code, {rejectWithValue, getState, dispatch}) =>{
        console.log(code);
        
        try {
            // images
            // make request
            // const res = await axios.get(`${baseURL}/coupons/single?code=${code}`, {
            //     code,
            // })
            // console.log(code, "code")
            const res = await axios.get(`${baseURL}/coupons/single?code=${code}`);
                console.log("Sending code:", code);
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

// slice
const couponsSlice = createSlice({
    name : "coupons",
    initialState,
    extraReducers: (builder) => {
        // create
        builder.addCase(createCouponAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(createCouponAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.coupon = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createCouponAction.rejected, (state, action) =>{
            state.loading = false;
            state.coupon = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // fetch all coupons
        builder.addCase(fetchCouponsAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(fetchCouponsAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.coupons = action.payload;
            state.isAdded = true;
        });

        builder.addCase(fetchCouponsAction.rejected, (state, action) =>{
            state.loading = false;
            state.coupons = null;
            state.isAdded = false;
            state.error = action.payload;
        });

         // fetch single coupon
        builder.addCase(fetchCouponAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(fetchCouponAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.coupon = action.payload;
            state.isAdded = true;
        });

        builder.addCase(fetchCouponAction.rejected, (state, action) =>{
            state.loading = false;
            state.coupon = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // reset success
        builder.addCase(resetSuccessAction.pending,(state, action) =>{
            state.isAdded = false;
            state.error = null;
        });
        
        // reset error
        builder.addCase(resetErrAction.pending,(state, action) =>{
            state.isAdded = false;
            state.error = null;
        });
    },
});

// Generate the reducer

const couponsReducer = couponsSlice.reducer;

export default couponsReducer;