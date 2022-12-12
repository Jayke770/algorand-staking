module.exports = {
    apps: [{
        name: "algo-staking",
        script: "./server/app.mjs",
        env: {
            NODE_ENV: "development"
        },
        env_production: {
            NODE_ENV: "production",
            PORT: 3000
        }
    }]
}