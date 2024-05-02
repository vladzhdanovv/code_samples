<template>
  <kivi-modal
    :open="open"
    title="Are you sure that you want to remove this maker ?"
    @close="onModalClose"
  >
    <template #body>
      <div class="button-wrapper">
        <kivi-button :rounded="true" @click="onModalClose">No</kivi-button>
        <kivi-button :rounded="true" @click="submit" variant="danger">
          Yes
        </kivi-button>
      </div>
    </template>
  </kivi-modal>
</template>

<script>
import KiviModal from "@/components/Common/KiviModal.vue";
import KiviButton from "@/components/Common/KiviButton.vue";
import { mapActions } from "pinia";
import { useMakerStore } from "@/stores/maker";

export default {
  components: {
    KiviModal,
    KiviButton,
  },

  props: {
    open: Boolean,
    makerId: [Number, String],
  },

  data() {
    return {};
  },

  methods: {
    async submit() {
      try {
        await this.deleteModeratorMaker(this.makerId);
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
      deleteModeratorMaker: "deleteModeratorMaker",
      fetchModeratorMakers: "fetchModeratorMakers",
    }),
  },
};
</script>

<style lang="scss" scoped>
.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
