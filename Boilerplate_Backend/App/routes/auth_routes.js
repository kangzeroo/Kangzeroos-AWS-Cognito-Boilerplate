
// GET /
exports.authtest = function(req, res, next){
	console.log("Passed the auth test!")
	res.send("Nice job! Your token passed the auth test!")
}
