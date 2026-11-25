import baseApi from "@/features/baseApi";
export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        listAllUsers: builder.query({
            query: () => 'api/user/admin/users'
        }), 
        getUserById: builder.query({
            query: (userId: string) => `api/user/admin/users/${userId}`
        }),
        updateUserById: builder.mutation({
            query: ({userId, payload} : {userId : string, payload: any}) => ({
                url: `api/user/admin/users/${userId}`,
                method: 'PUT',
                body: payload
            })
        }),
        deleteUserById: builder.mutation({
            query: (userId: string) => ({
                url: `api/user/admin/users/${userId}`,
                method: 'DELETE'
            })
        }),
        disableUserById: builder.mutation({
            query:(userId: string) => ({
                url: `api/user/admin/users/${userId}/disable`,
                method: 'PUT'
            })
        })
    })
})