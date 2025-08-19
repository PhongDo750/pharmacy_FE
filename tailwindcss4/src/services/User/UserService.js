import { BaseService } from "../base/BaseService";

export class UserService extends BaseService {
  constructor() {
    super("users");
  }

  async getUserById(userId) {
    try {
      if (typeof userId === 'string') return null;
      const response = await this.getBaseById(userId);
      return response;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  }
} 