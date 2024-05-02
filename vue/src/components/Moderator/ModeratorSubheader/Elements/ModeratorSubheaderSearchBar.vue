<template>
  <div class="subheader__search-bar">
    <form @submit.prevent="onSubmit">
      <input type="text" name="search-string" v-model="searchString" />
      <button class="subheader__search-button">
        <font-awesome-icon icon="search" />
      </button>
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

library.add(faSearch);

export default {
  model: {
    prop: "model",
    event: "search",
  },

  props: {
    model: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      searchString: this.model,
      lastSearchString: this.model,
    };
  },

  methods: {
    onSubmit: function (e) {
      let searchString = e.target.elements["search-string"].value;

      if (searchString === this.lastSearchString) {
        return;
      }

      this.$emit("search", searchString);

      this.lastSearchString = searchString;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/moderator/mixins.scss";
@import "@/assets/styles/moderator/variables.scss";

$border-color: #eef9ef;

.subheader__search-bar {
  position: absolute;

  left: 0;
  right: 0;

  width: 60%;
  margin: auto;

  color: $brand-dark-gray;

  @include ie-11 {
    @include absolute-center-vertically-with-transform;
  }

  @media (min-width: 375px) {
    width: 245px;
  }

  @media (min-width: 992px) {
    width: 290px;
  }

  input {
    width: 100%;
    height: 33px;

    padding-left: 34px;
    padding-right: 16px;

    border: 1px solid $border-color;
    border-radius: 19px;

    color: inherit;
    font-family: inherit;
    outline: none;

    background-color: #fff;
    box-shadow: $shadow-6-percent;

    @media (min-width: 992px) {
      height: 38px;

      padding-left: 40px;
      padding-right: 20px;
    }
  }

  .subheader__search-button {
    position: absolute;
    left: 0;

    width: 34px;
    height: 100%;
    padding: 0 0 0 6px;

    border: none;
    border-radius: 50% 0 0 50%;

    font-size: 12px;
    color: inherit;
    background-color: transparent;

    cursor: pointer;
    outline: none;

    @media (min-width: 992px) {
      width: 40px;
      font-size: 14px;
    }
  }
}
</style>
