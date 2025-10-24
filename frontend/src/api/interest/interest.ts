import apiClient from "@/lib/apiClient";
import { parseApiResponse } from "../parseResponse";
import { type Interests, InterestsSchema } from "@/types/user";
import { createApiResponseSchema } from "../schema";
import { getToastMessage } from "@/lib/messageMap";

export const interestApi = {
  findAll: async (): Promise<Interests> => {
    const response = await parseApiResponse(apiClient.get('/interests/all'), createApiResponseSchema(InterestsSchema));
    if (!response.success) {
      throw new Error(getToastMessage(response.messageKey));
    }
    return response.data;
  },
};