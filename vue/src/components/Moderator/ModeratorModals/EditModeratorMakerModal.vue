<template>
  <kivi-modal :open="open" title="Edit Maker" @close="onModalClose">
    <template #body>
      <div>
        <div class="inputs-wrapper">
          <div class="input-wrapper">
            <p class="input-label">Maker:</p>
            <moderator-form-input
              :bordered="true"
              v-model="model.name"
              read-only
            />
          </div>

          <div class="input-wrapper">
            <p class="input-label">Link:</p>
            <moderator-form-input :bordered="true" v-model="model.link" />
          </div>
          <div class="input-wrapper">
            <p class="input-label">Username:</p>
            <moderator-form-input
              autocomplete="off"
              :bordered="true"
              v-model="model.username"
            />
          </div>
          <div class="input-wrapper">
            <p class="input-label">Password:</p>
            <moderator-form-input
              autocomplete="off"
              :security-font="true"
              :bordered="true"
              v-model="model.password"
            />
          </div>
        </div>

        <div class="button-wrapper">
          <kivi-button :rounded="true" @click="submit"> Save</kivi-button>
        </div>
      </div>
    </template>
  </kivi-modal>
</template>

<script>
import { mapActions, mapState } from "pinia";

import KiviModal from "@/components/Common/KiviModal.vue";
import KiviButton from "@/components/Common/KiviButton.vue";
import ModeratorFormInput from "@/components/Moderator/ModeratorForm/ModeratorFormInput.vue";
import { useMakerStore } from "@/stores/maker";

export default {
  props: {
    open: Boolean,
    makerId: [Number, String],
  },

  components: {
    KiviModal,
    KiviButton,
    ModeratorFormInput,
  },

  data() {
    return {
      model: {
        name: "",
        link: "",
        username: "",
        password: "",
      },
    };
  },

  methods: {
    async submit() {
      try {
        const { link, username, password } = this.model;

        const data = { link, username, password };

        await this.editModeratorMaker(this.makerId, data);
        await this.fetchModeratorMakers();

        this.onModalClose();
      } catch (e) {
        console.error(e);
      }
    },

    onModalClose() {
      this.$emit("close");
    },

    ...mapActions(useMakerStore, {
      editModeratorMaker: "editModeratorMaker",
      fetchModeratorMakers: "fetchModeratorMakers",
    }),
  },

  computed: {
    ...mapState(useMakerStore, ["moderatorMakers"]),
  },

  watch: {
    makerId(newMakerId) {
      if (!newMakerId) return;

      const maker = this.moderatorMakers.find(
        (maker) => +maker.id === +this.makerId,
      );

      if (!maker) return;

      this.model = {
        name: maker.name,
        link: maker.pivot.link,
        username: maker.pivot.username,
        password: maker.pivot.password,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.inputs-wrapper {
  margin-bottom: 14px;
}

.input-wrapper {
  display: flex;
  align-items: center;

  .input-label {
    width: 25%;
    font-size: 11px;
    margin-right: 10px;
  }

  .moderator-form__element {
    width: 75%;
  }
}
</style>
