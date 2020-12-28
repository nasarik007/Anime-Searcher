const axios = require('axios');

const formUrlEncoded = x =>
   Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

module.exports = class sauceNAO {
    constructor(token) {
        this.token = token;
    }

    search(url) {
        return new Promise(async (resolve, reject) => {
            let request = await axios({
                method: 'POST',
                url: `https://saucenao.com/search.php`,
                data: formUrlEncoded({
                    api_key: this.token,
                    output_type: 2,
                    url: url,
                    database: 21
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            if(!request?.data?.results) resolve([]);
            let data = this.unique(request.data.results)
                .map(el => {
                    let newObj = {};
                    el.header.similarity = el.header.similarity / 100;
                    newObj.from = 'sauce';
                    Object.assign(newObj, el.data, el.header);
                    return newObj;   
                });
            resolve(data);
        })
    }

    unique(results) {
        let uniqued = []
        results.map(e => {
            if (!results.includes(e.anidb_aid)) {
                uniqued = [...uniqued, e]
            }
        })
        return uniqued;
    }
}