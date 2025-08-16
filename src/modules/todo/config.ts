export const TODO_CONFIG = {
  PAGE_SIZE: 10,
  DEFAULT_SORT: 'title',
  DEFAULT_SORT_DIRECTION: 'asc' as const,
  FILTER_FIELDS: ['title', 'description', 'is_completed'] as const,
  TABLE_COLUMNS: ['id', 'title', 'description', 'is_completed', 'actions'] as const,
} as const; 