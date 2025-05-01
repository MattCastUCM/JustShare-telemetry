export function generateStatementId() {
    return crypto.randomUUID();
}

export function httpRequest(fullUrl, method, headers, body, onSuccess, onError, debug) {
    method = method.toUpperCase()

    let config = {
        method: method,
        headers: headers,
    }

    if (["POST", "PUT"].includes(method)) {
        config.body = JSON.stringify(body)
    }

    fetch(fullUrl, config)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP Error status:" + response.status)
            }
            return response.json()
        })
        .then(data => {
            if (onSuccess) {
                onSuccess(data)
            }
        })
        .catch(error => {
            if (debug) {
                console.error("Request failed:", error.message)
            }

            if (onError) {
                onError(error)
            }
        })
}
