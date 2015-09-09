import express from 'express';
import Redis from 'then-redis';

const SniperStatus = {Joining: 'Joining', Lost: 'Lost'};

function main(itemId) {
    const app = express();
    let status = SniperStatus.Joining;

    app.get('/', function (req, res) {
      res.send(`<html><body><span id="sniper-status"></span></body></html>`);
    });

    var server = app.listen(3000, function () {
      var host = server.address().address;
      var port = server.address().port;

      console.log('Auction Sniper listening at http://%s:%s', host, port);
    });
}

export default {
    main,
    SniperStatus
}