import {createAsyncThunk, createSlice, isRejectedWithValue} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialState
const initialState = {
    loading: false,
    error: null,
    users: [],
    user: null,
    success: false, // ✅ add this
    profile: {}, 
    userAuth: {
        loading: false,
        error: null,
        userInfo: localStorage.getItem("userInfo") 
        ?JSON.parse(localStorage.getItem("userInfo")) 
        : null,
    }
}

// login Action

// export const loginUserAction = createAsyncThunk("users/login", 
//     async({email, password}, {rejectWithValue, getState, dispatch}) =>{
//         try {
//             // make the http request
//             const res = await axios.post(`${baseURL}/users/login`,{
//                 email,
//                 password,
//             });
//             // save user to local storage
//             localStorage.setItem("userInfo", JSON.stringify(res.data))
//             // console.log("Login response:", res.data); 
//             return res.data
//         } catch (error) {
//             console.log(error);
            
//             return rejectWithValue(error?.response?.data);
//         }
//     }
// );

export const loginUserAction = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/login`, { email, password }, {
        headers: { "Content-Type": "application/json" },
      });
      // Save in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data; // ✅ must return the whole data object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// register Action
export const registerUserAction = createAsyncThunk("users/register", 
    async({email, password, fullname}, {rejectWithValue, getState, dispatch}) =>{
        try {
            // make the http request
            const res = await axios.post(`${baseURL}/users/register`,{
                email,
                password,
                fullname,
            });
            // save user to local storage
            return res.data
        } catch (error) {
            console.log(error);
            
            return rejectWithValue(error?.response?.data);
        }
    }
);

// update user shipping address Action
export const updateUserShippingAddressAction = createAsyncThunk("users/update-shipping-address", 
    async({firstName, lastName, address, city, postalCode, country, province, phoneNumber}, {rejectWithValue, getState, dispatch}) =>{
        try {
            // token authenticated
            const token = getState()?.users?.userAuth?.userInfo?.token;
            // console.log("update", token);
            
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            // make the http request
            const res = await axios.put(`${baseURL}/users/update/shipping`,{
               firstName, 
               lastName, 
               address, 
               city, 
               postalCode, 
               country, 
               province,
               phoneNumber,
            }, config);
            // save user to local storage
            return res.data
        } catch (error) {
            console.log(error);
            
            return rejectWithValue(error?.response?.data);
        }
    }
);

// get user profile Action
export const getUserProfileAction = createAsyncThunk("users/profile", 
    async(payload, {rejectWithValue, getState, dispatch}) =>{
        try {
            // token authenticated
            const token = getState()?.users?.userAuth?.userInfo?.token;
            // console.log(token, "profile");
            
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            // console.log(config);
            
            // make the http request
            const res = await axios.get(`${baseURL}/users/profile`, config);
            console.log(res.data);
            
            // save user to local storage
            return res.data
        } catch (error) {
            console.log(error);
            
            return rejectWithValue(error?.response?.data);
        }
    }
);

// logOut user Action
export const logOutUserAction = createAsyncThunk("users/logOut", 
    async(payload, {rejectWithValue, getState, dispatch}) =>{
       localStorage.removeItem("userInfo");
        return true       
    }
);
// create userSlice
const usersSlice = createSlice({
    name: "users",
    initialState,
    extraReducers: (builder) => {
        // handle action 
        // login
        builder.addCase(loginUserAction.pending, (state, action) =>{
            state.userAuth.loading = true;
        });
        builder.addCase(loginUserAction.fulfilled, (state, action) =>{
            state.userAuth.userInfo = action.payload;
            state.userAuth.loading = false;
        });
        builder.addCase(loginUserAction.rejected, (state, action) =>{
            state.userAuth.error = action.payload;
            state.userAuth.loading = false;
        });

        // register
        builder.addCase(registerUserAction.pending, (state, action) =>{
            state.loading = true;
        });
  
        builder.addCase(registerUserAction.fulfilled, (state, action) =>{
            state.user = action.payload;
            state.loading = false;
            state.success = true; // ✅ set success to true

        });
        builder.addCase(registerUserAction.rejected, (state, action) =>{
            state.error = action.payload;
            state.loading = false;
        });

        // profile
        builder.addCase(getUserProfileAction.pending, (state, action) =>{
            state.loading = true;
        });
  
        builder.addCase(getUserProfileAction.fulfilled, (state, action) =>{
            state.profile = action.payload.user; 
            state.loading = false;
        });
        builder.addCase(getUserProfileAction.rejected, (state, action) =>{
            state.error = action.payload;
            state.loading = false;
            state.success = false; // ✅ explicitly false
        });

        // logOut
        builder.addCase(logOutUserAction.fulfilled, (state, action) =>{
            state.userAuth.userInfo = null;
        });

        // shipping address
        builder.addCase(updateUserShippingAddressAction.pending, (state, action) =>{
            state.loading = true;
        });
        builder.addCase(updateUserShippingAddressAction.fulfilled, (state, action) =>{
            state.user = action.payload.user;
            state.loading = false;
        });
        builder.addCase(updateUserShippingAddressAction.rejected, (state, action) =>{
            state.error = action.payload;
            state.loading = false;
        });


        // reset Err Action
        builder.addCase(resetErrAction.pending, (state) =>{
            state.error = null
        });

        builder.addCase(resetSuccessAction.pending, (state) =>{
            state.error = null
        })

    }
});

// generate reducers
const usersReducers = usersSlice.reducer;

export default usersReducers;