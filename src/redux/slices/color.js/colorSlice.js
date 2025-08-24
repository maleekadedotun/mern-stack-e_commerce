import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialState

const initialState = {
    colors: [],
    color: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create color action

export const createColorAction = createAsyncThunk(
    "color/create", 
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
            const res = await axios.post(`${baseURL}/colors`,
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

// fetch colors

export const fetchColorsAction = createAsyncThunk(
    "color/fetch-all", 
    async(payload, {rejectWithValue, getState, dispatch}) =>{
        try {
            // images
            // make request
            const res = await axios.get(`${baseURL}/colors`)
            return res.data
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

// slice
const colorSlice = createSlice({
    name : "colors",
    initialState,
    extraReducers: (builder) => {
        // create
        builder.addCase(createColorAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(createColorAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.color = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createColorAction.rejected, (state, action) =>{
            state.loading = false;
            state.color = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // fetch all brands
        builder.addCase(fetchColorsAction.pending, (state) =>{
            state.loading = true;
        });

        builder.addCase(fetchColorsAction.fulfilled, (state, action) =>{
            state.loading = false;
            state.colors = action.payload;
            state.isAdded = true;
        });

        builder.addCase(fetchColorsAction.rejected, (state, action) =>{
            state.loading = false;
            state.colors = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // reset error action
        builder.addCase(resetErrAction.pending, (state, action) =>{
            state.isAdded = false;
            state.error = null;
        });

           // reset success action
        builder.addCase(resetSuccessAction.pending, (state, action) =>{
            state.isAdded = false;
            state.error = null;
        });
    },
});

// Generate the reducer

const colorReducer = colorSlice.reducer;

export default colorReducer;