import { useState } from 'react'

function TodoList({
  todos,
  onToggleTodo,
  onRemoveTodo,
  onSaveTodoContent,
  disabledIds = [],
}) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')

  const startEdit = (todo) => {
    setEditingId(todo._id)
    setDraft(todo.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft('')
  }

  if (todos.length === 0) {
    return <p className="todo-empty">할 일을 추가해 보세요.</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => {
        const isPending = disabledIds.includes(todo._id)
        const isEditing = editingId === todo._id

        const handleSave = async () => {
          const ok = await onSaveTodoContent(todo._id, draft)
          if (ok) cancelEdit()
        }

        return (
          <li key={todo._id} className="todo-item">
            <div className="todo-item-label">
              <input
                type="checkbox"
                checked={todo.completed}
                disabled={isPending || isEditing}
                onChange={() => onToggleTodo(todo._id)}
                aria-label={
                  todo.completed ? '완료 취소' : '완료로 표시'
                }
              />
              {isEditing ? (
                <input
                  type="text"
                  className="todo-edit-input"
                  value={draft}
                  disabled={isPending}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      void handleSave()
                    }
                    if (event.key === 'Escape') {
                      event.preventDefault()
                      cancelEdit()
                    }
                  }}
                />
              ) : (
                <span className={todo.completed ? 'done' : ''}>
                  {todo.content}
                </span>
              )}
            </div>
            <div className="todo-item-actions">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void handleSave()}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={cancelEdit}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => startEdit(todo)}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onRemoveTodo(todo._id)}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default TodoList
