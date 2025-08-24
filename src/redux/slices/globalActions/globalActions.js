import { createAsyncThunk } from "@reduxjs/toolkit";

export const resetErrAction = createAsyncThunk("resetErr-Action", () =>{
    return {}
});

export const resetSuccessAction = createAsyncThunk("resetSuccess-Action", () =>{
    return {}
});