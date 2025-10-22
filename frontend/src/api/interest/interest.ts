import apiClient from "@/lib/apiClient";
import { parseApiResponse } from "../parseResponse";
import { GetAllInterestsResponseSchema, type GetAllInterestsResponse } from "./schema";

export const interestApi = {
  findAll: async (): Promise<GetAllInterestsResponse> => {
    return parseApiResponse(apiClient.get('/interests/all'), GetAllInterestsResponseSchema);
  },
};