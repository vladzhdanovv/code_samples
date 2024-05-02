<template>
  <button
    class="kivi-button"
    :class="{
      [variant]: !!variant,
      [size]: size,
      rounded: rounded,
      'full-width': fullWidth,
    }"
    @click="click"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: "primary",
    },
    size: {
      type: String,
      default: "middle",
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.kivi-button {
  outline: none;
  border: none;
  border-radius: 2px;
  transition: all ease-in-out 0.3s;
  box-sizing: border-box;

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }

  &.rounded {
    border-radius: 24px;
  }

  &.middle {
    line-height: 24px;
    padding: 6px 24px;
  }

  &.primary {
    color: #ffffff;
    background: $brand-green;
  }

  &.danger {
    color: #ffffff;
    background: $brand-red;
  }

  &.full-width {
    width: 100%;
  }
}
</style>
