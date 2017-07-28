module.exports = function StaticFile(app, express) {
    app.use(express.static('public'));
    app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
    app.use('/jquery', express.static('./node_modules/jquery/dist'));
};
