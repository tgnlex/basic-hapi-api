const hapi = require("@hapi/hapi");

const app = async () => {
	const server = hapi.server({
	  port: 3000,
	  host: "localhost",
	});

	server.route({
	  method: "GET",
	  path: "/",
	  handler: (request, h) => {
	    return "Hello, World!";
	  },
	});

	server.route({
		method: "GET", 
		path: "/json",
		handler: (request, h) => {
			return { greetings: "Hello, World!" };
		},
	});

	server.route({
		method: "GET", 
		path: "/path-params/{name}",
		handler: (request, h) => {
			const name = request.params.name;
			return { greetings: `Hello, ${name}!`};
		},
	});

	server.route({
		method: "GET", 
		path: "/query-params",
		handler: (request, h) => {
			const name = request.query.name;
			return { greetings: `Hello, ${name ? name : "LexFlare"}!` };
		}.
	});
	server.route({
    method: "POST",
    path: "/post",
    handler: (request, h) => {
      const data = request.payload;
      console.log(data);
      return { greetings: `Hello, ${data.name ? data.name : "Geekflare"}!` };
    },
  });


  // starting the server
  await server.start();
  console.log(`App is running on ${server.info.uri}`);
};


app();