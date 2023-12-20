
const Hapi = require('@hapi/hapi');

const data = {};
data.users = [
  {
	id: 1,
	name: 'admin',
	username: 'admin',
	password: 'root'
  },
];
data.renderHtml = {
	login: (message) => {
		return `
    <html><head><title>Login page</title></head><body>
    ${message ? '<h3>' + message + '</h3><br></a>' : ''}
    <form method="post" action="/login">
      Username: <input type="text" name="username"><br>
      Password: <input type="password" name="password"><br></a>
    <input type="submit" value="Login"></form>
    </body></html>
      `;
	}, 
	home: (name) => {
	  return `
		<html><head><title>Login page</title></head><body>
		<h3>Welcome ${name}! You are logged in!</h3>
		<form method="get" action="/logout">
		  <input type="submit" value="Logout">
		</form>
		</body></html>
	  `;
	}
  };
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });
  await server.register(require('@hapi/cookie'))

  server.auth.strategy('session', 'cookie', {
	cookie: {
	  name: 'sample',
	  password: 'long-tail-password-here',
	  isSecure: false	
	},

	redirectTo: '/login',
	validate: async (request, session) => {
	  const account = data.users.find((user) => (user.id === session.id))
	   
	  if (!account) {
		return { isValid: false};
	  }
	  return { isValid: true, credentials: account}
	}
  });
  server.auth.default('session')
 
  server.route([
	{
    method: 'GET',
    path: '/',
	options: {
      handler: (request, h) => {
        return data.renderHtml.home(request.auth.credentials.name)
     }
    }
  },
  {
	  method: 'GET',
	  path: '/login',
	  options: {
		auth: {
			mode: 'try'
		},
		plugins: {
			cookie: {
				redirectTo: false
			}
		}, 
		handler: async (request, h) => {
		  if (request.auth.isAuthenticated) {
			return h.redirect('/');
		  }
		  return data.renderHtml.login();
		} 
	  }
	},
	{
		method: 'POST',
		path: '/login', 
		options: {
			auth: {
				mode: 'try'
			},
			handler: async(request, h) => {
			  const { username, password } = request.payload;
			  if (!username || !password) {
				return data.renderHtml.login('Missing name or password')
			  }
			  const account = data.users.find(
				(user) => user.name === username && user.password === password
			  );
			if (!account) {
				return data.renderHtml.login('Imvalid Name or Password')
			}
			request.cookieAuth.set({ id: account.id });
			return h.redirect('/')
			}
		}
	}, 
	{
		method: 'GET', 
		path: '/logout',
		options: {
			handler: (request, h) => {
				request.cookieAuth.clear();
				return h.redirect('/');
			}
		}
	}
]);
  // #==============================================================================#
  // GET json route
  server.route({
	method: "GET", 
    path: "/json",
	handler: (request, h) => {
	  return { greetings: "Hello, World!" };
	},
});
// #===============================================================================#
// Dynamic GET route
  server.route({
	method: "GET", 
	path: "/greeting/{name}",
	handler: (request, h) => {
	  const name = request.params.name;
	  return { greetings: `Hello, ${name}!`};
	},
  });
  //#=============================================================================# 
  // Query params GET route
  server.route({
	method: "GET", 
	path: "/query",
	handler: (request, h) => {
	  const name = request.query.name;
	  return { greetings: `Hello, ${name ? name : "LexFlare"}!` };
    }
  });
  await server.start();
  console.log('Server running on %s', server.info.uri);
};
function handle_reject() {
  process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
  });
}
const main = async () => {
  try {
 	await init();
  }
  catch (err) {
	handle_reject();
	console.error(err.stack);
	process.exit(1);
  }
 
};

main();
                  