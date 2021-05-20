export const convertDateToMysqlDateTime = function (date: Date) {
	return (
		date.getUTCFullYear() +
		"-" +
		padDateToTwoDigits(1 + date.getUTCMonth()) +
		"-" +
		padDateToTwoDigits(date.getUTCDate()) +
		" " +
		padDateToTwoDigits(date.getUTCHours()) +
		":" +
		padDateToTwoDigits(date.getUTCMinutes()) +
		":" +
		padDateToTwoDigits(date.getUTCSeconds())
	);
};

function padDateToTwoDigits(digitCharacter) {
	if (0 <= digitCharacter && digitCharacter < 10) return "0" + digitCharacter.toString();
	if (-10 < digitCharacter && digitCharacter < 0) return "-0" + (-1 * digitCharacter).toString();
	return digitCharacter.toString();
}
