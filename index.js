const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.static("public")); // css as static
console.log("Server Started");

let path={
		presentList:"./data/presentList.json",
		quittingList:"./data/quittingList.json"
}

let json1,json2;

app.use((req, res, next) => {
	fs.readFile(path.presentList, (err, data) => {
		if (err) {
			console.log(err);
			return res
				.status(500)
				.send({ message: "Error while getting patients", error: err });
		}
		json1=data;
	});
	fs.readFile(path.quittingList, (err, data) => {
		if (err) {
			console.log(err);
			return res
				.status(500)
				.send({ message: "Error while getting patients", error: err });
		}
		json2=data;
	});
	next();
});

app.route("/presentList").get((req, res) => {
	return res.status(200).send(json1);
});

app.route("/quittingList").get((req, res) => {
	return res.status(200).send(json2);
});

app.listen(8000, () => console.log("Server started at port 8000"));

