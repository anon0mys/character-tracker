import { toast } from '../Components/ui'

/**
 * Hook to provide success and error notifications for API operations
 */
export const useApiNotifications = () => {
    const showSuccess = (message: string, title: string = "Success") => {
        toast({
            title,
            description: message,
        })
    }

    const showError = (error: string | Error | any, title: string = "Error") => {
        let errorMessage = 'An error occurred'
        
        if (typeof error === 'string') {
            errorMessage = error
        } else if (error instanceof Error) {
            errorMessage = error.message
        } else if (error?.message) {
            errorMessage = error.message
        } else if (Array.isArray(error) && error.length > 0) {
            errorMessage = typeof error[0] === 'string' ? error[0] : error[0]?.message || errorMessage
        } else if (typeof error === 'object' && error !== null) {
            errorMessage = error.errors?.[0]?.message || error.error?.message || error.error || errorMessage
        }

        toast({
            variant: "destructive",
            title,
            description: errorMessage,
        })
    }

    return { showSuccess, showError }
}

