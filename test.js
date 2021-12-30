//  crypto = require('crypto-js');
//
// let str = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZDg5MjMxMjc5OTkxYjJhNGMwMjdjMGIiLCJoc2giOiIkMmEkMTMkWk53Y0cubjdRZFIybDA3S1RHd2RoLlN0QksudW5GSFVGLkZnZ0tQTGlUV2pOVEFqVy9SMm0iLCJncmFudCI6ImFjY2VzcyIsImlhdCI6MTU2OTI2ODUwMiwiZXhwIjoxNjAwODI2MTAyfQ.PQcCoF9d25bBqr1U4IhJbylpnKTYiad3NjCh_LvMfLE~9~null~undefined~434ce0149ce42606d8746bd9`;
//
// str = 'test'
// const cryptoInfo = crypto.AES.encrypt(JSON.stringify(str), 'hello world sadi').toString();
//
//
// const info2 = crypto.AES.decrypt(cryptoInfo, 'hello world sadi').toString(crypto.enc.Utf8);
//
// const info3 = JSON.parse(info2);
//
// console.log({ str: info3 });


//given an array with duplicates and a number, return the number of times the number appears in the array


num = [1,1,1,2];

//find the duplicate number in the array


function findDuplicate(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        if (obj[arr[i]]) {
            return arr[i];
        } else {
            obj[arr[i]] = true;
        }
    }
}

//get the max number in an array num




function getMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

console.log(getMax(num));

console.log(findDuplicate(num));

