import { useGame } from "../Contexts"
import { toast } from "../Components/ui"

interface Request {
    path: string
    payload?: Object
    token?: string | null
    showSuccessToast?: boolean // Optional flag to control success toast display
    successMessage?: string // Optional custom success message
}

const Client = () => {
    const baseUrl = process.env.API_BASE_URL

    const headers = (token?: string | null): Record<string, string> => {
        let headers: Record<string, string> = {'Content-Type': 'application/json'}
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
            if (process.env.NODE_ENV === 'development') {
                console.log('[API Client] Sending request with token:', token.substring(0, 20) + '...')
            }
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.warn('[API Client] No token provided for request')
            }
        }
        return headers
    }

    const getErrorMessage = (error: any, statusCode?: number): string => {
        // Handle different error formats
        if (typeof error === 'string') {
            return error
        }
        
        if (error?.message) {
            return error.message
        }
        
        if (Array.isArray(error) && error.length > 0) {
            const firstError = error[0]
            if (typeof firstError === 'string') {
                return firstError
            }
            return firstError?.message || 'An error occurred'
        }
        
        if (typeof error === 'object' && error !== null) {
            // Try various common error formats
            return error.errors?.[0]?.message || 
                   error.error?.message || 
                   error.error ||
                   error.detail ||
                   'An error occurred'
        }

        // Default messages based on status code
        if (statusCode === 401) {
            return 'Unauthorized: Please log in again'
        }
        if (statusCode === 403) {
            return 'Forbidden: You do not have permission to perform this action'
        }
        if (statusCode === 404) {
            return 'Not found: The requested resource could not be found'
        }
        if (statusCode === 422) {
            return 'Validation error: Please check your input'
        }
        if (statusCode === 500) {
            return 'Server error: Please try again later'
        }
        if (statusCode === 503) {
            return 'Service unavailable: Please try again later'
        }

        return 'An unexpected error occurred'
    }

    const getResourceName = (path: string): string => {
        // Extract resource name from path for better success messages
        // Remove query parameters
        const pathWithoutQuery = path.split('?')[0]
        
        // Split path and filter out empty strings and numeric IDs
        const parts = pathWithoutQuery.split('/').filter(p => p && !p.match(/^\d+$/))
        
        // Get the last meaningful part (usually the resource name)
        const resource = parts[parts.length - 1] || 'item'
        
        // Handle common special cases
        const specialCases: Record<string, string> = {
            'spell_lists': 'Spell List',
            'spell-lists': 'Spell List',
            'spell_list': 'Spell List',
        }
        
        if (specialCases[resource]) {
            return specialCases[resource]
        }
        
        // Convert snake_case, kebab-case, or camelCase to Title Case
        return resource
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/([A-Z])/g, ' $1') // Add space before capitals
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    const getSuccessMessage = (method: string, path: string, customMessage?: string): string => {
        if (customMessage) {
            return customMessage
        }

        const resourceName = getResourceName(path)
        
        switch (method) {
            case 'POST':
                return `${resourceName} created successfully`
            case 'PATCH':
                return `${resourceName} updated successfully`
            case 'DELETE':
                return `${resourceName} deleted successfully`
            default:
                return 'Operation completed successfully'
        }
    }

    const parseResponse = async (response: Response, method?: string, path?: string, showSuccess?: boolean, successMessage?: string) => {
        if (!response.ok) {
            const statusCode = response.status
            
            try {
                const errorData = await response.json()
                
                if (response.status === 401) {
                    console.error('[API Client] Unauthorized (401) - Authentication token may be invalid or expired')
                    const message = getErrorMessage(errorData.errors || errorData, statusCode)
                    toast({
                        variant: "destructive",
                        title: "Authentication Error",
                        description: message,
                    })
                    throw errorData.errors || errorData
                }
                
                const message = getErrorMessage(errorData.errors || errorData, statusCode)
                toast({
                    variant: "destructive",
                    title: "Request Failed",
                    description: message,
                })
                
                throw errorData.errors || errorData
            } catch (parseError) {
                // If JSON parsing fails, handle as network error
                const message = getErrorMessage(parseError, statusCode)
                toast({
                    variant: "destructive",
                    title: "Request Failed",
                    description: message,
                })
                throw parseError
            }
        }
        
        // Show success toast for successful mutations (POST, PATCH, DELETE)
        if (showSuccess !== false && method && path && ['POST', 'PATCH', 'DELETE'].includes(method)) {
            const message = getSuccessMessage(method, path, successMessage)
            toast({
                title: "Success",
                description: message,
            })
        }
        
        if (response.status === 204) {
            return null
        }
        
        try {
            return await response.json()
        } catch (parseError) {
            console.error('[API Client] Failed to parse response JSON:', parseError)
            throw new Error('Failed to parse server response')
        }
    }

    const makeRequest = async (path: string, options: RequestInit, method?: string, showSuccess?: boolean, successMessage?: string) => {
        try {
            const response = await fetch(baseUrl + path, options)
            return await parseResponse(response, method, path, showSuccess, successMessage)
        } catch (error) {
            // Network errors or other fetch failures
            if (error instanceof TypeError && error.message.includes('fetch')) {
                toast({
                    variant: "destructive",
                    title: "Network Error",
                    description: "Unable to connect to the server. Please check your connection.",
                })
            }
            throw error
        }
    }

    const get = async ({ path, token, showSuccessToast, successMessage }: Request) => {
        const options = {
            headers: headers(token)
        }
        // GET requests don't show success toasts by default
        return makeRequest(path, options, 'GET', false)
    }

    const post = async ({ path, payload, token, showSuccessToast = true, successMessage }: Request) => {
        const options = {
            method: 'POST',
            headers: headers(token),
            body: JSON.stringify(payload)
        }
        return makeRequest(path, options, 'POST', showSuccessToast, successMessage)
    }

    const patch = async ({ path, payload, token, showSuccessToast = true, successMessage }: Request) => {
        const options = {
            method: 'PATCH',
            headers: headers(token),
            body: JSON.stringify(payload)
        }
        return makeRequest(path, options, 'PATCH', showSuccessToast, successMessage)
    }

    const destroy = async ({ path, token, showSuccessToast = true, successMessage }: Request) => {
        const options = {
            method: 'DELETE',
            headers: headers(token)
        }
        return makeRequest(path, options, 'DELETE', showSuccessToast, successMessage)
    }

    return {
        get,
        post,
        patch,
        destroy
    }
}

export default Client