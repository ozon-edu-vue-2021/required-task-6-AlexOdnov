<template>
  <oz-table :rows="rows">
    <oz-table-column prop="id" title="ID" />
    <oz-table-column prop="postId" title="Post ID" />

    <oz-table-column prop="email">
      <template #title>
        <b>Email</b>
      </template>

      <template #body="{ row }">
        <a :href="`mailto:${row.email}`">{{ row.email }}</a>
      </template>
    </oz-table-column>

    <oz-table-column prop="name" title="Name" />
    <oz-table-column prop="body" title="Content" />
  </oz-table>
</template>

<script>
import OzTable from './oz-table';
import OzTableColumn from './oz-table-column';

export default {
  name: 'SortWrapper',
  components: {
    OzTableColumn,
    OzTable,
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
  },
};
</script>
