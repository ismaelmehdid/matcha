import apiClient from "@/lib/apiClient";
import { parseApiResponse } from "../parseResponse";
import { InterestsSchema, type Interest } from "@/types/interest";
import { createApiResponseSchema } from "../schema";

export const interestApi = {
  findAll: async (): Promise<Interest[]> => {
    const response = await parseApiResponse(apiClient.get('/interests/all'), createApiResponseSchema(InterestsSchema));
    if (!response.success) {
      throw new Error(response.messageKey);
    }
    return response.data;
  },
};