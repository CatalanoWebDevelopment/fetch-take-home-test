import axios from 'axios'
import type { Dog, LoginCredentials, SearchResponse, Location } from '@/types'

const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true,
})

export const login = async (credentials: LoginCredentials) => {
  await api.post('/auth/login', credentials)
}

export const logout = async () => {
  await api.post('/auth/logout')
}

export const getBreeds = async (): Promise<string[]> => {
  const { data } = await api.get('/dogs/breeds')
  return data
}

export const searchDogs = async (params: {
  breeds?: string[]
  zipCodes?: string[]
  ageMin?: number
  ageMax?: number
  size?: number
  from?: number
  sort?: string
}): Promise<SearchResponse> => {
  const { data } = await api.get('/dogs/search', { params })
  return data
}

export const getDogs = async (ids: string[]): Promise<Dog[]> => {
  const { data } = await api.post('/dogs', ids)
  return data
}

export const getMatch = async (ids: string[]): Promise<{ match: string }> => {
  const { data } = await api.post('/dogs/match', ids)
  return data
}

export const searchLocations = async (params: {
  city?: string
  states?: string[]
  size?: number
}): Promise<{ results: Location[]; total: number }> => {
  const { data } = await api.post('/locations/search', params)
  return data
}
