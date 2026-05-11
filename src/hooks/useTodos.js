import { useEffect, useMemo, useState } from 'react'
import {
  createTodo,
  deleteTodo as deleteTodoApi,
  fetchTodos,
  updateTodo,
} from '../api/todoApi'

export const TODO_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

function useTodos() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState(TODO_FILTERS.ALL)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [pendingTodoIds, setPendingTodoIds] = useState([])

  useEffect(() => {
    let mounted = true

    const loadTodos = async () => {
      try {
        const initialTodos = await fetchTodos()
        if (!mounted) return
        setTodos(initialTodos)
      } catch (requestError) {
        if (!mounted) return
        setError(requestError.message)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadTodos()
    return () => {
      mounted = false
    }
  }, [])

  const filteredTodos = useMemo(() => {
    if (filter === TODO_FILTERS.ACTIVE) {
      return todos.filter((todo) => !todo.completed)
    }
    if (filter === TODO_FILTERS.COMPLETED) {
      return todos.filter((todo) => todo.completed)
    }
    return todos
  }, [todos, filter])

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  )

  const addTodo = async (content) => {
    if (isCreating) return false
    try {
      setIsCreating(true)
      setError('')
      const createdTodo = await createTodo(content)
      setTodos((prev) => [createdTodo, ...prev])
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  const toggleTodo = async (id) => {
    if (pendingTodoIds.includes(id)) return
    const currentTodo = todos.find((todo) => todo._id === id)
    if (!currentTodo) return

    try {
      setPendingTodoIds((prev) => [...prev, id])
      setError('')
      const updated = await updateTodo(id, {
        completed: !currentTodo.completed,
      })
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updated : todo)),
      )
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setPendingTodoIds((prev) => prev.filter((todoId) => todoId !== id))
    }
  }

  const removeTodo = async (id) => {
    if (pendingTodoIds.includes(id)) return
    try {
      setPendingTodoIds((prev) => [...prev, id])
      setError('')
      await deleteTodoApi(id)
      setTodos((prev) => prev.filter((todo) => todo._id !== id))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setPendingTodoIds((prev) => prev.filter((todoId) => todoId !== id))
    }
  }

  const saveTodoContent = async (id, content) => {
    if (pendingTodoIds.includes(id)) return false
    const trimmed = content.trim()
    if (!trimmed) {
      setError('할 일 내용을 입력하세요.')
      return false
    }
    try {
      setPendingTodoIds((prev) => [...prev, id])
      setError('')
      const updated = await updateTodo(id, { content: trimmed })
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updated : todo)),
      )
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    } finally {
      setPendingTodoIds((prev) => prev.filter((todoId) => todoId !== id))
    }
  }

  return {
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
  }
}

export default useTodos
