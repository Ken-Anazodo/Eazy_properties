import baseApi from "@/features/baseApi";
export interface PublicPropertyParams {
  currentPage?: number; // Page number for pagination
  itemsPerPage?: number; // Number of items per page
  status?: string; // Filter by property status
  labels?: string; // Filter by property labels
  propertyType?: string; // Filter by property type
  bathrooms?: number; // Minimum number of bathrooms
  bedrooms?: number; // Minimum number of bedrooms
  state?: string; // Filter by state
  city?: string; // Filter by city
  garages?: number; // Minimum number of garages
  rooms?: number; // Minimum number of rooms
  priceMin?: number; // Minimum price
  priceMax?: number; // Maximum price
  sizeMin?: number; // Minimum size
  sizeMax?: number; // Maximum size
  amenities?: string; // Comma-separated list of amenities
}

interface leaveComment {
  name: string;
  email: string;
  message: string
}

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProperty: builder.mutation({
      query: (payload: any) => ({
        url: "/api/property",
        method: "POST",
        body: payload,
      }),
    }),
    
    getAllUserProperties: builder.query({
      query: ({ page, limit }: { page: number; limit: number }) =>
        `/api/property/user?page=${page}&limit=${limit}`,
    }),

    getAllPublicProperties: builder.query({
      query: ({
        itemsPerPage = 1,
        currentPage = 10,
        status,
        labels,
        propertyType,
        bathrooms,
        bedrooms,
        state,
        city,
        garages,
        rooms,
        priceMin,
        priceMax,
        sizeMin,
        sizeMax,
        amenities,
      }: PublicPropertyParams) => {
        const params = new URLSearchParams();

        params.append("page", currentPage.toString());
        params.append("limit", itemsPerPage.toString());

        if (status) params.append("status", status);
        if (labels) params.append("labels", labels);
        if (propertyType) params.append("propertyType", propertyType);
        if (bathrooms) params.append("bathrooms", bathrooms.toString());
        if (bedrooms) params.append("bedrooms", bedrooms.toString());
        if (state) params.append("state", state);
        if (city) params.append("city", city);
        if (garages) params.append("garages", garages.toString());
        if (rooms) params.append("rooms", rooms.toString());
        if (priceMin) params.append("priceMin", priceMin.toString());
        if (priceMax) params.append("priceMax", priceMax.toString());
        if (sizeMin) params.append("sizeMin", sizeMin.toString());
        if (sizeMax) params.append("sizeMax", sizeMax.toString());
        if (amenities) params.append("amenities", amenities);

        return `/api/property/public?${params.toString()}`;
      },
    }),

    logPropertyViewAndNotify: builder.mutation({
      query: (propertyId: string) => ({
        url: `/api/property/${propertyId}/view`,
        method: "POST",
      }),
    }),
    
    fetchPropertyById: builder.query({
      query: (propertyId: string) => `/api/property/${propertyId}`,
    }),

    fetchPublishPropertyByAgentId: builder.query({
      query:({agencyId,  page, limit} : {agencyId:string, page:number, limit:number})=> `/api/property/${agencyId}?page=${page}&limit=${limit}`
    }),

    fetchCommentForSpecificProperty: builder.query({
      query:(propertyId:string)=> `/api/property/${propertyId}/comments`
    }),

    sendMessageToAnAgent:builder.mutation({
      query:({agentId, payload} : {agentId:any, payload:any}) => ({
        url: `api/property/agent/${agentId}/message`,
        method:"POST",
        body:payload
      })
    }),

    fetchAllMessageToASpecificAgent: builder.query({
      query:({agentId, page, limit}: {agentId:string, page:number, limit:number})=> `/api/property/agent/${agentId}/messages?page=${page}&limit=${limit}`
    }),

    leaveCommentsForASpecificProperty:builder.mutation({
      query:({propertyId, payload} : {propertyId: string, payload:leaveComment}) => ({
        url: `/api/property/${propertyId}/comment`,
        method:"POST",
        body:payload
      })
    }),

    fetchAllPropertyByAgent: builder.query({
      query: (agentId:string) => `/api/property/agent/${agentId}`
    })
    
  }),

});

export const {
  useCreatePropertyMutation,
  useGetAllUserPropertiesQuery,
  useGetAllPublicPropertiesQuery,
  useLogPropertyViewAndNotifyMutation,
  useFetchPropertyByIdQuery,
  useFetchPublishPropertyByAgentIdQuery,
  useFetchCommentForSpecificPropertyQuery,
  useSendMessageToAnAgentMutation,
  useFetchAllMessageToASpecificAgentQuery,
  useLeaveCommentsForASpecificPropertyMutation,
  useFetchAllPropertyByAgentQuery
} = propertyApi;
