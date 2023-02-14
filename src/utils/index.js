const math = require('./math');

function blendObjects(objects = [Object()], config = { blendArrays: Boolean() }) {
    const { blendArrays } = config;
    let result = {};

    objects.map((obj, index) => {
        if (index > 0 && typeof obj === 'object' && !Array.isArray(obj)) {
            Object.keys(obj).map((item) => {
                if (item === 'defaultValues') return;

                const curr = obj[item];
                const type = typeof curr;

                switch (type) {
                    case 'string': {
                        if (curr) result[item] = curr;
                        break;
                    }
                    case 'number': {
                        if (curr || curr === 0) result[item] = curr;
                        break;
                    }
                    case 'boolean': {
                        result[item] = curr;
                        break;
                    }
                    case 'object': {
                        if (Array.isArray(curr)) {
                            if (blendArrays) {
                                result[item] = [...result[item], ...curr];
                            } else {
                                result[item] = curr;
                            }
                        } else {
                            result[item] = Utils.blendObjects([result[item] || {}, curr], config || {});
                        }
                        break;
                    }
                    default: {
                        if (curr) result[item] = curr;
                    }
                }
            });
        } else {
            result = (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : result;
        }
    });

    return result;
}

function genCode(size){

    let chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','Y','W','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','k','r','s','t','u','v','x','y','w','z','0','1','2','3','4','5','6','7','8','9'];
    let charSize = chars.length - 1;
    let resultado = '';
    for(let i = 0; i < size; i++){
        let char = (Math.random() * charSize);
        resultado += chars[Number( char.toFixed(0) )];
    }	

    return resultado

}

function checkType(value){
    const type = typeof value;

    switch(type){
        case 'string':
        case 'number':
        case 'function':
        case 'boolean':
        case 'date': {
            if(type === 'number' && isNaN(value)) return 'NaN';
            return type;
        }
        case 'object': {
            if(value !== null){
                if(Array.isArray(value)) return 'array';
                return type;
            } else {
                return 'null';
            }
        }
        default: {
            if(value) return true;
        }
    }
}

function calcTimestamp(value, timeUnit, timeDirection) {
    let timeInMillis;

    if (!Boolean.isValid(value).number().success || !Boolean.isValid(timeUnit).stringFilled()) {
        throw new Error.Log('common.missing_params', ['value', 'timeUnit'], 'calcTimestamp()');
    }

    switch (timeUnit) {
        case 'seconds': {
            timeInMillis = value * 1000;
            break;
        }
        case 'minutes': {
            timeInMillis = value * 60 * 1000;
            break;
        }
        case 'hours': {
            timeInMillis = value * 60 * 60 * 1000;
            break;
        }
        case 'days': {
            timeInMillis = value * 24 * 60 * 60 * 1000;
            break;
        }
        case 'weeks': {
            timeInMillis = value * 7 * 24 * 60 * 60 * 1000;
            break;
        }
        case 'months': {
            timeInMillis = value * 30 * 24 * 60 * 60 * 1000;
            break;
        }
        case 'years': {
            timeInMillis = value * 12 * 30 * 24 * 60 * 60 * 1000;
            break;
        }
        default: {
            throw new Error.Log('common.bad_format_param', 'timeUnit', 'calcTimestamp()', 'seconds|minutes|hours|days|weeks|months|years', value);
        }
    }

    if (timeDirection === 'future') {
        return Date.now() + timeInMillis;
    }

    if (timeDirection === 'past' || !timeDirection) {
        return Date.now() - timeInMillis;
    }
}

function getStringDate(value, timeUnit, timeDirection) {
    const targetStamp = calcTimestamp(value, timeUnit, timeDirection);
    const targetDate = new Date(targetStamp);
    let targetYear = targetDate.getFullYear();
    let targetMonth = targetDate.getMonth() + 1;
    let targetDay = targetDate.getDate();

    if (!Boolean.isValid(value).number().success) {
        throw new Error.Log('common.missing_params', 'value', 'getStringDate()');
    }

    if (!timeDirection) {
        timeDirection = 'past';
    }

    switch (timeUnit) {
        case 'years': {
            return `${targetYear}-1-1`;
        }
        case 'months': {
            return `${targetYear}-${targetMonth}-1`;
        }
        case 'weeks':
        case 'days': {
            return `${targetYear}-${targetMonth}-${targetDay}`;
        }
        default: {
            throw new Error.Log('')
        }
    }
}

module.exports = {
    math,
    blendObjects,
    genCode,
    checkType,
    calcTimestamp,
    getStringDate
};
