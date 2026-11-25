import baseApi from "@/features/baseApi";

export const userAuthApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		adminDashboard: builder.query({query: () => "/api/v1/admin/dashboard/"}),

		userSignUp: builder.mutation({
			query: (userData)=>({
				url: "/api/auth/signup/",
				method: "POST",
				body: userData
			})
		}),

		userLogout: builder.mutation({
			query: ()=>({
				url: `/api/auth/logout`,
				method: 'POST',
			})
		}),

		userLogin: builder.mutation({
			query: (credentials)=>({
				url: "/api/auth/login",
				method: "POST",
				body: credentials
			})
		}),

		userRequestPasswordReset: builder.mutation({
			query: (userEmail)=>({
				url: "/api/auth/request-password-reset",
				method: "POST",
				body: userEmail
			})
		}),

		userResetPassword: builder.mutation({
			query: (userPasswordData) =>({
				url: "/api/auth/reset-password",
				method: "POST",
				body: userPasswordData
			})
		}),

		loginWithGoogle: builder.query({
          query:() => "/api/auth/google/callback"
		}),
		
		googleAuthCallBack: builder.query({
			query:() => "/api/auth/google/callback"
		})
	}),

})

export const { 
	useUserSignUpMutation, 
	useUserLogoutMutation, 
	useUserLoginMutation, 
	useUserRequestPasswordResetMutation, 
	useUserResetPasswordMutation 
} = userAuthApi;