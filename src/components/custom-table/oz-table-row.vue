<script lang="jsx">
export default {
  name: 'oz-table-row',
  props: {
    row: {
      type: Object,
      required: true,
    },
    columnsOptions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    renderCells(row, columnsOptions) {
      return columnsOptions.map((column) => {
        return (
          <div key={column.prop} class={this.$style.cell}>
            {column.scopedSlots.body ? (
              column.scopedSlots.body({ row })
            ) : (
              <p class={this.$style.cellText}>{row[column.prop]}</p>
            )}
          </div>
        );
      });
    },
  },
  render() {
    return (
      <div key={this.row.id} class={this.$style.grid}>
        {...this.renderCells(this.row, this.columnsOptions)}
      </div>
    );
  },
};
</script>

<style module>
.grid {
  display: grid;
  grid-template-columns: 10% 12.5% 25% 25% 27.5%;
  grid-template-rows: 110px;
}

.cell {
  text-align: left;
  border-bottom: 1px solid #c8cacc;
  padding: 1rem;
}

.cellText {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
