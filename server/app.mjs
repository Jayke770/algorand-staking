import App from './settings.mjs'
App.httpServer.listen(App.port, () => {
    console.log(`> Server Started on port ${App.port}`)
})