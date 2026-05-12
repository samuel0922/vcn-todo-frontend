/**
 * 백엔드 API 베이스 URL
 *
 * - Vite 환경 변수 `VITE_API_BASE_URL` 을 쓴다. 값은 `pjt-todo-react/.env` 에 넣고,
 *   `npm run dev` 를 다시 실행해야 반영된다(빌드 시점에 주입됨).
 * - 여기 넣는 값은 "호스트까지만" 이다. `/todos` 는 붙이지 않는다.
 *   이 파일의 `fetchTodos()` 등이 `request('/todos')` 처럼 경로를 이어 붙인다.
 *   예: 베이스가 `https://xxx.herokuapp.com` 이면 실제 요청은 `.../todos` 가 된다.
 * - 로컬에서 `pjt-todo-backend` 만 띄울 때는 `.env` 에
 *   `VITE_API_BASE_URL=http://localhost:5000` 을 넣으면 된다.
 * - `VITE_API_BASE_URL` 이 비어 있으면 아래 `DEFAULT_API_BASE`(Heroku 배포 주소)를 쓴다.
 * - 실수로 끝에 `/` 나 `/todos` 가 붙어 있어도 `normalizeApiBase` 가 베이스만 남기도록 정리한다.
 */
const DEFAULT_API_BASE =
  'https://vcn-todo-backend-202c8e7d5e33.herokuapp.com'

/** 베이스 URL (끝의 `/`, `/todos` 는 제거 — API 경로는 request()에서 붙음) */
function normalizeApiBase(url) {
  const raw =
    url != null && String(url).trim() !== ''
      ? String(url).trim()
      : DEFAULT_API_BASE
  let u = raw.replace(/\/+$/, '')
  if (u.endsWith('/todos')) u = u.slice(0, -'/todos'.length).replace(/\/+$/, '')
  return u
}

const API_BASE_URL = normalizeApiBase(import.meta.env.VITE_API_BASE_URL)

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
      '서버에 연결할 수 없습니다. Heroku가 꺼져 있지 않은지 확인하고, 브라우저 주소가 http://127.0.0.1:5173 이면 http://localhost:5173 로 열어 보세요(CORS). 로컬 백엔드면 .env에 VITE_API_BASE_URL=http://localhost:5000',
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
