module.exports = async (req, res) => {
    res.status(200).end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sign In</title>
        </head>
        <body>
            <h1>Sign In</h1>
        </body>
        </html>
    `);
}
