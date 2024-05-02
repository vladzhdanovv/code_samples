import { defineStore } from "pinia";
import Api from "@/services/api";
import { decryptPassword } from "@/utils/decryptPassword";

export const useMakerStore = defineStore("maker", {
  state: () => ({
    makers: [],
    moderatorMakers: [],
  }),

  actions: {
    /**
     * Fetch all makers.
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    fetchMakers() {
      return Api.get("maker/fetch").then((response) => {
        this.makers = response.data.data;
      });
    },

    /**
     * Fetch all makers.
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    fetchModeratorMakers(searchString = "") {
      return Api.get("moderator/makers", { searchString }).then((response) => {
        this.moderatorMakers = response.data.data;
      });
    },

    /**
     * Add moderator maker
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    addModeratorMaker(data) {
      return Api.post("moderator/makers", data);
    },

    /**
     * Edit moderator maker
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    editModeratorMaker(makerId, data) {
      return Api.put(`moderator/makers/${makerId}`, data);
    },

    /**
     * Edit moderator maker
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    deleteModeratorMaker(makerId) {
      return Api.delete("moderator/makers", makerId);
    },

    /**
     * Get moderator maker encrypted password and decryption key
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    async getMakerPassword(makerId) {
      const {
        data: { password, iv },
      } = await this.getEncryptedPassword(makerId);
      const {
        data: { key },
      } = await this.getDecryptionKey(makerId);

      return decryptPassword(password, key, iv);
    },

    /**
     * Get moderator maker encrypted password and iv
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    getEncryptedPassword(makerId) {
      return Api.get(`moderator/makers/${makerId}/encrypted-password`);
    },

    /**
     * Get moderator maker password decryption key
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    getDecryptionKey(makerId) {
      return Api.post(`moderator/makers/${makerId}/decryption-key`);
    },
  },
});
