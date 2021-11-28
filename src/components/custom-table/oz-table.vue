<script lang="jsx">
import { orderBy } from 'lodash/collection';
import FilterDropdown from './filter-dropdown';
import OzTableRow from './oz-table-row';

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
      sortProp: [],
      sortDirection: [],
      filterProp: '',
      filterText: '',
    };
  },
  computed: {
    sortedRows() {
      let res;

      if (!this.sortDirection.length) {
        res = this.rows;
      }

      res = orderBy(this.rows, this.sortProp, this.sortDirection);

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
      const index = this.sortProp.indexOf(prop);
      if (index !== -1) {
        const sortDirection =
          this.sortDirection[index] === 'desc' ? 'asc' : 'desc';
        this.sortDirection.splice(index, 1, sortDirection);
      } else {
        this.sortProp.push(prop);
        this.sortDirection.push('desc');
      }
    },
    removeSort(prop) {
      const index = this.sortProp.indexOf(prop);
      this.sortProp.splice(index, 1);
      this.sortDirection.splice(index, 1);
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

        const index = sortProp.indexOf(column.prop);

        if (index !== -1) {
          sortIcon =
            sortDirection[index] === 'asc'
              ? 'sort-amount-down'
              : 'sort-amount-up';
        }

        return (
          <div key={column.prop} class={$style.headerCell}>
            <span>{renderedTitle}</span>
            <font-awesome-icon
              class={$style.sortIcon}
              icon={sortIcon}
              on={{ click: () => this.toggleSort(column.prop) }}
            />
            <font-awesome-icon
              class={$style.sortIcon}
              icon="times"
              on={{ click: () => this.removeSort(column.prop) }}
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

    return (
      <div class={this.$style.table}>
        <div class={this.$style.thead}>{...columnsHead}</div>
        <RecycleScroller
          items={this.sortedRows}
          itemSize={110}
          pageMode
          scopedSlots={{
            default: ({ item }) => (
              <OzTableRow row={item} columnsOptions={columnsOptions} />
            ),
          }}
        />
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

.grid {
  display: grid;
  grid-template-columns: 10% 12.5% 25% 25% 27.5%;
}

.thead {
  composes: grid;
  position: sticky;
  top: 0;
  z-index: 2;
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
}

.sortIcon:hover {
  cursor: pointer;
}
</style>
