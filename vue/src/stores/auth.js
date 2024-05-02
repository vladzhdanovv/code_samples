import { defineStore } from "pinia";
import Api from "@/services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,

    cachedAccessToken: null,
    cachedRefreshToken: null,
    cachedRefreshTokenEmail: null,
  }),

  getters: {
    accessToken(state) {
      if (!state.cachedAccessToken) {
        state.cachedAccessToken = localStorage.getItem("kiviApiAccessToken");
      }

      return state.cachedAccessToken;
    },

    refreshToken(state) {
      if (!state.cachedRefreshToken) {
        state.cachedRefreshToken = localStorage.getItem("kiviApiRefreshToken");
      }

      return state.cachedRefreshToken;
    },

    refreshTokenEmail(state) {
      if (!state.cachedRefreshTokenEmail) {
        state.cachedRefreshTokenEmail = localStorage.getItem(
          "kiviApiRefreshTokenEmail",
        );
      }

      return state.cachedRefreshTokenEmail;
    },

    isAuthenticated(state) {
      return !!(state.accessToken && state.user);
    },
  },

  actions: {
    /**
     * Login with email and password.
     *
     * @param email
     * @param password
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    login(email, password) {
      return Api.post(
        "login",
        {
          email: email,
          password: password,
        },
        {
          skipAuthRefresh: true,
        },
      ).then((response) => {
        this.parseLoginResponse(response.data);
      });
    },

    /**
     * Login with the 'login token', that authenticates the user without email and password.
     *
     * @param token
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    loginWithToken(token) {
      return Api.post(
        "login-with-token",
        {
          token: token,
        },
        {
          skipAuthRefresh: true,
        },
      ).then((response) => {
        this.parseLoginResponse(response.data);
      });
    },

    /**
     * Provide the access and refresh tokens manually.
     *
     * @param accessToken
     * @param refreshToken
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    loginWithAccessToken(accessToken, refreshToken) {
      this.setAccessToken(accessToken);
      this.setRefreshToken(refreshToken);

      return this.loadUser();
    },

    /**
     * Logout.
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    logout() {
      return Api.post("logout").then((response) => {
        this.resetAuthenticatedUser();

        return response;
      });
    },

    /**
     * Refresh the expired access token.
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    refreshAccessToken() {
      const data = {
        email: this.refreshTokenEmail,
        refresh_token: this.refreshToken,
      };

      return Api.post("refresh", data).then((response) => {
        this.setAccessToken(response.data.access_token);
        this.setRefreshToken(response.data.refresh_token, data.email);

        return response;
      });
    },

    /**
     * Change the password.
     *
     * @param password
     * @param passwordConfirmation
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    changePassword(password, passwordConfirmation) {
      return Api.post("user/password", {
        password: password,
        password_confirmation: passwordConfirmation,
      });
    },

    /**
     * Load authenticated user details.
     *
     * @returns {Promise<axios.AxiosResponse<*>>}
     */
    loadUser() {
      return Api.get("user").then((response) => {
        this.user = this.parseUserResource(response.data.data);
      });
    },

    /**
     * Reset authenticated user.
     */
    resetAuthenticatedUser() {
      this.user = null;
      this.setAccessToken(null);
      this.setRefreshToken(null, null);
    },

    /**
     * Parse the login response.
     *
     * @param data
     */
    parseLoginResponse(data) {
      this.user = this.parseUserResource(data.user);

      this.setAccessToken(data.OAuth.access_token);
      this.setRefreshToken(data.OAuth.refresh_token, this.user.email);
    },

    /**
     * Parse the user resource.
     *
     * @param data
     * @returns {{firstName: string, lastName: string, role: string, email: string}}
     */
    parseUserResource(data) {
      const user = {
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role,
      };

      if (user.role === "moderator") {
        user.moderatorship = {
          name: data.moderatorship.name,
        };
      }

      return user;
    },

    /**
     * Set the access token.
     *
     * @param accessToken
     */
    setAccessToken(accessToken) {
      this.cachedAccessToken = accessToken;

      if (accessToken) {
        localStorage.setItem("kiviApiAccessToken", accessToken);
      } else {
        localStorage.removeItem("kiviApiAccessToken");
      }

      Api.setAccessToken(accessToken);
    },

    /**
     * Set the refresh token.
     *
     * @param refreshToken
     * @param refreshTokenEmail
     */
    setRefreshToken(refreshToken, refreshTokenEmail) {
      this.cachedRefreshToken = refreshToken;
      this.cachedRefreshTokenEmail = refreshTokenEmail;

      if (refreshToken) {
        localStorage.setItem("kiviApiRefreshToken", refreshToken);
        localStorage.setItem("kiviApiRefreshTokenEmail", refreshTokenEmail);
      } else {
        localStorage.removeItem("kiviApiRefreshToken");
        localStorage.removeItem("kiviApiRefreshTokenEmail");
      }
    },

    /**
     * Get a user home route based on their role.
     *
     * @returns {string}
     */
    getUserHomeRoute() {
      if (!this.isAuthenticated) {
        throw Error("Not authenticated");
      }

      if (this.user.role === "moderator") {
        return "moderator.applications";
      }

      if (this.user.role === "buyer") {
        throw Error("Buyer area not implemented");
      }

      throw Error(`Unknown role ${this.user.role}`);
    },
  },
});
