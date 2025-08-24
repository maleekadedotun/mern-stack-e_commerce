import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialState

const initialState = {
    reviews: [],
    review: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create review action

export const createReviewAction = createAsyncThunk(
    "review/create", 
    async({rating, message, id}, {rejectWithValue, getState, dispatch}) =>{
        try {
            
            // token authenticated
            const token = getState().users?.userAuth?.userInfo?.data?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            // request
            const res = await axios.post(`${baseURL}/reviews/${id}`,
                {
                  rating, message, id
                },
              config
            )
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

// slice
const reviewsSlice = createSlice({
    name : "reviews",
    initialState,
    extraReducers: (builder) => {
        // create
        builder.addCase(createReviewAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(createReviewAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.review = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createReviewAction.rejected, (state, action) =>{
            state.loading = false;
            state.review = null;
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

const reviewsReducer = reviewsSlice.reducer;

export default reviewsReducer;