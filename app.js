// const http = require('http');

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('mumbai indians \n');
// });

// server.listen(3000, () => {
//   console.log('Server running at http://0.0.0.0:3000/');
// });
const http = require('http');

const server = http.createServer((req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Mumbai Indians</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to right, #004BA0, #0474BA);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 0.5em;
        }
        p {
          font-size: 1.5rem;
        }
        .logo {
          width: 150px;
          height: auto;
          margin-bottom: 20px;
        }
        .highlight {
          color: #FFCB05;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <img class="logo" src="https://upload.wikimedia.org/wikipedia/en/2/25/Mumbai_Indians_Logo.svg" alt="Mumbai Indians Logo" />
      <h1>Welcome to the <span class="highlight">Mumbai Indians</span> Fan Zone!</h1>
      <p>🏏 Five-time IPL Champions 🏆</p>
      <p>Home Ground: Wankhede Stadium, Mumbai</p>
      <p><em>"Duniya Hila Denge Hum!"</em></p>
    </body>
    </html>
  `;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
});

server.listen(3000, () => {
  console.log('🏏 Mumbai Indians Fan Server running at http://0.0.0.0:3000/');
});
