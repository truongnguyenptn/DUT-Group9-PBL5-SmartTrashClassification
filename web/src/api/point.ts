import { Point } from "#/shared/utils/type";
import request from "./request";

// Function to fetch all points
export const fetchAllPoints = (): Promise<Point[]> => {
  return request.get('/bins')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching points:', error);
      throw error;
    });
};

export const updateBin = async (binData: any) => {
  try {
    const response = await request.post('/bin/update', binData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating bin: ');
  }
};
