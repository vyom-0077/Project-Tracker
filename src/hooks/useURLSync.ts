import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import type { FilterState, ViewType } from '../types';

function encodeFilters(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.statuses.length) params.set('status', filters.statuses.join(','));
  if (filters.priorities.length) params.set('priority', filters.priorities.join(','));
  if (filters.assignees.length) params.set('assignee', filters.assignees.join(','));
  if (filters.dateFrom) params.set('from', filters.dateFrom);
  if (filters.dateTo) params.set('to', filters.dateTo);
  return params;
}

function parseFilters(params: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {};
  const status = params.get('status');
  const priority = params.get('priority');
  const assignee = params.get('assignee');
  const from = params.get('from');
  const to = params.get('to');

  if (status) filters.statuses = status.split(',') as FilterState['statuses'];
  if (priority) filters.priorities = priority.split(',') as FilterState['priorities'];
  if (assignee) filters.assignees = assignee.split(',');
  if (from) filters.dateFrom = from;
  if (to) filters.dateTo = to;

  return filters;
}

export function useURLSync() {
  const { filters, view, setFilters, setView } = useAppStore();

  // On mount: read URL and restore state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsedFilters = parseFilters(params);
    if (Object.keys(parsedFilters).length > 0) {
      setFilters(parsedFilters);
    }
    const viewParam = params.get('view') as ViewType | null;
    if (viewParam && ['kanban', 'list', 'timeline'].includes(viewParam)) {
      setView(viewParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On filter/view change: update URL
  useEffect(() => {
    const params = encodeFilters(filters);
    params.set('view', view);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters, view]);

  // Back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const parsedFilters = parseFilters(params);
      setFilters({
        statuses: [],
        priorities: [],
        assignees: [],
        dateFrom: '',
        dateTo: '',
        ...parsedFilters,
      });
      const viewParam = params.get('view') as ViewType | null;
      if (viewParam && ['kanban', 'list', 'timeline'].includes(viewParam)) {
        setView(viewParam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setFilters, setView]);
}
