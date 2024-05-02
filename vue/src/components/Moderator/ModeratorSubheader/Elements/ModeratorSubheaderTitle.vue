<template>
  <h2 class="subheader__title">
    <slot></slot>
  </h2>
</template>

<script>
export default {
  data() {
    return {};
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.subheader__title {
  margin: 0;

  color: #fff;
  font-size: 18px;

  @media (min-width: 768px) {
    padding-left: 28px;
    padding-right: 28px;

    font-size: 24px;
  }

  @media (min-width: 992px) {
    font-size: 30px;
  }
}
</style>
