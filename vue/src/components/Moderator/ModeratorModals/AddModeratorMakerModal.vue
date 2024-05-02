<template>
  <kivi-modal :open="open" @close="onModalClose">
    <template #label>
      <div class="modal-label">Add an Additional Maker</div>
    </template>

    <template #body>
      <div>
        <div class="field-wrapper">
          <p class="field-wrapper--label">Choose maker:</p>
          <moderator-form-select
            :bordered="true"
            v-model="model"
            :options="makerOptions"
          />
        </div>

        <div class="field-wrapper">
          <p class="field-wrapper--label">New Application URL:</p>
          <moderator-form-input :bordered="true" v-model="externalLink" />
        </div>

        <div class="info-note">
          Please paste the link to this Maker's online application here. App
          will open this link when you choose to send an Application to this
          Maker.
        </div>

        <div class="info-note">
          If you need to log in to submit a new application, please provide your
          login credentials below. Your credentials will be securely stored and
          will only be used when submitting an application.
        </div>

        <div class="field-wrapper">
          <p class="field-wrapper--label">Username:</p>
          <moderator-form-input
            autocomplete="off"
            :bordered="true"
            v-model="username"
          />
        </div>

        <div class="field-wrapper">
          <p class="field-wrapper--label">Password:</p>
          <moderator-form-input
            :security-font="true"
            :bordered="true"
            v-model="password"
            autocomplete="off"
          />
        </div>

        <div class="button-wrapper">
          <kivi-button :rounded="true" :full-width="true" @click="submit">
            Continue
          </kivi-button>
        </div>

        <p class="not-found-hint">
          Don't see what you're looking for? Please reach out to
          <span>support@kivi.ai</span> to add a new maker to this list
        </p>
      </div>
    </template>
  </kivi-modal>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import KiviModal from "@/components/Common/KiviModal.vue";
import KiviButton from "@/components/Common/KiviButton.vue";
import ModeratorFormSelect from "@/components/Moderator/ModeratorForm/ModeratorFormSelect.vue";
import ModeratorFormInput from "@/components/Moderator/ModeratorForm/ModeratorFormInput.vue";
import { mapActions, mapState } from "pinia";
import { useMakerStore } from "@/stores/maker";

library.add(faPen);

export default {
  props: {
    open: Boolean,
  },

  components: {
    KiviModal,
    KiviButton,
    ModeratorFormInput,
    ModeratorFormSelect,
  },

  mounted() {
    this.fetchMakers();
  },

  data() {
    return {
      model: "",
      externalLink: "",
      username: "",
      password: "",
    };
  },

  methods: {
    async submit() {
      try {
        const data = {
          makerId: this.model,
          link: this.externalLink,
          username: this.username,
          password: this.password,
        };

        await this.addModeratorMaker(data);
        await this.fetchModeratorMakers();

        this.onModalClose();
      } catch (e) {
        console.error(e);
      }
    },

    onModalClose() {
      this.model = "";
      this.externalLink = "";
      this.username = "";
      this.password = "";

      this.$emit("close");
    },

    ...mapActions(useMakerStore, {
      fetchMakers: "fetchMakers",
      fetchModeratorMakers: "fetchModeratorMakers",
      addModeratorMaker: "addModeratorMaker",
    }),
  },

  computed: {
    ...mapState(useMakerStore, ["makers", "moderatorMakers"]),

    makerOptions() {
      const addedMakersIds = this.moderatorMakers.map((d) => d.id);
      const makers = this.makers.filter(
        (maker) => !addedMakersIds.includes(maker.id),
      );

      return makers.map((maker) => ({
        value: maker.id + "",
        label: maker.name,
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main";

.modal-label {
  font-size: 26px;
  font-weight: 400;
  margin-bottom: 16px;
}

.info-note {
  max-width: 500px;
  margin-bottom: 15px;
  font-size: 14px;
  font-family: Helvetica, serif;
  line-height: 1.3;
}

.button-wrapper {
  max-width: 200px;
  margin: 0 auto 12px auto;
}

.not-found-hint {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.3;
  max-width: 400px;
  margin: 0 auto;

  span {
    font-weight: 600;
    color: $brand-green;
  }
}

.field-wrapper {
  display: flex;
  align-items: center;
  margin: 20px 0;

  &--label {
    font-size: 20px;
    margin: 0;
    width: 40%;
  }

  .moderator-form__element {
    width: 60%;
  }
}
</style>
