<script lang="jsx">
import { orderBy } from 'lodash/collection';
import FilterDropdown from './filter-dropdown';

export default {
  name: 'oz-table',
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      sortProp: '',
      sortDirection: '',
      filterProp: '',
      filterText: '',
    };
  },
  computed: {
    sortedRows() {
      let res;

      if (!this.sortProp) {
        res = this.rows;
      }

      res = orderBy(this.rows, [this.sortProp], [this.sortDirection]);

      if (this.filterText) {
        res = res.filter(
          (row) => row[this.filterProp].search(this.filterText) > -1
        );
      }

      return res;
    },
  },
  methods: {
    toggleSort(prop) {
      this.sortProp = prop;
      this.sortDirection =
        this.sortDirection === 'desc' || !this.sortDirection ? 'asc' : 'desc';
    },
    openFilterTooltip(prop = '') {
      this.filterProp = prop;
      this.filterText = '';
    },
    setFilterText(e) {
      this.filterText = e.target.value;
    },
    renderHead(h, columnsOptions) {
      const { $style, sortProp, sortDirection, filterProp, filterText } = this;

      return columnsOptions.map((column) => {
        const renderedTitle = column.scopedSlots.title
          ? column.scopedSlots.title()
          : column.title;
        let sortIcon = 'sort';

        if (sortProp === column.prop) {
          sortIcon =
            sortDirection === 'asc' ? 'sort-amount-down' : 'sort-amount-up';
        }

        return (
          <div key={column.prop} class={$style.headerCell}>
            <span>{renderedTitle}</span>
            <font-awesome-icon
              class={$style.sortIcon}
              icon={sortIcon}
              on={{ click: () => this.toggleSort(column.prop) }}
            />
            <FilterDropdown
              columnProp={column.prop}
              shown={column.prop === filterProp}
              filterText={filterText}
              on={{
                openFilterTooltip: () => this.openFilterTooltip(column.prop),
                closeFilterTooltip: () => this.openFilterTooltip(),
                setFilterText: this.setFilterText,
              }}
            />
          </div>
        );
      });
    },
    renderRows(h, columnsOptions) {
      return this.sortedRows.map((row, index) => {
        return (
          <div key={row.id || index} class={this.$style.grid}>
            {...this.renderColumns(h, row, columnsOptions)}
          </div>
        );
      });
    },
    renderColumns(h, row, columnsOptions) {
      return columnsOptions.map((column) => {
        return (
          <div key={column.prop} class={this.$style.cell}>
            {column.scopedSlots.body
              ? column.scopedSlots.body({ row })
              : row[column.prop]}
          </div>
        );
      });
    },
    getColumnOptions() {
      return this.$slots.default
        .filter(
          (item) =>
            item.componentOptions &&
            item.componentOptions.tag === 'oz-table-column'
        )
        .map((column) =>
          Object.assign({}, column.componentOptions.propsData, {
            scopedSlots: column.data.scopedSlots || {},
          })
        );
    },
  },
  render(h) {
    const columnsOptions = this.getColumnOptions();
    const columnsHead = this.renderHead(h, columnsOptions);
    const rows = this.renderRows(h, columnsOptions);

    return (
      <div class={this.$style.table}>
        <div class={(this.$style.thead, this.$style.grid)}>
          {...columnsHead}
        </div>
        <div>{...rows}</div>
      </div>
    );
  },
};
</script>

<style module>
.table {
  border-spacing: 0;
  width: 100%;
}

.thead {
  position: sticky;
  top: 0;
}

.grid {
  display: grid;
  grid-template-columns: 10% 10% 25% 25% 30%;
}

.cell {
  text-align: left;
  border-bottom: 1px solid #c8cacc;
  padding: 1rem;
}

.headerCell {
  composes: cell;
  display: flex;
  align-items: center;
  background: #c7cbcb;
}

.sortIcon {
  margin-left: 8px;
  margin-right: 24px;
}

.sortIcon:hover {
  cursor: pointer;
}
</style>
