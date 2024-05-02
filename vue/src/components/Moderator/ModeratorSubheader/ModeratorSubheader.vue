<template>
  <div class="subheader">
    <div class="subheader__container">
      <slot></slot>

      <moderator-subheader-filters-toggle
        v-if="hasFiltersSlot && filtersToggable"
        @click="toggleFilters"
      ></moderator-subheader-filters-toggle>
    </div>

    <div
      class="subheader__filters"
      :class="{
        'subheader__filters--toggable': filtersToggable,
        'subheader__filters--hidden': filtersHidden,
        'subheader__filters--transition': filtersAnimating,
      }"
      v-if="hasFiltersSlot"
    >
      <div
        class="subheader__filters-background"
        v-if="filtersToggable"
        @click="toggleFilters"
      ></div>

      <div class="subheader__container">
        <div class="subheader__filters-heading">
          <font-awesome-icon
            icon="sliders-h"
            class="subheader__filters-heading-icon"
          />
          <span>FILTERS</span>

          <button class="btn subheader__filters-close" @click="toggleFilters">
            <font-awesome-icon icon="times" />
          </button>
        </div>

        <slot name="filters"></slot>

        <button
          class="btn btn--filled subheader__filters-submit"
          @click="toggleFilters"
        >
          GO
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ModeratorSubheaderFiltersToggle from "@/components/Moderator/ModeratorSubheader/Elements/ModeratorSubheaderFiltersToggle.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSlidersH, faTimes } from "@fortawesome/free-solid-svg-icons";

import "@/assets/styles/moderator/subheader.scss";

library.add(faSlidersH, faTimes);

export default {
  components: {
    ModeratorSubheaderFiltersToggle,
  },

  props: {
    filtersToggable: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      filtersVisible: !this.filtersToggable,
      filtersAnimating: false,
    };
  },

  methods: {
    toggleFilters: function () {
      if (this.filtersToggable) {
        this.filtersVisible = !this.filtersVisible;
        this.filtersAnimating = true;

        setTimeout(() => (this.filtersAnimating = false), 200);
      }
    },
  },

  computed: {
    hasFiltersSlot: function () {
      return typeof this.$slots.filters !== "undefined";
    },

    filtersHidden: function () {
      return this.filtersToggable && !this.filtersVisible;
    },
  },
};
</script>

<style lang="scss" scoped></style>
