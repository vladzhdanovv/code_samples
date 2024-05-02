<template>
  <div class="kivi-code-wrapper">
    <moderator-table-base>
      <template #head v-if="columns && columns.length">
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
        </tr>
      </template>

      <template #body v-if="data && data.length">
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="column in columns" :key="column.key">
            <slot
              v-if="column.slot"
              :name="generateSlotName(column)"
              :column="column"
              :row="row"
            />
            <div v-else>
              {{ row[column.key] }}
            </div>
          </td>
        </tr>
      </template>
    </moderator-table-base>
  </div>
</template>

<script>
import ModeratorTableBase from "@/components/Moderator/ModeratorTables/ModeratorTableBase.vue";

export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  methods: {
    convertToKebabCase(string) {
      return string
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
    },
    generateSlotName(column) {
      return this.convertToKebabCase(`column-${column.key}`);
    },
  },
  components: {
    ModeratorTableBase,
  },
};
</script>

<style lang="scss" scoped></style>
