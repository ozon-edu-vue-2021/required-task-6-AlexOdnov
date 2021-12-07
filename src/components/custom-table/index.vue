<template>
  <oz-table
    :rows="rows"
    @getPage="infGetPage"
    @changePage="changePage"
    :virtScroll="virtScroll"
    :infScroll="infScroll"
    :paginate="paginate"
    :currentPage="currentPage"
    :perPage="perPage"
    :totalPages="totalPages"
  >
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
    virtScroll: {
      type: Boolean,
      default: false,
    },
    infScroll: {
      type: Boolean,
      default: false,
    },
    paginate: {
      type: Boolean,
      default: false,
    },
    perPage: {
      type: Number,
      default: 20,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      rows: [],
      currentPage: 1,
    };
  },
  async created() {
    if (this.infScroll) {
      this.blockingPromise = this.getPage(1);
    } else {
      const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
      this.rows = await res.json();
    }
  },
  methods: {
    async getPage(number) {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${number}`
      );
      this.rows = await res.json();
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
      this.rows = [...this.rows, ...newRows];
      this.currentPage++;
    },
    changePage(number) {
      this.currentPage = number;
    },
  },
};
</script>
