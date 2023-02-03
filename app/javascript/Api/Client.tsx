interface Request {
    path: string
    payload?: Object
    token?: string | null
}

const Client = () => {
    const baseUrl = process.env.API_BASE_URL

    const headers = (token?: string | null) => {
        let headers = {'Content-Type': 'application/json'}
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        return headers
    }

    const parseResponse = (response) => {
        if (!response.ok) {
            throw response.statusText
        }
        if (response.status == 204) {
            return null
        }
        return response.json()
    }

    const makeRequest = async (path: string, options: Object) => {
        return fetch(baseUrl + path, options)
            .then(response => parseResponse(response))
    }

    const get = async ({ path, token }: Request) => {
        const options = {
            headers: headers(token)
        }
        return makeRequest(path, options)
    }

    const post = async ({ path, payload, token }: Request) => {
        const options = {
            method: 'POST',
            headers: headers(token),
            body: JSON.stringify(payload)
        }
        return makeRequest(path, options)
    }

    const patch = async ({ path, payload, token }: Request) => {
        const options = {
            method: 'PATCH',
            headers: headers(token),
            body: JSON.stringify(payload)
        }
        return makeRequest(path, options)
    }

    const destroy = async ({ path, token }: Request) => {
        const options = {
            method: 'DELETE',
            headers: headers(token)
        }
        return makeRequest(path, options)
    }

    return {
        get,
        post,
        patch,
        destroy
    }
}

export default Client