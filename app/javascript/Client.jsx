const Client = () => {
    const baseUrl = 'http://localhost:3000/api/v1'

    const headers = (token) => {
        let headers = {'Content-Type': 'application/json'}
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        return headers
    }

    const parseResponse = (response) => {
        if (!response.ok) {
            throw 'Error'
        }
        return response.json()
    }

    const Get = (path, {token}) => {
        return fetch(baseUrl + path, {
            headers: headers(token)
        })
        .then(response => parseResponse(response))
        .catch(error => console.log(error))
    }

    const Post = (path, {payload, token}) => {
        return fetch(baseUrl + path, {
            method: 'POST',
            headers: headers(token),
            body: JSON.stringify(payload)
        })
        .then(response => parseResponse(response))
        .catch(error => console.log(error))
    }

    const Delete = (path, { token }) => {
        return fetch(baseUrl + path, {
            method: 'DELETE',
            headers: headers(token)
        })
        .then(response => parseResponse(response))
        .catch(error => console.log(error))
    }

    return {
        Get,
        Post,
        Delete
    }
}

const useClient = () => {
    return Client()
}

export default useClient