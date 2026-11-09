const MAX_BODY_BYTES = 10_000;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5_000;

function jsonResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store'
        },
        body: JSON.stringify(body)
    };
}

function parseForm(event) {
    if (!event.body) return null;

    const body = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;

    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) return null;

    const headers = event.headers || {};
    const contentType = headers['content-type'] || headers['Content-Type'] || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
        return Object.fromEntries(new URLSearchParams(body));
    }

    try {
        return JSON.parse(body);
    } catch {
        return null;
    }
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        const response = jsonResponse(405, { success: false, message: 'Method not allowed.' });
        response.headers.Allow = 'POST';
        return response;
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
        console.error('WEB3FORMS_ACCESS_KEY is not configured.');
        return jsonResponse(500, { success: false, message: 'Contact form is not configured.' });
    }

    const form = parseForm(event);
    if (!form || typeof form !== 'object' || Array.isArray(form)) {
        return jsonResponse(400, { success: false, message: 'Invalid form data.' });
    }

    const name = typeof form.name === 'string' ? form.name.trim() : '';
    const email = typeof form.email === 'string' ? form.email.trim() : '';
    const message = typeof form.message === 'string' ? form.message.trim() : '';
    const botcheck = typeof form.botcheck === 'string' ? form.botcheck.trim() : '';

    if (botcheck) {
        return jsonResponse(400, { success: false, message: 'Invalid form data.' });
    }

    if (
        !name ||
        name.length > MAX_NAME_LENGTH ||
        !email ||
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !message ||
        message.length > MAX_MESSAGE_LENGTH
    ) {
        return jsonResponse(400, { success: false, message: 'Please check the form fields.' });
    }

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                access_key: accessKey,
                subject: 'Nouveau message depuis le portfolio',
                name,
                email,
                message
            }),
            signal: AbortSignal.timeout(10_000)
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            console.error('Web3Forms rejected the contact form submission.');
            return jsonResponse(502, { success: false, message: 'Unable to send your message right now.' });
        }

        return jsonResponse(200, { success: true });
    } catch (error) {
        console.error('Contact form relay failed:', error.message);
        return jsonResponse(502, { success: false, message: 'Unable to send your message right now.' });
    }
};
