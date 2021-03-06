'use strict';
const express = require('express');
const router = express.Router();
const Interface = require('../interface/interface');
const bearer = require('../middlewares/bearer-auth-middleware');
const acl = require('../middlewares/acl-middleware');

//----------------------------------------- request routes below ---------------------------------------------//

//--- reads the houses for the user ---//
router.get('/read', bearer, acl('read'), readHandler);

//--- create a new house add for the user ---//
router.post('/create', bearer, acl('create'), createHandler);

//--- updates the price if the house is negotiable ---//
router.put('/updatePrice', bearer, acl('updatePrice'), updatePriceHandler);

//--- delete the selling request ---//
router.delete('/delete', bearer, acl('delete'), deleteHandler);

//--- update status of the request by admins---//
router.put('/updateStatus', bearer, acl('updateStatus'), updateStatusHandler);


//---------------------------------request handler functions are below---------------------------------------//

//---'/read' handler---//
async function readHandler(req, res) {
    try {
        if(req.user.role=='seller'){
            const houses = await Interface.read(req.user);
            res.status(201).json({ houses });
        }else if(req.user.role=='admin'){
            const adminHouses = await Interface.read(req.user);
            const chartStats = await Interface.getChartStats(adminHouses);
            res.status(201).json({ houses:adminHouses,stats:chartStats });
        }
    } catch (error) {
        res.json({ error: error.message });
    };
};

//---'/create' handler---//
async function createHandler(req, res) {
    try {
        const { type,
            address,
            description,
            price,
            negotiable } = req.body;
        const house = {
            type,
            address,
            description,
            sellingPrice: price,
            negotiable
        }
        let houses = await Interface.create(req.user.email, house);
        res.status(201).json({ houses })
    } catch (error) {
        res.json({ error: error.message });
    }
};

// ---'/updatePrice' handelr ---//
async function updatePriceHandler(req, res) {
    try {
        const { houseID, newPrice } = req.body;
        let houses = await Interface.updatePrice(req.user, houseID, newPrice);
        res.status(201).json({ houses });
    } catch (error) {
        res.json({ error: error.message });
    }
}

//---'/delete' handler ---//
async function deleteHandler(req, res) {
    try {
        const { houseID, ownerEmail } = req.body;
        console.log(houseID)
        let houses = await Interface.delete(houseID, ownerEmail);
        if (req.user.role === 'seller') {
            res.status(201).json({ houses });
        } else if (req.user.role === 'admin') {
            const adminHouses = await Interface.read(req.user);
            const chartStats = await Interface.getChartStats(adminHouses);
            res.status(201).json({ houses:adminHouses,stats:chartStats })
        }
    } catch (error) {
        res.json({ error: error.message });
    }
}

//--'/updateStatus' handler --/
async function updateStatusHandler(req, res) {

    try {
        const { houseID, ownerEmail, stat } = req.body;

        let houses = await Interface.updateStatus(houseID, ownerEmail, stat);
        const updatedHouses = await Interface.read(req.user);
        const chartStats = await Interface.getChartStats(updatedHouses);
        res.json({ houses:updatedHouses,stats:chartStats });
    } catch (e) {
        res.json({ error: error.message });
    }
}


module.exports = router;