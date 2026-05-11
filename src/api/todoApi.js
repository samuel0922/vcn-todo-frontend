const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })
  } catch {
    throw new Error(
      '서버에 연결할 수 없습니다. pjt-todo-backend 폴더에서 npm run start를 실행하고, MongoDB가 실행 중인지 확인하세요.',
    )
  }

  if (!response.ok) {
    let message = '요청 처리 중 오류가 발생했습니다.'
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      // Keep default message when response body is not JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export async function fetchTodos() {
  return request('/todos')
}

export async function createTodo(content) {
  return request('/todos', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export async function updateTodo(id, payload) {
  return request(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteTodo(id) {
  return request(`/todos/${id}`, {
    method: 'DELETE',
  })
}
