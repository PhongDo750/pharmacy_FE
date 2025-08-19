import { BaseService } from "../base/BaseService";

export class PharmacyService extends BaseService {
  constructor() {
    super("pharmacy");
  }

  async getPharmacyUnitById(pharmacyUnitId) {
    try {
      const response = await this.getBaseById(pharmacyUnitId);
      return response;
    } catch (error) {
      console.error("Error fetching pharmacy unit details:", error);
      return null;
    }
  }
} 