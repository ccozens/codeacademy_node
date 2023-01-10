const checkMillionDollarIdea = (req, res, next) => {
    const value = req.body.numWeeks * req.body.weeklyRevenue;
    if (value >= 1000000) {
        req.valid = req.body;
        next();
    }
    else {
        return res.status(400).send('Idea is worth less than $1 mil')
    };
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
