import { TODO_FILTERS } from '../hooks/useTodos'

const FILTER_OPTIONS = [
  { value: TODO_FILTERS.ALL, label: '전체' },
  { value: TODO_FILTERS.ACTIVE, label: '미완료' },
  { value: TODO_FILTERS.COMPLETED, label: '완료' },
]

function TodoFilter({ value, onChange, disabled }) {
  return (
    <div className="todo-filter">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? 'is-active' : ''}
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default TodoFilter
