//#region Import
const express = require("express");
const mysql = require("mysql2");
const fs = require("fs");
const https = require("https");

let config = require("./config");
//#endregion

//#region Open AI

    async function search(query, count) {
        const response = await openaiCall("POST", "/v1/engines/ada/search", JSON.stringify({
            "file": config.fileId,
            "query": query,
            "return_metadata": true,
            "search_model": "ada",
            "max_rerank": count
        }));
        return response;
    }
    async function openaiCall(method, api, body) {
        return new Promise((rs, rj) => {
            const options = {
                hostname: "api.openai.com",
                path: api,
                method: method,
                headers: {
                    "Authorization": `Bearer ${config.apiKey}`,
                    "Content-Type": "application/json",
                }
            };
            const req = https.request(options, (res) => {
                let result = "";
                res.setEncoding("utf8");
                res.on("data", (chunk) => {
                    if (chunk)
                        result += chunk;
                });
                res.on("end", () => {
                    rs(JSON.parse(result?.toString()));
                });
            });
            req.on("error", (e) => {
                rj(e);
            });
            if (body)
                req.write(body);
            req.end();
        });
    }

//#endregion

const pool = mysql.createConnection(config.db_connect);
const app = express();

app.use(express.json());

//#region Get Sourses
app.use("/assets/:uid/:file", function(req, res, next){
	var uid = req.params.uid, file = req.params.file;
	if (fs.existsSync(`./assets/${uid}/${file}`)){
        if(file=="_auto_theme.css"){
            //theme
            res.sendFile(__dirname +`/assets/${uid}/${file}`);
        }else{
            res.sendFile(__dirname +`/assets/${uid}/${file}`);
        }
	} else {
		res.send(403,'Sorry! you cant see that.');
	}
});
app.get("*", function (req, res) {
  res.sendFile(__dirname + "/assets/html/index.html", function (err) {
    if (err) {
      console.log(err);
    }
  });
});
//#endregion

async function RequestToAi(query, count) {
    var result = {};
    try {
        const data = await search(query,count);
        if(data.error == undefined){
            console.log(data.data.length);
            for (let i = 0; i < Math.min(count, data.data.length); i++) {
                const item = data.data[i];
                if(item["score"] > 0){
                    result[item["metadata"]] = item["score"];
                }
            }
            console.log(Object.keys(result).length);
            return result
        }else{
            console.log(data.data.error)
            return {}
        }
    }
    catch (e) {
        console.error(e);
    }
    console.log("done");
}

app.post("/api/getData",function (req, res) {
    var data = RequestToAi(req.body.desc, 20).then((data)=>{
        // console.log(data);
        if (Object.keys(data).length == 0){
            res.sendStatus(400);
            return;
        }
        var query = `SELECT id, title, image, description FROM projects WHERE id in (${Object.keys(data).toString()});`;
        pool.query(query, 
            function(err, results) {
                //console.log("results:",results); 
                console.log("error:",err);
                if(err == null){
                    results.map(element => {
                        element["score"] = data[parseInt(element["id"])];
                    });
                    results.sort((y, z)=>{return data[z.id]-data[y.id]})
                    res.send(JSON.stringify(results))
                }else{
                res.sendStatus(400);
                }
            }
        );

    })


});

app.listen(config.port, () => console.log("Сервер запущен..."));