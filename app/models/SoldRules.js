;
module.exports = function(options) {
    var SoldRules = options.db.define(options.table, {
        id_sold_rule: Number,
        lhs: String,
        rhs: String,
        support: Number,
        confidence: Number,
        lift: Number
    }, {
        id: 'id_sold_rule',
        methods: {
        }
    });
};
