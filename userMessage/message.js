/**
 * Format User message
 * 
 */

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function formatUserMessage(userName, msg) {
    return {
        userName, msg,
        time: formatTime(new Date)
    }
}

module.exports = formatUserMessage;

