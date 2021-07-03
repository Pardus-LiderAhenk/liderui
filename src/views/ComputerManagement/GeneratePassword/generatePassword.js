/**
 * Return generated password by password length parameter.
 * @author Tuncay Çolak <tuncay.colak@tubitak.gov.tr>
 * @see {@link http://www.liderahenk.org/}
 */

export const GeneratePassword = {
    createPassword(passwordLength) {
        var numberChars = "0123456789";
        var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var lowerChars = "abcdefghijklmnopqrstuvwxyz";
        var allChars = numberChars + upperChars + lowerChars;
        var randPasswordArray = Array(passwordLength);
        randPasswordArray[0] = numberChars;
        randPasswordArray[1] = upperChars;
        randPasswordArray[2] = lowerChars;
        randPasswordArray = randPasswordArray.fill(allChars, 3);
        return this.shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
    },

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
};

export default GeneratePassword;