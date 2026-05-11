import { useState } from 'react'

function TodoInput({ onAddTodo, disabled }) {
  const [text, setText] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const success = await onAddTodo(trimmed)
    if (success) {
      setText('')
    }
  }

  return (
    <form className="todo-input-row" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        placeholder="할 일을 입력하세요"
        onChange={(event) => setText(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        추가
      </button>
    </form>
  )
}

export default TodoInput
