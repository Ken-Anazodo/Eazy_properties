import baseApi from "@/features/baseApi";
export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query({
            query: () => '/api/notification',
        }),
        markNotificationAsRead: builder.mutation({
            query: (notificationId: string) => ({
                url: `/api/notification/${notificationId}/read`,
                method: 'PUT',

            })
        })
    })
})
export const{useGetAllNotificationsQuery} =  notificationApi;