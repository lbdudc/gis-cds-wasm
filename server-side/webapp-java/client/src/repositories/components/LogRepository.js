import { HTTP } from "@/common/http-common";
const LOG_RESOURCE_NAME = `logs`;

export default {
  async save(log) {
    return await HTTP.post(`${LOG_RESOURCE_NAME}`, log);
  },
};
