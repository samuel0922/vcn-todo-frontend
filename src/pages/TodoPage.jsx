import TodoInput from '../components/TodoInput.jsx'
import TodoList from '../components/TodoList.jsx'
import TodoFilter from '../components/TodoFilter.jsx'
import useTodos from '../hooks/useTodos'

function TodoPage() {
  const {
    todos,
    filteredTodos,
    filter,
    setFilter,
    completedCount,
    addTodo,
    toggleTodo,
    removeTodo,
    saveTodoContent,
    error,
    isLoading,
    isCreating,
    pendingTodoIds,
  } = useTodos()

  return (
    <main className="todo-page">
      <section className="todo-card">
        <header className="todo-header">
          <h1>Todo List</h1>
          <p>
            완료 {completedCount} / 전체 {todos.length}
          </p>
        </header>
        {isLoading ? <p className="todo-loading">불러오는 중...</p> : null}
        {error ? <p className="todo-error">{error}</p> : null}
        <TodoInput onAddTodo={addTodo} disabled={isLoading || isCreating} />
        <TodoFilter
          value={filter}
          onChange={setFilter}
          disabled={isLoading}
        />
        <TodoList
          todos={filteredTodos}
          onToggleTodo={toggleTodo}
          onRemoveTodo={removeTodo}
          onSaveTodoContent={saveTodoContent}
          disabledIds={pendingTodoIds}
        />
      </section>
    </main>
  )
}

export default TodoPage
