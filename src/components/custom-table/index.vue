<template>
  <oz-table :rows="innerRows" @getPage="infGetPage" :infScroll="infScroll">
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
  name: 'CustomTable',
  components: {
    OzTableColumn,
    OzTable,
  },
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    infScroll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      innerRows: this.rows,
      currentPage: 1,
    };
  },
  created() {
    if (this.innerRows.length === 0) {
      this.blockingPromise = this.getPage(1);
    }
  },
  methods: {
    async getPage(number) {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${number}`
      );
      this.innerRows = await res.json();
      this.currentPage = number;
    },
    async infGetPage() {
      this.blockingPromise && (await this.blockingPromise);
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${
          this.currentPage + 1
        }`
      );
      const newRows = await res.json();
      this.innerRows = [...this.innerRows, ...newRows];
      this.currentPage++;
    },
  },
};
</script>
