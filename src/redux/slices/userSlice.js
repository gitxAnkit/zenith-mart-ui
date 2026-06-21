import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {},
    users: [],
    isAuthenticated: false,
    loading: false,
    error: null,
    isUpdated: false,
    isDeleted: false,
    message: null,
    success: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        // USER REDUCERS

        loginRequest: (state) => {
            state.loading = true;
            state.isAuthenticated = false;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        loginFail: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        registerUserRequest: (state) => {
            state.loading = true;
            state.isAuthenticated = false;
        },
        registerUserSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        registerUserFail: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        loadUserRequest: (state) => {
            state.loading = true;
            state.isAuthenticated = false;
        },
        loadUserSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        loadUserFail: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        },
        logoutFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // PROFILE REDUCERS

        updateProfileRequest: (state) => {
            state.loading = true;
        },
        updateProfileSuccess: (state, action) => {
            state.loading = false;
            state.isUpdated = action.payload;
            state.isUpdated = true;
        },
        updateProfileFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateProfileReset: (state) => {
            state.isUpdated = false;
        },

        updatePasswordRequest: (state) => {
            state.loading = true;
        },
        updatePasswordSuccess: (state, action) => {
            state.loading = false;
            state.isUpdated = action.payload;
        },
        updatePasswordFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updatePasswordReset: (state) => {
            state.isUpdated = false;
        },

        // FORGOT PASSWORD REDUCERS

        forgotPasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        forgotPasswordSuccess: (state, action) => {
            state.loading = false;
            state.message = action.payload;
        },
        forgotPasswordFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        resetPasswordSuccess: (state, action) => {
            state.loading = false;
            state.success = action.payload;
        },
        resetPasswordFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ALL USER REDUCERS

        allUsersRequest: (state) => {
            state.loading = true;
        },
        allUsersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        },
        allUsersFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // UPDATE DETAILS REDUCERS

        userDetailsRequest: (state) => {
            state.loading = true;
        },
        userDetailsSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        userDetailsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserRequest: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state, action) => {
            state.loading = false;
            state.isDeleted = action.payload.success;
            state.message = action.payload.message;
        },
        deleteUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserReset: (state) => {
            state.isDeleted = false;
        },
        updateUserRequest: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.isUpdated = action.payload;
        },
        updateUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserReset: (state) => {
            state.isUpdated = false;
        },

        // CLEAR ERRORS REDUCER
        clearErrors: (state) => {
            state.error = null;
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFail,
    registerUserRequest,
    registerUserSuccess,
    registerUserFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updateProfileReset,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    updatePasswordReset,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail,
    allUsersRequest,
    allUsersSuccess,
    allUsersFail,
    userDetailsRequest,
    userDetailsSuccess,
    userDetailsFail,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    deleteUserReset,
    updateUserRequest,
    updateUserSuccess,
    updateUserFail,
    updateUserReset,
    clearErrors,
} = userSlice.actions;

export default userSlice.reducer;
