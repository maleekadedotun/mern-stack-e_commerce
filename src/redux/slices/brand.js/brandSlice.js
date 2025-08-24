import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialState

const initialState = {
    brands: [],
    brand: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create brand action

export const createBrandAction = createAsyncThunk(
    "brand/create", 
    async(name, {rejectWithValue, getState, dispatch}) =>{
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
            const res = await axios.post(`${baseURL}/brands`,
                {
                    name, 
                },
              config
            )
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

// fetch brands

export const fetchBrandsAction = createAsyncThunk(
    "brand/fetch All", 
    async(payload, {rejectWithValue, getState, dispatch}) =>{
        try {
            // images
            // make request
            const res = await axios.get(`${baseURL}/brands`)
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

// slice
const brandSlice = createSlice({
    name : "brands",
    initialState,
    extraReducers: (builder) => {
        // create
        builder.addCase(createBrandAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(createBrandAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.brand = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createBrandAction.rejected, (state, action) =>{
            state.loading = false;
            state.brand = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // fetch all brands
        builder.addCase(fetchBrandsAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(fetchBrandsAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.brands = action.payload;
            state.isAdded = true;
        });

        builder.addCase(fetchBrandsAction.rejected, (state, action) =>{
            state.loading = false;
            state.brands = null;
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

const brandReducer = brandSlice.reducer;

export default brandReducer;