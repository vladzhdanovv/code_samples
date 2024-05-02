<template>
  <div class="makers-view">
    <moderator-subheader>
      <moderator-subheader-title>Makers</moderator-subheader-title>

      <moderator-subheader-search-bar @search="search" />
    </moderator-subheader>

    <div class="makers-view__container">
      <kivi-table :columns="columns" :data="moderatorMakers || []">
        <template #column-name="slotProps">
          <div>
            <div class="maker-image">
              <img :src="slotProps.row.image.image_url" />
            </div>
            <p class="maker-name">{{ slotProps.row.name }}</p>
          </div>
        </template>

        <template #column-external-link="slotProps">
          <a
            :href="slotProps.row.pivot.link"
            target="_blank"
            v-if="slotProps.row.pivot.link"
          >
            {{ slotProps.row.pivot.link }}
          </a>
          <p v-else>-</p>
        </template>

        <template #column-actions="slotProps">
          <div class="actions-button">
            <div
              class="action-button"
              @click="onEditMakerClick(slotProps.row.id)"
            >
              <font-awesome-icon icon="pen" size="2x" />
            </div>
            <div
              class="action-button"
              @click="onDeleteMakerClick(slotProps.row.id)"
            >
              <font-awesome-icon icon="trash" size="2x" />
            </div>
          </div>
        </template>
      </kivi-table>
    </div>

    <div class="makers-view__footer">
      <kivi-button :rounded="true" @click="onAddMakerClick">
        Add maker
      </kivi-button>
    </div>

    <add-moderator-maker-modal
      :open="isAddMakerModalOpen"
      @close="onAddModalClose"
    />
    <edit-moderator-maker-modal
      :open="isEditMakerModalOpen"
      :maker-id="selectedMakerId"
      @close="onEditModalClose"
    />
    <delete-moderator-maker-modal
      :open="isDeleteMakerModalOpen"
      :maker-id="selectedMakerId"
      @close="onDeleteModalClose"
    />
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddModeratorMakerModal from "@/components/Moderator/ModeratorModals/AddModeratorMakerModal.vue";
import EditModeratorMakerModal from "@/components/Moderator/ModeratorModals/EditModeratorMakerModal.vue";
import DeleteModeratorMakerModal from "@/components/Moderator/ModeratorModals/DeleteModeratorMakerModal.vue";
import KiviTable from "@/components/Common/KiviTable.vue";
import KiviButton from "@/components/Common/KiviButton.vue";
import ModeratorSubheader from "@/components/Moderator/ModeratorSubheader/ModeratorSubheader.vue";
import ModeratorSubheaderTitle from "@/components/Moderator/ModeratorSubheader/Elements/ModeratorSubheaderTitle.vue";
import ModeratorSubheaderSearchBar from "@/components/Moderator/ModeratorSubheader/Elements/ModeratorSubheaderSearchBar.vue";
import { mapActions, mapState } from "pinia";
import { useMakerStore } from "@/stores/maker";
import { useAuthStore } from "@/stores/auth";

library.add(faPen, faTrash);

export default {
  components: {
    KiviTable,
    AddModeratorMakerModal,
    EditModeratorMakerModal,
    DeleteModeratorMakerModal,
    KiviButton,
    ModeratorSubheader,
    ModeratorSubheaderTitle,
    ModeratorSubheaderSearchBar,
  },

  data() {
    return {
      isAddMakerModalOpen: false,
      isEditMakerModalOpen: false,
      isDeleteMakerModalOpen: false,
      selectedMakerId: null,

      columns: [
        {
          key: "name",
          label: "Maker",
          slot: true,
        },
        {
          key: "externalLink",
          label: "External link",
          slot: true,
        },
        {
          key: "actions",
          slot: true,
        },
      ],
    };
  },

  mounted() {
    this.fetchModeratorMakers();
  },

  computed: {
    ...mapState(useAuthStore, ["user"]),
    ...mapState(useMakerStore, ["moderatorMakers"]),
  },

  methods: {
    ...mapActions(useMakerStore, {
      fetchModeratorMakers: "fetchModeratorMakers",
    }),

    search(searchString) {
      this.fetchModeratorMakers(searchString);
    },

    onAddMakerClick() {
      this.isAddMakerModalOpen = true;
    },

    onEditMakerClick(makerId) {
      this.isEditMakerModalOpen = true;

      this.selectedMakerId = makerId;
    },

    onDeleteMakerClick(makerId) {
      this.isDeleteMakerModalOpen = true;

      this.selectedMakerId = makerId;
    },

    onAddModalClose() {
      this.isAddMakerModalOpen = false;
    },

    onEditModalClose() {
      this.isEditMakerModalOpen = false;
      this.selectedMakerId = null;
    },

    onDeleteModalClose() {
      this.isDeleteMakerModalOpen = false;
      this.selectedMakerId = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.makers-view {
  display: flex;
  flex-direction: column;

  .maker-image {
    max-width: 300px;
    height: 50px;
    margin-bottom: 1em;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: left;
    }
  }

  .maker-name {
    font-weight: 600;
    font-size: 14px;
    margin: 0;
  }

  &__container {
    margin-bottom: 24px;
  }

  ::v-deep {
    .subheader__title {
      @media (max-width: 767px) {
        display: none;
      }
    }
  }

  .actions-button {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 9px;

    .action-button {
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 1em;
      cursor: pointer;
    }
  }

  .makers-view__footer {
    padding: 0 24px;
  }
}
</style>
