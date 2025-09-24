// Generic localStorage-based CRUD utility with typed helpers
// Note: This is a frontend-only persistence layer; replace with Supabase when backend is ready

export type EntityWithId = { id: string } & Record<string, unknown>

function read<T = EntityWithId>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function write<T = EntityWithId>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function listEntities<T = EntityWithId>(key: string): T[] {
  return read<T>(key)
}

export function upsertEntity<T extends { id: string }>(key: string, entity: T): T {
  const all = read<T>(key)
  const idx = all.findIndex((e) => e.id === entity.id)
  if (idx >= 0) {
    all[idx] = entity
  } else {
    all.unshift(entity)
  }
  write(key, all)
  return entity
}

export function removeEntity<T extends { id: string }>(key: string, id: string): void {
  const all = read<T>(key)
  write(
    key,
    all.filter((e) => e.id !== id)
  )
}

export function getEntity<T extends { id: string }>(key: string, id: string): T | undefined {
  return read<T>(key).find((e) => e.id === id)
}

export function seedIfEmpty<T = EntityWithId>(key: string, seed: T[]): void {
  const all = read<T>(key)
  if (!all || all.length === 0) {
    write(key, seed)
  }
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}
