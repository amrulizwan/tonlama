const axios = require('axios');
const { getRandom } = require('random-useragent');
const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

function rdm_addr(size = 64, chars = '0123456789abcdef') {
    return Array.from({ length: size }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function verifyUser(mainaddr) {
    const refaddr = '0:' + rdm_addr();
    const url = 'https://lama-backend-qd2o.onrender.com/user';
    const randomUserAgent = getRandom();
    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': randomUserAgent,
        'Origin': 'https://www.tonlama.com',
        'Referer': 'https://www.tonlama.com/'
    };
    const data = {
        address: refaddr,
        refby: mainaddr
    };
    try {
        const response = await axios.post(url, data, { headers });
        if (response.status === 200) {
            const responseData = response.data;
            if (responseData.user) console.log(`${refaddr} reff success`);
            else console.log(`${refaddr} not success`);
        } else {
            console.log(`${refaddr} request failed with status ${response.status}`);
        }
    } catch (error) {
        console.log(`${refaddr} failed:`, error.message);
    }
}

async function main() {
    while (true) {
        const tasks = [];
        try {
            const data = await readFile('data.txt', 'utf-8');
            const lines = data.trim().split('\n');
            for (const line of lines) {
                const mainaddr = line.trim();
                tasks.push(verifyUser(mainaddr));
            }
            await Promise.all(tasks);
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }
}

main();
