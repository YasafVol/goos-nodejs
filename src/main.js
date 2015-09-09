import express from 'express';
import Redis from 'then-redis';
import AuctionMessageTranslator from './auction-message-translator'
import AuctionSniper from './auction-sniper'
import Message from './message';

const debug = require('debug')('goos:Sniper');

const SniperStatus = {Joining: 'Joining', Lost: 'Lost', Bidding: 'Bidding'};

function main(itemId) {
    const Topic = `auction-${itemId}`;

    let status = SniperStatus.Joining;

    const listener = {
        sniperLost: function() {
            debug("Setting status to Lost");
            status = SniperStatus.Lost;
        },

        sniperBidding: function() {
            debug("Setting status to Bidding");
            status = SniperStatus.Bidding;
        }
    };

    let subscriber = Redis.createClient();
    let publisher = Redis.createClient();

    publisher.publish(Topic, JSON.stringify(Message.Join()));

    const auction = {
        bid: function() {}
    }

    const translator = AuctionMessageTranslator(new AuctionSniper(auction, listener));
    subscriber.subscribe(Topic);
    subscriber.on('message', (topic, jsonMessage) => {
        translator.processMessage(topic, JSON.parse(jsonMessage));
    });

    const app = express();

    app.get('/', function (req, res) {
      res.send(`<html><body><span id="sniper-status">${status}</span></body></html>`);
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

