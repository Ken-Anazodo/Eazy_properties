import baseApi from "@/features/baseApi";
export const agencyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        agencyCreateAgentAndAddAgencyUnderThem: builder.mutation({
            query: (payload: any) => ({
                url: '/api/user/agency/add-agent',
                method: 'POST',
                body: payload
            })
        }),
        agencyViewAllAgents: builder.query({
            query: () => '/api/user/agency/agents'
        }),
        agencyEditAgentUnderThem: builder.mutation({
            query:({agentId, payload} : {agentId: string, payload: any}) => ({
                url: `/api/user/agency/agents/${agentId}`,
                method: 'PUT',
                body: payload
            })
        }),
        agentDeleteAgentUnderThem: builder.mutation({
            query: (agentId: string) => ({
                url: `/api/user/agency/agents/${agentId}`,
                method: 'DELETE'
            })
        })


    })
})