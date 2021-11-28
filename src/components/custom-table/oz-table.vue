<script lang="jsx">
import { orderBy } from 'lodash/collection';
import FilterDropdown from './filter-dropdown';
import OzTableRow from './oz-table-row';
import OzInfPaginator from './oz-inf-paginator';
import OzPaginator from './oz-paginator';

export default {
  name: 'oz-table',
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
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
    currentPage: {
      type: Number,
      default: 1,
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
      sortProp: [],
      sortDirection: [],
      filterProp: [],
      filterText: [],
    };
  },
  computed: {
    sortedRows() {
      let res;

      if (!this.sortDirection.length) {
        res = this.rows;
      }

      res = orderBy(this.rows, this.sortProp, this.sortDirection);

      if (this.filterText.length) {
        res = res.filter((row) => {
          for (let i = 0; i < this.filterProp.length; i++) {
            const prop = this.filterProp[i];
            const text = this.filterText[i];
            if (!text) {
              continue;
            }
            const res = row[prop].toString().includes(text);
            if (!res) {
              return false;
            }
          }
          return true;
        });
      }

      if (this.paginate) {
        const start = (this.currentPage - 1) * 10;
        const end = start + this.perPage;
        res = res.splice(start, end);
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
    openFilterTooltip(prop) {
      const index = this.filterProp.indexOf(prop);
      if (index === -1) {
        this.filterProp.push(prop);
        this.filterText.push('');
      }
    },
    closeFilterTooltip(prop) {
      const index = this.filterProp.indexOf(prop);
      if (index !== -1) {
        this.filterProp.splice(index, 1);
        this.filterText.splice(index, 1);
      }
    },
    setFilterText(prop, e) {
      const index = this.filterProp.indexOf(prop);
      this.filterText.splice(index, 1, e.target.value);
    },
    renderHead(h, columnsOptions) {
      const { $style, sortProp, sortDirection, filterProp, filterText } = this;

      return columnsOptions.map((column) => {
        const renderedTitle = column.scopedSlots.title
          ? column.scopedSlots.title()
          : column.title;
        let sortIcon = 'sort';

        const indexSort = sortProp.indexOf(column.prop);

        if (indexSort !== -1) {
          sortIcon =
            sortDirection[indexSort] === 'asc'
              ? 'sort-amount-down'
              : 'sort-amount-up';
        }

        const indexFilter = filterProp.indexOf(column.prop);
        let filterTextEl = '';
        if (indexFilter !== -1) {
          filterTextEl = filterText[indexFilter];
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
              shown={indexFilter !== -1}
              filterText={filterTextEl}
              on={{
                openFilterTooltip: () => this.openFilterTooltip(column.prop),
                closeFilterTooltip: () => this.closeFilterTooltip(column.prop),
                setFilterText: (e) => this.setFilterText(column.prop, e),
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
    renderRows(columnsOptions) {
      return this.sortedRows.map((row) => (
        <OzTableRow row={row} columnsOptions={columnsOptions} />
      ));
    },
  },
  render(h) {
    const columnsOptions = this.getColumnOptions();
    const columnsHead = this.renderHead(h, columnsOptions);

    return (
      <div class={this.$style.table}>
        <div class={this.$style.thead}>{...columnsHead}</div>
        {this.virtScroll ? (
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
        ) : (
          this.renderRows(columnsOptions)
        )}
        {this.infScroll ? (
          <OzInfPaginator on={{ getPage: this.$listeners.getPage }} />
        ) : null}
        {this.paginate ? (
          <OzPaginator
            currentPage={this.currentPage}
            totalPages={this.totalPages}
            on={{ changePage: this.$listeners.changePage }}
          />
        ) : null}
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
