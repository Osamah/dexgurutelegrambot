require('isomorphic-fetch');
require('dotenv').config();

const API_KEY = process.env.DEXGURU_API_KEY || '';
const BASEURL = 'https://api.dev.dex.guru/v1/';
const API_KEY_SUFFIX = `?api-key=${API_KEY}`;

async function getTokenData(chain_id, token_address) {
    const response = await fetch(`${BASEURL}chain/${chain_id}/tokens/${token_address}/market${API_KEY_SUFFIX}`);
    if (response.status >= 400) {
        console.log(response);
        return {
            error: true,
            status: 404
        }
    }
    const data = await response.json();
    return data;
}
async function getTokenInfo(chain_id, token_address) {
    const response = await fetch(`${BASEURL}chain/${chain_id}/tokens/${token_address}${API_KEY_SUFFIX}`);
    if (response.status >= 400) {
        console.log(response);
        return {
            error: true,
            status: 404
        }
    }
    const data = await response.json();
    return data;
}

module.exports = {
    getTokenInfo,
    getTokenData
}