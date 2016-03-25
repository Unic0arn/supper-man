var exec = require("child_process").exec;
function start(response) {
	console.log("Request handler 'start' was called.");
	 var content = "empty";

 exec("ls -h", function (error, stdout, stderr) {
   	response.writeHead(200, {"Content-Type": "text/plain"});
	 response.write(stdout);
	 response.end();
 });

} 

function app(response) {
	console.log("Request handler 'app' was called.");
	 response.writeHead(200, {"Content-Type": "text/plain"});
 	response.write("Hello Upload");
 	response.end();
}

exports.start = start;
exports.app = app;