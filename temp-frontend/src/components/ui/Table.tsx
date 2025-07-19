import React from 'react';
import styled from 'styled-components';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  sortable?: boolean;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  currentSort?: {
    key: keyof T;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  loading?: boolean;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableBody = styled.tbody`
  tr:hover {
    background-color: #f8f9fa;
  }
`;

const TableRow = styled.tr<{ clickable?: boolean }>`
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  text-align: left;
  color: #333;
`;

const TableHeaderCell = styled.th<{ sortable?: boolean }>`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #666;
  cursor: ${({ sortable }) => (sortable ? 'pointer' : 'default')};
  user-select: none;

  &:hover {
    background-color: ${({ sortable }) => (sortable ? '#f0f0f0' : 'inherit')};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 8px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${({ active }) => (active ? '#4a90e2' : '#ddd')};
  background-color: ${({ active }) => (active ? '#4a90e2' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#333')};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ active }) => (active ? '#357abd' : '#f8f9fa')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingRow = styled.tr`
  td {
    padding: 24px;
    text-align: center;
    color: #666;
  }
`;

const SortIcon = styled.span<{ direction?: 'asc' | 'desc' }>`
  margin-left: 4px;
  display: inline-block;
  transform: ${({ direction }) => (direction === 'desc' ? 'rotate(180deg)' : 'none')};
`;

function Table<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  sortable = false,
  onSort,
  currentSort,
  pagination,
  loading = false,
}: TableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (!sortable || !onSort) return;

    const direction =
      currentSort?.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort(key, direction);
  };

  return (
    <TableContainer>
      <StyledTable>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell
                key={String(column.key)}
                sortable={sortable}
                onClick={() => handleSort(column.key as keyof T)}
              >
                {column.header}
                {sortable && currentSort?.key === column.key && (
                  <SortIcon direction={currentSort.direction}>▼</SortIcon>
                )}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <LoadingRow>
              <td colSpan={columns.length}>Loading...</td>
            </LoadingRow>
          ) : (
            data.map((item) => (
              <TableRow
                key={item.id}
                clickable={!!onRowClick}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      {pagination && (
        <PaginationContainer>
          <PageButton
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </PageButton>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <PageButton
                key={page}
                active={page === pagination.currentPage}
                onClick={() => pagination.onPageChange(page)}
              >
                {page}
              </PageButton>
            )
          )}
          <PageButton
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </PageButton>
        </PaginationContainer>
      )}
    </TableContainer>
  );
}

export default Table; 