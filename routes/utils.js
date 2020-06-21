var utils = {
    isValidName: function (val){
        const type = typeof val;
        return !(
           val === null || 
           val === undefined || 
           (type === 'string' && val.trim().length === 0) || 
           (type !== 'string') 
        );
    }
};

module.exports = utils;