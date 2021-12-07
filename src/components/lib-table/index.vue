<template>
  <b-table
    :data="data"
    :columns="columns"
    pagination-size="is-small"
    per-page="20"
    paginated
    pagination-rounded
    sort-multiple
  />
</template>

<script>
export default {
  name: 'custom-table',
  data() {
    return {
      data: [],
      columns: [
        {
          label: 'Post ID',
          field: 'postId',
          searchable: true,
          sortable: true,
          width: '10%',
        },
        {
          label: 'ID',
          field: 'id',
          searchable: true,
          sortable: true,
          width: '10%',
        },
        {
          label: 'Name',
          field: 'name',
          searchable: true,
          sortable: true,
          width: '25%',
        },
        {
          label: 'Email',
          field: 'email',
          searchable: true,
          sortable: true,
          width: '25%',
        },
        {
          label: 'Content',
          field: 'body',
          searchable: true,
          sortable: true,
          width: '30%',
        },
      ],
    };
  },
  async created() {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
    this.data = await res.json();
  },
};
</script>

<style></style>
