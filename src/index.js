const fetch = require("node-fetch");
global.Headers = fetch.Headers;

module.exports = {

    MappConnectClient: class MappConnectClient {

        constructor(apiUrl, integrationId, apiKey) {
            this.apiUrl = apiUrl;
            this.integrationId = integrationId;
            this.apiKey = apiKey;
        }

        sendAutomation(bodyString) {
            this.sendEvent('automation', bodyString);
        }

        sendUser(bodyString) {
            this.sendEvent('user', bodyString);
        }

        sendPush(bodyString) {
            this.sendEvent('push', bodyString);
        }

        sendSms(bodyString) {
            this.sendEvent('sms', bodyString);
        }

        sendLocation(bodyString) {
            this.sendEvent('location', bodyString);
        }

        sendTransaction(bodyString) {
            this.sendEvent('transaction', bodyString);
        }

        sendEmail(bodyString) {
            this.sendEvent('email', bodyString);
        }

        sendWishlist(bodyString) {
            this.sendEvent('wishlist', bodyString);
        }

        sendAbandonedCart(bodyString) {
            this.sendEvent('abandonedcart', bodyString);
        }

        async sendEvent(subtype, bodyString) {
            let eventPath = '/api/v1/integration/' + this.integrationId + '/event';
            let token = this.generateJwt(bodyString, eventPath, 'subtype=' + subtype, this.apiKey);
            const res = await fetch(this.apiUrl + eventPath + '?subtype=' + subtype, {
                body: bodyString,
                headers: new Headers({
                    "Content-Type": "application/json",
                    "auth-token": token
                }),
                method: "post",
            })
        }

        getMessages() {
            return this.getData('message');
        }

        getGroups() {
            return this.getData('group');
        }

        getPushMessages() {
            return this.getData('message/push');
        }

        getPushMessages() {
            return this.getData('mobile-app');
        }

        async getData(dataType) {
            let apiPath = '/api/v1/integration/' + this.integrationId + '/' + dataType;
            let token = this.generateJwt(null, apiPath, null, this.apiKey);
            const res = await fetch(this.apiUrl + apiPath, {
                headers: new Headers({
                    "Content-Type": "application/json",
                    "auth-token": token
                }),
                method: "get",
            })
            const json = await res.json();
            return json;
        }

        generateJwt(request_body, request_uri, query_string, key) {
            let request_data = request_uri.toString();
            if (request_body) {
                request_data += '|' + request_body;
            }
            if (query_string) {
                request_data += '|' + query_string.toString();
            }
            let hash = crypto.createHash('sha1');
            let request_hash = hash.update(request_data).digest('hex');
            const jwtHeader = {
                alg: 'HS256'
            };
            const jwtBody = {
                'request-hash': request_hash,
                exp: Date.now() + 600000
            };
            const encodedBody = this.encodeParams(jwtBody);
            const encodedHeader = this.encodeParams(jwtHeader);
            const signature = this.normalizeBase64string(crypto
                .createHmac('sha256', key)
                .update(encodedHeader + '.' + encodedBody)
                .digest('base64'));
            let jwt = `${encodedHeader}.${encodedBody}.${signature}`;
            return jwt;
        }

        encodeParams(object) {
            let buff = Buffer.from(JSON.stringify(object));
            let base64data = this.normalizeBase64string(buff.toString('base64')); return base64data;
        }

        normalizeBase64string(base64string) {
            return base64string.replace('+', '-').replace('/', '_').replace(/=+$/, '');
        }
    }
}