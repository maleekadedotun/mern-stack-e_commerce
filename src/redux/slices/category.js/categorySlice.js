import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialState

const initialState = {
    categories: [],
    category: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create product action

export const createCategoryAction = createAsyncThunk(
    "category/create", 
    async(payload, {rejectWithValue, getState, dispatch}) =>{
        // console.log(payload);
        try {
            const {
                name, 
                file,
            } = payload

            // use formData
            const formData = new FormData();
            formData.append("name", name);
            formData.append("file", file);
            // token authenticated
            const token = getState().users?.userAuth?.userInfo?.data?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            // images
            const res = await axios.post(`${baseURL}/categories`,formData, config)
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

// fetch categories

export const fetchCategoriesAction = createAsyncThunk(
    "category/fetch All", 
    async(payload, {rejectWithValue, getState, dispatch}) =>{
        try {
            // images
            // make request
            const res = await axios.get(`${baseURL}/categories`)
            // console.log(res.data, "cart"); 
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

// slice
const categorySlice = createSlice({
    name : "products",
    initialState,
    extraReducers: (builder) => {
        // create
        builder.addCase(createCategoryAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(createCategoryAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.category = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createCategoryAction.rejected, (state, action) =>{
            state.loading = false;
            state.category = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // fetch all
        builder.addCase(fetchCategoriesAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(fetchCategoriesAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.categories = action.payload;
        });

        builder.addCase(fetchCategoriesAction.rejected, (state, action) =>{
            state.loading = false;
            state.categories = null;
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

const categoryReducer = categorySlice.reducer;

export default categoryReducer;