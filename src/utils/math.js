function calcPercent(total, ref){
    if (total === 0 || ref === 0) return 0;
    return ref * 100 / total;
}

module.exports = {
    calcPercent
};
