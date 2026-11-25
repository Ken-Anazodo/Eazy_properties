import baseApi from "@/features/baseApi";
export const userProfileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateUserProfile: builder.mutation({
            query: (userData: any) => ({
                url: "/api/user/profile",
                method: "PUT",  
                body: userData
            })
        }),
        getUserProfile: builder.query({
          query:()=> "/api/user/profile"
        }),
    })
})