import baseApi from "@/features/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    CreatePlan: builder.mutation({
      query: (payload) => ({
        url: "/api/auth/signup/",
        method: "POST",
        body: payload,
      }),
    }),

    BuyPlan: builder.mutation({
      query: (payload: { planId: string }) => ({
        url: "/api/subscription/subscribe",
        method: "POST",
        body: payload,
      }),
    }),

    updatePlan: builder.mutation({
      query: (arg: { payload: any; id: string }) => ({
        url: `/api/subscription/plans/${arg.id}`,
        method: "POST",
        body: arg.payload,
      }),
    }),

    getAllPlans: builder.query({
      query: () => `/api/subscription/plans`,
    }),
    
    verifyPaymentUsingPaystack: builder.mutation({
      query:(payload:any) => ({
        url: '/api/subscription/verify',
        method: 'POST',
        body: payload,
      })
    }),

    deleteSubscriptionPlan: builder.query({
      query:(id:string) => `/api/subscription/plans/${id}`
    }),
    
    getUserPlan: builder.query({
      query:() => `/api/subscription/my`
    })

  }),
});



export const { useGetAllPlansQuery, useBuyPlanMutation } = subscriptionApi;


